"""Provides timeline manipulation utilities for make_timeline and test_timeline"""

from datetime import datetime

def parse_time(timestamp):
    """Parses a timestamp into a datetime object"""
    return datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S')

def parse_event_time(event):
    """Parses the line's timestamp into a datetime object"""
    if isinstance(event, str):
        # TCPDecoder errors have a 251 at the start instead of a single hex byte
	# But most just have two digits.
        if event[3] == '|':
            time = parse_time(event[4:23])
            time = time.replace(microsecond=int(event[24:30]))
        else:
            time = parse_time(event[3:22])
            time = time.replace(microsecond=int(event[23:29]))
        return time
    elif isinstance(event, dict):
        return event['time']

def str_time(timestamp):
    """
    Parses a datetime object into a string for log comparisons.
    Trims microseconds to milliseconds."""
    return timestamp.strftime('%H:%M:%S.%f')[:-3]

def is_line_end(line_fields):
    if is_zone_unseal(line_fields) or is_limit_reset(line_fields):
        return True
    return is_encounter_end_code(line_fields)

def is_zone_seal(line_fields):
    return line_fields[4].endswith('sealed off in 15 seconds!')

def is_zone_unseal(line_fields):
    return line_fields[4].endswith('no longer sealed!')

def is_line_attack(line_fields):
    # We want only situations where a friendly attacks an enemy
    return line_fields[0] in ('21', '22') and line_fields[6].startswith('4')

def is_limit_reset(line_fields):
    return line_fields[4] == 'The limit gauge resets!'

def is_instance_begun(line_fields):
    return line_fields[4].endswith('has begun.')

def is_instance_ended(line_fields):
    return line_fields[4].endswith('has ended.')

def is_encounter_end_code(line_fields):
    if not line_fields[0] == '33':
        return False
    return line_fields[3] in ('40000010', '40000003')

def find_fights_in_file(file):
    e_starts = []
    encounter_start_staging = 0 # Staged to avoid spurious starts such as limit break usage
    e_ends = []
    encounter_in_progress = False
    current_instance = None
    encounter_sets = []
    for line in file:
        # Ignore log lines that aren't game status info
        if line[37:41] != '0839' and line[0:2] not in ['00', '01', '21', '22', '33']:
            continue
        line_fields = line.split('|')

        # Update current instance for returning alongside timestamps
        # Don't update if we're not entering a combat instance
        if is_instance_begun(line_fields):
            current_instance = line_fields[4].split(' has begun')[0]
            continue
        if is_instance_ended(line_fields):
            current_instance = None
            encounter_in_progress = False
            continue

        # We don't want to look for encounters outside a combat instance
        if current_instance is None:
            continue

        # Build start/end time groupings
        if is_zone_seal(line_fields):
            encounter_start_staging = [parse_event_time(line), line_fields[4].split(' will be sealed off')[0]]
            encounter_in_progress = True
            continue
        elif not encounter_in_progress and is_line_attack(line_fields):
            encounter_start_staging = [parse_event_time(line), current_instance]
            encounter_in_progress = True
            continue
        # If this fired regardless of an encounter being found, we would end up with phantom encounters.
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
        encounter_info = [str_time((e_starts[i][0])), str_time(e_ends[i]), str(e_starts[i][1])]
        encounter_sets.append(encounter_info)
    file.seek(0)
    return encounter_sets
