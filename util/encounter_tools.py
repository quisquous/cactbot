"""Provides timeline manipulation utilities for make_timeline and test_timeline"""

from datetime import datetime
import re
import argparse


class tcolor:
    WARN = "\033[33m"
    FAIL = "\033[91m"
    CAUTION = "\033[93m"
    END = "\033[0m"


def timestamp_type(arg):
    """Defines the timestamp input format"""
    if arg and re.match(r"\d{2}:\d{2}:\d{2}\.\d{3}", arg) is None:
        raise argparse.ArgumentTypeError("Invalid timestamp format. Use the format 12:34:56.789")
    return arg


def parse_time(timestamp):
    """Parses a timestamp into a datetime object"""
    return datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S")


def parse_event_time(event):
    """Parses the line's timestamp into a datetime object"""
    if isinstance(event, str):
        # TCPDecoder errors have a 251 at the start instead of a single hex byte
        # But most just have two digits.
        if event[3] == "|":
            time = parse_time(event[4:23])
            time = time.replace(microsecond=int(event[24:30]))
        else:
            time = parse_time(event[3:22])
            time = time.replace(microsecond=int(event[23:29]))
        return time
    elif isinstance(event, dict):
        return event["time"]


def str_time(timestamp):
    """
    Parses a datetime object into a string for log comparisons.
    Trims microseconds to milliseconds."""
    return timestamp.strftime("%H:%M:%S.%f")[:-3]


def is_line_end(line_fields):
    if is_zone_unseal(line_fields):
        return True
    if is_ce_end(line_fields):
        return True
    return is_encounter_end_code(line_fields)


def is_zone_seal(line_fields):
    if len(line_fields) <= 4:
        return False
    return line_fields[4].endswith("sealed off in 15 seconds!")


def is_zone_unseal(line_fields):
    if len(line_fields) <= 4:
        return False
    return line_fields[4].endswith("no longer sealed!")


def is_ce_start(line_fields):
    if len(line_fields) <= 2:
        return False
    if line_fields[0] != "00" or line_fields[2] != "0039":
        return False
    return get_ce_name(line_fields)


def get_ce_name(line_fields):
    if len(line_fields) <= 4:
        return False
    m = re.match(r"You have joined the critical engagement, (.*)\. Access", line_fields[4])
    if not m:
        return ""
    return m[1]


def is_ce_end(line_fields):
    if len(line_fields) <= 4:
        return False
    return line_fields[0] == "33" and line_fields[3] == "80000014" and line_fields[4] == "00"


def is_line_attack(line_fields):
    if len(line_fields) <= 6:
        return False
    # We want only situations where a friendly attacks an enemy
    return line_fields[0] in ("21", "22") and line_fields[6].startswith("4")


def is_instance_begun(line_fields):
    if len(line_fields) <= 4:
        return False
    return line_fields[4].endswith("has begun.")


def is_instance_updated(line_fields):
    if len(line_fields) <= 3:
        return False
    return line_fields[0] == "33" and line_fields[3] in ["40000001", "40000006"]


def is_instance_ended(line_fields):
    if len(line_fields) <= 4:
        return False
    return line_fields[4].endswith("has ended.")


def is_encounter_end_code(line_fields):
    if len(line_fields) <= 3:
        return False
    if not line_fields[0] == "33":
        return False
    return line_fields[3] in ("40000010", "40000003")


