import NetRegexes from '../../../../../resources/netregexes.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: add separate damageWarn-esque icon for damage downs?
// TODO: 58A6 Under The Weight / 58B2 Classical Sculpture missing somebody in party warning?
// TODO: figure out what classical sculpture number you are and say if you took the wrong laser?
// TODO: small lion 58B9 can hit non tethered people, but warn if hitting other tethers?
// TODO: warn if small lion 58B9 hits folks who already have fire debuff
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
    'E12S Promise Kingsblaze': '4F9E', // Big lion breath
    'E12S Oracle Dark Eruption 1': '58CE', // Initial warmup spread mechanic
    'E12S Oracle Dark Eruption 2': '58CD', // Relativity spread mechanic
    'E12S Oracle Black Halo': '58C7', // Tankbuster cleave
  },
  gainsEffectFail: {
    'E12S Oracle Doom': '9D4', // Relativity punishment for multiple mistakes
  },
  triggers: [
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
        const pillarOwner = data.pillarIdToOwner[matches.sourceId];
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
