#!/usr/bin/env python

import coinach
import csv
import csv_util
import os

_OUTPUT_FILE = "pet_names.ts"


if __name__ == "__main__":
    keys = ["Name"]

    tables = {}
    for lang in ["en", "fr", "de", "ja"]:
        reader = coinach.CoinachReader(verbose=True)
        tables[lang] = csv_util.make_map(reader.exd("Pet", lang=lang), keys)
    tables["cn"] = csv_util.get_cn_table("Pet", keys)
    tables["ko"] = csv_util.get_ko_table("Pet", keys)

    tables = {lang: [name for name in table.keys() if name] for lang, table in tables.items()}

    writer = coinach.CoinachWriter(verbose=True)
    header = """import { Lang } from '../../resources/languages';

type PetData = {
  [name in Lang]: readonly string[];
};"""
    writer.writeTypeScript(
        filename=os.path.join("resources", _OUTPUT_FILE),
        scriptname=os.path.basename(os.path.abspath(__file__)),
        header=header,
        type="PetData",
        as_const=False,
        data=tables,
    )
