import NetRegexes from '../../../../resources/netregexes';
import ZoneId from '../../../../resources/zone_id';
import { RaidbossData } from '../../../../types/data';
import { TriggerSet } from '../../../../types/trigger';

export type Data = RaidbossData;

const caresAboutTankStuff = (data: RaidbossData) => {
  return data.role === 'tank' || data.role === 'healer' || data.job === 'BLU';
};

// Triggers for all occasions and zones.
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: 'General Provoke',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Provoke: ${player}',
          de: 'Herausforderung: ${player}',
          fr: 'Provocation: ${player}',
          ja: '挑発: ${player}',
          cn: '挑衅: ${player}',
          ko: '도발: ${player}',
        },
      },
    },
    {
      id: 'General Frog Legs',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '4783' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      suppressSeconds: 0.5,
      infoText: (data, matches, output) => {
        if (matches.targetId === 'E0000000')
          return output.noTarget!({ player: data.ShortName(matches.source) });
        return output.text!({ player: data.ShortName(matches.source) });
      },
      outputStrings: {
        text: {
          en: 'Provoke: ${player}',
          de: 'Herausforderung: ${player}',
          fr: 'Provocation: ${player}',
          ja: '挑発: ${player}',
          cn: '挑衅: ${player}',
          ko: '도발: ${player}',
        },
        noTarget: {
          en: 'Provoke: ${player} (missed)',
          de: 'Herausforderung: ${player} (verfehlt)',
          fr: 'Provocation: ${player} (manquée)',
          ja: '挑発: ${player} (タゲなし)',
          cn: '挑衅: ${player} (无目标)',
        },
      },
    },
    {
      id: 'General Shirk',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1D71' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Shirk: ${player}',
          de: 'Geteiltes Leid: ${player}',
          fr: 'Dérobade: ${player}',
          ja: 'シャーク: ${player}',
          cn: '退避: ${player}',
          ko: '기피: ${player}',
        },
      },
    },
    {
      id: 'General Holmgang',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2B' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Holmgang: ${player}',
          de: 'Holmgang: ${player}',
          fr: 'Holmgang: ${player}',
          ja: 'ホルムギャング: ${player}',
          cn: '死斗: ${player}',
          ko: '일대일 결투: ${player}',
        },
      },
    },
    {
      id: 'General Hallowed',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1E' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Hallowed: ${player}',
          de: 'Heiliger Boden: ${player}',
          fr: 'Invincible: ${player}',
          ja: 'インビンシブル: ${player}',
          cn: '神圣领域: ${player}',
          ko: '천하무적: ${player}',
        },
      },
    },
    {
      id: 'General Superbolide',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3F18' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Bolide: ${player}',
          de: 'Meteoritenfall: ${player}',
          fr: 'Bolide: ${player}',
          ja: 'ボーライド: ${player}',
          cn: '超火流星: ${player}',
          ko: '폭발 유성: ${player}',
        },
      },
    },
    {
      id: 'General Living',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: 'E36' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Living: ${player}',
          de: 'Totenerweckung: ${player}',
          fr: 'Mort-vivant: ${player}',
          ja: 'リビングデッド: ${player}',
          cn: '行尸走肉: ${player}',
          ko: '산송장: ${player}',
        },
      },
    },
    {
      id: 'General Walking',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '32B' }),
      condition: (data, matches) => {
        if (matches.source !== data.me && !data.party.inAlliance(matches.source))
          return false;
        return caresAboutTankStuff(data);
      },
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.source) }),
      outputStrings: {
        text: {
          en: 'Walking: ${player}',
          de: 'Erweckter: ${player}',
          fr: 'Marcheur des limbes: ${player}',
          ja: 'ウォーキングデッド: ${player}',
          cn: '死而不僵: ${player}',
          ko: '움직이는 시체: ${player}',
        },
      },
    },
    {
      id: 'General Ready Check',
      netRegex: NetRegexes.gameLog({ line: '(?:\\y{Name} has initiated|You have commenced) a ready check\..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: '(?:\\y{Name} hat|Du hast) eine Bereitschaftsanfrage gestellt\..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Un appel de préparation a été lancé par \y{Name}\..*?', capture: false }),
      netRegexJa: NetRegexes.gameLog({ line: '(?:\\y{Name}が)?レディチェックを開始しました。.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '\\y{Name}?发起了准备确认.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '\\y{Name} 님이 준비 확인을 시작했습니다\.|준비 확인을 시작합니다\..*?', capture: false }),
      sound: '../../resources/sounds/Overwatch/D.Va_-_Game_on.ogg',
      soundVolume: 0.6,
    },
  ],
};

export default triggerSet;
