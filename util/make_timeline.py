#!/usr/bin/env python

import argparse
from datetime import datetime
import re

import fflogs
import timeline_aggregator
import encounter_tools as e_tools


"""FFLogs returns battle events in a list of dicts that looks something like this:
    {
        "timestamp": 4816719,
        "type": "cast",
        "sourceID": 113,
        "sourceIsFriendly": false,
        "targetID": 95,
        "targetIsFriendly": true,
        "ability": {
            "name": "attack",
            "guid": 870,
            "type": 128,
            "abilityIcon": "000000-000405.png"
        },
        "pin": "0"
    },
We map from the type property here to ACT network log line numbers.
Technically there are both 21 and 22 log lines,
but for the purposes of this script it doesn't matter which one we map to.

Sometimes there's an environmental actor that doesn't have the same layout.
These are assigned a GUID of 9020. They will have a "source" property:
{
    "timestamp": 5308320,
    "type": "cast",
    "source": {
        "name": "Leviathan",
        "id": 31,
        "guid": 9020,
        "type": "NPC",
        "icon": "NPC"
    },
    "sourceInstance": 1,
    "sourceIsFriendly": false,
    "targetID": 1,
    "targetIsFriendly": true,
    "ability": {
        "name": "Rip Current",
        "guid": 16353,
        "type": 1024,
        "abilityIcon": "000000-000405.png"
    },
    "pin": "0"
}
"""

log_event_types = {
    "cast": "21",
}

# Write to stdout with an explicit encoding of UTF-8
# See: https://stackoverflow.com/a/3597849
utf8stdout = open(1, "w", encoding="utf-8", closefd=False)


def make_entry(overrides):
    # This should include all of the fields that any entry uses.
    base_entry = {
        "time": 0,
        "combatant": None,
        "ability_id": None,
        "ability_name": None,
        "line_type": None,
    }
    return {**base_entry, **overrides}


def parse_report(args):
    """Reads an fflogs report and return a list of entries"""

    # Default values
    report_start_time = 0
    start_time = 0
    end_time = 0
    enemies = {}

    # Get report information
    report_data = fflogs.api("fights", args.report, "www", {"api_key": args.key})

    report_start_time = report_data["start"]

    # Get the start and end timestamps for the specific fight
    fight_id_found = False
    for fight in report_data["fights"]:
        if args.fight and fight["id"] == args.fight:
            start_time = fight["start_time"]
            end_time = fight["end_time"]
            fight_id_found = True
            break
        elif fight["end_time"] - fight["start_time"] > end_time - start_time:
            start_time = fight["start_time"]
            end_time = fight["end_time"]

    if args.fight and not fight_id_found:
        raise Exception("Fight ID not found in report")

    # Build an enemy name list, since these aren't in the events
    # Environment special case
    enemies[-1] = ""

    # Real enemies
    for enemy in report_data["enemies"]:
        enemies[enemy["id"]] = enemy["name"]

    # Get the actual event list for the single fight
    options = {
        "api_key": args.key,
        "start": start_time,
        "end": end_time,
        "filter": 'source.disposition="enemy" and type="cast"',
        "translate": "true",
    }
    event_data = fflogs.api("events", args.report, "www", options)

    entries = []

    # Actually make the entry dicts
    for event in event_data["events"]:
        if "sourceID" not in event:
            event["sourceID"] = event["source"]["id"]
            enemies[event["sourceID"]] = event["source"]["name"]

        entry = make_entry(
            {
                "time": datetime.fromtimestamp((report_start_time + event["timestamp"]) / 1000),
                "combatant": enemies[event["sourceID"]],
                "ability_id": hex(event["ability"]["guid"])[2:].upper(),
                "ability_name": event["ability"]["name"],
                "line_type": log_event_types[event["type"]],
            }
        )

        entries.append(entry)

    return entries, datetime.fromtimestamp((report_start_time + start_time) / 1000)


