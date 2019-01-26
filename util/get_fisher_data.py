import json
from pathlib import Path
import requests
import sys

locales = ['de', 'en', 'fr', 'ja']
tackle_id = 30

# First argument is the API key
if len(sys.argv) > 1:
    xivapi_key = sys.argv[1]
else:
    xivapi_key = False

def xivapi(content, filters = {}):
    """Fetches content columns from XIVAPI"""
    base = 'https://xivapi.com/'
    page = 1
    url = f'{base}{content}'
    by_id = False

    # IDs are just part of the url path
    if 'id' in filters:
        url += '/' + str(filters['id'])
        by_id = True
        del filters['id']

    # Add the key
    url += '?'
    if xivapi_key:
        url += f'key={xivapi_key}'

    # Filters are added onto the URL as a query string
    if len(filters):
        for key, value in filters.items():
            url += '&'

            if type(value) is list:
                # Collapse lists into comma-seperated strings
                url += f'{key}={",".join(str(x) for x in value)}'
            else:
                url += f'{key}={value}'

    response = requests.get(f'{url}&page={page}').json()

    if not by_id:
        results = response['Results']
    else:
        # Searches by ID do not have pagination separate from results
        results = response

    # Loop requests until the page is over
    while (not by_id and response['Pagination']['Page'] != response['Pagination']['PageTotal']):
        page += 1
        response = requests.get(f'{url}&page={page}')
        if response.status_code != 200:
            print(response.status_code)
            print(response.headers)
            print(response.text)
            exit()

        response = response.json()

        results += response['Results']

    return results

def coerce(string):
    """Changing strict JSON string to a format that satisfies eslint"""
    # Double quotes to single quotes
    coerced = string.replace("'", r"\'").replace("\"", "'")

    # Spaces between brace and content
    coerced = coerced.replace('{', '{ ').replace('}', ' }')

    return coerced

def get_fish_data():
    """Returns dictionaries for places, fish, and place->fish mapping"""
    # Generate the columns needed
    columns = ['ID', 'PlaceName.ID']

    for locale in locales:
        columns.append(f'PlaceName.Name_{locale}')
        columns.append(f'PlaceName.NameNoArticle_{locale}')

    for i in range(10):
        for locale in locales:
            columns.append(f'Item{i}.ID')
            columns.append(f'Item{i}.Singular_{locale}')

    results = xivapi('FishingSpot', {'columns': columns})

    # Build the data dicts from results
    places = {}
    fishes = {}
    placefish = {}

    for locale in locales:
        places[locale] = {}
        fishes[locale] = {}

    for result in results:
        # Skip spots without place names
        if not result['PlaceName']['Name_en']:
            continue

        for locale in locales:
            # Occasionally, PlaceName data will have null or empty strings in the NameNoArticle field
            # In these instances, I believe it simply defaults to the Name attribute
            name = result['PlaceName'][f'NameNoArticle_{locale}'] or result['PlaceName'][f'Name_{locale}']
            place_id = result['PlaceName']['ID']
            places[locale][place_id] = name

            id_list = []

            for item in range(10):
                fish = result[f'Item{item}']

                # Skip if no name
                if not fish[f'Singular_{locale}']:
                    continue

                # In German, multi-word item names have the first word suffixed by [a] or [p] to denote casing
                # For our purposes, simply removing it yields the in-game result
                if locale == 'de':
                    fish['Singular_de'] = fish['Singular_de'].replace('[a]', '').replace('[p]', '')

                # Add fish to fish list
                fishes[locale][fish['ID']] = fish[f'Singular_{locale}']

                # Add fish to id list
                id_list.append(fish['ID'])

            # Set IDs to the place ID if it's new or bigger
            if (
                    (place_id not in placefish and len(id_list)) or
                    (place_id in placefish and len(id_list) > len(placefish[place_id]))
            ):
                placefish[place_id] = id_list

    return places, fishes, placefish

def get_tackle():
    # Also get fishing tackle
    response = xivapi('ItemSearchCategory', {'id': tackle_id, 'columns': ['GameContentLinks.Item.ItemSearchCategory']})

    item_ids = response['GameContentLinks']['Item']['ItemSearchCategory']
    columns = ['ID','Singular_de','Singular_en','Singular_fr','Singular_ja']

    results = xivapi('Item', {'columns': columns, 'ids': item_ids})

    tackle = {}

    for locale in locales:
        locale_tackle = {}

        for result in results:
            if locale == 'de':
                result[f'Singular_de'] = result['Singular_de'].replace('[a]', '').replace('[p]', '')
            locale_tackle[result['ID']] = result[f'Singular_{locale}']

        tackle[locale] = locale_tackle

    return tackle

# Actual program runs here
places, fishes, placefish = get_fish_data()
tackle = get_tackle()

data = {
    'tackle': tackle,
    'places': places,
    'fish': fishes,
    'placefish': placefish
}

data_string = coerce(json.dumps(data))

filename = Path(__file__).resolve().parent.parent / 'ui' / 'fisher' / 'static-data.js'

with open(filename, 'w') as file:
    file.write("'use strict';\n\n")
    file.write("const gFisherData=")
    file.write(data_string)
    file.write(";\n")
