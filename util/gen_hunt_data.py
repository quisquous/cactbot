#!/usr/bin/env python

import csv
import urllib.request
import os
import io
import coinach
import argparse

_OUTPUT_FILE = "hunt.js"

_BASE_GITHUB = "https://raw.githubusercontent.com/"
_CN_GITHUB = "thewakingsands/ffxiv-datamining-cn/master/"
_KO_GITHUB = "Ra-Workspace/ffxiv-datamining-ko/master/csv/"


def update_german(list, search, replace):
    output = []
    for name in list:
        if search not in name:
            output.append(name)
            continue
        for repl in replace:
            output.append(name.replace(search, repl))
    return output


def parse_data(monsters, csvfile, lang="en", name_map=None):
    print(f"Processing {lang} hunt names language...")

    reader = csv.reader(csvfile)
    # skip the first three header lines
    next(reader)
    next(reader)
    next(reader)
    for row in reader:
        nm_id, base, rank_id, name_id = row[:-1]
        if not name_id:
            continue

        if name_map is None:
            name = name_id
        else:
            name = name_map[name_id]

        if not name:
            continue

        if lang == "de":
            name = [name.replace("[p]", "")]
            name = update_german(name, "[t]", ["der", "die", "das"])
            name = update_german(name, "[a]", ["e", "er", "es"])
            name = update_german(name, "[A]", ["e", "er", "es"])
            if len(name) == 1:
                name = name[0]

        # SaintCoinach prefaces ids with a comment
        # Other dumps just have the int.
        base = base.replace("BNpcBase#", "")

        if base == "10422":
            rank = "SS+"
        elif base == "10755":
            rank = "SS-"
        elif rank_id == "3":
            rank = "S"
        elif rank_id == "2":
            rank = "A"
        else:
            rank = "B"

        if nm_id in monsters:
            assert monsters[nm_id]["id"] == name_id
            assert monsters[nm_id]["rank"] == rank
        else:
            monsters[nm_id] = {"id": name_id, "rank": rank, "name": {}}

        monsters[nm_id]["name"][lang] = name


def update_coinach(monsters, reader):
    print("Reading Notorious Monster list...")

    nm_csv = reader.rawexd("NotoriousMonster")
    languages = ["en", "de", "fr", "ja"]
    for locale in languages:
        name_map = process_npc_names(reader.exd("BNpcName", lang=locale))
        parse_data(monsters, nm_csv, lang=locale, name_map=name_map)
    return monsters


def process_npc_names(csvfile):
    data = {}
    reader = csv.reader(csvfile)
    for row in reader:
        data[row[0]] = row[1]
    return data


def update_raw_csv(monsters, url, locale):
    with urllib.request.urlopen(url + "NotoriousMonster.csv") as nm_response:
        with urllib.request.urlopen(url + "BNpcName.csv") as names_response:
            notorious = io.StringIO(nm_response.read().decode("utf-8"))
            names = io.StringIO(names_response.read().decode("utf-8"))
            parse_data(monsters, notorious, locale, process_npc_names(names))


def get_from_coinach(_ffxiv_game_path, _saint_conainch_cmd_path, _cactbot_path):
    reader = coinach.CoinachReader(
        coinach_path=_saint_conainch_cmd_path, ffxiv_path=_ffxiv_game_path
    )
    monsters = {}
    update_coinach(monsters, reader)
    update_raw_csv(monsters, _BASE_GITHUB + _CN_GITHUB, "cn")
    update_raw_csv(monsters, _BASE_GITHUB + _KO_GITHUB, "ko")

    all_monsters = {}
    for (_, info) in monsters.items():
        all_monsters[info["name"]["en"]] = info

    writer = coinach.CoinachWriter(cactbot_path=_cactbot_path)
    writer.write(
        os.path.join("resources", _OUTPUT_FILE),
        os.path.basename(os.path.abspath(__file__)),
        "gMonster",
        all_monsters,
    )

    print(f"File '{_OUTPUT_FILE}' successfully created.")


if __name__ == "__main__":
    example_usage = r"python .\gen_hunt_data.py -fp 'E:\FINAL FANTASY XIV - A Realm Reborn' -scp 'F:\SaintCoinach\SaintCoinach.Cmd\bin\Release' -cp 'F:\cactbot'"

    parser = argparse.ArgumentParser(
        description="Creates hunt.js for the Radar overlay",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "-fp", "--ffxiv-path", help="Path to FFXIV installation (None == Default location)"
    )
    parser.add_argument(
        "-scp",
        "--saint-coinach-cmd-path",
        help="Path to SaintCoinach.cmd (None == Default location)",
    )
    parser.add_argument("-cp", "--cactbot-path", help="Path to CACTBOT (None == Default location)")

    args = parser.parse_args()
    get_from_coinach(args.ffxiv_path, args.saint_coinach_cmd_path, args.cactbot_path)