def parse_file(args):
    """Reads a file specified by arguments, and returns an entry list"""

    entries = []
    started = False
    encounter_sets = []
    with args.file as file:
        # If searching for encounters, divert and find start/end first.
        if args.search_fights:
            encounter_sets = e_tools.find_fights_in_file(file)
            # If all we want to do is list encounters, stop here and give to the user.
            if args.search_fights < 0:
                return e_tools.list_fights_in_file(args, encounter_sets)
        start_time, end_time = e_tools.choose_fight_times(args, encounter_sets)
        # Scan the file until the start timestamp
        for line in file:

            if not started and start_time != line[14:26]:
                continue

            if end_time == line[14:26]:
                break

            # We're at the start of the encounter now.
            if not started:
                started = True
                last_ability_time = e_tools.parse_event_time(line)

            # We cull non-useful lines before potentially more expensive operations.
            if not line[0:2] in ["00", "21", "22", "34"]:
                continue

            line_fields = line.split("|")

            # If it's a zone seal, we want to make a special entry.
            if e_tools.is_zone_seal(line_fields):
                entry = make_entry(
                    {
                        "line_type": "zone_seal",
                        "time": e_tools.parse_event_time(line),
                        "zone_message": line_fields[4].split(" will be sealed off")[0],
                    }
                )
                entries.append(entry)
                continue

            # We're looking for enemy casts or enemies becoming targetable/untargetable.
            # These lines will start with 21, 22, or 34, and have an NPC ID (400#####)
            # If none of these apply, skip the line

            if not line[0:2] in ["21", "22", "34"] or not line[37:40] == "400":
                continue

            # We aren't including targetable lines unless the user explicitly says to.
            if line[0:2] == "34" and not line_fields[3] in args.include_targetable:
                continue
            # At this point, we have a combat line for the timeline.
            entry = make_entry(
                {
                    "line_type": line_fields[0],
                    "time": e_tools.parse_event_time(line),
                    "combatant": line_fields[3],
                }
            )
            if line[0:2] in ["21", "22"]:
                entry["ability_id"] = line_fields[4]
                entry["ability_name"] = line_fields[5]

            # Unknown abilities should be hidden sync lines by default.
            if line_fields[5].startswith(("Unknown_", "unknown_")):
                entry["ability_name"] = "--sync--"
            else:
                entry["targetable"] = (
                    "--targetable--" if line_fields[6] == "01" else "--untargetable--"
                )
            entries.append(entry)

    if not started:
        raise Exception("Fight start not found")

    return entries, last_ability_time


def main(args):
    timeline_position = 0
    last_ability_time = 0

    # ACT log doesn't include friendly/enemy information per-line, so this is a set of default friendly npcs to filter
    # https://xivapi.com/Pet?pretty=true
    npc_combatants = [
        "Eos",
        "Selene",
        "Garuda-Egi",
        "Titan-Egi",
        "Ifrit-Egi",
        "Carbuncle",
        "Ruby Ifrit",
        "Emerald Garuda",
        "Topaz Titan",
        "Emerald Carbuncle",
        "Topaz Carbuncle",
        "Ruby Carbuncle",
        "Moonstone Carbuncle",
        "Rook Autoturret",
        "Bishop Autoturret",
        "Demi-Bahamut",
        "Demi-Phoenix",
        "Earthly Star",
        "Seraph",
        "Automaton Queen",
        "Bunshin",
        "Esteem",
        "Alphinaud",
        "Alisaie",
        "Y'shtola",
        "Ryne",
        "Minfilia",
        "Thancred",
        "Urianger",
        "Estinien",
        "G'raha Tia",
        "Alphinaud's Avatar",
        "Alisaie's Avatar",
        "Thancred's Avatar",
        "Urianger's Avatar",
        "Y'shtola's Avatar",
        "Estinien's Avatar",
        "G'raha Tia's Avatar",
        "",
        "Crystal Exarch",
        "Mikoto",
        "Liturgic Bell",
    ]

    # Format the phase timings
    phases = {}
    for phase in args.phase:
        ability, time = phase.split(":")
        phases[ability] = float(time)

    # Get the entry list or return fight list
    if args.search_fights and args.search_fights == -1:
        return parse_file(args)
    elif args.report:
        entries, start_time = parse_report(args)
    elif args.file:
        entries, start_time = parse_file(args)

    last_ability_time = start_time
    last_entry = make_entry({})

    output = []
    if entries[0]["line_type"] and entries[0]["line_type"] == "zone_seal":
        output.append(
            '0.0 "--sync--" sync / 00:0839::{} will be sealed off/ window 0,1'.format(
                entries[0]["zone_message"].title()
            )
        )
        entries.pop(0)
    else:
        output.append('0.0 "--sync--" sync /Engage!/ window 0,1')

    for entry in entries:

        # Ignore targetable/untargetable while processing ignored entries
        if entry["line_type"] in ["21", "22"]:
            # First up, check if it's an ignored entry
            # Ignore autos, probably need a better rule than this
            if entry["ability_name"].lower() == "Attack".lower():
                continue

        # Ignore abilities by NPC allies
        if entry["combatant"] in npc_combatants:
            continue

        # Ignore lines by arguments
        if (
            entry["ability_name"] in args.ignore_ability
            or entry["ability_id"] in args.ignore_id
            or entry["combatant"] in args.ignore_combatant
        ):
            continue

        # if only combatants was specified and combatant not in the list
        if args.only_combatant and entry["combatant"] not in args.only_combatant:
            continue

        # Ignore aoe spam
        if entry["time"] == last_entry["time"] and entry["ability_id"] == last_entry["ability_id"]:
            continue
        elif entry["line_type"] == "34" and not args.include_targetable:
            continue

        # Find out how long it's been since our last ability
        line_time = entry["time"]
        last_time_diff = line_time - last_ability_time
        last_time_diff_sec = last_time_diff.seconds
        last_time_diff_us = last_time_diff.microseconds
        drift = False

        # Find the difference to the 0.1 second
        last_time_diff_tenthsec = int(last_time_diff_us / 100000) / 10

        # Adjust other diffs
        last_time_diff_sec += last_time_diff_tenthsec
        last_time_diff_us %= 100000

        # Round up to the tenth of second
        if last_time_diff_us > 60000:
            last_time_diff_sec += 0.1

        # Round up with a note about exceptional drift
        elif last_time_diff_us > 50000:
            last_time_diff_sec += 0.1
            drift = -100000 + last_time_diff_us

        # Round down with a note about exceptional drift
        elif last_time_diff_us > 40000:
            drift = last_time_diff_us

        # If <20ms then there's no need to adjust sec or drift
        else:
            pass

        # Set the time, possibly adjusting to specified phase
        if entry["line_type"] not in ["21", "22"] or entry["ability_id"] not in phases:
            timeline_position += last_time_diff_sec
        else:
            timeline_position = phases[entry["ability_id"]]
            del phases[entry["ability_id"]]

        # Update the last ability time
        last_ability_time = line_time
        entry["position"] = timeline_position

        # Write the line
        if entry["line_type"] == "34":
            output_entry = '{position:.1f} "{targetable}"'.format(**entry)
        else:
            output_entry = '{position:.1f} "{ability_name}" sync / 1[56]:[^:]*:{combatant}:{ability_id}:/'.format(
                **entry
            )

        output.append(output_entry)

        # Save the entry til the next line for filtering
        last_entry = entry
    return output