def find_fights_in_file(file):
    e_starts = []
    encounter_start_staging = 0  # Staged to avoid spurious starts such as limit break usage
    e_ends = []
    encounter_in_progress = False
    current_zone = None
    current_instance = None
    encounter_sets = []
    for line in file:
        # Ignore log lines that aren't game status info
        if line[37:41] != "0839" and line[0:2] not in ["00", "01", "21", "22", "33"]:
            continue
        line_fields = line.split("|")

        # Continually update the zone
        if line[0:2] == "01":
            current_zone = line_fields[3]
            continue

        # Update current instance for returning alongside timestamps
        # We don't want instances that aren't a combat instance
        # If we see an instance begin, that's automatically good
        if is_instance_begun(line_fields):
            current_zone = line_fields[4].split(" has begun")[0]
            current_instance = current_zone
            continue

        # If we see a 21 line with a timer attached, that's also an instance
        if is_instance_updated(line_fields):
            current_instance = current_zone
            continue

        # An instance ending obviously means we aren't in an instance
        if is_instance_ended(line_fields):
            current_zone = None
            current_instance = None
            encounter_in_progress = False
            continue

        # We don't want to look for encounters outside a combat instance
        if current_instance is None:
            continue

        # Build start/end time groupings
        if is_zone_seal(line_fields):
            encounter_start_staging = [
                parse_event_time(line),
                line_fields[4].split(" will be sealed off")[0],
            ]
            encounter_in_progress = True
            continue
        if is_ce_start(line_fields):
            encounter_start_staging = [
                parse_event_time(line),
                "CE: %s" % get_ce_name(line_fields),
            ]
            encounter_in_progress = True
            continue
        elif not encounter_in_progress and is_line_attack(line_fields):
            encounter_start_staging = [parse_event_time(line), current_instance]
            encounter_in_progress = True
            continue
        # Fires only if there's an encounter in progress. This avoids phantom encounters.
        if is_line_end(line_fields) and encounter_in_progress:
            e_starts.append(encounter_start_staging)
            e_ends.append(parse_event_time(line))
            encounter_in_progress = False
            continue
        continue

    # Build a list of fight start/end pairs
    for i in range(0, len(e_ends)):
        # Ignore fights under 1 minute
        if (e_ends[i] - e_starts[i][0]).total_seconds() < 60:
            continue
        # Since the duration will only ever be used as a display string,
        # there's probably no need to do this "correctly".
        duration = str(e_ends[i] - e_starts[i][0]).split(".")[0][2:]
        encounter_info = [
            str_time((e_starts[i][0])),
            str_time(e_ends[i]),
            duration,
            str(e_starts[i][1]),
        ]
        encounter_sets.append(encounter_info)
    file.seek(0)
    return encounter_sets


def list_fights_in_file(args, encounter_sets):
    return [
        f'{str(i + 1).zfill(2)}. {" | ".join(e_info)}' for i, e_info in enumerate(encounter_sets)
    ]


def choose_fight_times(args, encounters):
    start_time = end_time = 0
    if args.search_fights:
        if args.search_fights > len(encounters):
            raise Exception("Selected fight index not in selected ACT log.")
        # Indexing is offset here to allow for 1-based indexing for the user.
        start_time = encounters[args.search_fights - 1][0]
        end_time = encounters[args.search_fights - 1][1]
    # In the event the user wishes to enter timestamps manually, we permit that here.
    else:
        start_time = args.start
        end_time = args.end
    return start_time, end_time


# Timeline test/translate functions
def clean_tl_line(line):
    # Any lines containing # before any quote marks
    # should be returned with anything following # stripped.
    if re.search(r'^[^"]*#.*$', line):
        return line.split("#")[0]

    # If a timeline text entry contains a "#" character as a string literal, this function breaks
    # unless we do this little dance.
    line_groups = line.split('"')
    line_groups[2] = line_groups[2].split("#")[0]
    return '"'.join(line_groups[i] for i in range(0, 3))


def split_tl_line(line):
    return re.search(r'^(?P<time>[\d\.]+)\s+"(?P<label>[^"]+)"\s+(?P<options>.+)', line)


def is_tl_line_syncmatch(line):
    return re.search(r"sync /([^/]+)/", line.group("options"))


def is_tl_line_begincast(poss_match):
    return re.search(r"^:([0-9A-F\[\]\(\)\|]+):([^:]+)", poss_match)


def is_tl_line_buff(poss_match):
    return re.search(r"1A:.......:(.+) gains the effect of (.+)( from)?", poss_match)


def is_tl_line_cast(poss_match):
    return re.search(r"^:([^:]+):([0-9A-F\(\)\|]+)", poss_match)


def is_tl_line_log(poss_match):
    return re.search(r"^\s*00:([0-9]*):(.*$)", poss_match)


def is_tl_line_adds(poss_match):
    return re.search(r"Added new combatant (.*$)", poss_match)


def colorize(input_text, color_code):
    return "{}{}{}".format(color_code, input_text, tcolor.END)


def color_fail(entry_text):
    return colorize(tcolor.FAIL, entry_text)


def color_warn(entry_text):
    return colorize(tcolor.WARN, entry_text)
