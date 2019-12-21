# Generates en/de/fr/ja translations for a given fflogs report.

import argparse
from collections import defaultdict
import json
import re
import sys
import encounter_tools as e_tools
import requests
import time

import fflogs

# 'en' here is 'www' which we consider the "base" and do automatically.
# 'cn' exists on fflogs but does not have proper translations, sorry.
languages = ['en', 'de', 'fr', 'ja', 'cn']
prefixes = {
    'en': 'www',
    'de': 'de',
    'fr': 'fr',
    'ja': 'ja',
    'cn': 'cn',
}
default_language = 'en'
ignore_abilities = ['Attack']
ignore_effects = [
    'Brink Of Death',
    'Sprint',
    'Regen',
    'Vulnerability Up',
    'Weakness',
]

# Setting the languages for use with XIVAPI/CafeMaker
xiv_langs = ['en', 'de', 'fr', 'ja']
xiv_lang_map = {'en': 'Name_en',
                'de': 'Name_de',
                'fr': 'Name_fr',
                'ja': 'Name_ja',
                }

def find_timeline_translatables(args):
    translatables = defaultdict(dict)
    # These keys do double duty as the indices for XIVAPI's search function.
    for element in ['action_ids', 'status', 'bnpcname', 'PlaceName']:
        translatables[element] = []   

    with args.timeline as file:
        for line in file:
            # Ignore all commented lines
            if not line[0].isdigit():
                continue

            # Boil each remaining line down to its sync regexes
            cleaned_line = re.search(r'^(?P<time>[\d\.]+)\s+"(?P<label>[^"]+)"\s+(?P<options>.+)', line)

            # If for some reason the line doesn't clean up properly, just skip it.
            if cleaned_line is None:
                continue

            sync_match = e_tools.is_tl_line_syncmatch(cleaned_line)

            # If we don't have a match for whatever reason, ignore the line.
            if sync_match is None:
                continue

            # We don't want to catch the reset line.
            if sync_match.group(1).startswith('is no longer sealed'):
                continue

            # Check through each line for its translatable elements,
            # adding new information to storage if found.

            # Looking for lines formatted as /:Enemy:CastID:/
            cast_match = e_tools.is_tl_line_cast(sync_match.group(0).split('/')[1])

            # Some lines include alternatives in the format 12(34|56). This breaks, and usually
            # these wouldn't be directly translated anyway.
            if cast_match and not re.search(r'\(.+\|.+\)', cast_match.group(0)):
                cast_match = cast_match.group(0).split(':')
                    # Here and for begincast we convert the hex ability ID to decimal,
                    # since that's what XIVAPI expects. We then convert back to string
                    # to avoid later complications.
                if not (str(int(cast_match[2], base=16)) in translatables['action_ids']):
                    translatables['action_ids'].append(str(int(cast_match[2], base=16)))
                if not (cast_match[1] in translatables['bnpcname']):
                    translatables['bnpcname'].append(cast_match[1])
                continue

            begincast_match = e_tools.is_tl_line_begincast(sync_match.group(0).split('/')[1])
            if begincast_match and not re.search(r'\(.+\|.+\)', begincast_match.group(0)):
                if not (begincast_match.group(1) in translatables['action_ids']):
                    translatables['action_ids'].append(str(int(begincast_match.group(1), base=16)))
                if not (begincast_match.group(2) in translatables['bnpcname']):
                    translatables['bnpcname'].append(begincast_match.group(2))
                continue
            
            # FIXME: The is_tl_line_buff() helper regex is currently bugged, and will NOT correctly return the buff/debuff.
            # The second capture group will eat the source/caster name up with the buff.
            # This line split  nonsense is to work around that
            buff_match = e_tools.is_tl_line_buff(sync_match.group(0))
            if buff_match:
                buff_match = buff_match.group(2).split(' from')[0]
                if not (buff_match in ['status']):
                    translatables['status'].append(buff_match)
                continue

            # Currently only looks for zone seal messages from log lines.
            # FIXME: Add other log line possibilities here if necessary.
            log_match = e_tools.is_tl_line_log(sync_match.group(1))
            if log_match and 'will be sealed off' in log_match.group(2):
                if not (log_match.group(2).split(' will be')[0] in translatables['PlaceName']):
                    translatables['PlaceName'].append(log_match.group(2).split(' will be')[0])

            add_match = e_tools.is_tl_line_adds(sync_match.group(1))
            if add_match:
                if not (add_match.group(1) in translatables['bnpcname']):
                    translatables['bnpcname'].append(add_match.group(1))
    print(translatables)
    return translatables