if __name__ == "__main__":
    # Set up all of the arguments
    example_usage = """
    example:
        make_timeline.py -f "%APPDATA%\\Advanced Combat Tracker\\FFXIVLogs\\Network_20180206.log" -s 12:30:45.156 -e 12:43:51.395 -ia Attack Explosion "Vacuum Claw" -ic "Aratama Soul"

        Scans Network_20180206.log, starts the encounter at 12:30:45.156, and crawls until
        12:43:51.395, collecting enemy ability usages along and printing them in a timeline format"""

    parser = argparse.ArgumentParser(
        description="Creates a timeline from a logged encounter",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    # Add main input vector, fflogs report or network log file
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-r", "--report", help="The ID of an FFLogs report")
    group.add_argument(
        "-f",
        "--file",
        type=argparse.FileType("r", encoding="utf8"),
        help="The path of the log file",
    )

    # Report arguments
    parser.add_argument(
        "-k", "--key", help="The FFLogs API key to use, from https://www.fflogs.com/profile",
    )
    parser.add_argument(
        "-rf",
        "--fight",
        type=int,
        help="Fight ID of the report to use. Defaults to longest in the report",
    )

    # Log file arguments
    parser.add_argument(
        "-s",
        "--start",
        type=e_tools.timestamp_type,
        help="Timestamp of the start, e.g. '12:34:56.789",
    )
    parser.add_argument(
        "-e", "--end", type=e_tools.timestamp_type, help="Timestamp of the end, e.g. '12:34:56.789'"
    )
    parser.add_argument(
        "-lf",
        "--search-fights",
        nargs="?",
        const=-1,
        type=int,
        help="Encounter in log to use, e.g. '1'. If no number is specified, returns a list of encounters.",
    )

    # Filtering arguments
    parser.add_argument(
        "-ii", "--ignore-id", nargs="*", default=[], help="Ability IDs to ignore, e.g. 27EF"
    )
    parser.add_argument(
        "-ia",
        "--ignore-ability",
        nargs="*",
        default=[],
        help="Ability names to ignore, e.g. Attack",
    )
    parser.add_argument(
        "-ic",
        "--ignore-combatant",
        nargs="*",
        default=[],
        help='Combatant names to ignore, e.g. "Aratama Soul"',
    )
    parser.add_argument(
        "-oc",
        "--only-combatant",
        nargs="*",
        default=[],
        help='Only the listed combatants will generate timeline data, e.g. "Aratama Soul"',
    )
    parser.add_argument(
        "-p",
        "--phase",
        nargs="*",
        default=[],
        help="Abilities that indicate a new phase, and the time to jump to, e.g. 28EC:1000",
    )
    parser.add_argument(
        "-it",
        "--include-targetable",
        nargs="*",
        default=[],
        help="Set this flag to include '34' log lines when making the timeline",
    )

    # Aggregate arguments
    parser.add_argument(
        "-at",
        "--aggregate-threshold",
        type=float,
        default=2.0,
        help="Threshold to average events from multiple reports by",
    )

    args = parser.parse_args()

    # Check dependent args
    if args.search_fights and not args.file:
        raise parser.error("Automatic encounter listing requires an input file")
    if args.file and not ((args.start and args.end) or args.search_fights):
        raise parser.error("Log file input requires start and end timestamps")
    if args.report and not args.key:
        raise parser.error(
            "FFlogs parsing requires an API key. Visit https://www.fflogs.com/profile and use the V1 Client Key"
        )

    # Actually call the script
    if not args.report or len(args.report.split(",")) == 1:
        print("\n".join(main(args)), file=utf8stdout)
    else:
        timelines = []
        tmp_args = args
        for report in args.report.split(","):
            tmp_args.report = report
            timelines.append(main(tmp_args))
        timeline_aggregator = timeline_aggregator.TimelineAggregator(timelines)
        print("\n".join(timeline_aggregator.aggregate(args.aggregate_threshold)), file=utf8stdout)
