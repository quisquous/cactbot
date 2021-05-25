import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Regexes from '../../../../../resources/regexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// UCU - The Unending Coil Of Bahamut (Ultimate)
export default {
  zoneId: ZoneId.TheUnendingCoilOfBahamutUltimate,
  timelineFile: 'unending_coil_ultimate.txt',
  timelineTriggers: [
    {
      id: 'UCU Bahamut\'s Claw',
      regex: /Bahamut's Claw x5/,
      beforeSeconds: 5,
      suppressSeconds: 1,
      // It's tough to track who this is on, especially for the first one.
      // Both tanks should care about the tankbuster because they can throw
      // mitigation on the other, so just always play this for both tanks.
      conditions: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    // --- State ---
    {
      id: 'UCU Firescorched Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '1D0' }),
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.fireDebuff = true;
      },
    },
    {
      id: 'UCU Firescorched Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '1D0' }),
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.fireDebuff = false;
      },
    },
    {
      id: 'UCU Icebitten Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '1D1' }),
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.iceDebuff = true;
      },
    },
    {
      id: 'UCU Icebitten Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '1D1' }),
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.iceDebuff = false;
      },
    },
    {
      id: 'UCU Fireball Counter',
      netRegex: NetRegexes.ability({ id: '26C5', source: 'Firehorn' }),
      netRegexDe: NetRegexes.ability({ id: '26C5', source: 'Feuerhorn' }),
      netRegexFr: NetRegexes.ability({ id: '26C5', source: 'Corne-De-Feu' }),
      netRegexJa: NetRegexes.ability({ id: '26C5', source: 'ファイアホーン' }),
      netRegexCn: NetRegexes.ability({ id: '26C5', source: '火角' }),
      netRegexKo: NetRegexes.ability({ id: '26C5', source: '화염뿔' }),
      run: (data, matches) => {
        data.fireballs[data.naelFireballCount].push(matches.target);
      },
    },
    {
      id: 'UCU Quickmarch Phase',
      netRegex: NetRegexes.startsUsing({ id: '26E2', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26E2', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26E2', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26E2', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26E2', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26E2', source: '바하무트 프라임', capture: false }),
      run: (data) => {
        if (data.resetTrio)
          data.resetTrio('quickmarch');
      },
    },
    {
      id: 'UCU Blackfire Phase',
      netRegex: NetRegexes.startsUsing({ id: '26E3', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26E3', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26E3', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26E3', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26E3', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26E3', source: '바하무트 프라임', capture: false }),
      run: (data) => {
        if (data.resetTrio)
          data.resetTrio('blackfire');
      },
    },
    {
      id: 'UCU Fellruin Phase',
      netRegex: NetRegexes.startsUsing({ id: '26E4', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26E4', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26E4', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26E4', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26E4', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26E4', source: '바하무트 프라임', capture: false }),
      run: (data) => {
        if (data.resetTrio)
          data.resetTrio('fellruin');
      },
    },
    {
      id: 'UCU Heavensfall Phase',
      netRegex: NetRegexes.startsUsing({ id: '26E5', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26E5', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26E5', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26E5', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26E5', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26E5', source: '바하무트 프라임', capture: false }),
      run: (data) => {
        if (data.resetTrio)
          data.resetTrio('heavensfall');
      },
    },
    {
      id: 'UCU Tenstrike Phase',
      netRegex: NetRegexes.startsUsing({ id: '26E6', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26E6', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26E6', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26E6', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26E6', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26E6', source: '바하무트 프라임', capture: false }),
      run: (data) => {
        if (data.resetTrio)
          data.resetTrio('tenstrike');
      },
    },
    {
      id: 'UCU Octet Phase',
      netRegex: NetRegexes.startsUsing({ id: '26E7', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26E7', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26E7', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26E7', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26E7', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26E7', source: '바하무트 프라임', capture: false }),
      run: (data) => {
        if (data.resetTrio)
          data.resetTrio('octet');
      },
    },
    {
      id: 'UCU Ragnarok Party Tracker',
      netRegex: NetRegexes.ability({ id: '26B8', source: 'Ragnarok' }),
      netRegexDe: NetRegexes.ability({ id: '26B8', source: 'Ragnarök' }),
      netRegexFr: NetRegexes.ability({ id: '26B8', source: 'Ragnarok' }),
      netRegexJa: NetRegexes.ability({ id: '26B8', source: 'ラグナロク' }),
      netRegexCn: NetRegexes.ability({ id: '26B8', source: '诸神黄昏' }),
      netRegexKo: NetRegexes.ability({ id: '26B8', source: '라그나로크' }),
      run: (data, matches) => {
        // This happens once during the nael transition and again during
        // the heavensfall trio.  This should proooobably hit all 8
        // people by the time you get to octet.
        data.partyList = data.partyList || {};
        data.partyList[matches.target] = true;
      },
    },

    // --- Twintania ---
    {
      id: 'UCU Twisters',
      netRegex: NetRegexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26AA', source: 'Gémellia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26AA', source: 'ツインタニア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26AA', source: '双塔尼亚', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26AA', source: '트윈타니아', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Twisters',
          de: 'Wirbelstürme',
          fr: 'Tornades',
          ja: '大竜巻',
          cn: '旋风',
          ko: '회오리',
        },
      },
    },
    {
      id: 'UCU Death Sentence',
      netRegex: NetRegexes.startsUsing({ id: '26A9', source: 'Twintania', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26A9', source: 'Twintania', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26A9', source: 'Gémellia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26A9', source: 'ツインタニア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26A9', source: '双塔尼亚', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26A9', source: '트윈타니아', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.role === 'tank' || data.role === 'healer')
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Death Sentence',
          de: 'Todesurteil',
          fr: 'Peine de mort',
          ja: 'デスセンテンス',
          cn: '死刑',
          ko: '사형 선고',
        },
      },
    },
    {
      id: 'UCU Hatch Collect',
      netRegex: NetRegexes.headMarker({ id: '0076' }),
      run: (data, matches) => {
        data.hatch = data.hatch || [];
        data.hatch.push(matches.target);
      },
    },
    {
      id: 'UCU Hatch Marker YOU',
      netRegex: NetRegexes.headMarker({ id: '0076' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hatch on YOU',
          de: 'Ausbrüten auf DIR',
          fr: 'Éclosion sur VOUS',
          ja: '自分に魔力爆散',
          cn: '点名魔力爆散',
          ko: '나에게 마력연성',
        },
      },
    },
    {
      id: 'UCU Hatch Callouts',
      netRegex: NetRegexes.headMarker({ id: '0076', capture: false }),
      delaySeconds: 0.25,
      infoText: (data, _matches, output) => {
        if (!data.hatch)
          return;
        const hatches = data.hatch.map((n) => data.ShortName(n)).join(', ');
        delete data.hatch;
        return output.text({ players: hatches });
      },
      outputStrings: {
        text: {
          en: 'Hatch: ${players}',
          de: 'Ausbrüten: ${players}',
          fr: 'Éclosion: ${players}',
          ja: '魔力爆散${players}',
          cn: '魔力爆散${players}',
          ko: '마력연성: ${players}',
        },
      },
    },
    {
      id: 'UCU Hatch Cleanup',
      netRegex: NetRegexes.headMarker({ id: '0076', capture: false }),
      delaySeconds: 5,
      run: (data) => {
        delete data.hatch;
      },
    },
    {
      id: 'UCU Twintania P2',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '75', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '75', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '75', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '75', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '75', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '75', capture: false }),
      sound: 'Long',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Phase 2 Push',
          de: 'Phase 2 Stoß',
          fr: 'Phase 2 poussée',
          ja: 'フェーズ2',
          cn: 'P2准备',
          ko: '트윈 페이즈2',
        },
      },
    },
    {
      id: 'UCU Twintania P3',
      regex: Regexes.hasHP({ name: 'Twintania', hp: '45', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Twintania', hp: '45', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Gémellia', hp: '45', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ツインタニア', hp: '45', capture: false }),
      regexCn: Regexes.hasHP({ name: '双塔尼亚', hp: '45', capture: false }),
      regexKo: Regexes.hasHP({ name: '트윈타니아', hp: '45', capture: false }),
      sound: 'Long',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Phase 3 Push',
          de: 'Phase 3 Stoß',
          fr: 'Phase 3 poussée',
          ja: 'フェーズ3',
          cn: 'P3准备',
          ko: '트윈 페이즈3',
        },
      },
    },

    // --- Nael ---
    {
      // https://xivapi.com/NpcYell/6497?pretty=true
      id: 'UCU Nael Quote 1',
      netRegex: NetRegexes.dialog({ line: 'From on high I descend, the hallowed moon to call.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Seht, ich steige herab, vom rotglühenden Monde.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Des cieux je vais descendre et révérer la lune.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '我、舞い降りて\\s*月を仰がん！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '我降临于此，\\s*对月长啸！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '흉조가 내려와 달을 올려다보리라!.*?', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread => In',
          de: 'Verteilen => Rein',
          fr: 'Se dispercer => Dedans',
          ja: '散開 => 密着',
          cn: '分散 => 靠近',
          ko: '산개 => 안으로',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6496?pretty=true
      id: 'UCU Nael Quote 2',
      netRegex: NetRegexes.dialog({ line: 'From on high I descend, the iron path to walk.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Seht, ich steige herab, um euch zu beherrschen.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Du haut des cieux, je vais descendre pour conquérir.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '我、舞い降りて\\s*鉄の覇道を征く！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '我降临于此，\\s*征战铁血霸道！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '흉조가 내려와 강철의 패도를 걸으리라!.*?', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread => Out',
          de: 'Verteilen => Raus',
          fr: 'Se dispercer => Dehors',
          ja: '散開 => 離れ',
          cn: '分散 => 远离',
          ko: '산개 => 밖으로',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6495?pretty=true
      id: 'UCU Nael Quote 3',
      netRegex: NetRegexes.dialog({ line: 'Take fire, O hallowed moon.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Flammender Pfad, geschaffen vom roten Mond.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Baignez dans la bénédiction de la lune incandescente.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '赤熱せし\\s*月の祝福を！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '炽热燃烧！\\s*给予我月亮的祝福！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '붉게 타오른 달의 축복을!.*?', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack => In',
          de: 'Stack => Rein',
          fr: 'Se rassembler => Dedans',
          ja: '頭割り => 密着',
          cn: '集合 => 靠近',
          ko: '쉐어 => 안으로',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6494?pretty=true
      id: 'UCU Nael Quote 4',
      netRegex: NetRegexes.dialog({ line: 'Blazing path, lead me to iron rule.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Umloderter Pfad, führe mich zur Herrschaft.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'La voie marquée par l\'incandescence mène à la domination.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '赤熱し、焼かれし道を\\s*鉄の覇道と成す！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '被炽热灼烧过的轨迹\\s*乃成铁血霸道！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '붉게 타오른 길을 강철의 패도로 만들겠노라!.*?', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stack => Out',
          de: 'Stack => Raus',
          fr: 'Se rassembler => Dehors',
          ja: '頭割り => 離れ',
          cn: '集合 => 远离',
          ko: '쉐어 => 밖으로',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6493?pretty=true
      id: 'UCU Nael Quote 5',
      netRegex: NetRegexes.dialog({ line: 'O hallowed moon, take fire and scorch my foes.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'O roter Mond! Umlodere meinen Pfad.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Que l\'incandescence de la lune brûle mes ennemis.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '月よ！\\s*赤熱し、神敵を焼け！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '月光啊！\\s*用你的炽热烧尽敌人！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '달이여! 붉게 타올라 신의 적을 태워버려라!.*?', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In => Stack',
          de: 'Rein => Stack',
          fr: 'Dedans => Se rassembler',
          ja: '密着 => 頭割り',
          cn: '靠近 => 集合',
          ko: '안으로 => 쉐어',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6492?pretty=true
      id: 'UCU Nael Quote 6',
      netRegex: NetRegexes.dialog({ line: 'O hallowed moon, shine you the iron path.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'O roter Mond! Führe mich zur Herrschaft.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Ô lune! Éclaire la voie de la domination.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '月よ！\\s*鉄の覇道を照らせ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '月光啊！\\s*照亮铁血霸道！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '달이여! 강철의 패도를 비춰라!.*?', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In => Out',
          de: 'Rein => Raus',
          fr: 'Dedans => Dehors',
          ja: '密着 => 離れ',
          cn: '靠近 => 远离',
          ko: '안으로 => 밖으로',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6501?pretty=true
      id: 'UCU Nael Quote 7',
      netRegex: NetRegexes.dialog({ line: 'Fleeting light! \'Neath the red moon, scorch you the earth.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Neues Gestirn! Glühe herab und umlodere meinen Pfad.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Supernova, brille de tout ton feu et irradie la terre rougie.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '超新星よ、輝きを増せ！\\s*紅月下の赤熱せし地を照らせ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '超新星啊，更加闪耀吧！\\s*照亮红月下炽热之地！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '초신성이여, 빛을 더하라! 붉은 달 아래, 붉게 타오르는 땅을 비춰라!.*?', capture: false }),
      delaySeconds: 4,
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from Tank => Stack',
          de: 'Weg vom Tank => Stack',
          fr: 'S\'éloigner du tank => Se rassembler',
          ja: 'タンクから離れ => 頭割り',
          cn: '远离坦克 => 集合',
          ko: '탱커 피하기 => 쉐어',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6500?pretty=true
      id: 'UCU Nael Quote 8',
      netRegex: NetRegexes.dialog({ line: 'Fleeting light! Amid a rain of stars, exalt you the red moon.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Neues Gestirn! Überstrahle jede Sternschnuppe.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Supernova, brille de tout ton feu et glorifie la lune rouge.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '超新星よ、輝きを増せ！\\s*星降りの夜に、紅月を称えよ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '超新星啊，更加闪耀吧！\\s*在星降之夜，称赞红月！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '초신성이여, 빛을 더하라! 유성이 쏟아지는 밤에, 붉은 달을 우러러보라!.*?', capture: false }),
      delaySeconds: 4,
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread => Away from Tank',
          de: 'Verteilen => Weg vom Tank',
          fr: 'Se dispercer => S\'éloigner du Tank',
          ja: '散開 => タンクから離れ',
          cn: '分散 => 远离坦克',
          ko: '산개 => 탱커 피하기',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6502?pretty=true
      id: 'UCU Nael Quote 9',
      netRegex: NetRegexes.dialog({ line: 'From on high I descend, the moon and stars to bring.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Ich steige herab zu Ehre des roten Mondes! Einer Sternschnuppe gleich.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Du haut des cieux, j\'appelle une pluie d\'étoiles.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '我、舞い降りて月を仰ぎ\\s*星降りの夜を招かん！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '我降临于此对月长啸！\\s*召唤星降之夜！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '흉조가 내려와, 달을 올려다보니 유성이 쏟아지는 밤이 도래하리라!.*?', capture: false }),
      durationSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread => In',
          de: 'Verteilen => Rein',
          fr: 'Se dispercer => Dedans',
          ja: '散開 => 密着',
          cn: '分散 => 靠近',
          ko: '산개 => 안으로',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6503?pretty=true
      id: 'UCU Nael Quote 10',
      netRegex: NetRegexes.dialog({ line: 'From hallowed moon I descend, a rain of stars to bring.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'O roter Mond, sieh mich herabsteigen! Einer Sternschnuppe gleich.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Depuis la lune, j\'invoque une pluie d\'étoiles.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '我、月より舞い降りて\\s*星降りの夜を招かん！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '我自月而来降临于此，\\s*召唤星降之夜！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '달로부터 흉조가 내려와 유성이 쏟아지는 밤이 도래하리라!.*?', capture: false }),
      durationSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In => Spread',
          de: 'Rein => Verteilen',
          fr: 'Dedans => Se dispercer',
          ja: '密着 => 散開',
          cn: '靠近 => 分散',
          ko: '안으로 => 산개',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6507?pretty=true
      id: 'UCU Nael Quote 11',
      netRegex: NetRegexes.dialog({ line: 'From hallowed moon I bare iron, in my descent to wield.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'O roter Mond, als Künder deiner Herrschaft stieg ich herab.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'De la lune je m\'arme d\'acier et descends.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '我、月より鉄を備え\\s*舞い降りん！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '我自月而来携钢铁降临于此！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '달로부터 강철의 패도를 거쳐 흉조가 내려오리라!.*?', capture: false }),
      durationSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In => Out => Spread',
          de: 'Rein => Raus => Verteilen',
          fr: 'Dedans => Dehors => Se dispercer',
          ja: '密着 => 離れ => 散開',
          cn: '靠近 => 远离 => 分散',
          ko: '안으로 => 밖으로 => 산개',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6506?pretty=true
      id: 'UCU Nael Quote 12',
      netRegex: NetRegexes.dialog({ line: 'From hallowed moon I descend, upon burning earth to tread.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'O roter Mond! Ich stieg herab, um deine Herrschaft zu bringen.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'De la lune, je descends et marche sur la terre ardente.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '我、月より舞い降りて\\s*赤熱せし地を歩まん！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '我自月而来降临于此，\\s*踏过炽热之地！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '달로부터 흉조가 내려와 붉게 타오르는 땅을 걸으리라!.*?', capture: false }),
      durationSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'In => Spread => Stack',
          de: 'Rein => Verteilen => Stack',
          fr: 'Dedans => Se dispercer => Se rassembler',
          ja: '密着 => 散開 => 頭割り',
          cn: '靠近 => 分散 => 集合',
          ko: '안으로 => 산개 => 쉐어',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6504?pretty=true
      id: 'UCU Nael Quote 13',
      netRegex: NetRegexes.dialog({ line: 'Unbending iron, take fire and descend.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Zur Herrschaft führt mein umloderter Pfad! Auf diesen steige ich herab.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Ô noble acier! Rougis ardemment et deviens ma lame transperçante.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '鉄よ、赤熱せよ！\\s*舞い降りし我が刃となれ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '钢铁燃烧吧！\\s*成为我降临于此的刀剑吧！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '강철이여, 붉게 타올라라! 흉조가 내려오니 그 칼날이 되어라!.*?', capture: false }),
      durationSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out => Stack => Spread',
          de: 'Raus => Stack => Verteilen',
          fr: 'Dehors => Se rassembler => Se dispercer',
          ja: '離れ => 頭割り => 散開',
          cn: '远离 => 集合 => 分散',
          ko: '밖으로 => 쉐어 => 산개',
        },
      },
    },
    {
      // https://xivapi.com/NpcYell/6505?pretty=true
      id: 'UCU Nael Quote 14',
      netRegex: NetRegexes.dialog({ line: 'Unbending iron, descend with fiery edge.*?', capture: false }),
      netRegexDe: NetRegexes.dialog({ line: 'Zur Herrschaft steige ich herab, auf umlodertem Pfad.*?', capture: false }),
      netRegexFr: NetRegexes.dialog({ line: 'Fier acier! Sois ma lame plongeante et deviens incandescent.*?', capture: false }),
      netRegexJa: NetRegexes.dialog({ line: '鉄よ、舞い降りし\\s*我の刃となり赤熱せよ！.*?', capture: false }),
      netRegexCn: NetRegexes.dialog({ line: '钢铁成为我降临于此的燃烧之剑！.*?', capture: false }),
      netRegexKo: NetRegexes.dialog({ line: '강철이여, 흉조가 내려오는도다! 그 칼날이 되어 붉게 타올라라!.*?', capture: false }),
      durationSeconds: 9,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out => Spread => Stack',
          de: 'Raus => Verteilen => Stack',
          fr: 'Dehors => Se dispercer => Se rassembler',
          ja: '離れ => 散開 => 頭割り',
          cn: '远离 => 分散 => 集合',
          ko: '밖으로 => 산개 => 쉐어',
        },
      },
    },
    {
      id: 'UCU Nael Thunderstruck',
      // Note: The 0A event happens before 'gains the effect' and 'starts
      // casting on' only includes one person.
      netRegex: NetRegexes.ability({ source: 'Thunderwing', id: '26C7' }),
      netRegexDe: NetRegexes.ability({ source: 'Donnerschwinge', id: '26C7' }),
      netRegexFr: NetRegexes.ability({ source: 'Aile-De-Foudre', id: '26C7' }),
      netRegexJa: NetRegexes.ability({ source: 'サンダーウィング', id: '26C7' }),
      netRegexCn: NetRegexes.ability({ source: '雷翼', id: '26C7' }),
      netRegexKo: NetRegexes.ability({ source: '번개날개', id: '26C7' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Thunder on YOU',
          de: 'Blitz auf DIR',
          fr: 'Foudre sur VOUS',
          ja: '自分にサンダー',
          cn: '雷点名',
          ko: '나에게 번개',
        },
      },
    },
    {
      id: 'UCU Nael Your Doom',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      condition: (data, matches) => {
        // FIXME: temporary workaround for "gains the effect for 9999.00"
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223
        if (matches.duration > 1000)
          return false;
        return data.me === matches.target;
      },
      // FIXME: temporary workaround for multiple gains effects messages.
      // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223#issuecomment-513486275
      durationSeconds: (_data, matches) => {
        if (parseFloat(matches.duration) <= 6)
          return 3;

        if (parseFloat(matches.duration) <= 10)
          return 6;

        return 9;
      },
      suppressSeconds: 20,
      alarmText: (_data, matches, output) => {
        if (parseFloat(matches.duration) <= 6)
          return output.doom1();
        if (parseFloat(matches.duration) <= 10)
          return output.doom2();
        return output.doom3();
      },
      tts: (_data, matches, output) => {
        if (parseFloat(matches.duration) <= 6)
          return output.justNumber({ num: '1' });

        if (parseFloat(matches.duration) <= 10)
          return output.justNumber({ num: '2' });

        return output.justNumber({ num: '3' });
      },
      outputStrings: {
        doom1: {
          en: 'Doom #1 on YOU',
          de: 'Verhängnis #1 auf DIR',
          fr: 'Glas #1 sur VOUS',
          ja: '自分に一番目死の宣告',
          cn: '死宣一号点名',
          ko: '죽음의 선고 1번',
        },
        doom2: {
          en: 'Doom #2 on YOU',
          de: 'Verhängnis #2 auf DIR',
          fr: 'Glas #2 sur VOUS',
          ja: '自分に二番目死の宣告',
          cn: '死宣二号点名',
          ko: '죽음의 선고 2번',
        },
        doom3: {
          en: 'Doom #3 on YOU',
          de: 'Verhängnis #3 auf DIR',
          fr: 'Glas #3 sur VOUS',
          ja: '自分に三番目死の宣告',
          cn: '死宣三号点名',
          ko: '죽음의 선고 3번',
        },
        justNumber: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'UCU Doom Init',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      condition: (_data, matches) => {
        // FIXME: temporary workaround for "gains the effect for 9999.00"
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223
        return matches.duration < 1000;
      },
      run: (data, matches) => {
        data.dooms = data.dooms || [null, null, null];
        let order = null;
        if (parseFloat(matches.duration) < 9)
          order = 0;
        else if (parseFloat(matches.duration) < 14)
          order = 1;
        else
          order = 2;

        // FIXME: temporary workaround for multiple gains effects messages.
        // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/223#issuecomment-513486275
        if (order !== null && data.dooms[order] === null)
          data.dooms[order] = matches.target;
      },
    },
    {
      id: 'UCU Doom Cleanup',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2', capture: false }),
      delaySeconds: 20,
      run: (data) => {
        delete data.dooms;
        delete data.doomCount;
      },
    },
    {
      id: 'UCU Nael Cleanse Callout',
      netRegex: NetRegexes.ability({ source: 'Fang Of Light', id: '26CA', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Lichtklaue', id: '26CA', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Croc De Lumière', id: '26CA', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ライトファング', id: '26CA', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '光牙', id: '26CA', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '빛의 송곳니', id: '26CA', capture: false }),
      infoText: (data, _matches, output) => {
        data.doomCount = data.doomCount || 0;
        let name;
        if (data.dooms)
          name = data.dooms[data.doomCount];
        data.doomCount++;
        if (name)
          return output.text({ num: data.doomCount, player: data.ShortName(name) });
      },
      outputStrings: {
        text: {
          en: 'Cleanse #${num}: ${player}',
          de: 'Medica #${num}: ${player}',
          fr: 'Purifié #${num}: ${player}',
          ja: '解除に番目${num}: ${player}',
          cn: '解除死宣 #${num}: ${player}',
          ko: '선고 해제 ${num}: ${player}',
        },
      },
    },
    {
      id: 'UCU Nael Fireball 1',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 35,
      suppressSeconds: 99999,
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.naelFireballCount = 1;
      },
      outputStrings: {
        text: {
          en: 'Fire IN',
          de: 'Feuer INNEN',
          fr: 'Feu EN DEDANS',
          ja: 'ファイアボールは密着',
          cn: '火1 分摊',
          ko: '불 같이맞기',
        },
      },
    },
    {
      id: 'UCU Nael Fireball 2',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 51,
      suppressSeconds: 99999,
      alertText: (data, _matches, output) => {
        // All players should be neutral by the time fire #2 happens.
        // If you have ice at this point, it means you missed the first
        // stack.  Therefore, make sure you stack.  It's possible you
        // can survive until fire 3 happens, but it's not 100%.
        // See: https://www.reddit.com/r/ffxiv/comments/78mdwd/bahamut_ultimate_mechanics_twin_and_nael_minutia/
        if (!data.fireballs[1].includes(data.me))
          return output.fireOutBeInIt();
      },
      infoText: (data, _matches, output) => {
        if (data.fireballs[1].includes(data.me))
          return output.fireOut();
      },
      run: (data) => {
        data.naelFireballCount = 2;
      },
      outputStrings: {
        fireOut: {
          en: 'Fire OUT',
          de: 'Feuer AUßEN',
          fr: 'Feu EN DEHORS',
          ja: 'ファイアボールは離れ',
          cn: '火2 出人群',
          ko: '불 대상자 밖으로',
        },
        fireOutBeInIt: {
          en: 'Fire OUT: Be in it',
          de: 'Feuer AUßEN: Drin sein',
          fr: 'Feu EN DEHORS : Allez dessus',
          ja: 'ファイアボールは離れ: 自分に密着',
          cn: '火2 补火',
          ko: '불 대상자 밖으로: 나는 같이 맞기',
        },
      },
    },
    {
      id: 'UCU Nael Fireball 3',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      delaySeconds: 77,
      suppressSeconds: 99999,
      alertText: (data, _matches, output) => {
        // If you were the person with fire tether #2, then you could
        // have fire debuff here and need to not stack.
        if (data.fireballs[1].includes(data.me) && data.fireballs[2].includes(data.me))
          return output.fireInAvoid();
      },
      infoText: (data, _matches, output) => {
        const tookTwo = data.fireballs[1].filter((p) => {
          return data.fireballs[2].includes(p);
        });
        if (tookTwo.includes(data.me))
          return;

        if (tookTwo.length > 0) {
          const players = tookTwo.map((name) => data.ShortName(name)).join(', ');
          return output.fireInPlayersOut({ players: players });
        }
        return output.fireIn();
      },
      run: (data) => {
        data.naelFireballCount = 3;
      },
      outputStrings: {
        fireIn: {
          en: 'Fire IN',
          de: 'Feuer INNEN',
          fr: 'Feu EN DEDANS',
          ja: 'ファイアボールは密着',
          cn: '火3 分摊',
          ko: '불 같이맞기',
        },
        fireInPlayersOut: {
          en: 'Fire IN (${players} out)',
          de: 'Feuer INNEN (${players} éviter)',
          fr: 'Feu EN DEDANS (${players} raus)',
          ja: 'ファイアボールは密着 (${players}は外へ)',
          cn: '火3 (${players}躲避)',
          ko: '불 같이맞기 (${players} 는 피하기)',
        },
        fireInAvoid: {
          en: 'Fire IN: AVOID!',
          de: 'Feuer INNEN: AUSWEICHEN!',
          fr: 'Feu EN DEDANS : L\'ÉVITER !',
          ja: 'ファイアボールは密着: 自分に離れ',
          cn: '火3 躲避！',
          ko: '불 같이맞기: 나는 피하기',
        },
      },
    },
    {
      id: 'UCU Nael Fireball 4',
      netRegex: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Ragnarök', id: '26B8', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Ragnarok', id: '26B8', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラグナロク', id: '26B8', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '诸神黄昏', id: '26B8', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '라그나로크', id: '26B8', capture: false }),
      preRun: (data) => {
        const tookTwo = data.fireballs[1].filter((p) => {
          return data.fireballs[2].includes(p);
        });
        const tookThree = tookTwo.filter((p) => {
          return data.fireballs[3].includes(p);
        });
        data.tookThreeFireballs = tookThree.includes(data.me);
      },
      delaySeconds: 98,
      suppressSeconds: 99999,
      alertText: (data, _matches, output) => {
        // It's possible that you can take 1, 2, and 3 even if nobody dies with
        // careful ice debuff luck.  However, this means you probably shouldn't
        // take 4.
        if (data.tookThreeFireballs)
          return output.fireInAvoid();
      },
      infoText: (data, _matches, output) => {
        if (!data.tookThreeFireballs)
          return output.fireIn();
      },
      run: (data) => {
        data.naelFireballCount = 4;
      },
      outputStrings: {
        fireIn: {
          en: 'Fire IN',
          de: 'Feuer INNEN',
          fr: 'Feu EN DEDANS',
          ja: 'ファイアボール密着',
          cn: '火4 分摊',
          ko: '불 같이맞기',
        },
        fireInAvoid: {
          en: 'Fire IN: AVOID!',
          de: 'Feuer INNEN: AUSWEICHEN!',
          fr: 'Feu EN DEDANS : L\'ÉVITER !',
          ja: 'ファイアボールは密着: 自分に離れ',
          cn: '火4 躲避！',
          ko: '불 같이맞기: 나는 피하기',
        },
      },
    },
    {
      id: 'UCU Dragon Tracker',
      netRegex: NetRegexes.abilityFull({ source: ['Iceclaw', 'Thunderwing', 'Fang Of Light', 'Tail Of Darkness', 'Firehorn'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      netRegexDe: NetRegexes.abilityFull({ source: ['Eisklaue', 'Donnerschwinge', 'Lichtklaue', 'Dunkelschweif', 'Feuerhorn'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      netRegexFr: NetRegexes.abilityFull({ source: ['Griffe-De-Glace', 'Aile-De-Foudre', 'Croc De Lumière', 'Queue De Ténèbres', 'Corne-De-Feu'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      netRegexJa: NetRegexes.abilityFull({ source: ['アイスクロウ', 'サンダーウィング', 'ライトファング', 'ダークテイル', 'ファイアホーン'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      netRegexCn: NetRegexes.abilityFull({ source: ['冰爪', '雷翼', '光牙', '暗尾', '火角'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      netRegexKo: NetRegexes.abilityFull({ source: ['얼음발톱', '번개날개', '빛의 송곳니', '어둠의 꼬리', '화염뿔'], id: ['26C6', '26C7', '26CA', '26C9', '26C5'] }),
      condition: (data, matches) => !data.seenDragon || !(matches.source in data.seenDragon),
      run: (data, matches) => {
        // seenDragon[dragon name] => boolean
        data.seenDragon = data.seenDragon || {};
        data.seenDragon[matches.source] = true;

        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        // Positions are the 8 cardinals + numerical slop on a radius=24 circle.
        // N = (0, -24), E = (24, 0), S = (0, 24), W = (-24, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        const dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        // naelDragons[direction 0-7 (N-NW)] => boolean
        data.naelDragons = data.naelDragons || [0, 0, 0, 0, 0, 0, 0, 0];
        data.naelDragons[dir] = 1;

        if (Object.keys(data.seenDragon).length !== 5)
          return;

        const output = data.findDragonMarks(data.naelDragons);
        const langMap = {
          en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
          de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
          fr: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
          ja: ['北', '北東', '東', '南東', '南', '南西', '西', '北西'],
          cn: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'],
          ko: ['북', '북동', '동', '남동', '남', '남서', '서', '북서'],
        };

        const dirNames = langMap[data.displayLang] || langMap['en'];
        data.naelMarks = output.marks.map((i) => {
          return dirNames[i];
        });
        data.wideThirdDive = output.wideThirdDive;
        data.unsafeThirdMark = output.unsafeThirdMark;
        delete data.naelDragons;
        // In case you forget, print marks in the log.
        // TODO: Maybe only if Options.Debug?
        console.log(data.naelMarks.join(', ') + (data.wideThirdDive ? ' (WIDE)' : ''));
      },
    },
    {
      id: 'UCU Nael Ravensbeak',
      netRegex: NetRegexes.startsUsing({ source: 'Nael deus Darnus', id: '26B6' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Nael deus Darnus', id: '26B6' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Nael deus Darnus', id: '26B6' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ネール・デウス・ダーナス', id: '26B6' }),
      netRegexCn: NetRegexes.startsUsing({ source: '奈尔·神·达纳斯', id: '26B6' }),
      netRegexKo: NetRegexes.startsUsing({ source: '넬 데우스 다르누스', id: '26B6' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap('alert'),
    },
    {
      // Called out after the 1st Ravensbeak.
      id: 'UCU Nael Dragon Placement',
      netRegex: NetRegexes.ability({ source: 'Nael deus Darnus', id: '26B6', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Nael deus Darnus', id: '26B6', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Nael deus Darnus', id: '26B6', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ネール・デウス・ダーナス', id: '26B6', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '奈尔·神·达纳斯', id: '26B6', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '넬 데우스 다르누스', id: '26B6', capture: false }),
      condition: (data) => data.naelMarks && !data.calledNaelDragons,
      durationSeconds: 10,
      infoText: (data, _matches, output) => {
        data.calledNaelDragons = true;
        const params = {
          dive1: data.naelMarks[0],
          dive2: data.naelMarks[1],
          dive3: data.naelMarks[2],
        };
        if (data.wideThirdDive)
          return output.marksWide(params);
        return output.marks(params);
      },
      outputStrings: {
        marks: {
          en: 'Marks: ${dive1}, ${dive2}, ${dive3}',
          de: 'Markierungen : ${dive1}, ${dive2}, ${dive3}',
          fr: 'Marque : ${dive1}, ${dive2}, ${dive3}',
          ja: 'マーカー: ${dive1}, ${dive2}, ${dive3}',
          cn: '标记: ${dive1}, ${dive2}, ${dive3}',
          ko: '징: ${dive1}, ${dive2}, ${dive3}',
        },
        marksWide: {
          en: 'Marks: ${dive1}, ${dive2}, ${dive3} (WIDE)',
          de: 'Markierungen : ${dive1}, ${dive2}, ${dive3} (GROß)',
          fr: 'Marque : ${dive1}, ${dive2}, ${dive3} (LARGE)',
          ja: 'マーカー: ${dive1}, ${dive2}, ${dive3} (広)',
          cn: '标记: ${dive1}, ${dive2}, ${dive3} (大)',
          ko: '징: ${dive1}, ${dive2}, ${dive3} (넓음)',
        },
      },
    },
    {
      id: 'UCU Nael Dragon Dive Marker Me',
      netRegex: NetRegexes.headMarker({ id: '0014' }),
      condition: (data) => !data.trio,
      alarmText: (data, matches, output) => {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target !== data.me)
          return;
        const dir = data.naelMarks ? data.naelMarks[data.naelDiveMarkerCount] : undefined;
        if (!dir)
          return output.text({ dir: output.unknownDir() });
        return output.text({ dir: dir });
      },
      outputStrings: {
        text: {
          en: 'Go To ${dir} with marker',
          de: 'Gehe nach ${dir} mit dem Marker',
          ja: 'マーカー付いたまま${dir}へ',
          cn: '带着点名去${dir}',
          ko: '${dir}으로 이동',
        },
        unknownDir: {
          en: '???',
          de: '???',
          fr: '???',
          ja: '???',
          cn: '???',
          ko: '???',
        },
      },
    },
    {
      id: 'UCU Nael Dragon Dive Marker Others',
      netRegex: NetRegexes.headMarker({ id: '0014' }),
      condition: (data) => !data.trio,
      infoText: (data, matches, output) => {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target === data.me)
          return;
        const num = data.naelDiveMarkerCount + 1;
        return output.text({ num: num, player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Dive #${num}: ${player}',
          de: 'Sturz #${num} : ${player}',
          fr: 'Bombardement #${num} : ${player}',
          ja: 'ダイブ${num}番目:${player}',
          cn: '冲 #${num}: ${player}',
          ko: '카탈 ${num}: ${player}',
        },
      },
    },
    {
      id: 'UCU Nael Dragon Dive Marker Counter',
      netRegex: NetRegexes.headMarker({ id: '0014', capture: false }),
      condition: (data) => !data.trio,
      run: (data) => {
        data.naelDiveMarkerCount++;
      },
    },
    {
      // Octet marker tracking (77=nael, 14=dragon, 29=baha, 2A=twin)
      id: 'UCU Octet Marker Tracking',
      netRegex: NetRegexes.headMarker({ id: ['0077', '0014', '0029'] }),
      condition: (data) => data.trio === 'octet',
      run: (data, matches) => {
        data.octetMarker = data.octetMarker || [];
        data.octetMarker.push(matches.target);
        if (data.octetMarker.length !== 7)
          return;

        const partyList = Object.keys(data.partyList);

        if (partyList.length !== 8) {
          console.error('Octet error: bad party list size: ' + JSON.stringify(partyList));
          return;
        }
        const uniqDict = {};
        for (let i = 0; i < data.octetMarker.length; ++i) {
          uniqDict[data.octetMarker[i]] = true;
          if (!partyList.includes(data.octetMarker[i])) {
            console.error('Octet error: could not find ' + data.octetMarker[i] + ' in ' + JSON.stringify(partyList));
            return;
          }
        }
        const uniq = Object.keys(uniqDict);
        // If the number of unique folks who took markers is not 7, then
        // somebody has died and somebody took two.  Could be on anybody.
        if (uniq.length !== 7)
          return;

        const remainingPlayers = partyList.filter((p) => {
          return !data.octetMarker.includes(p);
        });
        if (remainingPlayers.length !== 1) {
          // This could happen if the party list wasn't unique.
          console.error('Octet error: failed to find player, ' + JSON.stringify(partyList) + ' ' + JSON.stringify(data.octetMarker));
          return;
        }

        // Finally, we found it!
        data.lastOctetMarker = remainingPlayers[0];
      },
    },
    {
      id: 'UCU Octet Nael Marker',
      netRegex: NetRegexes.headMarker({ id: '0077' }),
      condition: (data) => data.trio === 'octet',
      infoText: (data, matches, output) => {
        const num = data.octetMarker.length;
        return output.text({ num: num, player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: '${num}: ${player} (nael)',
          de: '${num}: ${player} (nael)',
          fr: '${num} : ${player} (nael)',
          ja: '${num}: ${player} (ネール)',
          cn: '${num}: ${player} (奈尔)',
          ko: '${num}: ${player} (넬)',
        },
      },
    },
    {
      id: 'UCU Octet Dragon Marker',
      netRegex: NetRegexes.headMarker({ id: '0014' }),
      condition: (data) => data.trio === 'octet',
      infoText: (data, matches, output) => {
        const num = data.octetMarker.length;
        return output.text({ num: num, player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: '${num}: ${player}',
          de: '${num}: ${player}',
          fr: '${num} : ${player}',
          ja: '${num}: ${player}',
          cn: '${num}：${player}',
          ko: '${num}: ${player}',
        },
      },
    },
    {
      id: 'UCU Octet Baha Marker',
      netRegex: NetRegexes.headMarker({ id: '0029' }),
      condition: (data) => data.trio === 'octet',
      infoText: (data, matches, output) => {
        const num = data.octetMarker.length;
        return output.text({ num: num, player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: '${num}: ${player} (baha)',
          de: '${num}: ${player} (baha)',
          fr: '${num} : ${player} (baha)',
          ja: '${num}: ${player} (バハ)',
          cn: '${num}: ${player} (巴哈)',
          ko: '${num}: ${player} (바하)',
        },
      },
    },
    {
      id: 'UCU Octet Twin Marker',
      netRegex: NetRegexes.headMarker({ id: '0029', capture: false }),
      condition: (data) => data.trio === 'octet',
      delaySeconds: 0.5,
      alarmText: (data, _matches, output) => {
        if (data.lastOctetMarker === data.me)
          return output.twinOnYou();
      },
      infoText: (data, _matches, output) => {
        if (!data.lastOctetMarker)
          return output.twinOnUnknown();

        // If this person is not alive, then everybody should stack,
        // but tracking whether folks are alive or not is a mess.
        if (data.lastOctetMarker !== data.me)
          return output.twinOnPlayer({ player: data.ShortName(data.lastOctetMarker) });
      },
      tts: (data, _matches, output) => {
        if (!data.lastOctetMarker || data.lastOctetMarker === data.me)
          return output.stackTTS();
      },
      outputStrings: {
        twinOnYou: {
          en: 'YOU Stack for Twin',
          de: 'DU stackst für Twintania',
          fr: 'VOUS devez appâter Gémellia',
          ja: '自分にタニアには頭割り',
          cn: '双塔集合',
          ko: '내가 트윈징 대상자',
        },
        twinOnPlayer: {
          en: '8: ${player} (twin)',
          de: '8: ${player} (Twintania)',
          fr: '8 : ${player} (Gémellia)',
          ja: '8: ${player} (ツインタニア)',
          cn: '8: ${player} (双塔)',
          ko: '8: ${player} (트윈타니아)',
        },
        twinOnUnknown: {
          en: '8: ??? (twin)',
          de: '8: ??? (Twintania)',
          fr: '8 : ??? (Gémellia)',
          ja: '8: ??? (ツインタニア)',
          cn: '8: ??? (双塔)',
          ko: '8: ??? (트윈타니아)',
        },
        stackTTS: {
          en: 'stack for twin',
          de: 'stek für twintania',
          fr: 'Se rassembler pour appâter Gémellia',
          ja: '頭割り',
          cn: '双塔集合',
          ko: '트윈타니아 옆에 서기',
        },
      },
    },
    {
      id: 'UCU Twister Dives',
      netRegex: NetRegexes.ability({ source: 'Twintania', id: '26B2', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Twintania', id: '26B2', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Gémellia', id: '26B2', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ツインタニア', id: '26B2', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '双塔尼亚', id: '26B2', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '트윈타니아', id: '26B2', capture: false }),
      suppressSeconds: 2,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Twisters',
          de: 'Wirbelstürme',
          fr: 'Tornades',
          ja: 'ツイスター',
          cn: '旋风冲',
          ko: '회오리',
        },
      },
    },
    {
      id: 'UCU Bahamut Gigaflare',
      netRegex: NetRegexes.startsUsing({ id: '26D6', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26D6', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26D6', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26D6', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26D6', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26D6', source: '바하무트 프라임', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Gigaflare',
          de: 'Gigaflare',
          fr: 'GigaBrasier',
          ja: 'ギガフレア',
          cn: '十亿核爆',
          ko: '기가플레어',
        },
      },
    },
    {
      id: 'UCU Megaflare Stack Me',
      netRegex: NetRegexes.headMarker({ id: '0027' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Megaflare Stack',
          de: 'Megaflare Stack',
          fr: 'MegaBrasier rassemblement',
          ja: 'メガフレア頭割り',
          cn: '百万核爆集合',
          ko: '기가플레어 쉐어',
        },
      },
    },
    {
      id: 'UCU Megaflare Stack Tracking',
      netRegex: NetRegexes.headMarker({ id: '0027' }),
      run: (data, matches) => {
        data.megaStack.push(matches.target);
      },
    },
    {
      id: 'UCU Megaflare Tower',
      netRegex: NetRegexes.headMarker({ id: '0027', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.trio !== 'blackfire' && data.trio !== 'octet' || data.megaStack.length !== 4)
          return;

        if (data.megaStack.includes(data.me))
          return;

        if (data.trio === 'blackfire')
          return output.blackfireTower();

        if (!data.lastOctetMarker || data.lastOctetMarker === data.me)
          return output.octetTowerPlusTwin();

        return output.octetTower();
      },
      tts: (data, _matches, output) => {
        if (data.trio !== 'blackfire' && data.trio !== 'octet' || data.megaStack.length !== 4)
          return;

        if (!data.megaStack.includes(data.me))
          return output.towerTTS();
      },
      outputStrings: {
        blackfireTower: {
          en: 'Tower, bait hypernova',
          de: 'Turm, Hypernova ködern',
          fr: 'Tour, attirez Supernova',
          ja: 'タワーやスーパーノヴァ',
          cn: '踩塔, 引导超新星',
          ko: '초신성 피하고 기둥 밟기',
        },
        octetTowerPlusTwin: {
          en: 'Bait Twin, then tower',
          de: 'Twintania in Turm locken',
          fr: 'Attirez Gémellia, puis tour',
          ja: 'タニアダイブやタワー',
          cn: '引导双塔, 踩塔',
          ko: '트윈타니아 유도 후 기둥 밟기',
        },
        octetTower: {
          en: 'Get in a far tower',
          de: 'Geh in entfernten Turm',
          fr: 'Aller dans une tour lointaine',
          ja: '遠いタワー',
          cn: '踩远处的塔',
          ko: '기둥 밟기',
        },
        towerTTS: {
          en: 'tower',
          de: 'Turm',
          fr: 'Tour',
          ja: 'タワー',
          cn: '塔',
          ko: '기둥',
        },
      },
    },
    {
      id: 'UCU Megaflare Twin Tower',
      netRegex: NetRegexes.headMarker({ id: '0027', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.trio !== 'blackfire' && data.trio !== 'octet' || data.megaStack.length !== 4)
          return;
        if (!data.lastOctetMarker || data.lastOctetMarker === data.me)
          return;

        const twin = data.ShortName(data.lastOctetMarker);
        if (data.megaStack.includes(data.lastOctetMarker))
          return output.twinHasMegaflare({ player: twin });
        return output.twinHasTower({ player: twin });
      },
      tts: null,
      outputStrings: {
        twinHasMegaflare: {
          en: '${player} (twin) has megaflare',
          de: '${player} (Twin) hat Megaflare',
          ja: '${player} (ツインタニア) メガ頭割り',
          cn: '${player} (双塔) 分摊点名',
          ko: '${player} (트윈 징 대상자) => 쉐어',
        },
        twinHasTower: {
          en: '${player} (twin) needs tower',
          de: '${player} (Twin) braucht einen Turm',
          ja: '${player} (ツインタニア) 塔を踏む',
          cn: '${player} (双塔) 需要踩塔',
          ko: '${player} (트윈 징 대상자) => 기둥',
        },
      },
    },
    {
      id: 'UCU Earthshaker Me',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker('alarm'),
    },
    {
      id: 'UCU Earthshaker Tracking',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      run: (data, matches) => {
        data.shakers.push(matches.target);
      },
    },
    {
      id: 'UCU Earthshaker Not Me',
      netRegex: NetRegexes.headMarker({ id: '0028', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.trio !== 'quickmarch')
          return;
        if (data.shakers.length !== 3)
          return;
        if (data.role === 'tank')
          return output.quickmarchTankTether();
      },
      infoText: (data, _matches, output) => {
        if (data.trio === 'quickmarch') {
          if (data.shakers.length !== 3)
            return;
          if (!data.shakers.includes(data.me) && data.role !== 'tank')
            return output.quickmarchNotOnYou();
        } else if (data.trio === 'tenstrike') {
          if (data.shakers.length === 4 && !data.shakers.includes(data.me))
            return output.tenstrikeNotOnYou();
        }
      },
      run: (data) => {
        if (data.trio === 'tenstrike' && data.shakers.length === 4)
          data.shakers = [];
      },
      outputStrings: {
        quickmarchTankTether: {
          en: 'Pick up tether',
          de: 'Verbindung holen',
          fr: 'Prendre un lien',
          ja: 'テンペストウィング線',
          cn: '接线',
          ko: '줄 가로채기',
        },
        quickmarchNotOnYou: {
          en: 'No shaker; stack south.',
          de: 'Kein Erdstoß; im süden sammeln',
          fr: 'Pas de Secousse; se rassembler au Sud.',
          ja: 'シェイカーない；頭割りで南',
          cn: '无点名，南侧集合',
          ko: '징 없음, 모여서 쉐어',
        },
        tenstrikeNotOnYou: {
          en: 'Stack on safe spot',
          de: 'In Sicherheit steken',
          fr: 'Se rassembler au point sauf',
          ja: '頭割りで安全',
          cn: '安全点集合',
          ko: '안전장소에 모이기',
        },
      },
    },
    {
      id: 'UCU Morn Afah',
      netRegex: NetRegexes.startsUsing({ id: '26EC', source: 'Bahamut Prime' }),
      netRegexDe: NetRegexes.startsUsing({ id: '26EC', source: 'Prim-Bahamut' }),
      netRegexFr: NetRegexes.startsUsing({ id: '26EC', source: 'Primo-Bahamut' }),
      netRegexJa: NetRegexes.startsUsing({ id: '26EC', source: 'バハムート・プライム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '26EC', source: '至尊巴哈姆特' }),
      netRegexKo: NetRegexes.startsUsing({ id: '26EC', source: '바하무트 프라임' }),
      preRun: (data) => {
        data.mornAfahCount = data.mornAfahCount || 0;
        data.mornAfahCount++;
      },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.mornAfahYou({ num: data.mornAfahCount });
        return output.mornAfahPlayer({
          num: data.mornAfahCount,
          player: data.ShortName(matches.target),
        });
      },
      outputStrings: {
        mornAfahYou: {
          en: 'Morn Afah #${num} (YOU)',
          de: 'Morn Afah #${num} (DU)',
          fr: 'Morn Afah #${num} (VOUS)',
          ja: 'モーン・アファー${num}回 (自分)',
          cn: '无尽顿悟 #${num}',
          ko: '몬 아파 ${num} (나에게)',
        },
        mornAfahPlayer: {
          en: 'Morn Afah #${num} (${player})',
          de: 'Morn Afah #${num} (${player})',
          fr: 'Morn Afah #${num} (${player})',
          ja: 'モーン・アファー${num}回 (${player})',
          cn: '无尽顿悟 #${num} (${player})',
          ko: '몬 아파 ${num} (${player})',
        },
      },
    },
    {
      id: 'UCU Akh Morn',
      netRegex: NetRegexes.startsUsing({ id: '26EA', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26EA', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26EA', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26EA', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26EA', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26EA', source: '바하무트 프라임', capture: false }),
      preRun: (data) => {
        data.akhMornCount = data.akhMornCount || 0;
        data.akhMornCount++;
      },
      infoText: (data, _matches, output) => output.text({ num: data.akhMornCount }),
      outputStrings: {
        text: {
          en: 'Akh Morn #${num}',
          de: 'Akh Morn #${num}',
          ja: 'アク・モーン #${num}',
          cn: '死亡轮回 #${num}',
          ko: '아크 몬 ${num}',
        },
      },
    },
    {
      id: 'UCU Exaflare',
      netRegex: NetRegexes.startsUsing({ id: '26EF', source: 'Bahamut Prime', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26EF', source: 'Prim-Bahamut', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26EF', source: 'Primo-Bahamut', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26EF', source: 'バハムート・プライム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26EF', source: '至尊巴哈姆特', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26EF', source: '바하무트 프라임', capture: false }),
      preRun: (data) => {
        data.exaflareCount = data.exaflareCount || 0;
        data.exaflareCount++;
      },
      infoText: (data, _matches, output) => output.text({ num: data.exaflareCount }),
      outputStrings: {
        text: {
          en: 'Exaflare #${num}',
          de: 'Exaflare #${num}',
          fr: 'ExaBrasier #${num}',
          ja: 'エクサフレア${num}回',
          cn: '百京核爆 #${num}',
          ko: '엑사플레어 ${num}',
        },
      },
    },
    {
      // One time setup.
      id: 'UCU Initial Setup',
      netRegex: NetRegexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '26AA', source: 'Twintania', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '26AA', source: 'Gémellia', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '26AA', source: 'ツインタニア', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '26AA', source: '双塔尼亚', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '26AA', source: '트윈타니아', capture: false }),
      suppressSeconds: 99999,
      run: (data) => {
        // TODO: a late white puddle can cause dragons to get seen for the next
        // phase so clear them again here.  Probably data for triggers needs
        // to be cleared at more reliable times.
        delete data.naelDragons;
        delete data.seenDragon;
        delete data.naelMarks;
        delete data.wideThirdDive;
        delete data.unsafeThirdMark;

        data.naelFireballCount = 0;
        data.fireballs = {
          1: [],
          2: [],
          3: [],
          4: [],
        };

        data.resetTrio = (trio) => {
          data.trio = trio;
          data.shakers = [];
          data.megaStack = [];
        };

        // Begin copy and paste from dragon_test.js.
        const modDistance = (mark, dragon) => {
          const oneWay = (dragon - mark + 8) % 8;
          const otherWay = (mark - dragon + 8) % 8;
          const distance = Math.min(oneWay, otherWay);
          console.assert(distance >= 0);
          return distance;
        };

        const badSpots = (mark, dragon) => {
          // All spots between mark and dragon are bad.  If distance == 1,
          // then the dragon hits the spot behind the mark too.  e.g. N
          // mark, NE dragon will also hit NW.
          const bad = [];
          const distance = modDistance(mark, dragon);
          console.assert(distance > 0);
          console.assert(distance <= 2);
          if ((mark + distance + 8) % 8 === dragon) {
            // Clockwise.
            for (let i = 0; i <= distance; ++i)
              bad.push((mark + i) % 8);
            if (distance === 1)
              bad.push((mark - 1 + 8) % 8);
          } else {
            // Widdershins.
            for (let i = 0; i <= distance; ++i)
              bad.push((mark - i + 8) % 8);
            if (distance === 1)
              bad.push((mark + 1) % 8);
          }
          return bad;
        };

        const findDragonMarks = (array) => {
          const marks = [-1, -1, -1];
          const ret = {
            // Third drive is on a dragon three squares away and will cover
            // more of the middle than usual, e.g. SE dragon, SW dragon,
            // mark W (because S is unsafe from 2nd dive).
            wideThirdDive: false,
            // Third mark spot is covered by the first dive so needs to be
            // patient.  Third mark should always be patient, but you never
            // know.
            unsafeThirdMark: false,
            marks: ['error', 'error', 'error'],
          };

          const dragons = [];
          for (let i = 0; i < 8; ++i) {
            if (array[i])
              dragons.push(i);
          }

          if (dragons.length !== 5)
            return ret;

          // MARK 1: counterclockwise of #1 if adjacent, clockwise if not.
          if (dragons[0] + 1 === dragons[1]) {
            // If the first two dragons are adjacent, they *must* go CCW.
            // In the scenario of N, NE, SE, S, W dragons, the first marker
            // could be E, but that forces the second mark to be S (instead
            // of E), making SW unsafe for putting the mark between S and W.
            // Arguably, NW could be used here for the third mark, but then
            // the S dragon would cut off more of the middle of the arena
            // than desired.  This still could happen anyway in the
            // "tricksy" edge case below, but should be avoided if possible.
            marks[0] = (dragons[0] - 1 + 8) % 8;
          } else {
            // Split dragons.  Bias towards first dragon.
            marks[0] = Math.floor((dragons[0] + dragons[1]) / 2);
          }

          // MARK 2: go counterclockwise, unless dragon 2 is adjacent to 3.
          if (dragons[1] === dragons[2] - 1) {
            // Go clockwise.
            marks[1] = dragons[2] + 1;
          } else {
            // Go counterclockwise.
            marks[1] = dragons[2] - 1;
          }

          // MARK 3: if split, between 4 & 5.  If adjacent, clockwise of 5.
          if (dragons[3] + 1 === dragons[4]) {
            // Adjacent dragons.
            // Clockwise is always ok.
            marks[2] = (dragons[4] + 1) % 8;

            // Minor optimization:
            // See if counterclockwise is an option to avoid having mark 3
            // in a place that the first pair covers.
            //
            // If dragon 3 is going counterclockwise, then only need one
            // hole between #3 and #4, otherwise need all three holes.
            // e.g. N, NE, E, W, NW dragon pattern should prefer third
            // mark SW instead of N.
            const distance = marks[1] === dragons[2] - 1 ? 2 : 4;
            if (dragons[3] >= dragons[2] + distance)
              marks[2] = dragons[3] - 1;
          } else {
            // Split dragons.  Common case: bias towards last dragon, in case
            // 2nd charge is going towards this pair.
            marks[2] = Math.ceil((dragons[3] + dragons[4]) / 2);
            if (marks[1] === dragons[3] && marks[2] === marks[1] + 1) {
              // Tricksy edge case, e.g. N, NE, E, SE, SW.  S not safe for
              // third mark because second mark is at SE, and E dragon will
              // clip S.  Send all dragons CW even if this means eating more
              // arena space.
              marks[2] = (dragons[4] + 1) % 8;
              ret.wideThirdDive = true;
            }
          }

          const bad = badSpots(marks[0], dragons[0]);
          bad.concat(badSpots(marks[0], dragons[1]));
          ret.unsafeThirdMark = bad.includes(marks[2]);

          ret.marks = marks;
          return ret;
        };
        // End copy and paste.

        data.findDragonMarks = findDragonMarks;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bahamut Prime': 'Prim-Bahamut',
        'Fang of Light': 'Lichtklaue',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Deus Darnus': 'Nael deus Darnus',
        'Nael Geminus': 'Nael Geminus',
        'Ragnarok': 'Ragnarök',
        'Tail of Darkness': 'Dunkelschweif',
        'Thunderwing': 'Donnerschwinge',
        'Twintania': 'Twintania',
        'From on high I descend, the hallowed moon to call': 'Seht, ich steige herab, vom rotglühenden Monde',
        'From on high I descend, the iron path to walk': 'Seht, ich steige herab, um euch zu beherrschen',
        'Take fire, O hallowed moon': 'Flammender Pfad, geschaffen vom roten Mond',
        'Blazing path, lead me to iron rule': 'Umloderter Pfad, führe mich zur Herrschaft',
        'O hallowed moon, take fire and scorch my foes': 'O roter Mond! Umlodere meinen Pfad',
        'O hallowed moon, shine you the iron path': 'O roter Mond! Führe mich zur Herrschaft',
        'Fleeting light! \'Neath the red moon, scorch you the earth': 'Neues Gestirn! Glühe herab und umlodere meinen Pfad',
        'Fleeting light! Amid a rain of stars, exalt you the red moon': 'Neues Gestirn! Überstrahle jede Sternschnuppe',
        'From on high I descend, the moon and stars to bring': 'Ich steige herab zu Ehre des roten Mondes! Einer Sternschnuppe gleich',
        'From hallowed moon I descend, a rain of stars to bring': 'O roter Mond, sieh mich herabsteigen! Einer Sternschnuppe gleich',
        'From hallowed moon I bare iron, in my descent to wield': 'O roter Mond, als Künder deiner Herrschaft stieg ich herab',
        'From hallowed moon I descend, upon burning earth to tread': 'O roter Mond! Ich stieg herab, um deine Herrschaft zu bringen',
        'Unbending iron, take fire and descend': 'Zur Herrschaft führt mein umloderter Pfad! Auf diesen steige ich herab',
        'Unbending iron, descend with fiery edge': 'Zur Herrschaft steige ich herab, auf umlodertem Pfad',
      },
      'replaceText': {
        '--push--': '--stoß--',
        'Aetheric Profusion': 'Ätherische Profusion',
        'Akh Morn': 'Akh Morn',
        'Bahamut Marker': 'Bahamut Marker',
        'Bahamut\'s Claw': 'Klauen Bahamuts',
        'Bahamut\'s Favor': 'Bahamuts Segen',
        'Blackfire Trio': 'Schwarzfeuer-Trio',
        'Calamitous Blaze': 'Katastrophale Lohe',
        'Calamitous Flame': 'Katastrophale Flammen',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Death Sentence': 'Todesurteil',
        'Dive . Dynamo/Chariot': 'Sturzflug + Dynamo/Streitwagen',
        'Dive Dynamo Combo': 'Sturzflug Dynamo Kombo',
        'Doom': 'Verhängnis',
        'Dynamo . Beam/Chariot': 'Dynamo + Strahl/Streitwagen',
        'Earth Shaker': 'Erdstoß',
        'Exaflare': 'Exaflare',
        'Fellruin Trio': 'Untergangs-Trio',
        'Fireball(?! Soak)': 'Feuerball',
        'Flames Of Rebirth': 'Flammen der Wiedergeburt',
        'Flare Breath': 'Flare-Atem',
        'Flatten': 'Einebnen',
        'Generate': 'Formung',
        'Gigaflare': 'Gigaflare',
        'Grand Octet': 'Großes Oktett',
        'Heavensfall Trio': 'Himmelssturz-Trio',
        'Heavensfall(?! )': 'Himmelssturz',
        'Hypernova': 'Supernova',
        'Liquid Hell': 'Höllenschmelze',
        'Lunar Dive': 'Lunarer Sturz',
        '(?<! )Marker(?!\\w)': 'Marker',
        'Megaflare(?! Dive)': 'Megaflare',
        'Megaflare Dive': 'Megaflare-Sturz',
        'Meteor Stream': 'Meteorflug',
        'Meteor/Dive or Dive/Beam': 'Meteor/Sturzflug oder Sturzflug/Strahl',
        'Morn Afah': 'Morn Afah',
        'Nael Marker': 'Nael Marker',
        'Pepperoni': 'Salami',
        'Plummet(?!\/)': 'Herabstürzen',
        'Quickmarch Trio': 'Todesmarsch-Trio',
        'Random Combo Attack': 'Zufälliger Komboangriff',
        '(?<!\/)Ravensbeak': 'Bradamante',
        'Seventh Umbral Era': 'Siebte Ära des Schattens',
        'Spread': 'Verteilen',
        'Stack': 'Sammeln',
        'Targeted Fire': 'Feuer auf Ziel',
        'Tempest Wing': 'Sturm-Schwinge',
        'Tenstrike Trio': 'Zehnschlag-Trio',
        'Teraflare': 'Teraflare',
        'Thermionic . Dynamo/Chariot': 'Thermo + Dynamo/Streitwagen',
        'Thermionic Beam': 'Thermionischer Strahl',
        'Thermionic Burst': 'Thermionische Eruption',
        'Towers': 'Türme',
        'Triple Nael Quote': 'Drei Nael Zitate',
        'Twin Marker': 'Twin Marker',
        'Twister': 'Wirbelsturm',
        'Twisting Dive': 'Spiralschwinge',
        'Wings of Salvation': 'Rettende Schwinge',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Bahamut Prime': 'Primo-Bahamut',
        'Fang of Light': 'croc de lumière',
        'Firehorn': 'corne-de-feu',
        'Iceclaw': 'griffe-de-glace',
        'Nael Deus Darnus': 'Nael deus Darnus',
        'Nael Geminus': 'Nael Geminus',
        'Ragnarok': 'Ragnarok',
        'Tail of Darkness': 'queue de ténèbres',
        'Thunderwing': 'aile-de-foudre',
        'Twintania': 'Gémellia',
      },
      'replaceText': {
        '--push--': '--Poussé(e)--',
        'Aetheric Profusion': 'Excès d\'éther',
        'Akh Morn': 'Akh Morn',
        'Bahamut Marker': 'Marqueur de Bahamut',
        'Bahamut\'s Claw': 'Griffe de Bahamut',
        'Bahamut\'s Favor': 'Auspice du dragon',
        'Blackfire Trio': 'Trio des flammes noires',
        'Calamitous Blaze': 'Brasier du Fléau',
        'Calamitous Flame': 'Flammes du Fléau',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Dalamud Dive': 'Chute de Dalamud',
        'Death Sentence': 'Peine de mort',
        'Dive . Dynamo/Chariot': 'Plongeon + Dynamo/Char',
        'Dive Dynamo Combo': 'Plongeon Dynamo Combo',
        'Doom': 'Glas',
        'Dynamo . Beam/Chariot': 'Dynamo + Rayon/Char',
        'Earth Shaker': 'Secousse',
        'Exaflare': 'ExaBrasier',
        'Fellruin Trio': 'Trio du désastre',
        'Fireball(?! Soak)': 'Boule de feu',
        'Flames Of Rebirth': 'Feu résurrecteur',
        'Flare Breath': 'Souffle brasier',
        'Flatten': 'Compression',
        'Generate': 'Synthèse de mana',
        'Gigaflare': 'GigaBrasier',
        'Grand Octet': 'Octuors des dragons',
        'Heavensfall Trio': 'Trio de l\'univers',
        'Heavensfall(?! )': 'Destruction Universelle',
        'Hypernova': 'Hypernova',
        'Liquid Hell': 'Enfer liquide',
        'Lunar Dive': 'Plongeon lunaire',
        '(?<! )Marker(?!\\w)': 'Marqueur',
        'Megaflare(?! Dive)': 'MégaBrasier',
        'Megaflare Dive': 'Plongeon MégaBrasier',
        'Meteor Stream': 'Rayon météore',
        'Meteor/Dive or Dive/Beam': 'Météore/Plongeon ou Plongeon/Rayon',
        'Morn Afah': 'Morn Afah',
        'Nael Marker': 'Marqueur de Nael',
        'Pepperoni': 'Zones au sol',
        'Plummet(?!\/)': 'Piqué',
        'Quickmarch Trio': 'Trio de la marche militaire',
        'Random Combo Attack': 'Attaque combo aléatoire',
        '(?<!\/)Ravensbeak': 'Bec du rapace',
        'Seventh Umbral Era': '7e fléau',
        'Spread': 'Se disperser',
        'Stack': 'Se rassembler',
        'Targeted Fire': 'Feu ciblé',
        'Tempest Wing': 'Aile de tempête',
        'Tenstrike Trio': 'Trio des attaques',
        'Teraflare': 'TéraBrasier',
        'Thermionic . Dynamo/Chariot': 'Rayon + Dynamo/Char',
        'Thermionic Beam': 'Rayon thermoïonique',
        'Thermionic Burst': 'Rafale thermoïonique',
        'Towers': 'Tours',
        'Triple Nael Quote': 'Triple citation de Nael',
        'Twin Marker': 'Marqueur de Gémellia',
        'Twister': 'Grande trombe',
        'Twisting Dive': 'Plongeon-trombe',
        'Wings of Salvation': 'Aile de la salvation',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'Fang of Light': 'ライトファング',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Deus Darnus': 'ネール・デウス・ダーナス',
        'Nael Geminus': 'ネール・ジェミナス',
        'Ragnarok': 'ラグナロク',
        'Tail of Darkness': 'ダークテイル',
        'Thunderwing': 'サンダーウィング',
        'Twintania': 'ツインタニア',
      },
      'replaceText': {
        '--push--': '--フェイス切替--',
        'Aetheric Profusion': 'エーテリックプロフュージョン',
        'Akh Morn': 'アク・モーン',
        'Bahamut Marker': 'バハムート マーク',
        'Bahamut\'s Claw': 'バハムートクロウ',
        'Bahamut\'s Favor': '龍神の加護',
        'Blackfire Trio': '黒炎の三重奏',
        'Calamitous Blaze': '災いの焔',
        'Calamitous Flame': '災いの炎',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Death Sentence': 'デスセンテンス',
        'Dive . Dynamo/Chariot': 'ダイブ + ダイナモ/チャリオット',
        'Dive Dynamo Combo': 'ダイブ ダイナモ コンボ',
        'Doom': '死の宣告',
        'Dynamo . Beam/Chariot': 'ダイナモ + ビーム/チャリオット',
        'Earth Shaker': 'アースシェイカー',
        'Exaflare': 'エクサフレア',
        'Fellruin Trio': '厄災の三重奏',
        'Fireball(?! Soak)': 'ファイアボール',
        'Flames Of Rebirth': '転生の炎',
        'Flare Breath': 'フレアブレス',
        'Flatten': 'フラッテン',
        'Generate': '魔力錬成',
        'Gigaflare': 'ギガフレア',
        'Grand Octet': '群竜の八重奏',
        'Heavensfall Trio': '天地の三重奏',
        'Heavensfall(?! )': '天地崩壊',
        'Hypernova': 'スーパーノヴァ',
        'Liquid Hell': 'ヘルリキッド',
        'Lunar Dive': 'ルナダイブ',
        '(?<! )Marker(?!\\w)': 'マーク',
        'Megaflare(?! Dive)': 'メガフレア',
        'Megaflare Dive': 'メガフレアダイブ',
        'Meteor Stream': 'メテオストリーム',
        'Meteor/Dive or Dive/Beam': 'メテオ/ダイブ や ダイブ/ビーム',
        'Morn Afah': 'モーン・アファー',
        'Nael Marker': 'ネール マーク',
        'Pepperoni': '輪',
        'Plummet(?!\/)': 'プラメット',
        'Quickmarch Trio': '進軍の三重奏',
        'Random Combo Attack': 'ランダムコンボ',
        '(?<!\/)Ravensbeak': 'レイヴェンズビーク',
        'Seventh Umbral Era': '第七霊災',
        'Spread': '散開',
        'Stack': '集合',
        'Targeted Fire': 'タゲしたファイヤ',
        'Tempest Wing': 'テンペストウィング',
        'Tenstrike Trio': '連撃の三重奏',
        'Teraflare': 'テラフレア',
        'Thermionic . Dynamo/Chariot': 'サーミオニック + ダイナモ/チャリオット',
        'Thermionic Beam': 'サーミオニックビーム',
        'Thermionic Burst': 'サーミオニックバースト',
        'Towers': '塔',
        'Triple Nael Quote': '三体の黒玉',
        'Twin Marker': 'Twin Marker',
        'Twister': 'ツイスター',
        'Twisting Dive': 'ツイスターダイブ',
        'Wings of Salvation': 'サルヴェーションウィング',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bahamut Prime': '至尊巴哈姆特',
        'Fang of Light': '光牙',
        'Firehorn': '火角',
        'Iceclaw': '冰爪',
        'Nael Deus Darnus': '奈尔·神·达纳斯',
        'Nael Geminus': '奈尔双生子',
        'Ragnarok': '诸神黄昏',
        'Tail of Darkness': '暗尾',
        'Thunderwing': '雷翼',
        'Twintania': '双塔尼亚',
        'From on high I descend, the hallowed moon to call': '我降临于此，对月长啸！',
        'From on high I descend, the iron path to walk': '我降临于此，征战铁血霸道！',
        'Take fire, O hallowed moon': '炽热燃烧！给予我月亮的祝福！',
        'Blazing path, lead me to iron rule': '被炽热灼烧过的轨迹乃成铁血霸道！',
        'O hallowed moon, take fire and scorch my foes': '月光啊！用你的炽热烧尽敌人！',
        'O hallowed moon, shine you the iron path': '月光啊！照亮铁血霸道！',
        'Fleeting light! \'Neath the red moon, scorch you the earth': '超新星啊，更加闪耀吧！照亮红月下炽热之地！',
        'Fleeting light! Amid a rain of stars, exalt you the red moon': '超新星啊，更加闪耀吧！在星降之夜，称赞红月！',
        'From on high I descend, the moon and stars to bring': '我降临于此对月长啸！召唤星降之夜！',
        'From hallowed moon I descend, a rain of stars to bring': '我自月而来降临于此，召唤星降之夜！',
        'From hallowed moon I bare iron, in my descent to wield': '我自月而来携钢铁降临于此！',
        'From hallowed moon I descend, upon burning earth to tread': '我自月而来降临于此，踏过炽热之地！',
        'Unbending iron, take fire and descend': '钢铁燃烧吧！成为我降临于此的刀剑吧！',
        'Unbending iron, descend with fiery edge': '钢铁成为我降临于此的燃烧之剑！',
      },
      'replaceText': {
        '--push--': '--开怪--',
        'Aetheric Profusion': '以太失控',
        'Akh Morn': '死亡轮回',
        'Bahamut Marker': '巴哈标记',
        'Bahamut\'s Claw': '巴哈姆特之爪',
        'Bahamut\'s Favor': '龙神的加护',
        'Blackfire Trio': '黑炎的三重奏',
        'Calamitous Blaze': '灵灾之焰',
        'Calamitous Flame': '灵灾之炎',
        'Cauterize': '低温俯冲',
        'Chain Lightning': '雷光链',
        'Dalamud Dive': '月华冲',
        'Death Sentence': '死刑',
        'Dive . Dynamo/Chariot': '冲 + 月环/钢铁',
        'Dive Dynamo Combo': '冲月环连招',
        'Doom': '死亡宣告',
        'Dynamo . Beam/Chariot': '月环 + 光束/钢铁',
        'Earth Shaker': '大地摇动',
        'Exaflare': '百京核爆',
        'Fellruin Trio': '灾厄的三重奏',
        'Fireball(?! Soak)': '火球',
        'Flames Of Rebirth': '转生之炎',
        'Flare Breath': '核爆吐息',
        'Flatten': '夷为平地',
        'Generate': '魔力炼成',
        'Gigaflare': '十亿核爆',
        'Grand Octet': '群龙的八重奏',
        'Heavensfall Trio': '天地的三重奏',
        'Heavensfall(?! )': '天崩地裂',
        'Hypernova': '超新星',
        'Liquid Hell': '液体地狱',
        'Lunar Dive': '月流冲',
        '(?<! )Marker(?!\\w)': '标记',
        'Megaflare(?! Dive)': '百万核爆',
        'Megaflare Dive': '百万核爆冲',
        'Meteor Stream': '陨石流',
        'Meteor/Dive or Dive/Beam': '陨石/冲 或 冲/光束',
        'Morn Afah': '无尽顿悟',
        'Nael Marker': '奈尔标记',
        'Pepperoni': '大圈',
        'Plummet(?!\/)': '垂直下落',
        'Quickmarch Trio': '进军的三重奏',
        'Random Combo Attack': '随机连招',
        '(?<!\/)Ravensbeak': '凶鸟尖喙',
        'Seventh Umbral Era': '第七灵灾',
        'Spread': '分散',
        'Stack': '集合',
        'Targeted Fire': '火球点名',
        'Tempest Wing': '风暴之翼',
        'Tenstrike Trio': '连击的三重奏',
        'Teraflare': '万亿核爆',
        'Thermionic . Dynamo/Chariot': '离子 + 月环/钢铁',
        'Thermionic Beam': '热离子光束',
        'Thermionic Burst': '热离子爆发',
        'Towers': '塔',
        'Triple Nael Quote': '三黑球',
        'Twin Marker': '双塔标记',
        'Twister': '旋风',
        'Twisting Dive': '旋风冲',
        'Wings of Salvation': '救世之翼',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Bahamut Prime': '바하무트 프라임',
        'Fang of Light': '빛의 송곳니',
        'Firehorn': '화염뿔',
        'Iceclaw': '얼음발톱',
        'Nael Deus Darnus': '넬 데우스 다르누스',
        'Nael Geminus': '넬 게미누스',
        'Ragnarok': '라그나로크',
        'Tail of Darkness': '어둠의 꼬리',
        'Thunderwing': '번개날개',
        'Twintania': '트윈타니아',
      },
      'replaceText': {
        '--push--': '--최소 RDPS컷--',
        'Aetheric Profusion': '에테르 홍수',
        'Akh Morn': '아크 몬',
        'Bahamut Marker': '바하무트 징',
        'Bahamut\'s Claw': '바하무트의 발톱',
        'Bahamut\'s Favor': '용신의 가호',
        'Blackfire Trio': '흑염의 3중주',
        'Calamitous Blaze': '재앙의 화염',
        'Calamitous Flame': '재앙의 불꽃',
        'Cauterize': '인두질',
        'Chain Lightning': '번개 사슬',
        'Dalamud Dive': '달라가브 강하',
        'Death Sentence': '사형 선고',
        'Dive . Dynamo/Chariot': '강하 + 달/강철',
        'Dive Dynamo Combo': '강하 달 콤보',
        'Doom': '죽음의 선고',
        'Dynamo . Beam/Chariot': '달 + 광선/강철',
        'Earth Shaker': '요동치는 대지',
        'Exaflare': '엑사플레어',
        'Fellruin Trio': '재앙의 3중주',
        'Fireball(?! Soak)': '화염구',
        'Flames Of Rebirth': '윤회의 불꽃',
        'Flare Breath': '타오르는 숨결',
        'Flatten': '짓뭉개기',
        'Generate': '마력 연성',
        'Gigaflare': '기가플레어',
        'Grand Octet': '용들의 8중주',
        'Heavensfall Trio': '천지의 3중주',
        'Heavensfall(?! )': '천지붕괴(?! )',
        'Hypernova': '초신성',
        'Liquid Hell': '지옥의 늪',
        'Lunar Dive': '달 강하',
        '(?<! )Marker(?!\\w)': '징',
        'Megaflare(?! Dive)': '메가플레어',
        'Megaflare Dive': '메가플레어 다이브',
        'Meteor Stream': '유성 폭풍',
        'Meteor/Dive or Dive/Beam': '유성/강하 or 강하/광선',
        'Morn Afah': '몬 아파',
        'Nael Marker': '넬 징',
        'Pepperoni': '메가플레어 장판',
        'Plummet(?!\/)': '곤두박질',
        'Quickmarch Trio': '진군의 3중주',
        'Random Combo Attack': '랜덤 콤보 공격',
        '(?<!\/)Ravensbeak': '흉조의 부리',
        'Seventh Umbral Era': '제7재해',
        'Spread': '산개',
        'Stack': '모이기',
        'Targeted Fire': '대상자 화염구',
        'Tempest Wing': '폭풍우 날개',
        'Tenstrike Trio': '연격의 3중주',
        'Teraflare': '테라플레어',
        'Thermionic . Dynamo/Chariot': '열전자 + 달/강철',
        'Thermionic Beam': '열전자 광선',
        'Thermionic Burst': '열전자 폭발',
        'Towers': '기둥',
        'Triple Nael Quote': '넬 3회 대사',
        'Twin Marker': '트윈 징',
        'Twister': '회오리',
        'Twisting Dive': '회오리 강하',
        'Wings of Salvation': '구원의 날개',
      },
    },
  ],
};
