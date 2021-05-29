import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Regexes from '../../../../../resources/regexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// List of events:
// https://github.com/xivapi/ffxiv-datamining/blob/master/csv/DynamicEvent.csv
//
// These ids are (unfortunately) gathered by hand and don't seem to correlate
// to any particular bits of data.  However, there's a game log message when you
// register for a CE and an 0x21 message with this id when you accept and
// teleport in.  This avoids having to translate all of these names and also
// guarantees that the player is actually in the CE for the purpose of
// filtering triggers.
const ceIds = {
  // Kill It with Fire
  kill: '1D4',
  // The Baying of the Hound(s)
  hounds: '1CC',
  // Vigil for the Lost
  vigil: '1D0',
  // Aces High
  aces: '1D2',
  // The Shadow of Death's Hand
  shadow: '1CD',
  // The Final Furlong
  furlong: '1D5',
  // The Hunt for Red Choctober
  choctober: '1CA',
  // Beast of Man
  beast: '1DB',
  // The Fires of War
  fires: '1D6',
  // Patriot Games
  patriot: '1D1',
  // Trampled under Hoof
  trampled: '1CE',
  // And the Flames Went Higher
  flames: '1D3',
  // Metal Fox Chaos
  metal: '1CB',
  // Rise of the Robots'
  robots: '1DF',
  // Where Strode the Behemoth
  behemoth: '1DC',
  // The Battle of Castrum Lacus Litore
  castrum: '1D7',
  // Albeleo
  albeleo: '1DA',
  // Adrammelech
  adrammelech: '1D8',
};

// 9443: torrid orb (fire)
// 9444: frozen orb (ice)
// 9445: aqueous orb (water)
// 9446: charged orb (thunder)
// 9447: vortical orb (wind)
// 9448: sabulous orb (stone)
const orbNpcNameIdToOutputString = {
  '9443': 'stop',
  '9444': 'move',
  '9445': 'knockback',
  '9446': 'out',
  '9447': 'in',
  '9448': 'rings',
};

const orbOutputStrings = {
  unknown: {
    en: '???',
    de: '???',
    fr: '???',
    ja: '???',
    cn: '???',
    ko: '???',
  },
  knockback: Outputs.knockback,
  stop: {
    en: 'Stop',
    de: 'Stopp',
    fr: 'Arrêtez',
    ja: '動かない',
    cn: '停停停',
    ko: '멈추기',
  },
  // Special case.
  stopOutside: {
    en: 'Stop (Out)',
    de: 'Stop (Außen)',
    fr: 'Arrêtez (Extérieur)',
    ja: 'ストップ (外に)',
    cn: '停停停 (外面)',
    ko: '멈추기 (바깥에서)',
  },
  move: {
    en: 'Move',
    de: 'Bewegen',
    fr: 'Bougez',
    ja: '動け',
    cn: '动动动',
    ko: '움직이기',
  },
  in: {
    en: 'In',
    de: 'Rein',
    fr: 'Intérieur',
    ja: '中へ',
    cn: '靠近',
    ko: '안으로',
  },
  out: {
    en: 'Out',
    de: 'Raus',
    fr: 'Exterieur',
    ja: '外へ',
    cn: '远离',
    ko: '밖으로',
  },
  rings: {
    en: 'Rings',
    de: 'Ringe',
    fr: 'Anneaux',
    ja: 'ドーナツ',
    cn: '月环',
    ko: '고리장판',
  },
};

// TODO: promote something like this to Conditions?
const tankBusterOnParty = (ceId) => (data) => {
  if (ceId && data.ce !== ceId)
    return false;
  if (data.target === data.me)
    return true;
  if (data.role !== 'healer')
    return false;
  return data.party.inParty(data.target);
};

