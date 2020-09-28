#!/usr/bin/env python

import csv
import json
import os
import urllib.request
import re
import io
from collections import defaultdict

"""Action data is available in csv form that has 3 headers looks like:
key,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65
#,Name,,Icon,ActionCategory,,Animation{Start},VFX,Animation{End},ActionTimeline{Hit},,ClassJob,BehaviourType,ClassJobLevel,IsRoleAction,Range,CanTargetSelf,CanTargetParty,CanTargetFriendly,CanTargetHostile,,,TargetArea,,,,CanTargetDead,,CastType,EffectRange,XAxisModifier,,PrimaryCost{Type},PrimaryCost{Value},SecondaryCost{Type},SecondaryCost{Value},Action{Combo},PreservesCombo,Cast<100ms>,Recast<100ms>,CooldownGroup,,MaxCharges,AttackType,Aspect,ActionProcStatus,,Status{GainSelf},UnlockLink,ClassJobCategory,,,AffectsPosition,Omen,IsPvP,,,,,,,,,,,,IsPlayerAction
int32,str,bit&01,Image,ActionCategory,byte,ActionCastTimeline,ActionCastVFX,ActionTimeline,ActionTimeline,byte,ClassJob,byte,byte,bit&02,sbyte,bit&04,bit&08,bit&10,bit&20,bit&40,bit&80,bit&01,bit&02,bit&04,sbyte,bit&08,bit&10,byte,byte,byte,bit&20,byte,uint16,byte,Row,Action,bit&40,uint16,uint16,byte,byte,byte,AttackType,byte,ActionProcStatus,byte,Status,Row,ClassJobCategory,byte,bit&80,bit&01,Omen,bit&02,bit&04,bit&08,bit&10,bit&20,bit&40,bit&80,bit&01,bit&02,byte,bit&04,bit&08,bit&10
0,"",False,405,0,0,0,0,0,0,0,-1,0,0,False,0,False,False,False,False,False,False,False,False,False,0,True,True,0,0,0,False,0,0,0,0,0,False,0,0,0,0,0,0,0,0,0,0,0,0,0,False,False,0,False,False,True,False,True,True,False,False,True,0,False,False,False
===rest of data===

We take the raw output and convert it into a usable JavaScript file to be imported and used within modules so we don't need to find and hardcode action data.

TODO:
Move constants into config file
Implement argparse
Make more universal functions more friendly for reuse
General streamlining
Implement column filtering on returned data
Validate output
Implement proper logging
Implement proper error handling
Review and streamline name normalization (current normalization taken from csv_util.py and coinach.py)
Build out local file functionality
Move table structuring from dunders to get_data_table()
Stab feature creep/overengineering in the eye
"""

config = {
    "output": {
        "pve": "pve_action_info.js",
        "pvp": "pvp_action_info.js",
        "crafting": "crafting_action_info.js",
        "combo": "pve_action_combos.js",
        "invalid": "invalid_action.log",
    },
    "locale_url": {
        "root": "https://raw.githubusercontent.com/",
        "intl": "xivapi/ffxiv-datamining/master/csv/",
        "cn": "thewakingsands/ffxiv-datamining-cn/master/",
        "ko": "Ra-Workspace/ffxiv-datamining-ko/master/csv/",
        "local": "",
    },
    "path": {"cactbot": os.path.abspath(__file__)[:-24]},
    "log": {"error": "gen_action_info.log"},
}


def tree():
    return defaultdict(tree)


def __get_remote_table(url, inputs, outputs=None):
    """Connects to a remote source to retrieve the table data"""
    # TODO: Error handling
    with urllib.request.urlopen(url) as response:
        csv_file = csv.reader(io.StringIO(response.read().decode("utf-8-sig")))

    # First line is the indices and third line is the data types.  They aren't currently used, so we discard them.
    next(csv_file)
    # Second line is the headers
    # Append the hexidecimal version of the ID as a new column so the original ID is usable for correllation
    headers = next(csv_file) + ["HexID"]
    next(csv_file)

    # Change # to ID for more readable data
    headers[0] = headers[0].replace("#", "ID")
    # Generate the hex ID from the ID and return the data with the headers prepended
    return [headers] + [x + [format(int(x[0]), "X")] for x in csv_file]


def __get_local_table(filename, inputs, outputs=None):
    """Gets table data from a local file"""
    # I'm honestly not even sure if this will work as expected. It can be updated/fixed if a use case is found.
    with open(filename, "r") as table:
        csv_file = [x.rstrip("\r\n").split(",") for x in table.read().decode("utf-8-sig")]

    # First line is the indices and third line is the data types.  They aren't currently used, so we discard them.
    csv_file.pop(2)
    csv_file.pop(0)

    # Next line is the headers
    # Append the hexidecimal version of the ID as a new column so the original ID is usable for correllation
    headers = csv_file.pop(0) + ["HexID"]
    # Change # to ID for more readable data
    headers[0] = headers[0].replace("#", "ID")
    # Generate the hex ID from the ID and return the data with the headers prepended
    return [headers] + [x + [format(int(x[0]), "X")] for x in csv_file]


