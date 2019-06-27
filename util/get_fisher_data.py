import csv
import coinach
import json
from pathlib import Path
import os
import re
import requests
import sys

locales = ['de', 'en', 'fr', 'ja']
tackle_id = 30

# First argument is the API key
if len(sys.argv) > 1:
    xivapi_key = sys.argv[1]
else:
    xivapi_key = False

def cleanup_german(word):
    word = word.replace('[A]', 'er')
    word = word.replace('[p]', '')
    word = word.replace('[t]', 'der')

    if word.find('[a]') == -1:
      return [word]

    # [a] is complicated, and can mean different things in different contexts.
    # Just cover all our bases here.
    endings = ['e', 'en', 'es', 'er']
    return list(map(lambda x : word.replace('[a]', x), endings))

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
            columns.append(f'Item{i}.Plural_{locale}')

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

                if locale == 'de':
                    fish['Singular_de'] = cleanup_german(fish['Singular_de'])
                    fish['Plural_de'] = cleanup_german(fish['Plural_de'])
                    flist = fish['Singular_de']
                    flist.extend(fish['Plural_de'])
                else:
                    flist = [fish[f'Singular_{locale}'], fish[f'Plural_{locale}']]

                # uniq
                flist = [x for idx, x in enumerate(flist) if idx == flist.index(x) and x]
                # delistify if only one element
                if len(flist) == 1:
                  flist = flist[0]

                fishes[locale][fish['ID']] = flist

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
                result['Singular_de'] = cleanup_german(result['Singular_de'])
            locale_tackle[result['ID']] = result[f'Singular_{locale}']

        tackle[locale] = locale_tackle

    return tackle

def append_special_place_names(places):
    # handle special german casting names
    fishing_places = places['de'].keys()

    coin = coinach.CoinachReader()
    reader = csv.reader(coin.exd('PlaceName', lang='de'))
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
        m = re.search(r'<Case\(2\)>([^<]*)<\/Case>', row[xml_idx])
        if not m:
            continue

        if isinstance(places['de'][place], list):
          places['de'][place].append(m.group(1))
        else:
          places['de'][place] = [places['de'][place], m.group(1)]

# Actual program runs here
places, fishes, placefish = get_fish_data()
tackle = get_tackle()
append_special_place_names(places)

data = {
    'tackle': tackle,
    'places': places,
    'fish': fishes,
    'placefish': placefish
}

filename = Path(__file__).resolve().parent.parent / 'ui' / 'fisher' / 'static-data.js'
writer = coinach.CoinachWriter()
writer.write(
    filename,
    os.path.basename(os.path.abspath(__file__)),
    'gFisherData',
    data)