export default {
  zoneId: ZoneId.TheBozjanSouthernFront,
  resetWhenOutOfCombat: false,
  timelineFile: 'bozjan_southern_front.txt',
  timeline: [
    (data) => {
      // The MRV missile is the first ability that hits the entire raid, but only the bottom raid.
      // Hopefully you have not died to the one ability before this.  We'll insert one line into
      // the timeline here that will see if the player by name was hit by a bottom raid aoe,
      // and then jump to the correct timeline.  There's no "autos without targets" shenanigans
      // that we can do here, like in BA.
      const regex = Regexes.ability({ id: '51FD', target: data.me });
      const line = `20036.9 "--helldiver--" sync /${regex.source}/ window 100,100 jump 30036.9`;
      return [
        'hideall "--helldiver--"',
        line,
      ];
    },
  ],
  timelineTriggers: [
    {
      id: 'Bozja South Castrum Lyon Winds\' Peak',
      regex: /Winds' Peak/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
  ],
  triggers: [
    {
      id: 'Bozja South Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 7 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 7 minutes.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '操作がない状態になってから7分が経過しました。.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经7分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '7분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      response: Responses.wakeUp(),
    },
    {
      id: 'Bozja South Critical Engagement',
      netRegex: NetRegexes.network6d({ command: '80000014' }),
      run: (data, matches) => {
        // This fires when you win, lose, or teleport out.
        if (matches.data0 === '00') {
          if (data.ce && data.options.Debug)
            console.log(`Stop CE: ${data.ce}`);
          // Stop any active timelines.
          data.StopCombat();
          // Prevent further triggers for any active CEs from firing.
          data.ce = null;
          return;
        }

        data.ce = null;
        const ceId = matches.data0.toUpperCase();
        for (const key in ceIds) {
          if (ceIds[key] === ceId) {
            if (data.options.Debug)
              console.log(`Start CE: ${ceId} (${key})`);
            data.ce = ceId;
            return;
          }
        }

        if (data.options.Debug)
          console.log(`Unknown CE: ${ceId}`);
      },
    },
    {
      id: 'Bozja South Choctober Choco Slash',
      netRegex: NetRegexes.startsUsing({ source: 'Red Comet', id: '506C' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Rot(?:e|er|es|en) Meteor', id: '506C' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Comète Rouge', id: '506C' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'レッドコメット', id: '506C' }),
      netRegexCn: NetRegexes.startsUsing({ source: '红色彗星', id: '506C' }),
      netRegexKo: NetRegexes.startsUsing({ source: '붉은 혜성', id: '506C' }),
      condition: tankBusterOnParty(ceIds.choctober),
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Bottom Check',
      // TODO: netRegex could take (data) => {} here so we could do a target: data.me?
      netRegex: NetRegexes.ability({ source: '4th Legion Helldiver', id: '51FD' }),
      netRegexDe: NetRegexes.ability({ source: 'Höllentaucher Der Iv\\. Legion', id: '51FD' }),
      netRegexFr: NetRegexes.ability({ source: 'Plongeur Infernal De La 4E Légion', id: '51FD' }),
      netRegexJa: NetRegexes.ability({ source: 'Ivレギオン・ヘルダイバー', id: '51FD' }),
      netRegexCn: NetRegexes.ability({ source: '第四军团地狱潜者', id: '51FD' }),
      netRegexKo: NetRegexes.ability({ source: 'Iv군단 헬다이버', id: '51FD' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.helldiver = true,
    },
    {
      id: 'Bozja South Castrum Helldiver MRV Missile',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51FC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Höllentaucher Der Iv\\. Legion', id: '51FC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Plongeur Infernal De La 4E Légion', id: '51FC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'Ivレギオン・ヘルダイバー', id: '51FC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '第四军团地狱潜者', id: '51FC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: 'Iv군단 헬다이버', id: '51FC', capture: false }),
      condition: (data) => {
        // This won't play the first time, but that seems better than a false positive for the top.
        if (!data.helldiver)
          return false;
        return Conditions.caresAboutAOE()(data);
      },
      response: Responses.aoe(),
    },
    {
      id: 'Bozja South Castrum Helldiver Lateral Dive',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51EA', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Höllentaucher Der Iv\\. Legion', id: '51EA', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Plongeur Infernal De La 4E Légion', id: '51EA', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'Ivレギオン・ヘルダイバー', id: '51EA', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '第四军团地狱潜者', id: '51EA', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: 'Iv군단 헬다이버', id: '51EA', capture: false }),
      condition: (data) => data.helldiver,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand in dive charge',
          de: 'Stehe im Ansturm',
          fr: 'Restez dans la charge',
          ja: '直線頭割りに入る',
          cn: '进入直线分摊',
          ko: '돌진 장판 위에 서기',
        },
      },
    },
    {
      id: 'Bozja South Castrum Helldiver Magitek Missiles',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51FE' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Höllentaucher Der Iv\\. Legion', id: '51FE' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Plongeur Infernal De La 4E Légion', id: '51FE' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'Ivレギオン・ヘルダイバー', id: '51FE' }),
      netRegexCn: NetRegexes.startsUsing({ source: '第四军团地狱潜者', id: '51FE' }),
      netRegexKo: NetRegexes.startsUsing({ source: 'Iv군단 헬다이버', id: '51FE' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Helldiver Infrared Blast',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51EC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Höllentaucher Der Iv\\. Legion', id: '51EC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Plongeur Infernal De La 4E Légion', id: '51EC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'Ivレギオン・ヘルダイバー', id: '51EC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '第四军团地狱潜者', id: '51EC', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: 'Iv군단 헬다이버', id: '51EC', capture: false }),
      condition: (data) => data.helldiver,
      delaySeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Take one tether',
          de: 'Nimm eine´Verbindung',
          fr: 'Prenez un lien',
          ja: '線を取る',
          cn: '接线',
          ko: '선 하나 낚아채기',
        },
      },
    },
    {
      id: 'Bozja South Castrum Helldiver Joint Attack',
      netRegex: NetRegexes.startsUsing({ source: '4th Legion Helldiver', id: '51FE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Höllentaucher Der Iv\\. Legion', id: '51FE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Plongeur Infernal De La 4E Légion', id: '51FE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'Ivレギオン・ヘルダイバー', id: '51FE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '第四军团地狱潜者', id: '51FE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: 'Iv군단 헬다이버', id: '51FE', capture: false }),
      condition: (data) => data.helldiver,
      response: Responses.killAdds(),
    },
    {
      id: 'Bozja South Castrum Brionac Electric Anvil',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51DD' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brionac', id: '51DD' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Brionac', id: '51DD' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブリューナク', id: '51DD' }),
      netRegexCn: NetRegexes.startsUsing({ source: '布里欧纳克', id: '51DD' }),
      netRegexKo: NetRegexes.startsUsing({ source: '브류나크', id: '51DD' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Brionac False Thunder Left',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51CE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brionac', id: '51CE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Brionac', id: '51CE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブリューナク', id: '51CE', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '布里欧纳克', id: '51CE', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '브류나크', id: '51CE', capture: false }),
      condition: (data) => !data.helldiver,
      response: Responses.goLeft(),
    },
    {
      id: 'Bozja South Castrum Brionac False Thunder Right',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51CF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brionac', id: '51CF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Brionac', id: '51CF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブリューナク', id: '51CF', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '布里欧纳克', id: '51CF', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '브류나크', id: '51CF', capture: false }),
      condition: (data) => !data.helldiver,
      response: Responses.goRight(),
    },
    {
      id: 'Bozja South Castrum Brionac Anti-Warmachina Weaponry',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51CD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brionac', id: '51CD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Brionac', id: '51CD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブリューナク', id: '51CD', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '布里欧纳克', id: '51CD', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '브류나크', id: '51CD', capture: false }),
      condition: (data) => !data.helldiver,
      delaySeconds: 6.5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Magitek Core',
          de: 'Besiege Magitek-Reaktor',
          fr: 'Tuez le Cœur magitek',
          ja: '魔導コアを撃破',
          cn: '击杀魔导核心',
          ko: '마도 핵 죽이기',
        },
      },
    },
    {
      id: 'Bozja South Castrum Brionac Energy Generation',
      netRegex: NetRegexes.startsUsing({ source: 'Brionac', id: '51D0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Brionac', id: '51D0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Brionac', id: '51D0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ブリューナク', id: '51D0', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '布里欧纳克', id: '51D0', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '브류나크', id: '51D0', capture: false }),
      condition: (data) => !data.helldiver,
      preRun: (data) => data.energyCount = (data.energyCount || 0) + 1,
      infoText: (data, _matches, output) => {
        if (data.energyCount === 1)
          return output.getUnderOrb();
        if (data.energyCount === 2)
          return output.goCorner();

        // TODO: triggers for energy generation.
        // It'd be nice to do this, but you barely see #3, let alone #5.
        // #1 is always get under orb
        // #2 is always get to corners
        // #3 has two spawn options (#1 or #2 callout), interorb tethers
        // #4 magentism to/from orb, but orbs don't have tethers
        // #5 magentism to/from orb, interorb tethers
        // https://docs.google.com/document/d/1gSHyYA4Qg_tEz-GK9N7ppAdbXQIL91MoYYWJ651lDMk/edit#
        // Energy generation is 51D0 is spawning orbs
        // Lightsphere is 9437, Darksphere is 9438.
        // Pos: (63,-222,249.4999) (94380000011982).
        // Pos: (80,-229,249.4999) (94380000011982).
        // Pos: (80,-215,249.4999) (94380000011982).
        // Pos: (97,-222,249.4999) (94380000011982).
      },
      outputStrings: {
        getUnderOrb: {
          en: 'Get Under Orb',
          de: 'Geh unter einem Orb',
          fr: 'Allez sous l\'Orbe',
          ja: '白玉に安置',
          cn: '靠近白球',
          ko: '구슬 아래로',
        },
        goCorner: {
          en: 'Go To Corner',
          de: 'Geh in die Ecken',
          fr: 'Allez dans un coin',
          ja: 'コーナーへ',
          cn: '去角落',
          ko: '구석으로',
        },
      },
    },
    {
      id: 'Bozja South Castrum Albeleo Baleful Gaze',
      netRegex: NetRegexes.startsUsing({ source: 'Albeleo\'s Monstrosity', id: '5404', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Albeleos Biest', id: '5404', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Bête D\'Albeleo', id: '5404', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アルビレオズ・ビースト', id: '5404', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '阿尔贝雷欧的巨兽', id: '5404', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알비레오의 야수', id: '5404', capture: false }),
      suppressSeconds: 3,
      response: Responses.lookAway(),
    },
    {
      id: 'Bozja South Castrum Albeleo Abyssal Cry',
      netRegex: NetRegexes.startsUsing({ source: 'Albeleo\'s Hrodvitnir', id: '5406' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Hrodvitnir', id: '5406' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Hródvitnir', id: '5406' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アルビレオズ・フローズヴィトニル', id: '5406' }),
      netRegexCn: NetRegexes.startsUsing({ source: '阿尔贝雷欧的恶狼', id: '5406' }),
      netRegexKo: NetRegexes.startsUsing({ source: '알비레오의 흐로드비트니르', id: '5406' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Bozja South Castrum Adrammelech Holy IV',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F96', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F96', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F96', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アドラメレク', id: '4F96', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '阿德拉梅里克', id: '4F96', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '아드람멜렉', id: '4F96', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Bozja South Castrum Adrammelech Flare',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F95' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F95' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F95' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アドラメレク', id: '4F95' }),
      netRegexCn: NetRegexes.startsUsing({ source: '阿德拉梅里克', id: '4F95' }),
      netRegexKo: NetRegexes.startsUsing({ source: '아드람멜렉', id: '4F95' }),
      // TODO: this is probably magical.
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Adrammelech Meteor',
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F92', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F92', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F92', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アドラメレク', id: '4F92', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '阿德拉梅里克', id: '4F92', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '아드람멜렉', id: '4F92', capture: false }),
      delaySeconds: 4.5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Meteors',
          de: 'Besiege die Meteore',
          fr: 'Tuez les météores',
          ja: 'メテオを撃破',
          cn: '击杀陨石',
          ko: '메테오 부수기',
        },
      },
    },
    {
      id: 'Bozja South Castrum Adrammelech Orb Collector',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '944[3-8]' }),
      run: (data, matches) => {
        data.orbs = data.orbs || {};
        data.orbs[matches.id.toUpperCase()] = matches.npcNameId;
      },
    },
    {
      id: 'Bozja South Castrum Adrammelech Curse of the Fiend Orbs',
      // TODO: We could probably move this right after the orbs appear?
      netRegex: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アドラメレク', id: '4F7B', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '阿德拉梅里克', id: '4F7B', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '아드람멜렉', id: '4F7B', capture: false }),
      // Mini-timeline:
      //  0.0: Adrammelech starts using Curse Of The Fiend
      //  3.0: Adrammelech uses Curse Of The Fiend
      //  4.0: orbs appear
      //  6.2: Adrammelech starts using Accursed Becoming
      //  7.1: orb tethers appear
      // 10.1: Adrammelech uses Accursed Becoming
      // 17.3: Adrammelech uses orb ability #1.
      preRun: (data) => data.fiendCount = (data.fiendCount || 0) + 1,
      durationSeconds: (data) => (data.orbs || {}).length === 4 ? 23 : 14,
      suppressSeconds: 20,
      infoText: (data, _matches, output) => {
        // Let your actor id memes be dreams!
        // Orbs go off from highest actor id to lowest actor id, in pairs of two.
        const sortedOrbs = Object.keys(data.orbs || {}).sort().reverse();
        const orbIdToNameId = data.orbs;
        delete data.orbs;

        if (sortedOrbs.length === 0)
          return output.unknown();

        data.orbOutput = sortedOrbs.map((orbId) => {
          const nameId = orbIdToNameId[orbId];
          const output = orbNpcNameIdToOutputString[nameId];
          return output ? output : 'unknown';
        });

        // If there is a pair of orbs, and they are the same type, then this is the mechanic
        // introduction and only one orb goes off.
        if (data.orbOutput.length === 2) {
          if (data.orbOutput[0] === data.orbOutput[1])
            data.orbOutput = [data.orbOutput[0]];
        }

        // Special case, fire + earth = stop far outside.
        if (data.orbOutput.length >= 2) {
          if (data.orbOutput[0] === 'stop' && data.orbOutput[1] === 'rings')
            data.orbOutput[0] = 'stopOutside';
        }
        if (data.orbOutput.length === 4) {
          if (data.orbOutput[2] === 'stop' && data.orbOutput[3] === 'rings')
            data.orbOutput[2] = 'stopOutside';
        }

        // Don't bother outputting a single one, as it'll come up shortly.
        // This could get confusing saying "knockback" far enough ahead
        // that using knockback prevention would wear off before the mechanic.
        if (data.orbOutput.length > 1)
          return data.orbOutput.map((key) => output[key]()).join(' => ');
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Bozja South Castrum Adrammelech Accursed Becoming Orb 1',
      // This ability happens once per pair of orbs (with the same timings).
      // So use these two triggers to handle the single, pair, and two pairs of orbs cases.
      netRegex: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'アドラメレク', id: '4F7B', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '阿德拉梅里克', id: '4F7B', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '아드람멜렉', id: '4F7B', capture: false }),
      // 5 seconds warning.
      delaySeconds: 7.2 - 5,
      durationSeconds: 4.5,
      alertText: (data, _matches, output) => {
        data.orbOutput = data.orbOutput || [];
        const orb = data.orbOutput.shift();
        if (!orb)
          return;
        return output[orb]();
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Bozja South Castrum Adrammelech Accursed Becoming Orb 2',
      netRegex: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Adrammelech', id: '4F7B', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'アドラメレク', id: '4F7B', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '阿德拉梅里克', id: '4F7B', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '아드람멜렉', id: '4F7B', capture: false }),
      // 2.5 seconds warning, as it's weird if this shows up way before the first orb.
      delaySeconds: 9 - 2.5,
      alertText: (data, _matches, output) => {
        data.orbOutput = data.orbOutput || [];
        const orb = data.orbOutput.shift();
        if (!orb)
          return;
        return output[orb]();
      },
      outputStrings: orbOutputStrings,
    },
    {
      id: 'Bozja South Castrum Adrammelech Electric Charge Collector',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9449' }),
      run: (data, matches) => {
        data.warped = data.warped || {};
        data.warped[matches.id.toUpperCase()] = {
          x: matches.x,
          y: matches.y,
        };
      },
    },
    {
      id: 'Bozja South Castrum Adrammelech Shock',
      // This is the first Electric Charge tether.
      netRegex: NetRegexes.tether({ source: 'Adrammelech', target: 'Electric Charge' }),
      netRegexDe: NetRegexes.tether({ source: 'Adrammelech', target: 'Blitz' }),
      netRegexFr: NetRegexes.tether({ source: 'Adrammelech', target: 'Boule D\'Énergie' }),
      netRegexJa: NetRegexes.tether({ source: 'アドラメレク', target: '雷気' }),
      netRegexCn: NetRegexes.tether({ source: '阿德拉梅里克', target: '雷气' }),
      netRegexKo: NetRegexes.tether({ source: '아드람멜렉', target: '번개기운' }),
      alertText: (data, matches, output) => {
        if (!data.warped)
          return output.unknown();

        const loc = data.warped[matches.targetId.toUpperCase()];
        delete data.warped;
        if (!loc)
          return output.unknown();

        // Four inner orb locations:
        // 85, -614.6 (NE)
        // 88.6, -601.1 (SE)
        // 75.1, -597.5 (SW)
        // 71.5, -611 (NW)

        const adrammelechCenterX = 80;
        const adrammelechCenterY = -605;

        // North is negative y.
        if (loc.x > adrammelechCenterX) {
          if (loc.y < adrammelechCenterY)
            return output.southwest();
          return output.northwest();
        }
        if (loc.y < adrammelechCenterY)
          return output.southeast();
        return output.northeast();
      },
      outputStrings: {
        unknown: {
          // "Follow Other People ;)"
          en: 'Go ???',
          de: 'Gehe nach ???',
          fr: 'Allez au ???',
          ja: '??? へ',
          cn: '去 ???',
          ko: '???쪽으로',
        },
        northeast: {
          en: 'Go northeast',
          de: 'Gehe nach Nordosten',
          fr: 'Allez au nord-est',
          ja: '北東へ',
          cn: '去右上(东北)',
          ko: '북동쪽으로',
        },
        southeast: {
          en: 'Go southeast',
          de: 'Gehe nach Südosten',
          fr: 'Allez au sud-est',
          ja: '南東へ',
          cn: '去右下(东南)',
          ko: '남동쪽으로',
        },
        southwest: {
          en: 'Go southwest',
          de: 'Gehe nach Südwesten',
          fr: 'Allez au sud-ouest',
          ja: '南西へ',
          cn: '去左下(西南)',
          ko: '남서쪽으로',
        },
        northwest: {
          en: 'Go northwest',
          de: 'Gehe nach Nordwesten',
          fr: 'Allez au nord-ouest',
          ja: '北西へ',
          cn: '去左上(西北)',
          ko: '북서쪽으로',
        },
      },
    },
    {
      id: 'Bozja South Castrum Dawon Molting Plumage',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ドゥン', id: '517A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '达温', id: '517A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '다우언', id: '517A', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Bozja South Castrum Dawon Molting Plumage Orbs',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dawon', id: '517A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ドゥン', id: '517A', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '达温', id: '517A', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '다우언', id: '517A', capture: false }),
      delaySeconds: 5,
      alertText: (data, _matches, output) => {
        // Only the first plumage orbs have no wind.
        // If we needed to this dynamically, look for Call Beast (5192) from Lyon before this.
        const text = data.haveSeenMoltingPlumage ? output.orbWithFlutter() : output.justOrb();
        data.haveSeenMoltingPlumage = true;
        return text;
      },
      outputStrings: {
        justOrb: {
          en: 'Get Under Light Orb',
          de: 'Unter einem Lichtorb stellen',
          fr: 'Allez sous un Orbe lumineux',
          ja: '白玉へ',
          cn: '靠近白球',
          ko: '하얀 구슬 안으로',
        },
        orbWithFlutter: {
          en: 'Get Under Blown Light Orb',
          de: 'Zu einem weggeschleuderten Lichtorb gehen',
          fr: 'Allez sous un Orbe lumineux soufflé',
          ja: '赤玉へ',
          cn: '靠近火球',
          ko: '하얀 구슬이 이동할 위치로',
        },
      },
    },
    {
      id: 'Bozja South Castrum Dawon Scratch',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '517B' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dawon', id: '517B' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dawon', id: '517B' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ドゥン', id: '517B' }),
      netRegexCn: NetRegexes.startsUsing({ source: '达温', id: '517B' }),
      netRegexKo: NetRegexes.startsUsing({ source: '다우언', id: '517B' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Dawon Swooping Frenzy',
      netRegex: NetRegexes.startsUsing({ source: 'Dawon', id: '5175', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Dawon', id: '5175', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Dawon', id: '5175', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ドゥン', id: '5175', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '达温', id: '5175', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '다우언', id: '5175', capture: false }),
      suppressSeconds: 9999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Follow Boss',
          de: 'Folge dem Boss',
          fr: 'Suivez le Boss',
          ja: 'ボスの後ろに追う',
          cn: '跟紧在Boss身后',
          ko: '보스 따라가기',
        },
      },
    },
    {
      id: 'Bozja South Castrum Lyon Passage',
      netRegex: NetRegexes.gameLog({ line: 'Lyon the Beast King would do battle at Majesty\'s Place.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Der Bestienkönig will einen Kampf auf seinem Podest.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Lyon attend des adversaires à sa taille sur la tribune des Souverains.*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '獣王ライアンは、王者の円壇での戦いを望んでいるようだ.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '兽王莱昂似乎很期待在王者圆坛战斗！', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '마수왕 라이언이 왕의 단상에서 싸우려고 합니다!', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lyon Passage Open',
          de: 'Lyon Zugang offen',
          fr: 'Passage du Lyon ouvert',
          ja: '獣王ライオンフェイス開始',
          cn: '挑战兽王莱恩',
          ko: '라이언 포탈 개방',
        },
      },
    },
    {
      id: 'Bozja South Castrum Lyon Twin Agonies',
      netRegex: NetRegexes.startsUsing({ source: 'Lyon The Beast King', id: '5174' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Lyon (?:der|die|das) Bestienkönig', id: '5174' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Lyon Le Roi Bestial', id: '5174' }),
      netRegexJa: NetRegexes.startsUsing({ source: '獣王ライアン', id: '5174' }),
      netRegexCn: NetRegexes.startsUsing({ source: '兽王 莱昂', id: '5174' }),
      netRegexKo: NetRegexes.startsUsing({ source: '마수왕 라이언', id: '5174' }),
      condition: tankBusterOnParty,
      response: Responses.tankBuster(),
    },
    {
      id: 'Bozja South Castrum Lyon King\'s Notice',
      netRegex: NetRegexes.startsUsing({ source: 'Lyon The Beast King', id: '516E', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Lyon (?:der|die|das) Bestienkönig', id: '516E', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Lyon Le Roi Bestial', id: '516E', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '獣王ライアン', id: '516E', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '兽王 莱昂', id: '516E', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '마수왕 라이언', id: '516E', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Bozja South Castrum Lyon Taste of Blood',
      netRegex: NetRegexes.startsUsing({ source: 'Lyon The Beast King', id: '5173', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Lyon (?:der|die|das) Bestienkönig', id: '5173', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Lyon Le Roi Bestial', id: '5173', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '獣王ライアン', id: '5173', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '兽王 莱昂', id: '5173', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '마수왕 라이언', id: '5173', capture: false }),
      response: Responses.getBehind(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Lyon the Beast King would do battle at Majesty\'s Place': 'Der Bestienkönig will einen Kampf auf seinem Podest',
        'Red Comet': 'Rot(?:e|er|es|en) Meteor',
        'Albeleo\'s Monstrosity': 'Albeleos Biest',
        'Albeleo\'s Hrodvitnir': 'Hrodvitnir',
        'Electric Charge': 'Blitz',
        '7 minutes have elapsed since your last activity..*?': 'Seit deiner letzten Aktivität sind 7 Minuten vergangen.',
        '4Th Legion Helldiver': 'Höllentaucher der IV\\. Legion',
        'Adrammelech': 'Adrammelech',
        'Bladesmeet': 'Hauptplatz der Wachen',
        'Brionac': 'Brionac',
        'Dawon': 'Dawon',
        'Eaglesight': 'Platz des Kämpferischen Adlers',
        'Lightsphere': 'Lichtkugel',
        'Lyon The Beast King(?! would)': 'Lyon (?:der|die|das) Bestienkönig',
        'Majesty\'s Auspice': 'Halle des Bestienkönigs',
        'Shadowsphere': 'Schattensphäre',
        'The airship landing': 'Flugplatz',
        'The grand gates': 'Haupttor',
        'Verdant Plume': 'blau(?:e|er|es|en) Feder',
      },
      'replaceText': {
        '(?<!Command: )Chain Cannon': 'Kettenkanone',
        '(?<!Command: )Dive Formation': 'Simultanattacke',
        '(?<!Command: )Infrared Blast': 'Hitzestrahlung',
        '(?<!Command: )Lateral Dive': 'Frontalangriff',
        '--Lyon Passage--': '--Lyon Zugang--',
        'Accursed Becoming': 'Zaubersynthese',
        'Aero IV': 'Windka',
        'Anti-Warmachina Weaponry': 'Anti-Magitek-Attacke',
        'Blizzard IV': 'Eiska',
        'Burst II': 'Knall',
        'Call Beast': 'Ruppiges Rufen',
        'Command: Chain Cannon': 'Befehl: Kettenkanonensalve',
        'Command: Dive Formation': 'Befehl: Simultanattacke',
        'Command: Infrared Blast': 'Befehl: Hitzestrahlung',
        'Command: Joint Attack': 'Befehl: Antiobjektattacke',
        'Command: Lateral Dive': 'Befehl: Frontalangriff',
        'Command: Suppressive Formation': 'Antipersonenangriff',
        'Curse Of The Fiend': 'Zaubersiegel',
        'Electric Anvil': 'Elektroamboss',
        'Energy Generation': 'Energiegenerierung',
        'Explosion': 'Explosion',
        'False Thunder': 'Störsender',
        'Fervid Pulse': 'Flammenstoß',
        'Fire IV': 'Feuka',
        'Flare': 'Flare',
        'Frigid Pulse': 'Froststoß',
        'Frigid/': 'Frost/',
        'Heart Of Nature': 'Puls der Erde',
        'Holy IV': 'Giga-Sanctus',
        'Lightburst': 'Lichtstoß',
        'Lightning Shower': 'Blitzregen',
        'Magitek Magnetism': 'Magimagnetismus',
        'Magitek Missiles': 'Magitek-Rakete',
        'Magnetic Jolt': 'Magnetische Interferenz',
        'Meteor': 'Meteor',
        'Molting Plumage': 'Federsturm',
        'Mrv Missile': 'Multisprengkopf-Rakete',
        'Nature\'s Blood': 'Erdschneider',
        'Nature\'s Pulse': 'Erdrutsch',
        'Obey': 'Gehorchen',
        'Orb': 'Orb',
        'Pentagust': 'Pentagast',
        'Polar Magnetism': 'Konvertermagnet',
        'Pole Shift': 'Umpolung',
        'Raging Winds': 'Sturmflügel',
        'Ready': 'Bellendes Befehlen',
        'Scratch': 'Kräftiges Kratzen',
        'Shadow Burst': 'Schattenstoß',
        'Shock': 'Energetisierung',
        'Stone IV': 'Steinka',
        'Surface Missile': 'Antipersonenrakete',
        'Swooping Frenzy': 'Heftiges Schütteln',
        'Taste Of Blood': 'Blutiges Wehklagen',
        'The King\'s Notice': 'Herrschender Blick',
        'Thunder IV': 'Blitzka',
        'Tornado': 'Tornado',
        'Twin Agonies': 'Doppelter Tod',
        'Voltstream': 'Voltstrom',
        'Warped Light': 'Blitzartillerie',
        'Water IV': 'Giga-Aqua',
        'Winds\' Peak': 'Katastrophale Windstärke',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Lyon the Beast King would do battle at Majesty\'s Place': 'Lyon attend des adversaires à sa taille sur la tribune des Souverains',
        'Red Comet': 'Comète Rouge',
        'Albeleo\'s Monstrosity': 'Bête D\'Albeleo',
        'Albeleo\'s Hrodvitnir': 'Hródvitnir',
        'Electric Charge': 'Boule D\'Énergie',
        '7 minutes have elapsed since your last activity..*?': 'Votre personnage est inactif depuis 7 minutes.*?',
        '4Th Legion Helldiver': 'plongeur infernal de la 4e légion',
        'Adrammelech': 'Adrammelech',
        'Bladesmeet': 'Hall des Lames',
        'Brionac': 'Brionac',
        'Dawon': 'Dawon',
        'Eaglesight': 'Perchoir des Aigles',
        'Lightsphere': 'sphère de lumière',
        'Lyon The Beast King(?! would)': 'Lyon le Roi bestial',
        'Majesty\'s Auspice': 'Auditorium',
        'Shadowsphere': 'sphère ombrale',
        'The airship landing': 'Aire d\'atterrissage',
        'The grand gates': 'Porte du castrum',
        'Verdant Plume': 'plume de sinople',
      },
      'replaceText': {
        '--Lyon Passage--': '--Passage du Lyon --',
        '(?<!Command: )Chain Cannon': 'Canon automatique',
        '(?<!Command: )Dive Formation': 'Attaque groupée',
        '(?<!Command: )Infrared Blast': 'Rayonnement thermique',
        '(?<!Command: )Lateral Dive': 'Attaque frontale',
        'Accursed Becoming': 'Combinaison de sortilège',
        'Aero IV': 'Giga Vent',
        'Anti-Warmachina Weaponry': 'Attaque antimagitek',
        'Blizzard IV': 'Giga Glace',
        'Burst II': 'Bouillonnement',
        'Call Beast': 'Appel familier',
        'Command: Chain Cannon': 'Directive : Salve de canons automatiques',
        'Command: Dive Formation': 'Nouvelle directive : Attaque groupée antimatériel',
        'Command: Infrared Blast': 'Nouvelle directive : Rayonnement thermique antimatériel',
        'Command: Joint Attack': 'Nouvelle directive : Attaque ciblée antimatériel',
        'Command: Lateral Dive': 'Nouvelle directive : Attaque frontale antimatériel',
        'Command: Suppressive Formation': 'Neutralisation',
        'Curse Of The Fiend': 'Sceau magique',
        'Electric Anvil': 'Enclume électrique',
        'Energy Generation': 'Condensateur d\'énergie',
        'Explosion': 'Explosion',
        'False Thunder': 'Foudre artificielle',
        '(?<!Frigid/)Fervid Pulse': 'Pulsation ardente',
        'Fire IV': 'Giga Feu',
        'Flare': 'Brasier',
        'Frigid/Fervid Pulse': 'Pulsation glacial/ardente',
        'Frigid Pulse': 'Pulsation glaciale',
        'Heart Of Nature': 'Pulsation sismique',
        'Holy IV': 'Giga Miracle',
        'Lightburst': 'Éclat de lumière',
        'Lightning Shower': 'Averse d\'éclairs',
        'Magitek Magnetism': 'Électroaimant magitek',
        'Magitek Missiles': 'Missiles magitek',
        'Magnetic Jolt': 'Interférences magnétiques',
        'Meteor': 'Météore',
        'Molting Plumage': 'Mue de plumage',
        'Mrv Missile': 'Missile à tête multiple',
        'Nature\'s Blood': 'Onde fracturante',
        'Nature\'s Pulse': 'Onde brise-terre',
        'Obey': 'À l\'écoute du maître',
        'Orb': 'Orbe',
        'Pentagust': 'Pentasouffle',
        'Polar Magnetism': 'Aimant à polarité inversée',
        'Pole Shift': 'Inversion des pôles',
        'Raging Winds': 'Rafales stagnantes',
        'Ready': 'Obéis !',
        'Scratch': 'Griffade',
        'Shadow Burst': 'Salve ténébreuse',
        'Shock': 'Décharge électrostatique',
        'Stone IV': 'Giga Terre',
        'Surface Missile': 'Missiles sol-sol',
        'Swooping Frenzy': 'Plongeon frénétique',
        'Taste Of Blood': 'Lamentation sanglante',
        'The King\'s Notice': 'Œil torve des conquérants',
        'Thunder IV': 'Giga Foudre',
        'Tornado': 'Tornade',
        'Twin Agonies': 'Double fracassage',
        'Voltstream': 'Flux voltaïque',
        'Warped Light': 'Artillerie éclair',
        'Water IV': 'Giga Eau',
        'Winds\' Peak': 'Rafales furieuses',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Lyon the Beast King would do battle at Majesty\'s Place': '獣王ライアンは、王者の円壇での戦いを望んでいるようだ',
        'Red Comet': 'レッドコメット',
        'Albeleo\'s Monstrosity': 'アルビレオズ・ビースト',
        'Albeleo\'s Hrodvitnir': 'アルビレオズ・フローズヴィトニル',
        'Electric Charge': '雷気',
        '7 minutes have elapsed since your last activity..*?': '操作がない状態になってから7分が経過しました。.*?',
        '4Th Legion Helldiver': 'IVレギオン・ヘルダイバー',
        'Adrammelech': 'アドラメレク',
        'Bladesmeet': '剣たちの大広間',
        'Brionac': 'ブリューナク',
        'Dawon': 'ドゥン',
        'Eaglesight': '荒鷲の広場',
        'Lightsphere': 'ライトスフィア',
        'Lyon The Beast King(?! would)': '獣王ライアン',
        'Majesty\'s Auspice': '円壇の間',
        'Shadowsphere': 'シャドウスフィア',
        'The airship landing': '飛空戦艦発着場',
        'The grand gates': '城門',
        'Verdant Plume': '濃緑の羽根',
      },
      'replaceText': {
        '--Lyon Passage--': '--ライオンへ行きましょう--',
        '(?<!Command: )Chain Cannon': 'チェーンガン',
        '(?<!Command: )Dive Formation': '一斉突撃',
        '(?<!Command: )Infrared Blast': '熱線照射',
        '(?<!Command: )Lateral Dive': '突進攻撃',
        'Accursed Becoming': '魔法合成',
        'Aero IV': 'エアロジャ',
        'Anti-Warmachina Weaponry': '対魔導兵器攻撃',
        'Blizzard IV': 'ブリザジャ',
        'Burst II': 'バースト',
        'Call Beast': 'よびだす',
        'Command: Chain Cannon': '発令：チェーンガン斉射',
        'Command: Dive Formation': '発令：対物一斉突撃',
        'Command: Infrared Blast': '発令：対物熱線照射',
        'Command: Joint Attack': '発令：対物集中攻撃',
        'Command: Lateral Dive': '発令：対物突進攻撃',
        'Command: Suppressive Formation': '制圧突撃',
        'Curse Of The Fiend': '魔法印',
        'Electric Anvil': 'エレクトリックアンビル',
        'Energy Generation': 'エネルギー体生成',
        'Explosion': '爆散',
        'False Thunder': 'フォルスサンダー',
        '(?<!/)Fervid Pulse': 'ファーヴィッドパルス',
        'Fire IV': 'ファイジャ',
        'Flare': 'フレア',
        'Frigid Pulse': 'フリジッドパルス',
        'Frigid/Fervid Pulse': 'フリジッドパルス/ファーヴィッドパルス',
        'Heart Of Nature': '地霊脈',
        'Holy IV': 'ホーリジャ',
        'Lightburst': 'ライトバースト',
        'Lightning Shower': 'ライトニングシャワー',
        'Magitek Magnetism': '魔導マグネット',
        'Magitek Missiles': '魔導ミサイル',
        'Magnetic Jolt': '磁力干渉',
        'Meteor': 'メテオ',
        'Molting Plumage': 'モルトプルメイジ',
        'Mrv Missile': '多弾頭ミサイル',
        'Nature\'s Blood': '波導地霊斬',
        'Nature\'s Pulse': '波導地霊衝',
        'Obey': 'しじをきく',
        'Orb': '玉',
        'Pentagust': 'ペンタガスト',
        'Polar Magnetism': '転換マグネット',
        'Pole Shift': '磁場転換',
        'Raging Winds': '風烈飛翔流',
        'Ready': 'しじをさせろ',
        'Scratch': 'スクラッチ',
        'Shadow Burst': 'シャドウバースト',
        'Shock': '放電',
        'Stone IV': 'ストンジャ',
        'Surface Missile': '対地ミサイル',
        'Swooping Frenzy': 'スワープフレンジー',
        'Taste Of Blood': '鬼哭血散斬',
        'The King\'s Notice': '覇王邪視眼',
        'Thunder IV': 'サンダジャ',
        'Tornado': 'トルネド',
        'Twin Agonies': '双魔邪王斬',
        'Voltstream': 'ボルトストリーム',
        'Warped Light': '閃光砲',
        'Water IV': 'ウォタジャ',
        'Winds\' Peak': '超級烈風波',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Lyon the Beast King would do battle at Majesty\'s Place': '兽王莱昂似乎很期待在王者圆坛战斗！',
        'Red Comet': '红色彗星',
        'Albeleo\'s Monstrosity': '阿尔贝雷欧的巨兽',
        'Albeleo\'s Hrodvitnir': '阿尔贝雷欧的恶狼',
        'Electric Charge': '雷气',
        '7 minutes have elapsed since your last activity..*?': '已经7分钟没有进行任何操作.*?',
        '4Th Legion Helldiver': '第四军团地狱潜者',
        'Adrammelech': '阿德拉梅里克',
        'Bladesmeet': '群刃大厅',
        'Brionac': '布里欧纳克',
        'Dawon': '达温',
        'Eaglesight': '苍鹰广场',
        'Lightsphere': '光耀晶球',
        'Lyon The Beast King(?! would)': '兽王 莱昂',
        'Majesty\'s Auspice': '圆坛之间',
        'Shadowsphere': '暗影晶球',
        'The airship landing': '飞空战舰着陆台',
        'The grand gates': '城门',
        'Verdant Plume': '浓绿之羽',
      },
      'replaceText': {
        '--Lyon Passage--': '--兽王通道开启--',
        '(?<!Command: )Chain Cannon': '链式机关炮',
        '(?<!Command: )Dive Formation': '一齐突击',
        '(?<!Command: )Infrared Blast': '热线照射',
        '(?<!Command: )Lateral Dive': '突进攻击',
        'Accursed Becoming': '魔法合成',
        'Aero IV': '飙风',
        'Anti-Warmachina Weaponry': '对魔导兵器攻击',
        'Blizzard IV': '冰澈',
        'Burst II': '磁暴',
        'Call Beast': '呼叫',
        'Command: Chain Cannon': '下令：链式机关炮齐射',
        'Command: Dive Formation': '下令：对物一齐突击',
        'Command: Infrared Blast': '下令：对物热线照射',
        'Command: Joint Attack': '下令：对物集中攻击',
        'Command: Lateral Dive': '下令：对物突进攻击',
        'Command: Suppressive Formation': '下令：对人压制突击',
        'Curse Of The Fiend': '魔法印',
        'Electric Anvil': '电砧',
        'Energy Generation': '生成能源体',
        'Explosion': '爆炸',
        'False Thunder': '伪雷',
        '(?<!/)Fervid Pulse': '炙热脉冲',
        'Fire IV': '炽炎',
        'Flare': '核爆',
        'Frigid Pulse': '寒冷脉冲',
        'Frigid/Fervid Pulse': '寒冷脉冲/炙热脉冲',
        'Heart Of Nature': '地灵脉',
        'Holy IV': '极圣',
        'Lightburst': '光爆破',
        'Lightning Shower': '雷光雨',
        'Magitek Magnetism': '魔导磁石',
        'Magitek Missiles': '魔导飞弹',
        'Magnetic Jolt': '磁力干涉',
        'Meteor': '陨石流星',
        'Molting Plumage': '换羽',
        'Mrv Missile': '多弹头飞弹',
        'Nature\'s Blood': '波导地灵斩',
        'Nature\'s Pulse': '波导地灵冲',
        'Obey': '服从',
        'Orb': '球',
        'Pentagust': '五向突风',
        'Polar Magnetism': '转换磁石',
        'Pole Shift': '磁场转换',
        'Raging Winds': '风烈飞翔流',
        'Ready': '准备',
        'Scratch': '抓击',
        'Shadow Burst': '暗影爆',
        'Shock': '放电',
        'Stone IV': '崩石',
        'Surface Missile': '对地导弹',
        'Swooping Frenzy': '狂乱猛冲',
        'Taste Of Blood': '鬼哭血散斩',
        'The King\'s Notice': '霸王邪视眼',
        'Thunder IV': '霹雷',
        'Tornado': '龙卷',
        'Twin Agonies': '双魔邪王斩',
        'Voltstream': '电压流',
        'Warped Light': '闪光炮',
        'Water IV': '骇水',
        'Winds\' Peak': '超级烈风波',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Lyon the Beast King would do battle at Majesty\'s Place': '마수왕 라이언이 왕의 단상에서 싸우려고 합니다!',
        'Red Comet': '붉은 혜성',
        'Albeleo\'s Monstrosity': '알비레오의 야수',
        'Albeleo\'s Hrodvitnir': '알비레오의 흐로드비트니르',
        'Electric Charge': '번개기운',
        '7 minutes have elapsed since your last activity..*?': '7분 동안 아무 조작을 하지 않았습니다..*?',
        '4Th Legion Helldiver': 'IV군단 헬다이버',
        'Adrammelech': '아드람멜렉',
        'Bladesmeet': '검들의 대광장',
        'Brionac': '브류나크',
        'Dawon': '다우언',
        'Eaglesight': '독수리 광장',
        'Lightsphere': '빛 구체',
        'Lyon The Beast King(?! would)': '마수왕 라이언',
        'Majesty\'s Auspice': '단상',
        'Shadowsphere': '그림자 구체',
        'The airship landing': '골드 소서 비공정 승강장',
        'The grand gates': '성문',
        'Verdant Plume': '진녹색 날개',
      },
      'replaceText': {
        '--Lyon Passage--': '--라이언 통과--',
        '(?<!Command: )Chain Cannon': '기관총 일제 발사',
        '(?<!Command: )Dive Formation': '대물 일제 돌격',
        '(?<!Command: )Infrared Blast': '대물 열선',
        '(?<!Command: )Lateral Dive': '대물 돌진 공격',
        'Accursed Becoming': '마법 합성',
        'Aero IV': '에어로쟈',
        'Anti-Warmachina Weaponry': '마도 병기 대응 공격',
        'Blizzard IV': '블리자쟈',
        'Burst II': '버스트',
        'Call Beast': '부르기',
        'Command: Chain Cannon': '지령: 기관총 일제 발사',
        'Command: Dive Formation': '지령: 대물 일제 돌격',
        'Command: Infrared Blast': '지령: 대물 열선',
        'Command: Joint Attack': '지령: 대물 집중 공격',
        'Command: Lateral Dive': '지령: 대물 돌진 공격',
        'Command: Suppressive Formation': '대인 제압 돌격',
        'Curse Of The Fiend': '마법인',
        'Electric Anvil': '전기 모루',
        'Energy Generation': '에너지 구체 생성',
        'Explosion': '폭산',
        'False Thunder': '인공 번개',
        'Frigid(?! )': '냉랭한',
        'Fervid Pulse': '열렬한 고동',
        'Fire IV': '파이쟈',
        'Flare': '플레어',
        'Frigid Pulse': '냉랭한 고동',
        'Heart Of Nature': '지령맥',
        'Holy IV': '홀리쟈',
        'Lightburst': '빛 분출',
        'Lightning Shower': '번개 세례',
        'Magitek Magnetism': '마도 자석',
        'Magitek Missiles': '마도 미사일',
        'Magnetic Jolt': '자력 간섭',
        'Meteor': '메테오',
        'Molting Plumage': '털갈이',
        'Mrv Missile': '다탄두 미사일',
        'Nature\'s Blood': '파도지령참',
        'Nature\'s Pulse': '파도지령충',
        'Obey': '명령 따르기',
        'Orb': '구슬',
        'Pentagust': '다섯 갈래 돌풍',
        'Polar Magnetism': '자석 변환',
        'Pole Shift': '자기장 전환',
        'Raging Winds': '풍렬비상류',
        'Ready': '명령하기',
        'Scratch': '생채기',
        'Shadow Burst': '그림자 폭발',
        'Shock': '방전',
        'Stone IV': '스톤쟈',
        'Surface Missile': '대지 미사일',
        'Swooping Frenzy': '광란의 급강하',
        'Taste Of Blood': '귀곡혈산참',
        'The King\'s Notice': '패왕사시안',
        'Thunder IV': '선더쟈',
        'Tornado': '토네이도',
        'Twin Agonies': '쌍마사왕참',
        'Voltstream': '번개 급류',
        'Warped Light': '섬광포',
        'Water IV': '워터쟈',
        'Winds\' Peak': '초급렬풍파',
      },
    },
  ],
};
