#!/usr/bin/env python

import csv
import io
import re
import urllib.request

_BASE_GITHUB = "https://raw.githubusercontent.com/"
_INTL_GITHUB = "xivapi/ffxiv-datamining/master/csv/"
_CN_GITHUB = "thewakingsands/ffxiv-datamining-cn/master/"
_KO_GITHUB = "Ra-Workspace/ffxiv-datamining-ko/master/csv/"


# Turn names from tables into JavaScript-safe ascii string keys.
def clean_name(str):
    if not str:
        return str

    # The Tam\u2013Tara Deepcroft
    str = re.sub(r"\u2013", "-", str)

    # The <Emphasis>Whorleater</Emphasis> Extreme
    str = re.sub(r"</?Emphasis>", "", str)

    # Various symbols to get rid of.
    str = re.sub(r"[':(),]", "", str)

    # Sigmascape V4.0 (Savage)
    str = re.sub(r"\.", "", str)

    # Common case hyphen: TheSecondCoilOfBahamutTurn1
    # Special case hyphen: ThePalaceOfTheDeadFloors1_10
    str = re.sub(r"([0-9])-([0-9])", r"\1_\2", str)
    str = re.sub(r"[-]", " ", str)

    # Of course capitalization isn't consistent, that'd be ridiculous.
    str = str.title()

    # collapse remaining whitespace
    str = re.sub(r"\s+", "", str)

    # remove non-ascii characters
    str = re.sub(r"[^0-9A-z_]", "", str)
    return str


# inputs[0] is the key column for the returned map
def make_map(contents, inputs, outputs=None):
    map = {}

    reader = csv.reader(contents)
    next(reader)
    keys = next(reader)
    next(reader)

    indices = []
    for input in inputs:
        if isinstance(input, int):
            indices.append(input)
            continue
        indices.append(keys.index(input))

    if outputs == None:
        outputs = inputs

    for row in reader:
        output = {}
        for i in range(0, len(indices)):
            output[outputs[i]] = row[indices[i]]
        if indices[0] in row:
            print("key collision for %s, %s" % (inputs, outputs))
        map[row[indices[0]]] = output

    return map


def __get_remote_table(url, inputs, outputs=None):
    with urllib.request.urlopen(url) as response:
        contents = io.StringIO(response.read().decode("utf-8"))
        return make_map(contents, inputs, outputs)


def get_intl_table(table, inputs, outputs=None):
    url = "%s%s%s.csv" % (_BASE_GITHUB, _INTL_GITHUB, table)
    return __get_remote_table(url, inputs, outputs)


def get_ko_table(table, inputs, outputs=None):
    url = "%s%s%s.csv" % (_BASE_GITHUB, _KO_GITHUB, table)
    return __get_remote_table(url, inputs, outputs)


def get_cn_table(table, inputs, outputs=None):
    url = "%s%s%s.csv" % (_BASE_GITHUB, _CN_GITHUB, table)
    return __get_remote_table(url, inputs, outputs)


def get_locale_table(table, locale, inputs, outputs=None):
    if locale == "cn":
        return get_cn_table(table, inputs, outputs)
    elif locale == "ko":
        return get_ko_table(table, inputs, outputs)
    else:
        raise Exception("Invalid locale: %s" % locale)


def get_raw_csv(table, locale):
    if locale == "cn":
        url = "%s%s%s.csv" % (_BASE_GITHUB, _CN_GITHUB, table)
    elif locale == "ko":
        url = "%s%s%s.csv" % (_BASE_GITHUB, _KO_GITHUB, table)
    else:
        raise Exception("Invalid locale: %s" % locale)
    with urllib.request.urlopen(url) as response:
        return io.StringIO(response.read().decode("utf-8"))
