import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Regexes from '../../../../../resources/regexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

const diveDirections = {
  unknown: {
    en: '?',
    de: '?',
    fr: '?',
    ja: '?',
    cn: '?',
    ko: '?',
  },
  north: {
    en: 'N',
    de: 'N',
    fr: 'N',
    ja: '北',
    cn: '北',
    ko: '북',
  },
  northeast: {
    en: 'NE',
    de: 'NO',
    fr: 'NE',
    ja: '北東',
    cn: '东北',
    ko: '북동',
  },
  east: {
    en: 'E',
    de: 'O',
    fr: 'E',
    ja: '東',
    cn: '东',
    ko: '동',
  },
  southeast: {
    en: 'SE',
    de: 'SO',
    fr: 'SE',
    ja: '東南',
    cn: '南東',
    ko: '남동',
  },
  south: {
    en: 'S',
    de: 'S',
    fr: 'S',
    ja: '南',
    cn: '南',
    ko: '남',
  },
  southwest: {
    en: 'SW',
    de: 'SW',
    fr: 'SO',
    ja: '南西',
    cn: '西南',
    ko: '남서',
  },
  west: {
    en: 'W',
    de: 'W',
    fr: 'O',
    ja: '西',
    cn: '西',
    ko: '서',
  },
  northwest: {
    en: 'NW',
    de: 'NW',
    fr: 'NO',
    ja: '北西',
    cn: '西北',
    ko: '북서',
  },
};

