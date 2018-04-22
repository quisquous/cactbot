### Generates en/de/fr/ja translations for a given fflogs report.

import argparse
from collections import defaultdict
from datetime import datetime
import fflogs
import json
import re
import sys

# 'en' here is 'www' which we consider the "base" and do automatically.
# 'cn' exists on fflogs but does not have proper translations, sorry.
languages = ['en', 'de', 'fr', 'ja']
prefixes = {
  'en': 'www',
  'de': 'de',
  'fr': 'fr',
  'ja': 'ja',
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

# generate a mapping of lang => { default_name => name }
def build_mapping(translations, ignore_list=[]):
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
          raise Exception('Conflict on %s: "%s" and "%s"' % (default_name, existing_name, name))
      else:
        replace[lang][default_name] = name
  return replace

def main(args):
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
    options = {
        'api_key': args.key,
        'start': start_time,
        'end': end_time,
        # filtering for disposition='enemy' drops neutral abilities like Encumber.
        # including death also gets you Wroth Ghosts that don't show up otherwise.
        'filter': 'source.type="NPC" and (type="cast" or type="death")',
        'translate': 'true',
    }
    abilities = defaultdict(dict)
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
    options = {
        'api_key': args.key,
        'start': start_time,
        'end': end_time,
        'filter': 'source.type="NPC" and (type="applydebuffstack" or type="applydebuff" or type="refreshdebuff")',
        'translate': 'true',
    }
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

    # Build some JSON similar to what cactbot expects in trigger files.
    timeline_replace = []
    for lang in languages:
      if lang == default_language:
        continue
      timeline_replace.append({
        'locale': lang,
        'replaceText': ability_replace[lang],
        'replaceSync': mob_replace[lang],
        # sort this last <_<
        '~effectNames': effect_replace[lang],
      })
    output = { 'timelineReplace': timeline_replace }
    output_str = json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True)

    # Write that out to the user.
    if args.output_file:
      with open(args.output_file, 'w', encoding='utf-16') as fp:
        fp.write(output_str)
    else:
      try:
        print(output_str)
      except UnicodeEncodeError as e:
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
    parser.add_argument('-of', '--output-file', help="The file to write output in")

    parser.add_argument('-k', '--key', help="The FFLogs API key to use, from https://www.fflogs.com/accounts/changeuser")
    parser.add_argument('-rf', '--fight', type=int, help="Fight ID of the report to use. Defaults to longest in the report")

    args = parser.parse_args()

    if args.report and not args.key:
        raise parser.error("FFlogs parsing requires an API key. Visit https://www.fflogs.com/accounts/changeuser and use the Public key")

    main(args)
