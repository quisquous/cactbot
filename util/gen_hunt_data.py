#!/usr/bin/env python

import argparse
import coinach
import csv
import csv_util
import os

_OUTPUT_FILE = "hunt.ts"


def update_german(list, search, replace):
    output = []
    for name in list:
        if search not in name:
            output.append(name)
            continue
        for repl in replace:
            output.append(name.replace(search, repl))
    return output


def parse_data(monsters, notorious, lang, name_map):
    print(f"Processing {lang} hunt names language...")

    for nm_id, nm_info in notorious.items():
        base = nm_info["BNpcBase"]
        rank_id = nm_info["Rank"]
        name_id = nm_info["BNpcName"]
        if not name_id:
            continue

        if name_map is None:
            name = name_id
        else:
            name = name_map[name_id]["Singular"]

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
    notorious_keys = ["#", "BNpcBase", "Rank", "BNpcName"]
    notorious = csv_util.make_map(reader.rawexd("NotoriousMonster"), notorious_keys)

    languages = ["en", "de", "fr", "ja"]
    for locale in languages:
        name_map = csv_util.make_map(reader.exd("BNpcName", lang=locale), ["#", "Singular"])
        parse_data(monsters, notorious, locale, name_map)
    return monsters


def update_raw_csv(monsters, locale):
    notorious_keys = ["#", "BNpcBase", "Rank", "BNpcName"]
    notorious = csv_util.get_locale_table("NotoriousMonster", locale, notorious_keys)
    name_map = csv_util.get_locale_table("BNpcName", locale, ["#", "Singular"])
    parse_data(monsters, notorious, locale, name_map)


def get_from_coinach(_ffxiv_game_path, _saint_conainch_cmd_path, _cactbot_path):
    reader = coinach.CoinachReader(
        coinach_path=_saint_conainch_cmd_path, ffxiv_path=_ffxiv_game_path
    )
    monsters = {}
    update_coinach(monsters, reader)
    update_raw_csv(monsters, "cn")
    update_raw_csv(monsters, "ko")

    all_monsters = {}
    for (_, info) in monsters.items():
        all_monsters[info["name"]["en"]] = info

    writer = coinach.CoinachWriter(cactbot_path=_cactbot_path)

    header = """import { LocaleObject } from '../types/trigger';

type LocaleTextOrArray = LocaleObject<string | string[]>;

export type Rank = 'S' | 'SS+' | 'SS-' | 'A' | 'B';

// Optional values are supported in `Options.CustomMonsters`.
export type HuntEntry = {
  id: string;
  name: LocaleTextOrArray | string | string[];
  rank?: Rank;
  regex?: RegExp;
  hp?: number;
}

export type HuntMap = {
  [huntName: string]: HuntEntry;
};"""

    writer.writeTypeScript(
        filename=os.path.join("resources", _OUTPUT_FILE),
        scriptname=os.path.basename(os.path.abspath(__file__)),
        header=header,
        type="HuntMap",
        as_const=False,
        data=all_monsters,
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