export default {
  zoneId: ZoneId.TheSecondCoilOfBahamutTurn4,
  timelineFile: 't9.txt',
  timelineTriggers: [
    {
      id: 'T9 Claw',
      regex: /Bahamut's Claw x5/,
      beforeSeconds: 5,
      condition: (data) => data.role === 'tank' || data.role === 'healer' || data.job === 'BLU',
      response: Responses.tankBuster(),
    },
    {
      id: 'T9 Dalamud Dive',
      regex: /Dalamud Dive/,
      beforeSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dive on Main Tank',
          de: 'Sturz auf den Main Tank',
          fr: 'Plongeon sur le Main Tank',
          ja: 'MTに飛んでくる',
          cn: '凶鸟跳点MT',
          ko: '광역 탱버',
        },
      },
    },
    {
      id: 'T9 Super Nova',
      regex: /Super Nova x3/,
      beforeSeconds: 4,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Super Novas Outside',
          de: 'Köder Supernova draußen',
          fr: 'Attirez les Supernovas à l\'extérieur',
          ja: 'スーパーノヴァを外に設置',
          cn: '人群外放黑洞',
          ko: '초신성 외곽으로 유도',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'T9 Raven Blight You',
      netRegex: NetRegexes.gainsEffect({ effectId: '1CA' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (data, matches) => matches.duration - 5,
      durationSeconds: 5,
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Blight on YOU',
          de: 'Pestschwinge auf DIR',
          fr: 'Bile de rapace sur VOUS',
          ja: '自分に凶鳥毒気',
          cn: '毒气点名',
          ko: '5초후 디버프 폭발',
        },
      },
    },
    {
      id: 'T9 Raven Blight Not You',
      netRegex: NetRegexes.gainsEffect({ effectId: '1CA' }),
      condition: Conditions.targetIsNotYou(),
      delaySeconds: (data, matches) => matches.duration - 5,
      durationSeconds: 5,
      infoText: (data, matches, output) => output.text({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Blight on ${player}',
          de: 'Pestschwinge auf ${player}',
          fr: 'Bile de rapace sur ${player}',
          ja: '${player}に凶鳥毒気',
          cn: '毒气点${player}',
          ko: '광역폭발 디버프 ${player}',
        },
      },
    },
    {
      id: 'T9 Meteor',
      netRegex: NetRegexes.headMarker({ id: '000[7A9]' }),
      condition: Conditions.targetIsYou(),
      response: Responses.meteorOnYou(),
    },
    {
      id: 'T9 Meteor Stream',
      netRegex: NetRegexes.headMarker({ id: '0008' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'T9 Stack',
      netRegex: NetRegexes.headMarker({ id: '000F' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.thermoOnYou();

        return output.stackOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        thermoOnYou: {
          en: 'Thermo on YOU',
          de: 'Thermo auf DIR',
          fr: 'Thermo sur VOUS',
          ja: '自分に頭割り',
          cn: '分摊点名',
          ko: '쉐어징 대상자',
        },
        stackOn: {
          en: 'Stack on ${player}',
          de: 'Sammeln auf ${player}',
          fr: 'Packez-vous sur ${player}',
          ja: '${player}と頭割り',
          cn: '靠近${player}分摊',
          ko: '"${player}" 쉐어징',
        },
      },
    },
    {
      id: 'T9 Phase 2',
      regex: Regexes.hasHP({ name: 'Nael Deus Darnus', hp: '64', capture: false }),
      regexDe: Regexes.hasHP({ name: 'Nael Deus Darnus', hp: '64', capture: false }),
      regexFr: Regexes.hasHP({ name: 'Nael Deus Darnus', hp: '64', capture: false }),
      regexJa: Regexes.hasHP({ name: 'ネール・デウス・ダーナス', hp: '64', capture: false }),
      regexCn: Regexes.hasHP({ name: '奈尔·神·达纳斯', hp: '64', capture: false }),
      regexKo: Regexes.hasHP({ name: '넬 데우스 다르누스', hp: '64', capture: false }),
      sound: 'Long',
    },
    {
      id: 'T9 Earthshock',
      netRegex: NetRegexes.startsUsing({ id: '7F5', source: 'Dalamud Spawn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7F5', source: 'Dalamud-Golem', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7F5', source: 'Golem De Dalamud', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7F5', source: 'ダラガブゴーレム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7F5', source: '卫月巨像', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7F5', source: '달라가브 골렘', capture: false }),
      condition: (data) => data.CanSilence(),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Silence Blue Golem',
          de: 'Blauen Golem verstummen',
          fr: 'Interrompez le Golem bleu',
          ja: '沈黙：青ゴーレム',
          cn: '沉默蓝色小怪',
          ko: '파란골렘 기술끊기',
        },
      },
    },
    {
      id: 'T9 Heavensfall',
      netRegex: NetRegexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '83B', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '83B', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '83B', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '83B', source: '넬 데우스 다르누스', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Heavensfall',
          de: 'Himmelssturz',
          fr: 'Destruction universelle',
          ja: '天地崩壊',
          cn: '击退AOE',
          ko: '천지붕괴',
        },
      },
    },
    {
      id: 'T9 Garotte Twist Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '1CE' }),
      condition: (data, matches) => data.me === matches.target && !data.garotte,
      infoText: (data, _, output) => output.text(),
      run: (data) => data.garotte = true,
      outputStrings: {
        text: {
          en: 'Garotte on YOU',
          de: 'Leicht fixierbar auf DIR',
          fr: 'Sangle accélérée sur VOUS',
          ja: '自分に拘束加速',
          cn: '连坐点名',
          ko: '구속 가속',
        },
      },
    },
    {
      id: 'T9 Ghost Death',
      netRegex: NetRegexes.ability({ id: '7FA', source: 'The Ghost Of Meracydia', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '7FA', source: 'Geist Von Meracydia', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '7FA', source: 'Fantôme Méracydien', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '7FA', source: 'メラシディアン・ゴースト', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '7FA', source: '美拉西迪亚幽龙', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '7FA', source: '메라시디아의 유령', capture: false }),
      condition: (data) => data.garotte,
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleanse Garotte',
          de: 'reinige Leicht fixierbar',
          fr: 'Dissipez Sangle accélérée',
          ja: '白い床に乗る',
          cn: '踩白圈',
          ko: '흰색 장판 밟기',
        },
      },
    },
    {
      id: 'T9 Garotte Twist Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '1CE' }),
      condition: (data, matches) => data.me === matches.target && data.garotte,
      run: (data) => delete data.garotte,
    },
    {
      id: 'T9 Final Phase',
      netRegex: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      condition: (data) => !data.seenFinalPhase,
      sound: 'Long',
      run: (data) => data.seenFinalPhase = true,
    },
    {
      id: 'T9 Dragon Locations',
      netRegex: NetRegexes.addedCombatantFull({ name: ['Firehorn', 'Iceclaw', 'Thunderwing'] }),
      netRegexDe: NetRegexes.addedCombatantFull({ name: ['Feuerhorn', 'Eisklaue', 'Donnerschwinge'] }),
      netRegexFr: NetRegexes.addedCombatantFull({ name: ['Corne-De-Feu', 'Griffe-De-Glace', 'Aile-De-Foudre'] }),
      netRegexJa: NetRegexes.addedCombatantFull({ name: ['ファイアホーン', 'アイスクロウ', 'サンダーウィング'] }),
      netRegexCn: NetRegexes.addedCombatantFull({ name: ['火角', '冰爪', '雷翼'] }),
      netRegexKo: NetRegexes.addedCombatantFull({ name: ['화염뿔', '얼음발톱', '번개날개'] }),
      run: (data, matches) => {
        // Lowercase all of the names here for case insensitive matching.
        const allNames = {
          en: ['firehorn', 'iceclaw', 'thunderwing'],
          de: ['feuerhorn', 'eisklaue', 'donnerschwinge'],
          fr: ['corne-de-feu', 'griffe-de-glace ', 'aile-de-foudre'],
          ja: ['ファイアホーン', 'アイスクロウ', 'サンダーウィング'],
          cn: ['火角', '冰爪', '雷翼'],
          ko: ['화염뿔', '얼음발톱', '번개날개'],
        };
        const names = allNames[data.parserLang];
        const idx = names.indexOf(matches.name.toLowerCase());
        if (idx === -1)
          return;

        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);

        // Most dragons are out on a circle of radius=~28.
        // Ignore spurious dragons like "Pos: (0.000919255,0.006120025,2.384186E-07)"
        if (x * x + y * y < 20 * 20)
          return;

        // Positions are the 8 cardinals + numerical slop on a radius=28 circle.
        // N = (0, -28), E = (28, 0), S = (0, 28), W = (-28, 0)
        // Map N = 0, NE = 1, ..., NW = 7
        const dir = Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;

        data.dragons = data.dragons || [0, 0, 0];
        data.dragons[idx] = dir;
      },
    },
    {
      id: 'T9 Final Phase Reset',
      netRegex: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      run: (data) => {
        data.tetherCount = 0;
        data.naelDiveMarkerCount = 0;

        // Missing dragons??
        if (!data.dragons || data.dragons.length !== 3) {
          data.naelMarks = ['unknown', 'unknown'];
          data.safeZone = 'unknown';
          return;
        }

        // T9 normal dragons are easy.
        // The first two are always split, so A is the first dragon + 1.
        // The last one is single, so B is the last dragon + 1.

        const dragons = data.dragons.sort();
        const dirNames = [
          'north',
          'northeast',
          'east',
          'southeast',
          'south',
          'southwest',
          'west',
          'northwest',
        ];
        data.naelMarks = [dragons[0], dragons[2]].map((i) => dirNames[(i + 1) % 8]);

        // Safe zone is one to the left of the first dragon, unless
        // the last dragon is diving there.  If that's true, use
        // one to the right of the second dragon.
        let possibleSafe = (dragons[0] - 1 + 8) % 8;
        if ((dragons[2] + 2) % 8 === possibleSafe)
          possibleSafe = (dragons[1] + 1) % 8;
        data.safeZone = dirNames[possibleSafe];
      },
    },
    {
      id: 'T9 Dragon Marks',
      netRegex: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '7E6', source: 'Nael Deus Darnus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '7E6', source: 'ネール・デウス・ダーナス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '7E6', source: '奈尔·神·达纳斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '7E6', source: '넬 데우스 다르누스', capture: false }),
      durationSeconds: 12,
      infoText: (data, _, output) => output.marks({
        dir1: output[data.naelMarks[0]](),
        dir2: output[data.naelMarks[1]](),
      }),
      outputStrings: {
        ...diveDirections,
        marks: {
          en: 'Marks: ${dir1}, ${dir2}',
          de: 'Markierungen : ${dir1}, ${dir2}',
          fr: 'Marques : ${dir1}, ${dir2}',
          ja: 'マーカー: ${dir1}, ${dir2}',
          cn: '标记： ${dir1}, ${dir2}',
          ko: '카탈징: ${dir1}, ${dir2}',
        },
      },
    },
    {
      id: 'T9 Tether',
      netRegex: NetRegexes.tether({ id: '0005', source: 'Firehorn' }),
      netRegexDe: NetRegexes.tether({ id: '0005', source: 'Feuerhorn' }),
      netRegexFr: NetRegexes.tether({ id: '0005', source: 'Corne-De-Feu' }),
      netRegexJa: NetRegexes.tether({ id: '0005', source: 'ファイアホーン' }),
      netRegexCn: NetRegexes.tether({ id: '0005', source: '火角' }),
      netRegexKo: NetRegexes.tether({ id: '0005', source: '화염뿔' }),
      preRun: (data) => {
        data.tetherCount = data.tetherCount || 0;
        data.tetherCount++;
      },
      alertText: (data, matches, output) => {
        if (data.me !== matches.target)
          return;
        // Out, In, Out, In
        if (data.tetherCount % 2)
          return output.fireOutOnYou();
        return output.fireInOnYou;
      },
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return;
        // Out, In, Out, In
        if (data.tetherCount % 2)
          return output.fireOutOn({ player: data.ShortName(matches.target) });
        return output.fireInOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        fireOutOnYou: {
          en: 'Fire Out (on YOU)',
          de: 'Feuer raus (auf DIR)',
          fr: 'Feu extérieur (sur VOUS)',
          ja: 'ファイヤ、外に (自分)',
          cn: '火球单吃点名',
        },
        fireInOnYou: {
          en: 'Fire In (on YOU)',
          de: 'Feuer rein (auf DIR)',
          fr: 'Feu intérieur (sur VOUS)',
          ja: 'ファイヤ、頭割り (自分)',
          cn: '火球集合点名',
        },
        fireOutOn: {
          en: 'Fire Out (on ${player})',
          de: 'Feuer raus (auf ${player})',
          fr: 'Feu extérieur (sur ${player})',
          ja: 'ファイヤ、外に (${player})',
          cn: '火球单吃点${player}',
        },
        fireInOn: {
          en: 'Fire In (on ${player})',
          de: 'Feuer rein (auf ${player})',
          fr: 'Feu intérieur (sur ${player})',
          ja: 'ファイヤ、頭割り (${player})',
          cn: '火球集合点${player}',
        },
      },
    },
    {
      id: 'T9 Thunder',
      netRegex: NetRegexes.ability({ source: 'Thunderwing', id: '7FD' }),
      netRegexDe: NetRegexes.ability({ source: 'Donnerschwinge', id: '7FD' }),
      netRegexFr: NetRegexes.ability({ source: 'Aile-De-Foudre', id: '7FD' }),
      netRegexJa: NetRegexes.ability({ source: 'サンダーウィング', id: '7FD' }),
      netRegexCn: NetRegexes.ability({ source: '雷翼', id: '7FD' }),
      netRegexKo: NetRegexes.ability({ source: '번개날개', id: '7FD' }),
      condition: Conditions.targetIsYou(),
      alarmText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Thunder on YOU',
          de: 'Blitz auf DIR',
          fr: 'Foudre sur VOUS',
          ja: '自分にサンダー',
          cn: '雷点名',
          ko: '번개 대상자',
        },
      },
    },
    {
      id: 'T9 Dragon Safe Zone',
      netRegex: NetRegexes.headMarker({ id: '0014', capture: false }),
      delaySeconds: 3,
      durationSeconds: 6,
      suppressSeconds: 20,
      infoText: (data, _, output) => output.safeZone({ dir: output[data.safeZone]() }),
      outputStrings: {
        ...diveDirections,
        safeZone: {
          en: 'Safe zone: ${dir}',
          de: 'Sichere Zone: ${dir}',
          fr: 'Zone sûre : ${dir}',
          ja: '安置: ${dir}',
          cn: '安全点在：${dir}',
          ko: '안전 지대: ${dir}',
        },
      },
    },
    {
      id: 'T9 Dragon Marker',
      netRegex: NetRegexes.headMarker({ id: '0014' }),
      condition: Conditions.targetIsYou(),
      alarmText: (data, matches, output) => {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target !== data.me)
          return;
        const marker = ['A', 'B', 'C'][data.naelDiveMarkerCount];
        const dir = data.naelMarks[data.naelDiveMarkerCount];
        return output.goToMarkerInDir({ marker: marker, dir: dir });
      },
      tts: (data, matches, output) => {
        data.naelDiveMarkerCount = data.naelDiveMarkerCount || 0;
        if (matches.target !== data.me)
          return;
        return output.goToMarker({ marker: ['A', 'B', 'C'][data.naelDiveMarkerCount] });
      },
      outputStrings: {
        goToMarkerInDir: {
          en: 'Go To ${marker} (in ${dir})',
          de: 'Gehe zu ${marker} (im ${dir})',
          fr: 'Allez en ${marker} (au ${dir})',
          ja: '${marker}に行く' + ' (あと ${dir}秒)',
          cn: '去${marker} (在 ${dir}秒)',
          ko: '${marker}로 이동' + ' (${dir}쪽)',
        },
        goToMarker: {
          en: 'Go To ${marker}',
          de: 'Gehe zu ${marker}',
          fr: 'Allez en ${marker}',
          ja: '${marker}行くよ',
          cn: '去${marker}',
          ko: '${marker}로 이동',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Astral Debris': 'Lichtgestein',
        'Dalamud Fragment': 'Dalamud-Bruchstück',
        'Dalamud Spawn': 'Dalamud-Golem',
        'Firehorn': 'Feuerhorn',
        'Iceclaw': 'Eisklaue',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael deus Darnus',
        'Ragnarok': 'Ragnarök',
        'The Ghost Of Meracydia': 'Geist von Meracydia',
        'Thunderwing': 'Donnerschwinge',
        'Umbral Debris': 'Schattengestein',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': 'Meteor',
        'Bahamut\'s Claw': 'Klauen Bahamuts',
        'Bahamut\'s Favor': 'Bahamuts Segen',
        'Binding Coil': 'Verschlungene Schatten',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Dalamud Dive': 'Dalamud-Sturzflug',
        'Divebomb': 'Sturzbombe',
        'Fireball': 'Feuerball',
        'Ghost': 'Geist',
        'Golem Meteors': 'Golem Meteore',
        'Heavensfall': 'Himmelssturz',
        'Iron Chariot': 'Eiserner Streitwagen',
        'Lunar Dynamo': 'Lunarer Dynamo',
        'Megaflare': 'Megaflare',
        'Meteor Stream': 'Meteorflug',
        'Raven Dive': 'Bahamuts Schwinge',
        'Ravensbeak': 'Bradamante',
        'Ravensclaw': 'Silberklauen',
        'Stardust': 'Sternenstaub',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Thermionischer Strahl',
        '\\(East\\)': '(Osten)',
        '\\(In\\)': '(Rein)',
        '\\(North\\)': '(Norden)',
        '\\(Out\\)': '(Raus)',
        '\\(South\\)': '(Süden)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Astral Debris': 'Débris Astral',
        'Dalamud Fragment': 'Débris De Dalamud',
        'Dalamud Spawn': 'Golem De Dalamud',
        'Firehorn': 'Corne-De-Feu',
        'Iceclaw': 'Griffe-De-Glace',
        'Nael Geminus': 'Nael Geminus',
        'Nael deus Darnus': 'Nael Deus Darnus',
        'Ragnarok': 'Ragnarok',
        'The Ghost Of Meracydia': 'Fantôme Méracydien',
        'Thunderwing': 'Aile-De-Foudre',
        'Umbral Debris': 'Débris Ombral',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': 'Météore',
        'Bahamut\'s Claw': 'Griffe de Bahamut',
        'Bahamut\'s Favor': 'Auspice du dragon',
        'Binding Coil': 'Écheveau entravant',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Dalamud Dive': 'Chute de Dalamud',
        'Divebomb Mark': 'Bombe plongeante, marque',
        'Fireball': 'Boule de feu',
        'Ghost Add': 'Add Fantôme',
        'Golem Meteors': 'Golem de Dalamud',
        'Heavensfall': 'Destruction universelle',
        'Iron Chariot': 'Char de fer',
        'Lunar Dynamo': 'Dynamo lunaire',
        'Megaflare': 'MégaBrasier',
        'Meteor Stream': 'Rayon météore',
        'Raven Dive': 'Fonte du rapace',
        'Ravensbeak': 'Bec du rapace',
        'Ravensclaw': 'Serre du rapace',
        'Stardust': 'Poussière d\'étoile',
        'Super Nova': 'Supernova',
        'Thermionic Beam': 'Rayon thermoïonique',
        '\\(East\\)': '(Est)',
        '\\(In\\)': '(Intérieur)',
        '\\(North\\)': '(Nord)',
        '\\(Out\\)': '(Extérieur)',
        '\\(South\\)': '(Sud)',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Astral Debris': 'アストラルデブリ',
        'Dalamud Fragment': 'ダラガブデブリ',
        'Dalamud Spawn': 'ダラガブゴーレム',
        'Firehorn': 'ファイアホーン',
        'Iceclaw': 'アイスクロウ',
        'Nael Geminus': 'ネール・ジェミナス',
        'Nael deus Darnus': 'ネール・デウス・ダーナス',
        'Ragnarok': 'ラグナロク',
        'The Ghost Of Meracydia': 'メラシディアン・ゴースト',
        'Thunderwing': 'サンダーウィング',
        'Umbral Debris': 'アンブラルデブリ',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': 'メテオ',
        'Bahamut\'s Claw': 'バハムートクロウ',
        'Bahamut\'s Favor': '龍神の加護',
        'Binding Coil': 'バインディングコイル',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Dalamud Dive': 'ダラガブダイブ',
        'Divebomb': 'ダイブボム',
        'Fireball': 'ファイアボール',
        'Ghost Add': '雑魚: ゴースト',
        'Golem Meteors': 'ゴーレムメテオ',
        'Heavensfall': '天地崩壊',
        'Iron Chariot': 'アイアンチャリオット',
        'Lunar Dynamo': 'ルナダイナモ',
        'Megaflare': 'メガフレア',
        'Meteor Stream': 'メテオストリーム',
        'Raven Dive': 'レイヴンダイブ',
        'Ravensbeak': 'レイヴェンズビーク',
        'Ravensclaw': 'レイヴェンズクロウ',
        'Stardust': 'スターダスト',
        'Super Nova': 'スーパーノヴァ',
        'Thermionic Beam': 'サーミオニックビーム',
        '\\(East\\)': '(東))',
        '\\(In\\)': '(中)',
        '\\(North\\)': '(北)',
        '\\(Out\\)': '(外)',
        '\\(South\\)': '(南)',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Astral Debris': '星极岩屑',
        'Dalamud Fragment': '卫月岩屑',
        'Dalamud Spawn': '卫月巨像',
        'Firehorn': '火角',
        'Iceclaw': '冰爪',
        'Nael Geminus': '奈尔双生子',
        'Nael deus Darnus': '奈尔·神·达纳斯',
        'Ragnarok': '诸神黄昏',
        'The Ghost Of Meracydia': '美拉西迪亚幽龙',
        'Thunderwing': '雷翼',
        'Umbral Debris': '灵极岩屑',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': '陨石',
        'Bahamut\'s Claw': '巴哈姆特之爪',
        'Bahamut\'s Favor': '龙神的加护',
        'Binding Coil': '拘束圈',
        'Cauterize': '低温俯冲',
        'Chain Lightning': '雷光链',
        'Dalamud Dive': '月华冲',
        'Divebomb': '爆破俯冲',
        'Fireball': '烈火球',
        'Ghost': '幽灵',
        'Golem Meteors': '石头人陨石',
        'Heavensfall': '天崩地裂',
        'Iron Chariot': '钢铁战车',
        'Lunar Dynamo': '月流电圈',
        'Megaflare': '百万核爆',
        'Meteor Stream': '陨石流',
        'Raven Dive': '凶鸟冲',
        'Ravensbeak': '凶鸟尖喙',
        'Ravensclaw': '凶鸟利爪',
        'Stardust': '星尘',
        'Super Nova': '超新星',
        'Thermionic Beam': '热离子光束',
        '\\(East\\)': '(东)',
        '\\(In\\)': '(内)',
        '\\(North\\)': '(北)',
        '\\(Out\\)': '(外)',
        '\\(South\\)': '(南)',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Astral Debris': '천상의 잔해',
        'Dalamud Fragment': '달라가브의 잔해',
        'Dalamud Spawn': '달라가브 골렘',
        'Firehorn': '화염뿔',
        'Iceclaw': '얼음발톱',
        'Nael Geminus': '넬 게미누스',
        'Nael deus Darnus': '넬 데우스 다르누스',
        'Ragnarok': '라그나로크',
        'The Ghost Of Meracydia': '메라시디아의 유령',
        'Thunderwing': '번개날개',
        'Umbral Debris': '저승의 잔해',
      },
      'replaceText': {
        '(?<! )Meteor(?! Stream)': '메테오',
        'Bahamut\'s Claw': '바하무트의 발톱',
        'Bahamut\'s Favor': '용신의 가호',
        'Binding Coil': '구속의 고리',
        'Cauterize': '인두질',
        'Chain Lightning': '번개 사슬',
        'Dalamud Dive': '달라가브 강하',
        'Divebomb': '급강하 폭격',
        'Fireball': '화염구',
        'Ghost Add': '유령 쫄',
        'Golem Meteors': '골렘 메테오',
        'Heavensfall': '천지붕괴',
        'Iron Chariot': '강철 전차',
        'Lunar Dynamo': '달의 원동력',
        'Megaflare': '메가플레어',
        'Meteor Stream': '유성 폭풍',
        'Raven Dive': '흉조의 강하',
        'Ravensbeak': '흉조의 부리',
        'Ravensclaw': '흉조의 발톱',
        'Stardust': '별조각',
        'Super Nova': '초신성',
        'Thermionic Beam': '열전자 광선',
        'Mark A': 'A징',
        'Mark B': 'B징',
        '\\(East\\)': '(동)',
        '\\(South\\)': '(남)',
        '\\(North\\)': '(북)',
        '\\(In\\)': '(안)',
        '\\(Out\\)': '(밖)',
      },
    },
  ],
};
