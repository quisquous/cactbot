import json
from pathlib import Path
import requests
from time import sleep

base = 'https://xivapi.com/'
spot = 'FishingSpot'
columns = 'columns=ID,PlaceName.NameNoArticle,Item0.Singular,Item1.Singular,Item2.Singular,Item3.Singular,Item4.Singular,Item5.Singular,Item6.Singular,Item7.Singular,Item8.Singular,Item9.Singular'
page = 1

response = requests.get(f'{base}{spot}?{columns}&page={page}').json()

results = response['Results']

while (response['Pagination']['Page'] != response['Pagination']['PageTotal']):
    page += 1
    response = requests.get(f'{base}{spot}?{columns}&page={page}').json()

    results += response['Results']

# have full list of results now
holes = {}

for result in results:
    # Skip spots without place names
    if not result['PlaceName']['NameNoArticle']:
        continue

    items = []

    for item in range(0,10):
        if not result['Item'+str(item)]['Singular']:
            continue

        items.append(result['Item'+str(item)]['Singular'])

    if not len(items):
        continue

    holes[result['PlaceName']['NameNoArticle']] = items

holes_string = json.dumps(holes)

# Coerce from json to single quotes
holes_string = holes_string.replace("'", r"\'")
holes_string = holes_string.replace("\"", "'")

# Spaces before and after braces
holes_string = holes_string.replace('{', '{ ')
holes_string = holes_string.replace('}', ' }')

filename = Path(__file__).resolve().parent.parent / 'ui' / 'fisher' / 'holes.js'

with open(filename, 'w') as file:
    file.write("'use strict';\n\n")
    file.write("const gFishingHoles=")
    file.write(holes_string)
    file.write(";\n")