#!/usr/bin/env python

import coinach
import csv
import os

_OUTPUT_FILE = "territory_type.js"


def parse_data(csvfile):
    all_rates = {}
    reader = csv.reader(csvfile)
    next(reader)
    keys = next(reader)
    next(reader)

    place_idx = keys.index("PlaceName")
    rate_idx = keys.index("WeatherRate")

    # TODO: verify which of these they should be
    known_conflicts = {
        # Mist is 14/32
        "Mist": 14,
        # Diadem is 60/61/62/71
        "The Diadem": 60,
        # The Howling Eye is 26/101 (101 probably ff15 content)
        "The Howling Eye": 26,
    }

    row_idx = 3
    for row in reader:
        row_idx += 1
        place = row[place_idx]
        if not place:
            continue
        if place in known_conflicts:
            all_rates[place] = known_conflicts[place]
            continue
        rate = int(row[rate_idx])

        # ignore many single weather types that are (likely?) used for instanced fights
        # TODO: If these ever change, consider
        ignore = [
            0,  # fair skies
            28,  # clouds
            36,  # wind
            40,  # fog
            42,  # blizzards
            45,  # tension
            58,  # clear skies
            86,  # umbral static
            88,  # dimensional disruption
            89,  # thunder
            92,  # dimensional disruption
            95,  # fair skies
        ]
        if rate in ignore:
            continue

        if place in all_rates:
            if all_rates[place] != rate:
                print(
                    f"Discrepancy for {place}, had: {all_rates[place]}, found: {rate}, "
                    f"row: {row_idx}"
                )
            continue
        all_rates[place] = rate
    return all_rates


def update(reader, writer):
    data = reader.exd("TerritoryType")
    all_rates = parse_data(data)
    writer.write(
        os.path.join("resources", _OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        "gTerritoryWeather",
        all_rates,
    )


if __name__ == "__main__":
    # TODO: make an arg parser for non-default paths
    reader = coinach.CoinachReader(verbose=True)
    writer = coinach.CoinachWriter(verbose=True)
    update(reader, writer)
