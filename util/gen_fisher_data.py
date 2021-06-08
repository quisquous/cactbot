#!/usr/bin/env python

import argparse
import csv
import csv_util
import coinach
import io
import json
import os
import re
import requests
import sys
import urllib
import yaml

from pathlib import Path

locales = ["de", "en", "fr", "ja"]
tackle_id = 33
seafood_id = 47
base = "https://xivapi.com/"
fishTrackerBase = (
    "https://raw.githubusercontent.com/icykoneko/ff14-fish-tracker-app/master/private/fishData.yaml"
)

# First argument is the API key
if len(sys.argv) > 1:
    xivapi_key = sys.argv[1]
else:
    xivapi_key = False


def cleanup_german(word):
    word = word.replace("[A]", "er")
    word = word.replace("[p]", "")
    word = word.replace("[t]", "der")

    if word.find("[a]") == -1:
        return [word]

    # [a] is complicated, and can mean different things in different contexts.
    # Just cover all our bases here.
    endings = ["e", "en", "es", "er"]
    return list(map(lambda x: word.replace("[a]", x), endings))


def xivapi(content, filters={}):
    """Fetches content columns from XIVAPI"""
    page = 1
    url = f"{base}{content}"
    by_id = False

    # IDs are just part of the url path
    if "id" in filters:
        url += "/" + str(filters["id"])
        by_id = True
        del filters["id"]

    # Add the key
    url += "?"
    if xivapi_key:
        url += f"key={xivapi_key}"

    # Filters are added onto the URL as a query string
    if len(filters):
        for key, value in filters.items():
            url += "&"

            if type(value) is list:
                # Collapse lists into comma-seperated strings
                url += f'{key}={",".join(str(x) for x in value)}'
            else:
                url += f"{key}={value}"

    response = requests.get(f"{url}&page={page}").json()

    if not by_id:
        results = response["Results"]
    else:
        # Searches by ID do not have pagination separate from results
        results = response

    # Loop requests until the page is over
    while not by_id and response["Pagination"]["Page"] != response["Pagination"]["PageTotal"]:
        page += 1
        response = requests.get(f"{url}&page={page}")
        if response.status_code != 200:
            print(response.status_code)
            print(response.headers)
            print(response.text)
            exit()

        response = response.json()

        results += response["Results"]

    return results


def fish_tracker():
    response = requests.get(fishTrackerBase)
    if response.status_code != 200:
        print(response.status_code)
        print(response.headers)
        print(response.text)
        exit()

    return yaml.load(response.text, yaml.Loader)


def get_fish_data():
    """Returns dictionaries for places, fish, and place->fish mapping"""
    # Generate the columns needed
    columns = ["ID", "PlaceName.ID"]

    for locale in locales:
        columns.append(f"PlaceName.Name_{locale}")
        columns.append(f"PlaceName.NameNoArticle_{locale}")

    for i in range(10):
        for locale in locales:
            columns.append(f"Item{i}.ID")
            columns.append(f"Item{i}.Singular_{locale}")
            columns.append(f"Item{i}.Plural_{locale}")

    results = xivapi("FishingSpot", {"columns": columns})

    # Build the data dicts from results
    places = {}
    fishes = {}
    placefish = {}

    for locale in locales:
        places[locale] = {}
        fishes[locale] = {}

    for result in results:
        # Skip spots without place names
        if not result["PlaceName"]["Name_en"]:
            continue

        for locale in locales:
            place_id = result["PlaceName"]["ID"]

            if locale == "fr":
                # This is to specifically to turn `Arbre à pappus` into `L'arbre à pappus`.
                # Other French names already have `L'` in the front, so we can't treat it
                # as optional in the regex.  See: #2651.
                places[locale][place_id] = result["PlaceName"][f"Name_{locale}"]
            else:
                # However, English specifically is much more inconsistent about when "The"
                # appears in the Name_en field.  "Limsa Lominsa lower decks" has a "The" in
                # game, but not in Name_en.  "The Source" has a "The" in game, but does have
                # one in Name_en.  Prefering NameNoArticle_en removes all "Thes" from English.

                # Occasionally, PlaceName data will have null or empty strings in the NameNoArticle field.
                # In these instances, I believe it simply defaults to the Name attribute.
                places[locale][place_id] = (
                    result["PlaceName"][f"NameNoArticle_{locale}"]
                    or result["PlaceName"][f"Name_{locale}"]
                )

            id_list = []

            for item in range(10):
                fish = result[f"Item{item}"]

                # Skip if no name
                if not fish[f"Singular_{locale}"]:
                    continue

                if locale == "de":
                    fish["Singular_de"] = cleanup_german(fish["Singular_de"])
                    fish["Plural_de"] = cleanup_german(fish["Plural_de"])
                    flist = fish["Singular_de"]
                    flist.extend(fish["Plural_de"])
                else:
                    flist = [fish[f"Singular_{locale}"], fish[f"Plural_{locale}"]]

                # uniq
                flist = [x for idx, x in enumerate(flist) if idx == flist.index(x) and x]
                # delistify if only one element
                if len(flist) == 1:
                    flist = flist[0]

                fishes[locale][fish["ID"]] = flist

                # Add fish to id list
                id_list.append(fish["ID"])

            if place_id in placefish:
                # not efficient to do this, but number of fish is small
                placefish[place_id] = sorted(list(set(placefish[place_id]).union(set(id_list))))
            else:
                placefish[place_id] = sorted(id_list)

    return places, fishes, placefish


