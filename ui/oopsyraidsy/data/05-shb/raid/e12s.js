import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: add separate damageWarn-esque icon for damage downs?
// TODO: 58A6 Under The Weight / 58B2 Classical Sculpture missing somebody in party warning?
// TODO: figure out what classical sculpture number you are and say if you took the wrong laser?
// TODO: 58CA Dark Water III / 58C5 Shell Crusher should hit everyone in party
// TODO: Dark Aero III 58D4 should not be a share except on advanced relativity for double aero.
// (for gains effect, single aero = ~23 seconds, double aero = ~31 seconds duration)

export default {
  zoneId: ZoneId.EdensPromiseEternitySavage,
  damageWarn: {
    'E12S Promise Rapturous Reach Left': '58AD', // Haircut with left safe side
    'E12S Promise Rapturous Reach Right': '58AE', // Haircut with right safe side
    'E12S Promise Temporary Current': '4E44', // Levi get under cast (damage down)
    'E12S Promise Conflag Strike': '4E45', // Ifrit get sides cast (damage down)
    'E12S Promise Ferostorm': '4E46', // Garuda get intercardinals cast (damage down)
    'E12S Promise Judgment Jolt': '4E47', // Ramuh get out cast (damage down)
    'E12S Promise Shatter': '589C', // Ice Pillar explosion if tether not gotten
    'E12S Oracle Dark Blizard III': '58D3', // Relativity donut mechanic
    'E12S Oracle Apocalypse': '58E6', // Light up circle explosions (damage down)
  },
  damageFail: {
    'E12S Oracle Maelstrom': '58DA', // Advanced Relativity traffic light aoe
  },
  shareWarn: {
    'E12S Promise Frigid Stone': '589E', // Shiva spread
    'E12S Oracle Darkest Dance': '4E33', // Farthest target bait + jump before knockback
    'E12S Oracle Dark Current': '58D8', // Baited traffic light lasers
    'E12S Oracle Spirit Taker': '58C6', // Random jump spread mechanic after Shell Crusher
    'E12S Oracle Somber Dance 1': '58BF', // Farthest target bait for Dual Apocalypse
    'E12S Oracle Somber Dance 2': '58C0', // Second somber dance jump
  },
  shareFail: {
    'E12S Promise Weight Of The World': '58A5', // Titan bomb blue marker
    'E12S Promise Pulse Of The Land': '58A3', // Titan bomb yellow marker
    'E12S Promise Blade Of Flame': '58B3', // Classic Sculpture laser
    'E12S Oracle Dark Eruption 1': '58CE', // Initial warmup spread mechanic
    'E12S Oracle Dark Eruption 2': '58CD', // Relativity spread mechanic
    'E12S Oracle Black Halo': '58C7', // Tankbuster cleave
  },
  gainsEffectFail: {
    'E12S Oracle Doom': '9D4', // Relativity punishment for multiple mistakes
  },
  triggers: [
    {
      // Big circle ground aoes during Shiva junction.
      // This can be shielded through as long as that person doesn't stack.
      id: 'E12S Icicle Impact',
      netRegex: NetRegexes.ability({ id: '4E5A' }),
      condition: (e) => e.damage > 0,
      mistake: (e, data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'E12S Promise Ice Pillar Tracker',
      netRegex: NetRegexes.tether({ source: 'Ice Pillar', id: ['0001', '0039'] }),
      run: (e, data, matches) => {
        data.pillarIdToOwner = data.pillarIdToOwner || {};
        data.pillarIdToOwner[matches.sourceId] = matches.target;
      },
    },
    {
      id: 'E12S Promise Ice Pillar Mistake',
      netRegex: NetRegexes.ability({ source: 'Ice Pillar', id: '589B' }),
      condition: (e, data, matches) => {
        if (!data.pillarIdToOwner)
          return false;
        return matches.target !== data.pillarIdToOwner[matches.sourceId];
      },
      mistake: (e, data, matches) => {
        const pillarOwner = data.ShortName(data.pillarIdToOwner[matches.sourceId]);
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (from ${pillarOwner})`,
            de: `${matches.ability} (von ${pillarOwner})`,
            fr: `${matches.ability} (de ${pillarOwner})`,
            ja: `${matches.ability} (${pillarOwner}から)`,
            cn: `${matches.ability} (来自${pillarOwner})`,
            ko: `${matches.ability} (from ${pillarOwner})`,
          },
        };
      },
    },
    {
      // Titan phase orange marker
      id: 'E12S Promise Force Of The Land',
      damageRegex: '58A4',
      condition: (e) => e.type === '15',
      mistake: function(e, data, matches) {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: `${matches.ability} (alone)`,
            de: `${matches.ability} (allein)`,
            fr: `${matches.ability} (seul(e))`,
            ja: `${matches.ability} (一人)`,
            cn: `${matches.ability} (单吃)`,
            ko: `${matches.ability} (혼자 맞음)`,
          },
        };
      },
    },
    {
      id: 'E12S Promise Gain Fire Resistance Down II',
      // The Beastly Sculpture gives a 3 second debuff, the Regal Sculpture gives a 14s one.
      netRegex: NetRegexes.gainsEffect({ effectId: '832' }),
      run: (e, data, matches) => {
        data.fire = data.fire || {};
        data.fire[matches.target] = true;
      },
    },
    {
      id: 'E12S Promise Lose Fire Resistance Down II',
      netRegex: NetRegexes.losesEffect({ effectId: '832' }),
      run: (e, data, matches) => {
        data.fire = data.fire || {};
        data.fire[matches.target] = false;
      },
    },
    {
      id: 'E12S Promise Small Lion Tether',
      netRegex: NetRegexes.tether({ source: 'Beastly Sculpture', id: '0011' }),
      netRegexDe: NetRegexes.tether({ source: 'Abbild Eines Löwen', id: '0011' }),
      netRegexFr: NetRegexes.tether({ source: 'Création Léonine', id: '0011' }),
      netRegexJa: NetRegexes.tether({ source: '創られた獅子', id: '0011' }),
      run: (e, data, matches) => {
        data.smallLionIdToOwner = data.smallLionIdToOwner || {};
        data.smallLionIdToOwner[matches.sourceId.toUpperCase()] = matches.target;
        data.smallLionOwners = data.smallLionOwners || [];
        data.smallLionOwners.push(matches.target);
      },
    },
    {
      id: 'E12S Promise Small Lion Lionsblaze',
      netRegex: NetRegexes.ability({ source: 'Beastly Sculpture', id: '58B9' }),
      netRegexDe: NetRegexes.ability({ source: 'Abbild Eines Löwen', id: '58B9' }),
      netRegexFr: NetRegexes.ability({ source: 'Création Léonine', id: '58B9' }),
      netRegexJa: NetRegexes.ability({ source: '創られた獅子', id: '58B9' }),
      mistake: (e, data, matches) => {
        // Folks baiting the big lion second can take the first small lion hit,
        // so it's not sufficient to check only the owner.
        if (!data.smallLionOwners)
          return;
        const owner = data.smallLionOwners[matches.sourceId.toUpperCase()];
        if (!owner)
          return;
        if (matches.target === owner)
          return;

        // If the target also has a small lion tether, that is always a mistake.
        // Otherwise, it's only a mistake if the target has a fire debuff.
        const hasSmallLion = data.smallLionOwners.includes(matches.target);
        const hasFireDebuff = data.fire && data.fire[matches.target];

        if (hasSmallLion || hasFireDebuff) {
          const ownerNick = data.ShortName(owner);
          return {
            type: 'fail',
            blame: owner,
            name: matches.target,
            text: {
              en: `${matches.ability} (from ${ownerNick})`,
              de: `${matches.ability} (von ${ownerNick})`,
              fr: `${matches.ability} (de ${ownerNick})`,
              ja: `${matches.ability} (${ownerNick}から)`,
              cn: `${matches.ability} (来自${ownerNick})`,
              ko: `${matches.ability} (from ${ownerNick})`,
            },
          };
        }
      },
    },
    {
      id: 'E12S Promise North Big Lion',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Regal Sculpture' }),
      run: (e, data, matches) => {
        const y = parseFloat(matches.y);
        const centerY = 75;
        if (y < centerY)
          data.northBigLion = matches.id.toUpperCase();
      },
    },
    {
      id: 'E12S Promise Big Lion Kingsblaze',
      netRegex: NetRegexes.ability({ source: 'Regal Sculpture', id: '4F9E' }),
      mistake: (e, data, matches) => {
        const singleTarget = e.type === '15';
        const hasFireDebuff = data.fire && data.fire[matches.target];

        // Success iff only one person takes it and they have no fire debuff.
        if (singleTarget && !hasFireDebuff)
          return;

        let text = matches.ability;
        if (data.northBigLion) {
          if (data.northBigLion === matches.sourceId) {
            text = {
              en: `${matches.ability} (north big lion)`,
            };
          } else {
            text = {
              en: `${matches.ability} (south big lion)`,
            };
          }
        }

        return {
          type: 'fail',
          name: matches.target,
          text: text,
        };
      },
    },
    {
      id: 'E12S Knocked Off',
      // 589A = Ice Pillar (promise shiva phase)
      // 58B6 = Palm Of Temperance (promise statue hand)
      // 58B7 = Laser Eye (promise lion phase)
      // 58C1 = Darkest Dance (oracle tank jump + knockback in beginning and triple apoc)
      netRegex: NetRegexes.ability({ id: ['589A', '58B6', '58B7', '58C1'] }),
      deathReason: (e, data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          reason: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'A été assommé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
    {
      id: 'E12S Oracle Shadoweye',
      damageRegex: '58D2',
      condition: (e) => e.damage > 0,
      mistake: (e, data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
};
