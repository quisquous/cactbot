import { Lang } from '../../../../../resources/languages';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { LocaleText } from '../../../../../types/trigger';
import { playerDamageFields } from '../../../oopsy_common';

export interface Data extends OopsyData {
  decOffset?: number;
  laserNameToNum?: { [name: string]: number };
  sculptureTetherNameToId?: { [name: string]: string };
  sculptureYPositions?: { [sculptureId: string]: number };
  bladeOfFlameCount?: number;
  pillarIdToOwner?: { [pillarId: string]: string };
  smallLionIdToOwner?: { [pillarId: string]: string };
  smallLionOwners?: string[];
  northBigLion?: string;
  fire?: { [name: string]: boolean };
}

// TODO: add separate damageWarn-esque icon for damage downs?
// TODO: 58A6 Under The Weight / 58B2 Classical Sculpture missing somebody in party warning?
// TODO: 58CA Dark Water III / 58C5 Shell Crusher should hit everyone in party
// TODO: Dark Aero III 58D4 should not be a share except on advanced relativity for double aero.
// (for gains effect, single aero = ~23 seconds, double aero = ~31 seconds duration)

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is the formless tankbuster, ID 004F.
const firstHeadmarker = parseInt('00DA', 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.EdensPromiseEternitySavage,
  damageWarn: {
    'E12S Promise Rapturous Reach Left': '58AD', // Haircut with left safe side
    'E12S Promise Rapturous Reach Right': '58AE', // Haircut with right safe side
    'E12S Promise Temporary Current': '4E44', // Levi get under cast (damage down)
    'E12S Promise Conflag Strike': '4E45', // Ifrit get sides cast (damage down)
    'E12S Promise Ferostorm': '4E46', // Garuda get intercardinals cast (damage down)
    'E12S Promise Judgment Jolt': '4E47', // Ramuh get out cast (damage down)
    'E12S Promise Shatter': '589C', // Ice Pillar explosion if tether not gotten
    'E12S Promise Impact': '58A1', // Titan bomb drop
    'E12S Oracle Dark Blizzard III': '58D3', // Relativity donut mechanic
    'E12S Oracle Apocalypse': '58E6', // Light up circle explosions (damage down)
  },
  damageFail: {
    'E12S Oracle Maelstrom': '58DA', // Advanced Relativity traffic light aoe
  },
  gainsEffectFail: {
    'E12S Oracle Doom': '9D4', // Relativity punishment for multiple mistakes
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
    'E12S Oracle Dark Eruption 1': '58CE', // Initial warmup spread mechanic
    'E12S Oracle Dark Eruption 2': '58CD', // Relativity spread mechanic
    'E12S Oracle Black Halo': '58C7', // Tankbuster cleave
  },
  soloWarn: {
    'E12S Promise Force Of The Land': '58A4',
  },
  triggers: [
    {
      // Big circle ground aoes during Shiva junction.
      // This can be shielded through as long as that person doesn't stack.
      id: 'E12S Icicle Impact',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '4E5A', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'E12S Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      run: (data, matches) => {
        const id = getHeadmarkerId(data, matches);
        const firstLaserMarker = '0091';
        const lastLaserMarker = '0098';
        if (id >= firstLaserMarker && id <= lastLaserMarker) {
          // ids are sequential: #1 square, #2 square, #3 square, #4 square, #1 triangle etc
          const decOffset = parseInt(id, 16) - parseInt(firstLaserMarker, 16);

          // decOffset is 0-7, so map 0-3 to 1-4 and 4-7 to 1-4.
          data.laserNameToNum ??= {};
          data.laserNameToNum[matches.target] = decOffset % 4 + 1;
        }
      },
    },
    {
      // These sculptures are added at the start of the fight, so we need to check where they
      // use the "Classical Sculpture" ability and end up on the arena for real.
      id: 'E12S Promise Chiseled Sculpture Classical Sculpture',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ source: 'Chiseled Sculpture', id: '58B2' }),
      run: (data, matches) => {
        // This will run per person that gets hit by the same sculpture, but that's fine.
        // Record the y position of each sculpture so we can use it for better text later.
        data.sculptureYPositions ??= {};
        data.sculptureYPositions[matches.sourceId.toUpperCase()] = parseFloat(matches.y);
      },
    },
    {
      // The source of the tether is the player, the target is the sculpture.
      id: 'E12S Promise Chiseled Sculpture Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ target: 'Chiseled Sculpture', id: '0011' }),
      run: (data, matches) => {
        data.sculptureTetherNameToId ??= {};
        data.sculptureTetherNameToId[matches.source] = matches.targetId.toUpperCase();
      },
    },
    {
      id: 'E12S Promise Blade Of Flame Counter',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Chiseled Sculpture', id: '58B3' }),
      delaySeconds: 1,
      suppressSeconds: 1,
      run: (data) => {
        data.bladeOfFlameCount = data.bladeOfFlameCount || 0;
        data.bladeOfFlameCount++;
      },
    },
    {
      // This is the Chiseled Sculpture laser with the limit cut dots.
      id: 'E12S Promise Blade Of Flame',
      type: 'Ability',
      netRegex: NetRegexes.ability({ type: '22', source: 'Chiseled Sculpture', id: '58B3' }),
      mistake: (data, matches) => {
        if (!data.laserNameToNum || !data.sculptureTetherNameToId || !data.sculptureYPositions)
          return;

        // Find the person who has this laser number and is tethered to this statue.
        const number = (data.bladeOfFlameCount || 0) + 1;
        const sourceId = matches.sourceId.toUpperCase();
        const names = Object.keys(data.laserNameToNum);
        const withNum = names.filter((name) => data.laserNameToNum?.[name] === number);
        const owners = withNum.filter((name) => data.sculptureTetherNameToId?.[name] === sourceId);

        // if some logic error, just abort.
        if (owners.length !== 1)
          return;

        // The owner hitting themselves isn't a mistake...technically.
        if (owners[0] === matches.target)
          return;

        // Now try to figure out which statue is which.
        // People can put these wherever.  They could go sideways, or diagonal, or whatever.
        // It seems mooooost people put these north / south (on the south edge of the arena).
        // Let's say a minimum of 2 yalms apart in the y direction to consider them "north/south".
        const minimumYalmsForStatues = 2;

        let isStatuePositionKnown = false;
        let isStatueNorth = false;
        const sculptureIds = Object.keys(data.sculptureYPositions);
        if (sculptureIds.length === 2 && sculptureIds.includes(sourceId)) {
          const otherId = sculptureIds[0] === sourceId ? sculptureIds[1] : sculptureIds[0];
          const sourceY = data.sculptureYPositions[sourceId];
          const otherY = data.sculptureYPositions[otherId ?? ''];
          if (sourceY === undefined || otherY === undefined || otherId === undefined)
            throw new UnreachableCode();
          const yDiff = Math.abs(sourceY - otherY);
          if (yDiff > minimumYalmsForStatues) {
            isStatuePositionKnown = true;
            isStatueNorth = sourceY < otherY;
          }
        }

        const owner = owners[0];
        const ownerNick = data.ShortName(owner);
        let text = {
          en: `${matches.ability} (from ${ownerNick}, #${number})`,
          de: `${matches.ability} (von ${ownerNick}, #${number})`,
          ja: `${matches.ability} (${ownerNick}から、#${number})`,
          cn: `${matches.ability} (来自${ownerNick}，#${number})`,
          ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번)`,
        };
        if (isStatuePositionKnown && isStatueNorth) {
          text = {
            en: `${matches.ability} (from ${ownerNick}, #${number} north)`,
            de: `${matches.ability} (von ${ownerNick}, #${number} norden)`,
            ja: `${matches.ability} (北の${ownerNick}から、#${number})`,
            cn: `${matches.ability} (来自北方${ownerNick}，#${number})`,
            ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번 북쪽)`,
          };
        } else if (isStatuePositionKnown && !isStatueNorth) {
          text = {
            en: `${matches.ability} (from ${ownerNick}, #${number} south)`,
            de: `${matches.ability} (von ${ownerNick}, #${number} Süden)`,
            ja: `${matches.ability} (南の${ownerNick}から、#${number})`,
            cn: `${matches.ability} (来自南方${ownerNick}，#${number})`,
            ko: `${matches.ability} (대상자 "${ownerNick}", ${number}번 남쪽)`,
          };
        }

        return {
          type: 'fail',
          name: matches.target,
          blame: owner,
          text: text,
        };
      },
    },
    {
      id: 'E12S Promise Ice Pillar Tracker',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Ice Pillar', id: ['0001', '0039'] }),
      run: (data, matches) => {
        data.pillarIdToOwner ??= {};
        data.pillarIdToOwner[matches.sourceId] = matches.target;
      },
    },
    {
      id: 'E12S Promise Ice Pillar Mistake',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Ice Pillar', id: '589B' }),
      condition: (data, matches) => {
        if (!data.pillarIdToOwner)
          return false;
        return matches.target !== data.pillarIdToOwner[matches.sourceId];
      },
      mistake: (data, matches) => {
        const pillarOwner = data.ShortName(data.pillarIdToOwner?.[matches.sourceId]);
        return {
          type: 'fail',
          blame: matches.target,
          text: {
            en: `${matches.ability} (from ${pillarOwner})`,
            de: `${matches.ability} (von ${pillarOwner})`,
            fr: `${matches.ability} (de ${pillarOwner})`,
            ja: `${matches.ability} (${pillarOwner}から)`,
            cn: `${matches.ability} (来自${pillarOwner})`,
            ko: `${matches.ability} (대상자 "${pillarOwner}")`,
          },
        };
      },
    },
    {
      id: 'E12S Promise Gain Fire Resistance Down II',
      type: 'GainsEffect',
      // The Beastly Sculpture gives a 3 second debuff, the Regal Sculpture gives a 14s one.
      netRegex: NetRegexes.gainsEffect({ effectId: '832' }),
      run: (data, matches) => {
        data.fire ??= {};
        data.fire[matches.target] = true;
      },
    },
    {
      id: 'E12S Promise Lose Fire Resistance Down II',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '832' }),
      run: (data, matches) => {
        data.fire ??= {};
        data.fire[matches.target] = false;
      },
    },
    {
      id: 'E12S Promise Small Lion Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ source: 'Beastly Sculpture', id: '0011' }),
      netRegexDe: NetRegexes.tether({ source: 'Abbild Eines Löwen', id: '0011' }),
      netRegexFr: NetRegexes.tether({ source: 'Création Léonine', id: '0011' }),
      netRegexJa: NetRegexes.tether({ source: '創られた獅子', id: '0011' }),
      run: (data, matches) => {
        data.smallLionIdToOwner ??= {};
        data.smallLionIdToOwner[matches.sourceId.toUpperCase()] = matches.target;
        data.smallLionOwners ??= [];
        data.smallLionOwners.push(matches.target);
      },
    },
    {
      id: 'E12S Promise Small Lion Lionsblaze',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ source: 'Beastly Sculpture', id: '58B9' }),
      netRegexDe: NetRegexes.abilityFull({ source: 'Abbild Eines Löwen', id: '58B9' }),
      netRegexFr: NetRegexes.abilityFull({ source: 'Création Léonine', id: '58B9' }),
      netRegexJa: NetRegexes.abilityFull({ source: '創られた獅子', id: '58B9' }),
      mistake: (data, matches) => {
        // Folks baiting the big lion second can take the first small lion hit,
        // so it's not sufficient to check only the owner.
        if (!data.smallLionOwners)
          return;
        const owner = data.smallLionIdToOwner?.[matches.sourceId.toUpperCase()];
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

          const centerY = -75;
          const x = parseFloat(matches.x);
          const y = parseFloat(matches.y);
          let dirObj = null;
          if (y < centerY) {
            if (x > 0)
              dirObj = Outputs.dirNE;
            else
              dirObj = Outputs.dirNW;
          } else {
            if (x > 0)
              dirObj = Outputs.dirSE;
            else
              dirObj = Outputs.dirSW;
          }

          return {
            type: 'fail',
            blame: owner,
            name: matches.target,
            text: {
              en: `${matches.ability} (from ${ownerNick}, ${dirObj['en']})`,
              de: `${matches.ability} (von ${ownerNick}, ${dirObj['de']})`,
              fr: `${matches.ability} (de ${ownerNick}, ${dirObj['fr']})`,
              ja: `${matches.ability} (${ownerNick}から, ${dirObj['ja']})`,
              cn: `${matches.ability} (来自${ownerNick}, ${dirObj['cn']}`,
              ko: `${matches.ability} (대상자 "${ownerNick}", ${dirObj['ko']})`,
            },
          };
        }
      },
    },
    {
      id: 'E12S Promise North Big Lion',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Regal Sculpture' }),
      run: (data, matches) => {
        const y = parseFloat(matches.y);
        const centerY = -75;
        if (y < centerY)
          data.northBigLion = matches.id.toUpperCase();
      },
    },
    {
      id: 'E12S Promise Big Lion Kingsblaze',
      type: 'Ability',
      netRegex: NetRegexes.ability({ source: 'Regal Sculpture', id: '4F9E' }),
      netRegexDe: NetRegexes.ability({ source: 'Abbild eines großen Löwen', id: '4F9E' }),
      netRegexFr: NetRegexes.ability({ source: 'création léonine royale', id: '4F9E' }),
      netRegexJa: NetRegexes.ability({ source: '創られた獅子王', id: '4F9E' }),
      mistake: (data, matches) => {
        const singleTarget = matches.type === '21';
        const hasFireDebuff = data.fire && data.fire[matches.target];

        // Success if only one person takes it and they have no fire debuff.
        if (singleTarget && !hasFireDebuff)
          return;

        const northBigLion: LocaleText = {
          en: 'north big lion',
          de: 'Nordem, großer Löwe',
          ja: '大ライオン(北)',
          cn: '北方大狮子',
          ko: '북쪽 큰 사자',
        };
        const southBigLion: LocaleText = {
          en: 'south big lion',
          de: 'Süden, großer Löwe',
          ja: '大ライオン(南)',
          cn: '南方大狮子',
          ko: '남쪽 큰 사자',
        };
        const shared: LocaleText = {
          en: 'shared',
          de: 'geteilt',
          ja: '重ねた',
          cn: '重叠',
          ko: '같이 맞음',
        };
        const fireDebuff: LocaleText = {
          en: 'had fire',
          de: 'hatte Feuer',
          ja: '炎付き',
          cn: '火Debuff',
          ko: '화염 디버프 받음',
        };

        const labels = [];
        const lang: Lang = data.options.ParserLanguage;

        if (data.northBigLion) {
          if (data.northBigLion === matches.sourceId)
            labels.push(northBigLion[lang] ?? northBigLion['en']);
          else
            labels.push(southBigLion[lang] ?? southBigLion['en']);
        }
        if (!singleTarget)
          labels.push(shared[lang] ?? shared['en']);
        if (hasFireDebuff)
          labels.push(fireDebuff[lang] ?? fireDebuff['en']);

        return {
          type: 'fail',
          name: matches.target,
          text: `${matches.ability} (${labels.join(', ')})`,
        };
      },
    },
    {
      id: 'E12S Knocked Off',
      type: 'Ability',
      // 589A = Ice Pillar (promise shiva phase)
      // 58B6 = Palm Of Temperance (promise statue hand)
      // 58B7 = Laser Eye (promise lion phase)
      // 58C1 = Darkest Dance (oracle tank jump + knockback in beginning and triple apoc)
      netRegex: NetRegexes.ability({ id: ['589A', '58B6', '58B7', '58C1'] }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          text: {
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
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '58D2', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
