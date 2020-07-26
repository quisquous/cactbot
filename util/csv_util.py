#!/usr/bin/env python

import csv
import io
import urllib.request

_BASE_GITHUB = "https://raw.githubusercontent.com/"
_INTL_GITHUB = "xivapi/ffxiv-datamining/master/csv/"
_CN_GITHUB = "thewakingsands/ffxiv-datamining-cn/master/"
_KO_GITHUB = "Ra-Workspace/ffxiv-datamining-ko/master/csv/"

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
