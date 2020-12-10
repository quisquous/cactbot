import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: ageless serpent knockback
// TODO: shifting sky tether callouts
// TODO: cycle of faith tether callouts

// Notes:
// sinsmite = lightning elemental break
// sinsmoke = fire elemental break
// sinsight = light elemental break
// blastburn = burnt strike fire knockback
// burnout = burnt strike lightning out
// shining blade = burnt strike light bait
// Fatebreaker's Image Bound Of Faith is 5682 / 567F / ????

const unknownTarget = {
  en: '???',
  de: '???',
  fr: '???',
  ja: '???',
  cn: '???',
  ko: '???',
};

export default {
  zoneId: ZoneId.EdensPromiseAnamorphosisSavage,
  timelineFile: 'e11s.txt',
  triggers: [
    {
      id: 'E11S Elemental Break Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5663', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Partner Stacks',
        },
      },
    },
    {
      id: 'E11S Elemental Break Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5666', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Spread',
        },
      },
    },
    {
      id: 'E11S Elemental Break Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5668', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Group Stacks',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5652', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Knockback',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5654', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave -> Out',
        },
      },
    },
    {
      id: 'E11S Burnt Strike Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5656', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Line Cleave + Bait',
        },
      },
    },
    {
      id: 'E11S Bound Of Faith Tether Collector',
      netRegex: NetRegexes.tether({ id: '0011' }),
      run: (data, matches) => {
        data.tethers = data.tethers || {};
        data.tethers[data.target] = matches.targetId;
      },
    },
    {
      id: 'E11S Bound Of Faith Tether Collector Cleanup',
      netRegex: NetRegexes.tether({ id: '0011', capture: false }),
      delaySeconds: 20,
      run: (data) => delete data.tethers,
    },
    {
      id: 'E11S Bound Of Faith Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5658', capture: false }),
      alertText: (data, _, output) => {
        const targets = Object.keys(data.tethers || {});
        if (targets.includes(data.me))
          return output.stackOnYou();
        if (targets.length === 0)
          return output.stackOnTarget({ player: output.unknownTarget() });
        return output.stackOnTarget({ player: data.ShortName(targets[0]) });
      },
      outputStrings: {
        stackOnYou: {
          en: 'Stack on YOU',
          de: 'Auf DIR sammeln',
          fr: 'Package sur VOUS',
          ja: '自分にスタック',
          cn: '集合点名',
          ko: '쉐어징 대상자',
        },
        stackOnTarget: {
          en: 'Stack on ${player}',
          de: 'Auf ${player} sammeln',
          fr: 'Packez-vous sur ${player}',
          ja: '${player}にスタック',
          cn: '靠近 ${player}集合',
          ko: '"${player}" 쉐어징',
        },
        unknownTarget: unknownTarget,
      },
    },
    {
      id: 'E11S Bound Of Faith Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '565B', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          onYou: {
            en: 'Lightning Tether on YOU',
          },
          forTanks: {
            en: 'Lightning on ${player}',
          },
          tankCleave: {
            en: 'Tank cleave',
            de: 'Tank Cleave',
            fr: 'Tank cleave',
            ja: '前方範囲攻撃',
            cn: '顺劈',
            ko: '광역 탱버',
          },
          unknownTarget: unknownTarget,
        };

        const targets = Object.keys(data.tethers || {});
        if (targets.includes(data.me))
          return { alarmText: output.onYou() };
        if (data.role !== 'tank')
          return { infoText: output.tankCleave() };
        if (targets.length === 0)
          return { alertText: output.forTanks({ player: output.unknownTarget() }) };
        return { alertText: output.forTanks({ player: data.ShortName(targets[0]) }) };
      },
    },
    {
      id: 'E11S Bound Of Faith Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '565F', capture: false }),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          awayFromGroup: {
            en: 'Away from Group',
            de: 'Weg von der Gruppe',
            fr: 'Éloignez-vous du groupe',
            ja: '外へ',
            cn: '远离人群',
            ko: '다른 사람들이랑 떨어지기',
          },
          awayFromTarget: {
            en: 'Away from ${player}',
            de: 'Weg von ${player}',
            fr: 'Éloignez-vous de ${player}',
            ja: '${player}から離れ',
            cn: '远离${player}',
            ko: '"${player}"에서 멀어지기',
          },
          unknownTarget: unknownTarget,
        };

        const targets = Object.keys(data.tethers || {});
        if (targets.includes(data.me))
          return { alarmText: output.awayFromGroup() };
        if (targets.length === 0)
          return { infoText: output.awayFromTarget({ player: output.unknownTarget() }) };
        return { infoText: output.awayFromTarget({ player: data.ShortName(targets[0]) }) };
      },
    },
    {
      id: 'E11S Burnished Glory',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '56A4', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'E11S Powder Mark',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '56A2' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'E11S Powder Mark Explosion',
      netRegex: NetRegexes.gainsEffect({ source: 'Fatebreaker', effectId: '993' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 4,
      alertText: (data, _, output) => output.awayFromGroup(),
      outputStrings: {
        awayFromGroup: {
          en: 'Away from Group',
          de: 'Weg von der Gruppe',
          fr: 'Éloignez-vous du groupe',
          ja: '外へ',
          cn: '远离人群',
          ko: '다른 사람들이랑 떨어지기',
        },
      },
    },
    {
      id: 'E11S Turn of the Heavens Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566A', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
        },
      },
    },
    {
      id: 'E11S Turn of the Heavens Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566B', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
        },
      },
    },
    {
      id: 'E11S Resonant Winds',
      netRegex: NetRegexes.startsUsing({ source: 'Demi-Gukumatz', id: '5689', capture: false }),
      response: Responses.getIn('info'),
    },
    {
      id: 'E11S Shifting Sky Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5675', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
        },
      },
    },
    {
      id: 'E11S Shifting Sky Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5676', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
        },
      },
    },
    {
      id: 'E11S Right Of The Heavens Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566E', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Go to Blue',
        },
      },
    },
    {
      id: 'E11S Right Of The Heavens Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '566F', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Go to Red',
        },
      },
    },
    {
      id: 'E11S Sundered Sky Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5677', capture: false }),
      durationSeconds: 10,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Fire: Knockback To Red -> Go Blue',
        },
      },
    },
    {
      id: 'E11S Sundered Sky Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5678', capture: false }),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lightning: Knockback To Blue -> Go Red',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Fire',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '568A', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Partner Stacks -> Line Cleave -> Knockback -> Stack',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Lightning',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '5692', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Spread -> Line Cleave -> Out -> Tank Cleaves',
        },
      },
    },
    {
      id: 'E11S Cycle of Faith Light',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker', id: '569A', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Protean -> Group Stacks -> Line Cleave -> Bait -> Away',
        },
      },
    },
    {
      // TODO: differentiate untargeted fatebreaker image abilities.
      id: 'E11S Shifting Sky Debug Log',
      netRegex: NetRegexes.startsUsing({ source: 'Fatebreaker\'s Image' }),
      run: (data, matches) => {
        for (const key in (data.tethers || {})) {
          if (data.tethers[key] === matches.sourceId) {
            console.log(`${matches.id}: ${key}`);
            return;
          }
        }
        console.log(`Unknown image id: ${JSON.stringify(matches)}, ` +
          `${JSON.stringify(data.tethers || {})}}`);
      },
    },
  ],
};
