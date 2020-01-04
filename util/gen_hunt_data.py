import csv
import os
from collections import defaultdict
import coinach

_OUTPUT_FILE = 'hunt.js'


def update_german(string):
    string = string.replace('[p]', '')
    string = string.replace('[t]', '(?:der|die|das)')
    string = string.replace('[a]', '(?:e|er|es|en)')
    string = string.replace('[A]', '(?:e|er|es|en)')
    return string


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

        name = m_name
        if lang == 'de':
            name = update_german(name)

        monsters[m_id] = {
            'name': {
                lang: name,
            },
            'rank': rank,
        }
    return monsters


def update(reader):
    languages = ['en', 'de', 'fr', 'ja']
    monsters = defaultdict(lambda: {'name':{}, 'rank':''})
    for locale in languages:
        exd = reader.exd('NotoriousMonster', lang=locale)
        data = parse_data(exd, lang=locale)
        for key in data:
            monsters[key]['name'].update(data[key]['name'])
            monsters[key]['rank'] = data[key]['rank']
    return monsters


def get_from_coinach():
    reader = coinach.CoinachReader()
    writer = coinach.CoinachWriter()
    monsters = update(reader)
    all_monsters = {}
    for (_, info) in monsters.items():
        all_monsters[info['name']['en']] = info
    writer.write(
        os.path.join('resources', _OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        'gMonster',
        all_monsters)


if __name__ == '__main__':
    get_from_coinach()
