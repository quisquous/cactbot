import argparse
from datetime import datetime
import re

import fflogs
import timeline_aggregator
import encounter_tools as e_tools


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

        entry = {
            "time": datetime.fromtimestamp((report_start_time + event["timestamp"]) / 1000),
            "combatant": enemies[event["sourceID"]],
            "ability_id": hex(event["ability"]["guid"])[2:].upper(),
            "ability_name": event["ability"]["name"],
        }

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
                return [f'{i + 1}. {" ".join(e_info)}' for i, e_info in enumerate(encounter_sets)]
            elif args.search_fights > len(encounter_sets):
                raise Exception("Selected fight index not in selected ACT log.")

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

            # We're looking for enemy casts or enemies becoming targetable/untargetable.
            # These lines will start with 21, 22, or 34, and have an NPC ID (400#####)
            # If this isn't one, skip the line

            if not (line[0:2] in ["21", "22", "34"]) or not line[37:40] == "400":
                continue
            line_fields = line.split("|")
            # We aren't including targetable lines unless the user explicitly says to.
            if line[0:2] == '34' and not line_fields[3] in args.includetargetable:
              continue

            # At this point, we have a combat line for the timeline.
            entry = {
                "line_type": line_fields[0],
                "time": e_tools.parse_event_time(line),
                "combatant": line_fields[3],
            }
            if line[0:2] in ["21", "22"]:
              entry["ability_id"] = line_fields[4]
              entry["ability_name"] = line_fields[5]

              # Unknown abilities should be hidden sync lines by default.
              if line_fields[5].startswith("Unknown_"):
                  entry["ability_name"] = "--sync--"
            else:
              entry["targetable"] = "--targetable--" if line_fields[6] == "01" else "--untargetable--"
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
        "",
        "2P",
        "Crystal Exarch",
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
    last_entry = {"time": 0, "ability_id": ""}

    output = []
    output.append('0 "Start" sync /Engage!/ window 0,1')

    for entry in entries:

        # Ignore targetable/untargetable while processing ignored entries
        if entry["line_type"] in ["21", "22"]:
          # First up, check if it's an ignored entry
          # Ignore autos, probably need a better rule than this
          if entry["ability_name"] == "Attack":
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

          # Ignore aoe spam
          if entry["time"] == last_entry["time"] and entry["ability_id"] == last_entry["ability_id"]:
              continue
        elif entry["line_type"] == "34" and not args.includetargetable:
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
        if entry["line_type"] == "34" or entry["ability_id"] not in phases:
            timeline_position += last_time_diff_sec
        else:
            timeline_position = phases[entry["ability_id"]]
            del phases[entry["ability_id"]]

        # Update the last ability time
        last_ability_time = line_time
        entry["position"] = timeline_position

        # Write the line
        if entry["line_type"] == "34" and args.includetargetable:
          print(entry)
          output_entry = '{position:.1f} "{targetable}"'.format(
              **entry
          )
        else:
          output_entry = '{position:.1f} "{ability_name}" sync /:{combatant}:{ability_id}:/'.format(
            **entry
          )

        output.append(output_entry.encode("ascii", "ignore").decode("utf8", "ignore"))

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
        "-k",
        "--key",
        help="The FFLogs API key to use, from https://www.fflogs.com/accounts/changeuser",
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
        "-e",
        "--end",
        type=e_tools.timestamp_type,
        help="Timestamp of the end, e.g. '12:34:56.789"
    )
    parser.add_argument(
        "-lf",
        "--search_fights",
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
        help="Combatant names to ignore, e.g. Aratama Soul",
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
      "--includetargetable",
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
            "FFlogs parsing requires an API key. Visit https://www.fflogs.com/accounts/changeuser and use the Public key"
        )

    # Actually call the script
    if not args.report or len(args.report.split(",")) == 1:
        print("\n".join(main(args)))
    else:
        timelines = []
        tmp_args = args
        for report in args.report.split(","):
            tmp_args.report = report
            timelines.append(main(tmp_args))
        timeline_aggregator = timeline_aggregator.TimelineAggregator(timelines)
        print("\n".join(timeline_aggregator.aggregate(args.aggregate_threshold)))
