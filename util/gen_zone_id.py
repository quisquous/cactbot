#!/usr/bin/env python

import coinach
import csv
import os
import re

_ZONE_ID_OUTPUT_FILE = "zone_id.js"

# Turn names from ContentFinderCondition into JavaScript-safe string keys.
def clean_name(str):
    if not str:
        return str

    # The Tam\u2013Tara Deepcroft
    str = re.sub(r"\u2013", "-", str)

    # The <Emphasis>Whorleater</Emphasis> Extreme
    str = re.sub(r"</?Emphasis>", "", str)

    # Various symbols to get rid of.
    str = re.sub(r"[':(),]", "", str)

    # Sigmascape V4.0 (Savage)
    str = re.sub(r"\.", "", str)

    # Common case hyphen: TheSecondCoilOfBahamutTurn1
    # Special case hyphen: ThePalaceOfTheDeadFloors1_10
    str = re.sub(r"([0-9])-([0-9])", r"\1_\2", str)
    str = re.sub(r"[-]", " ", str)

    # Of course capitalization isn't consistent, that'd be ridiculous.
    str = str.title()

    # collapse remaining whitespace
    str = re.sub(r"\s+", "", str)
    return str


# inputs[0] is the key column for the returned map
def make_map(file, inputs, outputs):
    map = {}

    reader = csv.reader(file)
    next(reader)
    keys = next(reader)
    next(reader)

    indices = []
    for input in inputs:
        if isinstance(input, int):
            indices.append(input)
            continue
        indices.append(keys.index(input))

    for row in reader:
        output = {}
        for i in range(1, len(indices)):
            output[outputs[i]] = row[indices[i]]
        map[row[indices[0]]] = output

    return map


def make_territory_map(territory_file):
    inputs = ["#", 11, "PlaceName", "Name"]
    outputs = ["content_id", "cfc_id", "place_name", "name"]
    return make_map(territory_file, inputs, outputs)


def make_cfc_map(cfc_file):
    inputs = ["#", "Name", "TerritoryType"]
    outputs = ["cfc_id", "name", "territory_type"]
    return make_map(cfc_file, inputs, outputs)


def parse_data(territory_map, cfc_map):
    map = {}
    map["MatchAll"] = None
    cfc_names = set()
    collision_names = set()

    # Build territory name to cfc id map.  Collisions have value None.
    name_to_cfc = {}
    for cfc_id, cfc in cfc_map.items():
        territory = cfc["territory_type"]

        # Some are empty.
        if not territory:
            continue

        # Collision?
        if territory in name_to_cfc:
            name_to_cfc[territory] = None
        name_to_cfc[territory] = cfc_id

    # First pass, find everything with a cfc name.
    # These take precedence over any later collisions.
    for content_id, territory in territory_map.items():
        cfc_id = territory["cfc_id"]
        if cfc_id == "0":
            continue
        raw_name = cfc_map[cfc_id]["name"]
        name_key = clean_name(raw_name)
        if not name_key:
            continue
        cfc_names.add(name_key)

    # Second pass, generate all the names, giving cfc names priority.
    for content_id, territory in territory_map.items():
        cfc_id = territory["cfc_id"]
        place_name = territory["place_name"]
        territory_name = territory["name"]

        if cfc_id != "0":
            name_key = clean_name(cfc_map[cfc_id]["name"])
        elif territory_name in name_to_cfc and name_to_cfc[territory_name]:
            cfc_id_by_name = name_to_cfc[territory_name]
            name_key = clean_name(cfc_map[cfc_id_by_name]["name"])
        else:
            # World zones like Middle La Noscea are not in CFC.
            name_key = clean_name(place_name)
            # Names from ContentFinderCondition take precedence over
            # territory names.  There are some duplicates, such as
            # The Copied Factory version you can walk around in.
            if name_key in cfc_names:
                continue

        if not name_key:
            continue

        # If we've already seen this twice, ignore.
        if name_key in collision_names:
            print("collision: %s: %d" % (name_key, int(content_id)))
            continue

        # If this is a collision with an existing name,
        # remove the old one.
        if name_key in map:
            collision_names.add(name_key)
            print("collision: %s: %d" % (name_key, map[name_key]))
            print("collision: %s: %d" % (name_key, int(content_id)))
            map.pop(name_key)
            continue

        map[name_key] = int(content_id)

    return map


if __name__ == "__main__":
    # TODO: make an arg parser for non-default paths
    reader = coinach.CoinachReader(verbose=True)
    writer = coinach.CoinachWriter(verbose=True)

    territory_map = make_territory_map(reader.exd("TerritoryType"))
    cfc_map = make_cfc_map(reader.exd("ContentFinderCondition"))

    writer.write(
        os.path.join("resources", _ZONE_ID_OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        "ZoneId",
        parse_data(territory_map, cfc_map),
    )
