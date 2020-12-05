#!/usr/bin/env python

"""Helper for automating SaintCoinach -- https://github.com/ufx/SaintCoinach"""

import json
import re
import subprocess
import os
import sys

_COINACH_EXE = "SaintCoinach.Cmd.exe"
_DEFAULT_COINACH_PATHS = [
    "C:\\SaintCoinach\\",
    "D:\\SaintCoinach\\",
]

if os.environ.get("CACTBOT_DEFAULT_COINACH_PATH", None):
    _DEFAULT_COINACH_PATHS.append(os.environ["CACTBOT_DEFAULT_COINACH_PATH"])

_FFXIV_EXE = os.path.join("game", "ffxiv_dx11.exe")

_DEFAULT_FFXIV_PATHS = [
    "C:\\Program Files (x86)\\SquareEnix\\FINAL FANTASY XIV - A Realm Reborn",
    "D:\\Program Files (x86)\\SquareEnix\\FINAL FANTASY XIV - A Realm Reborn",
]

if os.environ.get("CACTBOT_DEFAULT_FFXIV_PATH", None):
    _DEFAULT_FFXIV_PATHS.append(os.environ["CACTBOT_DEFAULT_FFXIV_PATH"])


class CoinachError(Exception):
    def __init__(self, message, cmd, output):
        self.message = message
        self.cmd = cmd
        self.output = output


class CoinachReader:
    def __init__(self, coinach_path=None, ffxiv_path=None, verbose=False):
        self.coinach_path = coinach_path
        self.ffxiv_path = ffxiv_path
        self.verbose = verbose

        if not self.coinach_path:
            for p in _DEFAULT_COINACH_PATHS:
                if os.path.isfile(os.path.join(p, _COINACH_EXE)):
                    self.coinach_path = p
                    break
        if not self.ffxiv_path:
            for p in _DEFAULT_FFXIV_PATHS:
                if os.path.isfile(os.path.join(p, _FFXIV_EXE)):
                    self.ffxiv_path = p
                    break

        if not os.path.isfile(os.path.join(self.coinach_path, _COINACH_EXE)):
            raise Exception("invalid coinach path: %s" % self.coinach_path)
        if not os.path.isfile(os.path.join(self.ffxiv_path, _FFXIV_EXE)):
            raise Exception("invalid ffxiv path: %s" % self.ffxiv_path)

    def exd(self, table, lang="en"):
        return self._coinach_cmd("exd", table, lang)

    def rawexd(self, table, lang="en"):
        return self._coinach_cmd("rawexd", table, lang)

    def _coinach_cmd(self, coinach_cmd, table, lang):
        cmd_list = [
            os.path.join(self.coinach_path, _COINACH_EXE),
        ]
        args = [self.ffxiv_path, "lang %s" % lang, "%s %s" % (coinach_cmd, table)]

        cmd_list.extend(map(lambda x: '"%s"' % x, args))
        cmd = " ".join(cmd_list)

        if self.verbose:
            print("coinach_path: %s" % self.coinach_path)
            print("ffxiv_path: %s" % self.ffxiv_path)
            print("cmd: %s" % cmd)

        # This will throw an exception if stuff is VERY wrong
        # however, return code is still 0 even if all exports fail.
        # Also, it seems to need to be run from the SaintCoinach directory.
        raw_output = subprocess.check_output(cmd, cwd=self.coinach_path,)
        output = raw_output.decode("utf8")

        # Manually check output for errors.
        m = re.search(r"^([0-9])* files exported, ([0-9])* failed", output, re.MULTILINE)
        if not m:
            raise CoinachError("Unknown output", cmd, output)
        if m.group(1) == "0":
            raise CoinachError("Zero successes", cmd, output)
        if m.group(2) != "0":
            raise CoinachError("Non-zero failures", cmd, output)

        # Find directory that this export was written to.
        # There's no way to control this.
        m = re.search(r"^Definition version: ([0-9.]*)", output, re.MULTILINE)
        if not m:
            raise CoinachError("Unknown output", cmd, output)

        csv_filename = os.path.join(self.coinach_path, m.group(1), coinach_cmd, "%s.csv" % table)

        if self.verbose:
            print("output: \n%s" % output)
            print("output csv: %s" % csv_filename)

        # Read the whole file immediately,
        # as future commands with different langs will overwrite.
        with open(csv_filename, "r", encoding="utf-8") as f:
            lines = f.readlines()

        if self.verbose:
            print("csv lines: %d" % len(lines))

        return lines


class CoinachWriter:
    def __init__(self, cactbot_path=None, verbose=False):
        self.verbose = verbose

        if not cactbot_path:
            cactbot_path = self._find_cactbot_path()
        self.cactbot_path = cactbot_path
        if not os.path.isdir(self.cactbot_path):
            raise Exception("Invalid cactboth path: %s" % self.cactbot_path)

    def _find_cactbot_path(self):
        p = os.path.abspath(__file__)
        while True:
            p, tail = os.path.split(p)
            if "cactbot" in tail:
                p = os.path.join(p, tail)
                if self.verbose:
                    print("cactbot: %s" % p)
                return p
            if not tail:
                return None

    def write(self, filename, scriptname, variable, d):
        full_path = os.path.join(self.cactbot_path, filename)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write("// Auto-generated from %s\n" % scriptname)
            f.write("// DO NOT EDIT THIS FILE DIRECTLY\n\n")
            f.write("export default ")

            str = json.dumps(d, sort_keys=True, indent=2, ensure_ascii=False)
            # single quote style
            str = re.sub(r"'", '\\"', str)
            str = re.sub(r'"', "'", str)
            # add trailing commas
            str = re.sub(r"([0-9]|'|]|})\s*$", r"\1,", str, flags=re.MULTILINE)
            # remove final trailing comma
            str = re.sub(r",$", "", str)
            # make keys integers, remove leading zeroes.
            str = re.sub(r"'0*([0-9]+)': {", r"\1: {", str)
            f.write(str)
            f.write(";\n")

        if self.verbose:
            print("wrote: %s" % filename)


if __name__ == "__main__":
    reader = CoinachReader(verbose=True)
    lines = reader.exd(sys.argv[1], "en")
    print(lines)