def compile_and_send(translatables):
    # XIVAPI/cafemaker allows for returning multiple items in one request if the item IDs are known.
    IDstr = ",".join(translatables['action_ids'])

    # These columns will be used for every XIVAPI request, so we alias them now.
    columns = 'Name_en,Name_de,Name_fr,Name_ja'
    ID_req = requests.get('https://xivapi.com/action', params={'ids': IDstr, 'columns': columns})
    ID_JSON = ID_req.json()['Results']

    finished_items = defaultdict(dict)
    for element in ['abilities', 'status', 'bnpcname', 'PlaceName']:
        finished_items[element] = defaultdict(dict)

    # Nested loops to unroll the abilities into something usable, yay!
    for ability in range(0, len(ID_JSON)):
        # Some abilities have no names.
        if ID_JSON[ability]['Name_en'] is '':
            continue
        for lang in xiv_langs:
            finished_items['abilities'][lang][ID_JSON[ability]['Name_en']] = ID_JSON[ability][xiv_lang_map[lang]]

    # Clearing the actions from the translation dict so we can iterate over it cleanly.
    translatables.pop('action_ids')

    # Because XIVAPI imposes rate limits, we manually stay under.
    requestcount = 1

    # Because we don't have the IDs for other elements, we have to search for them individually.
    # The Requests module blocks by default, so we don't need any asynchronous handling here.
    # TODO: Look up IDs in St Coinach so we can collapse all this into one request per type?
    # Nested loops are just THE BEST
    for element in translatables:
        working_dict = finished_items[element]
        if element is 'PlaceName':
            working_dict = finished_items['bnpcname']
        for item in translatables[element]:
            # To avoid being timed out by the server, we manually slow down here.
            # TODO: Allow for users to include their XIVAPI developer key to increase this limit.
            if requestcount % 11 is 0:
                time.sleep(1)
            req_payload = {'string': item, 'indexes': element, 'columns':columns,  'string_algo':'match'}
            search_req_results = requests.get('https://xivapi.com/search', params=req_payload).json()['Results']
            if len(search_req_results) is 0:
                continue

            # We assume here that the first result will be accurate.
            for lang in xiv_langs:
                working_dict[lang][search_req_results[0]['Name_en']] = search_req_results[0][xiv_lang_map[lang]]
            requestcount += 1
    return finished_items


def find_start_end_time(report, args):
    # Get the start and end timestamps for the specific fight
    start_time = 0
    end_time = 0
    fight_id = 0
    for fight in report['fights']:
        if args.fight and fight['id'] == args.fight:
            start_time = fight['start_time']
            end_time = fight['end_time']
            fight_id = fight['id']
            break
        elif fight['end_time'] - fight['start_time'] > end_time - start_time:
            start_time = fight['start_time']
            end_time = fight['end_time']
            fight_id = fight['id']

    if args.fight and not fight_id:
        raise Exception('Fight ID not found in report')

    return start_time, end_time, fight_id


def add_default_ability_mappings(ability_replace):
    # Many timelines have these, so just include a few by default.

    # FIXME: add ja translations here.
    # FIXME: add Start as well
    ability_replace['de']['--targetable--'] = '--anvisierbar--'
    ability_replace['fr']['--targetable--'] = '--Ciblable--'

    ability_replace['de']['--untargetable--'] = '--nich anvisierbar--'
    ability_replace['fr']['--untargetable--'] = '--Impossible à cibler--'

    ability_replace['de']['Enrage'] = 'Finalangriff'
    ability_replace['fr']['Enrage'] = 'Enrage'

    ability_replace['fr']['--Reset--'] = '--Réinitialisation--'
    ability_replace['fr']['--sync--'] = '--Synchronisation--'


def add_default_sync_mappings(sync_replace, args):
    sync_replace['de']['Engage!'] = 'Start!'
    sync_replace['fr']['Engage!'] = 'À l\'attaque'
    sync_replace['ja']['Engage!'] = '戦闘開始！'
    if not args.timeline:
        sync_replace['cn']['Engage!'] = '战斗开始！'


def build_mapping(translations, ignore_list=[]):
    """Build Mapping.

    Generate a mapping of lang => { default_name => name }
    """
    replace = defaultdict(dict)
    for _, item in translations.items():
        for lang, name in item.items():
            if lang == default_language:
                continue
            default_name = item[default_language]
            if default_name in ignore_list:
                continue
            if default_name.startswith('Unknown_'):
                continue
            if default_name in replace[lang]:
                existing_name = replace[lang][default_name]
                if existing_name != name:
                    # Just clean this up in post.
                    # raise Exception('Conflict on %s: "%s" and "%s"' % (default_name, existing_name, name))
                    pass
            else:
                if default_name and name :
                    replace[lang][default_name] = name
    return replace


def format_output_str(output_str):
    output_str = output_str.replace("'", "\\'")
    output_str = output_str.replace("\"","'")
    output_str = output_str.replace("'timelineReplace'", "timelineReplace")
    regex = re.compile(r"]$", re.M)
    output_str = regex.sub("],", output_str)
    regex = re.compile(r"}$", re.M)
    output_str = regex.sub("},", output_str)
    regex = re.compile(r"'[\r\n]", re.M)
    output_str = regex.sub("',\n", output_str)
    return output_str[:-1]


