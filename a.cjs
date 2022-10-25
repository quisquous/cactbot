const os = require('os');
const fs = require('node:fs/promises');
const path = require('path');


async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory())
      yield* walk(entry);
    else if (d.isFile())
      yield entry;
  }
}

// Then, use it with a simple async for loop
async function main() {
  for await (const p of walk('./ui/raidboss/data/')) {
    if (!p.endsWith('.ts')) {
      continue;
    }

    console.log(p);
    let content = (await fs.readFile(p)).toString();

    content = content.replaceAll(pattern, 'netRegex: {$2},');

    if (!content.includes('NetRegexes.')) {
      content = content.replace('import NetRegexes from \'../../../../../resources/netregexes\';\r\n', '');
    }

    await fs.writeFile(p, content);
  }
}

const method = [
  'startsUsing',
  'ability',
  'abilityFull',
  'headMarker',
  'addedCombatant',
  'addedCombatantFull',
  'removingCombatant',
  'gainsEffect',
  'statusEffectExplicit',
  'losesEffect',
  'tether',
  'wasDefeated',
  'networkDoT',
  'gameLog', 'gameNameLog',

  'statChange', 'changeZone', 'network6d', 'nameToggle', 'map', 'systemLogMessage', 'mapEffect',

].join('|');

const pattern = new RegExp(`netRegex: NetRegexes\.(${method})\({(.*)}\),`, 'g');


main().catch(e => {
  throw e;
});