def get_data_table(table_name, locale="intl", inputs=None, outputs=None):
    """Retrieves table data based on provided locale"""
    if locale == "local" and os.path.exists(table_name):
        return __get_local_table(table_name + ".csv", inputs, outputs)
    if locale in config["locale_url"]:
        url = config["locale_url"]["root"] + config["locale_url"][locale] + table_name + ".csv"
        return __get_remote_table(url, inputs, outputs)
    else:
        raise Exception("Invalid locale: %s" % locale)


def normalize_name(str):
    """Converts names into JavaScript-safe ascii string keys that adhere to the expected conventions."""
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


def write_js(filename, scriptname, variable, d):
    """Writes the created data structure to a .js file"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write("'use strict';\n\n")
        f.write("// Auto-generated from %s\n" % scriptname)
        f.write("// DO NOT EDIT THIS FILE DIRECTLY\n\n")
        f.write("const %s = " % variable)

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
        f.write(";\n\n")

        f.write("if (typeof module !== 'undefined')\n")
        f.write("  module.exports = %s;\n" % variable)

        print("wrote: %s" % filename)


def save_error(header, what, map, key):
    with open(config["log"]["error"], "a") as error_log:
        error_log.write("%s %s: %s" % (header, what, map[key]))


if __name__ == "__main__":
    actions_table = get_data_table("Action")
    jobs_table = get_data_table("ClassJob")

    actions = tree()
    jobs = defaultdict()

    # Restructure each row as a dictionary
    for job in ({k: v for k, v in zip(jobs_table[0], row)} for row in jobs_table[1:]):
        # Nest the data inside a new dictionary using the ID as the key
        jobs[job.pop("ID")] = job

    # This big pile of loop takes the header row and the data row and merges them together as a dictionary
    # Then it does some filtering to validate the action data.
    # Then it sorts the actions into relevant categories and nests the data as class/job abbreviation (ADV, GLA, DRK, etc.) then power name
    # Structure should end up looking vaguely like {'pve': {'CLS':{'AbilityName':{'RemainingKey':'Value'}}}}
    for action in ({k: v for k, v in zip(actions_table[0], row) if k} for row in actions_table[1:]):
        is_player_action = action["IsPlayerAction"] == "True"

        # They seem to use -1 for deprecated actions.
        is_valid_classjob = int(action["ClassJob"]) >= 0

        # Categories 30 and 31 are DoW and DoM respectively, 32 and 33 are DoH and DoL respectively.
        is_combat_classjob = (
            is_valid_classjob and 30 <= int(jobs[action["ClassJob"]]["ClassJobCategory"]) <= 31
        )
        is_crafting_classjob = (
            is_valid_classjob and 32 <= int(jobs[action["ClassJob"]]["ClassJobCategory"]) <= 33
        )

        # We keep the ID as the key for invalid actions in the event of a name collision.
        if action["Name"] and is_player_action and is_combat_classjob:
            if action["IsPvP"] == "False":
                if action["Name"] in actions["pve"][jobs[action["ClassJob"]]["Abbreviation"]]:
                    actions["invalid"][action.pop("ID")] = action
                else:
                    if int(action["Action{Combo}"]) > 0:
                        actions["combo"][action["ID"]]["Name"] = action["Name"]
                        actions["combo"][action["ID"]]["Previous"][action["Action{Combo}"]] = ""
                        actions["combo"][action["Action{Combo}"]]["Next"][action["ID"]] = action[
                            "Name"
                        ]
                    actions["pve"][jobs[action["ClassJob"]]["Abbreviation"]][
                        action.pop("Name")
                    ] = action
            elif action["IsPvP"] == "True":
                if action["Name"] in actions["pvp"][jobs[action["ClassJob"]]["Abbreviation"]]:
                    actions["invalid"][action.pop("ID")] = action
                else:
                    actions["pvp"][jobs[action["ClassJob"]]["Abbreviation"]][
                        action.pop("Name")
                    ] = action
        elif action["Name"] and is_player_action and is_crafting_classjob:
            if action["Name"] in actions["crafting"][jobs[action["ClassJob"]]["Abbreviation"]]:
                actions["invalid"][action.pop("ID")] = action
            else:
                actions["crafting"][jobs[action["ClassJob"]]["Abbreviation"]][
                    action.pop("Name")
                ] = action
        else:
            actions["invalid"][action.pop("ID")] = action

    for each in config["output"]:
        write_js(
            os.path.join(config["path"]["cactbot"], "resources", config["output"][each]),
            os.path.basename(os.path.abspath(__file__)),
            each.capitalize() + "Action",
            {k: {normalize_name(n): v for n, v in actions[each][k].items()} for k in actions[each]},
        )