def main(args):
    mob_replace = defaultdict(dict)
    effect_replace = defaultdict(dict)
    ability_replace = defaultdict(dict)

    # If we're working with an existing timeline file, go find everything to translate within it,
    # instead of using FFLogs to translate.
    if args.timeline:
        translatables = find_timeline_translatables(args)
        compiled_items = compile_and_send(translatables)
        mob_replace = compiled_items['bnpcname']
        effect_replace = compiled_items['status']
        ability_replace = compiled_items['abilities']


        # We don't want key errors popping up, so we ensure that Main looks only for languages we're working with.
        languages = xiv_langs

    else:
        # Get overall reports and enemies.
        enemies = defaultdict(dict)
        options = {
            'api_key': args.key,
            'translate': 'true',
        }
        fight_id = 0

        for lang in languages:
            report = fflogs.api('fights', args.report, prefixes[lang], options)
            if fight_id == 0:
                start_time, end_time, fight_id = find_start_end_time(report, args)
            for enemy in report['enemies']:
                # Because the overall report contains all enemies from any report,
                # filter them by the fight_id that we care about.
                for fight in enemy['fights']:
                    if fight['id'] == fight_id:
                        enemies[enemy['id']][lang] = enemy['name']
                        break

        # Get abilities for the chosen fight.
        abilities = defaultdict(dict)
        options = {
            'api_key': args.key,
            'start': start_time,
            'end': end_time,
            # filtering for disposition='enemy' drops neutral abilities like Encumber.
            # including death also gets you Wroth Ghosts that don't show up otherwise.
            'filter': 'source.type="NPC" and (type="cast" or type="death" or type="begincast")',
            'translate': 'true',
        }

        for lang in languages:
            events = fflogs.api('events', args.report, prefixes[lang], options)['events']
            for event in events:
                actor = 0
                if 'targetID' in event:
                    actor = event['targetID']

                if 'ability' not in event:
                    # Some mobs don't show up in the fight enemy list, but are things that get death events.
                    # e.g. {'sourceIsFriendly': False, 'type': 'death', 'target': {'guid': 58, 'name': 'Wroth Ghost', 'type': 'NPC' } }
                    if event['type'] == 'death' and not actor and 'target' in event:
                        target = event['target']
                        enemies[target['guid']][lang] = target['name']
                    continue
                ability = event['ability']
                abilities[(actor, ability['guid'])][lang] = ability['name']

        # Finally, get boss debuff names.  These aren't used directly in timeline replacement
        # but are helpful to have listed when writing other triggers.
        options['filter'] = 'source.type="NPC" and (type="applydebuffstack" or type="applydebuff" or type="refreshdebuff")'

        effects = defaultdict(dict)
        for lang in languages:
            events = fflogs.api('events', args.report, prefixes[lang], options)['events']
            for event in events:
                actor = 0
                if 'targetID' in event:
                    actor = event['targetID']
                ability = event['ability']
                effects[(actor, ability['guid'])][lang] = ability['name']

        # Generate mappings of english => locale names.
        mob_replace = build_mapping(enemies)
        ability_replace = build_mapping(abilities, ignore_abilities)
        effect_replace = build_mapping(effects, ignore_effects)

    add_default_sync_mappings(mob_replace, args)
    add_default_ability_mappings(ability_replace)

    # Build some JSON similar to what cactbot expects in trigger files.
    timeline_replace = []
    for lang in languages:
        if lang == default_language:
            continue
        timeline_replace.append({
            'locale': lang,
            'replaceSync': dict(sorted(mob_replace[lang].items(), reverse=True)),
            'replaceText': dict(sorted(ability_replace[lang].items(), reverse=True)),
            # sort this last <_<
            '~effectNames': dict(sorted(effect_replace[lang].items(), reverse=True)),
        })
    output = {'timelineReplace': timeline_replace}
    output_str = json.dumps(output, ensure_ascii=False, indent=2, sort_keys=False)
    output_str = format_output_str(output_str)
    
    # Write that out to the user.
    if args.output_file:
        with open(args.output_file, 'w', encoding='utf-8') as fp:
            fp.write(output_str)
    else:
        try:
            print(output_str)
        except UnicodeEncodeError:
            print("Warning: unable to print to console, use --output-file", file=sys.stderr)
            raise


if __name__ == "__main__":
    example_usage = """
    example:
        translate_fight.py -r WfrP3jgTqCbk4Ady --output-file=output.json

        Finds translations of this fight on fflogs and writes a json
        file suitable for including in a cactbot trigger file"""

    parser = argparse.ArgumentParser(
        description="Creates a translation from an fflogs report",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter)

    parser.add_argument('-r', '--report', help="The ID of an FFLogs report")
    parser.add_argument('-t', '--timeline', type=argparse.FileType('r', encoding="utf8"), help="Timeline for encounter to translate.")
    parser.add_argument('-of', '--output-file', help="The file to write output in")

    parser.add_argument('-k', '--key', help="The FFLogs API key (public) to use, from https://www.fflogs.com/accounts/changeuser")
    parser.add_argument('-rf', '--fight', type=int, help="Fight ID of the report to use. Defaults to longest in the report")

    args = parser.parse_args()

    if not args.report and not args.timeline:
        parser.print_help()
        sys.exit(0)

    if args.report and not args.key:
        raise parser.error("FFlogs parsing requires an API key. Visit https://www.fflogs.com/accounts/changeuser and use the Public key")

    main(args)