def get_tackle():
    # Also get fishing tackle
    response = xivapi(
        "ItemUICategory", {"id": tackle_id, "columns": ["GameContentLinks.Item.ItemUICategory"]},
    )

    item_ids = response["GameContentLinks"]["Item"]["ItemUICategory"]
    columns = ["ID"] + [f"Singular_{locale}" for locale in locales]

    results = xivapi("Item", {"columns": columns, "ids": item_ids})

    tackle = {}

    for locale in locales:
        locale_tackle = {}

        for result in results:
            if locale == "de":
                result["Singular_de"] = cleanup_german(result["Singular_de"])
            locale_tackle[result["ID"]] = result[f"Singular_{locale}"]

        tackle[locale] = locale_tackle

    return tackle


def find_fish_by_name(fishes, name):
    for id, value in fishes["en"].items():
        if type(value) is list:
            for actualName in value:
                if actualName == name:
                    return id
        else:
            if value == name:
                return id


def get_tugs(fishes):
    tugs = {}
    data = fish_tracker()
    for fish in data:
        if "tug" in fish and fish["tug"]:
            id = find_fish_by_name(fishes, fish["name"].lower())
            tug = None
            tug_name = fish["tug"].casefold()

            if tug_name == "light":
                tug = 1
            elif tug_name == "medium":
                tug = 2
            elif tug_name == "heavy" or tug_name == "legendary":
                tug = 3
            else:
                print("unknown tug type: " + tug_name)

            if tug and id:
                tugs[id] = tug

    return tugs


def append_special_place_names(places):
    # handle special german casting names
    fishing_places = places["de"].keys()

    coin = coinach.CoinachReader()
    reader = csv.reader(coin.exd("PlaceName", lang="de"))
    next(reader)
    next(reader)
    next(reader)

    place_idx = 0
    xml_idx = 9

    for row in reader:
        place = int(row[place_idx])
        if not place:
            continue
        if place not in fishing_places:
            continue
        m = re.search(r"<Case\(2\)>([^<]*)<\/Case>", row[xml_idx])
        if not m:
            continue

        if isinstance(places["de"][place], list):
            places["de"][place].append(m.group(1))
        else:
            places["de"][place] = [places["de"][place], m.group(1)]


def get_cn_data():
    global locales, base

    locales = ["chs", "en"]
    base = "https://cafemaker.wakingsands.com/"

    places, fishes, _ = get_fish_data()
    tackle = get_tackle()

    return places, fishes, tackle


def get_ko_data():
    item_keys = ["#", "Singular", "ItemUICategory"]
    items = csv_util.get_ko_table("Item", item_keys)

    tackle = {}
    fishes = {}
    for id, item in items.items():
        # no plurals
        if item["ItemUICategory"] == str(tackle_id):
            tackle[int(id)] = item["Singular"]
        elif item["ItemUICategory"] == str(seafood_id):
            fishes[int(id)] = item["Singular"]

    # Sorry, this is an unfortunate duplication of get_fish_data
    # xivapi has data in a different way than the csvs do.
    # This does mean that there are more keys here.
    place_keys = ["#", "Name"]
    place_names = csv_util.get_ko_table("PlaceName", place_keys)

    spot_keys = ["#", "PlaceName", "Item[0]"]
    spots = csv_util.get_ko_table("FishingSpot", spot_keys)

    places = {}
    for id, spot in spots.items():
        place_id = spot["PlaceName"]
        if place_id == "0":
            continue
        places[int(place_id)] = place_names[place_id]["Name"]

    return {"ko": places}, {"ko": fishes}, {"ko": tackle}


if __name__ == "__main__":
    example_usage = "python3 gen_fisher_data.py"
    parser = argparse.ArgumentParser(
        description="Generate fisher data from xivapi",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    args = parser.parse_args()

    places, fishes, placefish = get_fish_data()
    tackle = get_tackle()
    tugs = get_tugs(fishes)
    append_special_place_names(places)

    cn_places, cn_fishes, cn_tackle = get_cn_data()
    tackle.update({"cn": cn_tackle["chs"]})
    places.update({"cn": cn_places["chs"]})
    fishes.update({"cn": cn_fishes["chs"]})

    ko_places, ko_fishes, ko_tackle = get_ko_data()
    tackle.update(ko_tackle)
    places.update(ko_places)
    fishes.update(ko_fishes)

    data = {
        "tackle": tackle,
        "places": places,
        "fish": fishes,
        "placefish": placefish,
        "tugs": tugs,
    }

    filename = Path(__file__).resolve().parent.parent / "ui" / "fisher" / "static-data.ts"
    writer = coinach.CoinachWriter()

    header = """import { Lang } from '../../resources/languages';

type LangMapping = {
  [lang in Lang]: {
    [id: string]: string | string[];
  };
};

type FisherData = {
  readonly fish: LangMapping;
  readonly placefish: { [placeId: string]: number[] };
  readonly places: LangMapping;
  readonly tackle: LangMapping;
  readonly tugs: { [fishId: string]: number };
};"""
    writer.writeTypeScript(
        filename=filename,
        scriptname=os.path.basename(os.path.abspath(__file__)),
        header=header,
        type="FisherData",
        as_const=False,
        data=data,
    )
