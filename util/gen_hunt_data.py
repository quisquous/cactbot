import csv
import coinach
import os
from collections import defaultdict

_OUTPUT_FILE = 'hunt.js'


def parse_data(csvfile, lang='en'):
    monsters = {}
    reader = csv.reader(csvfile)
    # skip the first three header lines
    next(reader)
    next(reader)
    next(reader)
    if lang == 'chs':
        lang = 'cn'
    for row in reader:
        m_id, m_base, m_rank, m_name = row[:-1]
        if not m_name: continue
        m_rank = 'S' if m_rank == 3 else (
            'A' if m_rank == 2 else 'B'
        )
        if m_base == 'BNpcBase#10422':
            m_rank = 'SS+'
        if m_base == 'BNpcBase#10755':
            m_rank = 'SS-'
        monsters[m_id] = {
            'name':{
                lang: m_name,
            },
            'rank': m_rank,
        }
    return monsters


def update(reader, writer):
    languages = ['en', 'de', 'fr', 'ja']
    monsters = defaultdict(lambda: {'name':{}, 'rank':''})
    for locale in languages:
        data = reader.exd('NotoriousMonster', lang=locale)
        data = parse_data(data, lang=locale)
        for m in data.keys():
            monsters[m]['name'].update(data[m]['name'])
            monsters[m]['rank'] = data[m]['rank']
    return monsters

def update_cn(reader, writer, monsters={}):
    languages = ['chs']
    for locale in languages:
        data = reader.exd('NotoriousMonster', lang=locale)
        data = parse_data(data, lang=locale)
        for m in data.keys():
            monsters[m]['name'].update(data[m]['name'])
            monsters[m]['rank'] = data[m]['rank']
    return monsters

FFXIV_PATH = ''
CN_FFXIV_PATH = 'C:\Games\SDO\FFXIV'

def get_from_coinach():
    # TODO: make an arg parser for non-default paths
    reader = coinach.CoinachReader(verbose=True)
    writer = coinach.CoinachWriter(verbose=True)
    if FFXIV_PATH:
        reader.ffxiv_path = FFXIV_PATH
    monsters = update(reader, writer)
    if CN_FFXIV_PATH:
        reader.ffxiv_path = CN_FFXIV_PATH
    monsters = update_cn(reader, writer, monsters)
    all_monsters = {}
    for (k, v) in monsters.items():
        all_monsters[v['name']['en']] = v
    writer.write(
        os.path.join('resources', _OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        'gMonster',
        all_monsters)

def get_from_xivapi():
    # TODO: get hunt resources from xivapi
    pass

if __name__ == '__main__':
    get_from_coinach()