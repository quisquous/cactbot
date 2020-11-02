#!/usr/bin/env python

import coinach
import csv
import csv_util
import json
import os

# Maybe this should be called Status like the table, but everything else
# says gain/lose effects.
_EFFECTS_OUTPUT_FILE = "effect_id.js"

# There are a looooot of duplicate effect names in pvp, and it's impossible
# to differentiate other than manually.  There's also older effects that
# did different things that are still around.
#
# This is a map of id to skill name (for smoke testing/documentation).
known_mapping = {
    "Thundercloud": "164",
    "Battle Litany": "786",
    "Right Eye": "1453",
    "Left Eye": "1454",
    "Meditative Brotherhood": "1182",
    "Brotherhood": "1185",
    "Embolden": "1297",
    "Technical Finish": "1822",
    "Lord of Crowns": "1876",
    "Lady of Crowns": "1877",
    "Divination": "1878",
    "The Balance": "1882",
    "The Bole": "1883",
    "The Arrow": "1884",
    "The Spear": "1885",
    "The Ewer": "1886",
    "The Spire": "1887",
    "Sword Oath": "1902",
    "Tactician": "1951",
    # This is for others, 1821 is for self.
    "Standard Finish": "2105",
    "The Wanderer's Minuet": "2216",
    "Mage's Ballad": "2217",
    "Army's Paeon": "2218",
    "Stormbite": "1201",
    "Caustic Bite": "1200",
    "Windbite": "129",
    "Venomous Bite": "124",
}


def print_error(header, what, map, key):
    print("%s %s: %s" % (header, what, json.dumps(map[key])))


def make_effect_map(table):
    found_names = set()

    map = {}
    for id, effect in table.items():
        raw_name = effect["Name"]
        name = csv_util.clean_name(raw_name)
        if not name:
            continue

        if raw_name in known_mapping:
            if id != known_mapping[raw_name]:
                print_error("skipping", raw_name, table, id)
                continue

        if name in map:
            print_error("collision", name, table, id)
            print_error("collision", name, table, map[name])
            del map[name]
            continue
        if name in found_names:
            print_error("collision", name, table, id)
            continue

        found_names.add(name)
        map[name] = id

    # Make sure everything specified in known_mapping was found in the above loop.
    for raw_name, id in known_mapping.items():
        name = csv_util.clean_name(raw_name)
        if name not in found_names:
            print_error("missing", name, known_mapping, raw_name)

    # Store ids as hex.
    return {k: format(int(v), "X") for k, v in map.items()}


if __name__ == "__main__":
    table = csv_util.get_intl_table("Status", ["#", "Name", "Icon", "PartyListPriority"])

    writer = coinach.CoinachWriter(verbose=True)
    writer.write(
        os.path.join("resources", _EFFECTS_OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        "EffectId",
        make_effect_map(table),
    )
