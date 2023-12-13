// This test loads an individual oopsy file and validates things about it.

import path from 'path';

import { assert } from 'chai';

// TODO: verify usage of matches vs capture: true in oopsy triggers

import { LooseOopsyTrigger, LooseOopsyTriggerSet, OopsyMistakeMapFields } from '../../types/oopsy';

export const oopsyMistakeMapKeys: readonly (keyof OopsyMistakeMapFields)[] = [
  'damageWarn',
  'damageFail',
  'gainsEffectWarn',
  'gainsEffectFail',
  'shareWarn',
  'shareFail',
  'soloWarn',
  'soloFail',
] as const;

const testOopsyFile = (file: string, info: OopsyTriggerSetInfo) => {
  let triggerSet: LooseOopsyTriggerSet;

  before(async () => {
    // const contents = fs.readFileSync(file).toString();

    // Normalize path
    const importPath = `../../${path.relative(process.cwd(), file).replace('.ts', '.js')}`;

    // Dynamic imports don't have a type, so add type assertion.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    triggerSet = (await import(importPath)).default as LooseOopsyTriggerSet;
  });

  // Dummy test so that failures in before show up with better text.
  it('should load properly', () => {/* noop */});

  it('has valid id and prefix', () => {
    let prefix: undefined | string;
    let brokenPrefixes = false;

    const verifyId = (id: string): void => {
      if (prefix === undefined) {
        prefix = id;
        return;
      }

      const prevSeenFile = info.triggerId[id];
      if (prevSeenFile !== undefined)
        assert.fail(`duplicate id: '${id}' seen in ${prevSeenFile}`);
      info.triggerId[id] = file;

      // Find common prefix.
      let idx = 0;
      const len = Math.min(prefix.length, id.length);
      for (idx = 0; idx < len; ++idx) {
        if (prefix[idx] !== id[idx])
          break;
      }
      if (idx === 0) {
        assert.fail(`${file}: No common id prefix in '${prefix}' and '${id}'`);
        brokenPrefixes = true;
        return;
      }
      prefix = prefix.slice(0, idx);
    };

    for (const field of oopsyMistakeMapKeys) {
      for (const id of Object.keys(triggerSet[field] ?? {})) {
        verifyId(id);
      }
    }

    for (const trigger of triggerSet.triggers ?? []) {
      if (trigger.id === undefined) {
        assert.fail(`Missing id field in trigger ${trigger.netRegex?.source ?? '???'}`);
        continue;
      }

      verifyId(trigger.id);
    }

    // If there's at least two ids, then the prefix must be a full word.
    // e.g. you can have two triggers like "Prefix Thing 1" and "Prefix Thing 2"
    // you cannot have two triggers like "O4N Thing 1" and "O4S Thing 2",
    // as the prefix "O4" is not a full word (and have a space after it,
    // as "Prefix " does.  This is a bit rigid, but prevents many typos.
    if (!brokenPrefixes && prefix !== undefined && prefix.length > 0) {
      // if prefix includes more than one word, just remove latter letters.
      if (prefix.includes(' '))
        prefix = prefix.slice(0, prefix.lastIndexOf(' ') + 1);
      // TODO: it would be nice to do a loop back through all the ids and list
      // which ones fail this, rather than just saying "O4S is not a full word".
      if (!prefix.endsWith(' '))
        assert.fail(`id prefix '${prefix}' is not a full word, must end in a space`);
    }
  });

  it('has sorted trigger fields', () => {
    // This is the order in which they are run.
    const triggerOrder: (keyof LooseOopsyTrigger)[] = [
      'id',
      'comment',
      'condition',
      'delaySeconds',
      'suppressSeconds',
      'deathReason',
      'mistake',
      'run',
    ];

    for (const trigger of triggerSet.triggers ?? []) {
      const id = trigger.id;
      // This will be an error in another test.
      if (id === undefined)
        continue;

      let lastIdx = -1;

      const keys = Object.keys(trigger);

      for (const field of triggerOrder) {
        if (!(field in trigger))
          continue;

        const thisIdx = keys.indexOf(field);
        if (thisIdx === -1)
          continue;
        if (thisIdx <= lastIdx) {
          assert.fail(
            `in ${id}, field '${keys[lastIdx] ?? '???'}' must precede '${keys[thisIdx] ?? '???'}'`,
          );
        }

        lastIdx = thisIdx;
      }
    }
  });

  it('has valid zone id', () => {
    if (!('zoneId' in triggerSet))
      assert.fail(`missing zone id`);
    else if (typeof triggerSet.zoneId === 'undefined')
      assert.fail(`unknown zone id`);

    if ('zoneRegex' in triggerSet)
      assert.fail(`use zoneId instead of zoneRegex`);
  });

  it('does not reuse the same ability id', () => {
    // Within the same file's mistake maps, it's wrong to have the same ability id listed twice
    // as it means that it would show two errors if that ever happened. This is likely a typo.

    const abilityIdToId: { [abilityid: string]: string } = {};
    for (const field of oopsyMistakeMapKeys) {
      for (const [id, abilityId] of Object.entries(triggerSet[field] ?? {})) {
        // Ignore TODOs from `util/sync_files.ts` that haven't been filled out.
        if (abilityId.startsWith('TODO'))
          continue;
        const prevId = abilityIdToId[abilityId];
        if (prevId === undefined) {
          abilityIdToId[abilityId] = id;
          continue;
        }
        assert.fail(`duplicate ability '${abilityId}' in '${id}' and '${prevId}'`);
      }
    }
  });
};

type OopsyTriggerSetInfo = {
  // id -> filename map
  triggerId: { [id: string]: string };
};

const testOopsyFiles = (oopsyFiles: string[]): void => {
  const info: OopsyTriggerSetInfo = {
    triggerId: {},
  };
  describe('oopsy test', () => {
    for (const file of oopsyFiles) {
      describe(`${file}`, () => testOopsyFile(file, info));
    }
  });
};

export default testOopsyFiles;
