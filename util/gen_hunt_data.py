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
    for row in reader:
        m_id, m_base, m_rank, m_name = row[:-1]
        if not m_name:
            continue
        if m_base == 'BNpcBase#10422':
            rank = 'SS+'
        elif m_base == 'BNpcBase#10755':
            rank = 'SS-'
        elif m_rank == '3':
            rank = 'S'
        elif m_rank == '2':
            rank = 'A'
        else:
            rank = 'B'
        monsters[m_id] = {
            'name': {
                lang: m_name,
            },
            'rank': rank,
        }
    return monsters


def update(reader, writer):
    languages = ['en', 'de', 'fr', 'ja']
    monsters = defaultdict(lambda: {'name':{}, 'rank':''})
    for locale in languages:
        exd = reader.exd('NotoriousMonster', lang=locale)
        data = parse_data(exd, lang=locale)
        for m in data.keys():
            monsters[m]['name'].update(data[m]['name'])
            monsters[m]['rank'] = data[m]['rank']
    return monsters


def get_from_coinach():
    reader = coinach.CoinachReader(verbose=True)
    writer = coinach.CoinachWriter(verbose=True)
    monsters = update(reader, writer)
    all_monsters = {}
    for (k, v) in monsters.items():
        all_monsters[v['name']['en']] = v
    writer.write(
        os.path.join('resources', _OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        'gMonster',
        all_monsters)


if __name__ == '__main__':
    get_from_coinach()