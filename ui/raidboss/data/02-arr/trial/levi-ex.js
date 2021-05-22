import NetRegexes from '../../../../../resources/netregexes';
import Util from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import Outputs from '../../../../../resources/outputs';

// TODO: we could consider a timeline trigger for the Tidal Roar raidwide,
// but it barely does 25% health, has no startsUsing, and the timeline for
// this fight is not reliable enough to use.

// TODO: it'd be nice to call out the dives too, but there is no log line
// or combatant in the right place until ~4.5s after the nameplate toggles.
// This is about 1-2s after the splash appears, and so feels really late.
// Unfortunately the dives also have multiple combatants in plausible
// positions (+/-7, +/-20) and so more work would need to be done to tell
// them apart.

export default {
  zoneId: ZoneId.TheWhorleaterExtreme,
  timelineFile: 'levi-ex.txt',
  triggers: [
    {
      id: 'LeviEx Dive Counter Tidal Wave Reset',
      netRegex: NetRegexes.ability({ source: 'Leviathan', id: '82E', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Leviathan', id: '82E', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Léviathan', id: '82E', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'リヴァイアサン', id: '82E', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '利维亚桑', id: '82E', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '리바이어선', id: '82E', capture: false }),
      run: (data) => {
        // There's always a slam after Tidal Wave.
        data.diveCounter = 1;
        // If you are running this unsynced and don't hit the button,
        // then prevent "Hit the Button" calls on future dives.
        data.converter = false;
      },
    },
    {
      id: 'LeviEx Dive Counter Body Slam Reset',
      netRegex: NetRegexes.ability({ source: 'Leviathan', id: '82A', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Leviathan', id: '82A', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Léviathan', id: '82A', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'リヴァイアサン', id: '82A', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '利维亚桑', id: '82A', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '리바이어선', id: '82A', capture: false }),
      // Redundant, but this will keep things on track if anything goes awry.
      run: (data) => data.diveCounter = 1,
    },
    {
      id: 'LeviEx Dive Counter Wave Spume Adjust',
      netRegex: NetRegexes.addedCombatant({ name: 'Wave Spume', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gischtwelle', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Écume Ondulante', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ウェイブ・スピューム', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '巨浪泡沫', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '파도치는 물거품', capture: false }),
      suppressSeconds: 5,
      // Usually the pattern is slam / dive / dive / slam, but after wave spumes appear,
      // there is a single dive then a slam.  Adjust for this one-off case here.
      run: (data) => data.diveCounter = 2,
    },
    {
      id: 'LeviEx Slam Location',
      netRegex: NetRegexes.nameToggle({ name: 'Leviathan', toggle: '00', capture: false }),
      netRegexDe: NetRegexes.nameToggle({ name: 'Leviathan', toggle: '00', capture: false }),
      netRegexFr: NetRegexes.nameToggle({ name: 'Léviathan', toggle: '00', capture: false }),
      netRegexJa: NetRegexes.nameToggle({ name: 'リヴァイアサン', toggle: '00', capture: false }),
      netRegexCn: NetRegexes.nameToggle({ name: '利维亚桑', toggle: '00', capture: false }),
      netRegexKo: NetRegexes.nameToggle({ name: '리바이어선', toggle: '00', capture: false }),
      condition: (data) => {
        data.diveCounter = (data.diveCounter || 0) + 1;
        return data.diveCounter % 3 === 1;
      },
      // Actor moves between 4.6s and 4.7s; add a tiny bit of time for certainty.
      delaySeconds: 5,
      promise: async (data) => {
        const callData = await callOverlayHandler({
          call: 'getCombatants',
        });
        if (!callData || !callData.combatants || !callData.combatants.length) {
          console.error('Dive: failed to get combatants: ${JSON.stringify(callData)}');
          return;
        }
        // This is the real levi, according to hp.
        data.slamLevis = callData.combatants.filter((c) => c.BNpcID === 2802);
      },
      alertText: (data, _matches, output) => {
        // Slams happen at +/-~14.6 +/-~13.
        const filtered = data.slamLevis.filter((c) => {
          const offsetX = Math.abs(Math.abs(c.PosX) - 14.6);
          const offsetY = Math.abs(Math.abs(c.PosY) - 13);
          return offsetX < 1 && offsetY < 1;
        });
        if (filtered.length !== 1)
          return;
        const levi = filtered[0];
        if (levi.PosY > 0)
          return output.north();
        return output.south();
      },
      outputStrings: {
        north: Outputs.north,
        south: Outputs.south,
      },
    },
    {
      id: 'LeviEx Veil of the Whorl',
      netRegex: NetRegexes.ability({ source: 'Leviathan', id: '875', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Leviathan', id: '875', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Léviathan', id: '875', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'リヴァイアサン', id: '875', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '利维亚桑', id: '875', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '리바이어선', id: '875', capture: false }),
      condition: (data) => Util.isCasterDpsJob(data.job) || Util.isHealerJob(data.job),
      suppressSeconds: 9999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Head Only',
          de: 'Nur den Kopf angreifen',
          fr: 'Attaquez seulement la tête',
          ja: '頭だけに攻撃',
          cn: '攻击头部',
          ko: '머리만 공격하기',
        },
      },
    },
    {
      id: 'LeviEx Mantle of the Whorl',
      netRegex: NetRegexes.ability({ source: 'Leviathan\'s Tail', id: '874', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Leviathans Schwanz', id: '874', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Queue De Léviathan', id: '874', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'リヴァイアサン・テール', id: '874', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '利维亚桑的尾巴', id: '874', capture: false }),
      netRegexKo: NetRegexes.ability({ source: '리바이어선 꼬리', id: '874', capture: false }),
      condition: (data) => Util.isRangedDpsJob(data.job),
      suppressSeconds: 9999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Attack Tail Only',
          de: 'Nur den Schwanz angreifen',
          fr: 'Attaquez seulement la queue',
          ja: 'テールだけに攻撃',
          cn: '攻击尾巴',
          ko: '꼬리만 공격하기',
        },
      },
    },
    {
      id: 'LeviEx Wavespine Sahagin Add',
      netRegex: NetRegexes.addedCombatant({ name: 'Wavespine Sahagin', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Wellendorn-Sahagin', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Sahuagin Épine-Du-Ressac', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ウェイブスパイン・サハギン', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '波棘鱼人', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '물결등뼈 사하긴', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: Outputs.killAdds,
      },
    },
    {
      id: 'LeviEx Wavetooth Sahagin Add',
      netRegex: NetRegexes.addedCombatant({ name: 'Wavetooth Sahagin', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Wellenzahn-Sahagin', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Sahuagin Dent-Du-Ressac', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ウェイブトゥース・サハギン', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '波齿鱼人', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '물결이빨 사하긴', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Wavetooth Add',
          de: 'Besiege Wellenzahn Add',
          fr: 'Tuez l\'add Dent-du-ressac',
          ja: 'ウェイブトゥース・サハギンに攻撃',
          cn: '优先击杀波齿鱼人',
          ko: '물결이빨 사하긴 처치',
        },
      },
    },
    {
      id: 'LeviEx Wavetooth Sahagin Stun',
      netRegex: NetRegexes.addedCombatant({ name: 'Wavetooth Sahagin' }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Wellenzahn-Sahagin' }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Sahuagin Dent-Du-Ressac' }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ウェイブトゥース・サハギン' }),
      netRegexCn: NetRegexes.addedCombatant({ name: '波齿鱼人' }),
      netRegexKo: NetRegexes.addedCombatant({ name: '물결이빨 사하긴' }),
      condition: (data) => data.CanStun(),
      delaySeconds: 5,
      alertText: (_data, matches, output) => output.text({ name: matches.name }),
      outputStrings: {
        text: Outputs.stunTarget,
      },
    },
    {
      id: 'LeviEx Gyre Spume',
      netRegex: NetRegexes.addedCombatant({ name: 'Gyre Spume', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gischtblase', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Écume Concentrique', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ジャイヤ・スピューム', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '游涡泡沫', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '소용돌이치는 물거품', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Gyre Spumes',
          de: 'Besiege Gischtblase',
          fr: 'Tuez les écumes concentriques',
          ja: 'ジャイヤ・スピュームに攻撃',
          cn: '打黄泡泡',
          ko: '노랑 물거품 처치',
        },
      },
    },
    {
      id: 'LeviEx Wave Spume',
      netRegex: NetRegexes.addedCombatant({ name: 'Wave Spume', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gischtwelle', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Écume Ondulante', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ウェイブ・スピューム', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '巨浪泡沫', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '파도치는 물거품', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Wave Spume Adds',
          de: 'Gischtwelle Adds',
          fr: 'Tuez les écumes ondulantes',
          ja: 'ウェイブ・スピューム出現',
          cn: '蓝泡泡出现',
          ko: '파랑 물거품 출현',
        },
      },
    },
    {
      id: 'LeviEx Wave Spume Explosion',
      netRegex: NetRegexes.addedCombatant({ name: 'Wave Spume', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Gischtwelle', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Écume Ondulante', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'ウェイブ・スピューム', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '巨浪泡沫', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '파도치는 물거품', capture: false }),
      // ~35.2 seconds from added combatant until :Aqua Burst:888: explosion.
      // Tell everybody because not much else going on in this fight,
      // and other people need to get away.
      delaySeconds: 30,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Burst Soon',
          de: 'Gischtwelle platzen gleich',
          fr: 'Burst bientôt',
          ja: 'まもなく爆発',
          cn: '黄泡泡即将爆炸',
          ko: '물거품 폭발',
        },
      },
    },
    {
      id: 'LeviEx Elemental Converter',
      netRegex: NetRegexes.nameToggle({ name: 'Elemental Converter' }),
      netRegexDe: NetRegexes.nameToggle({ name: 'Elementarumwandler' }),
      netRegexFr: NetRegexes.nameToggle({ name: 'Activateur De La Barrière' }),
      netRegexJa: NetRegexes.nameToggle({ name: '魔法障壁発動器' }),
      netRegexCn: NetRegexes.nameToggle({ name: '魔法障壁发动器' }),
      netRegexKo: NetRegexes.nameToggle({ name: '마법 장벽 발동기' }),
      run: (data, matches) => data.converter = !!parseInt(matches.toggle),
    },
    {
      id: 'LeviEx Hit The Button',
      netRegex: NetRegexes.nameToggle({ name: 'Leviathan', toggle: '00', capture: false }),
      netRegexDe: NetRegexes.nameToggle({ name: 'Leviathan', toggle: '00', capture: false }),
      netRegexFr: NetRegexes.nameToggle({ name: 'Léviathan', toggle: '00', capture: false }),
      netRegexJa: NetRegexes.nameToggle({ name: 'リヴァイアサン', toggle: '00', capture: false }),
      netRegexCn: NetRegexes.nameToggle({ name: '利维亚桑', toggle: '00', capture: false }),
      netRegexKo: NetRegexes.nameToggle({ name: '리바이어선', toggle: '00', capture: false }),
      // The best way to know if it's time to hit the button is if the converter is ready.
      // I think this is not true for hard mode, but is true (fingers crossed) for extreme.
      condition: (data) => data.converter,
      // Some delay for safety, as the button can be hit too early.
      delaySeconds: 3.5,
      suppressSeconds: 30,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Hit The Button!',
          de: 'Mit Elementarumwandler interagieren!',
          fr: 'Activez la barrière !',
          ja: '魔法障壁を発動',
          cn: '打开开关！',
          ko: '장벽 발동!',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Elemental Converter': 'Elementarumwandler',
        'Leviathan(?!\'s)': 'Leviathan',
        'Leviathan\'s Tail': 'Leviathans Schwanz',
        'Gyre Spume': 'Gischtblase',
        'Wave Spume': 'Gischtwelle',
        'Wavetooth Sahagin': 'Wellenzahn-Sahagin',
        'Wavespine Sahagin': 'Wellendorn-Sahagin',
      },
      'replaceText': {
        'Aqua Breath': 'Aqua-Atem',
        'Aqua Burst': 'Aquatischer Knall',
        'Body Slam': 'Bugwelle',
        'Briny Veil': 'Wasserspiegelung',
        'Dread Tide': 'Hydrophobie',
        'Grand Fall': 'Wasserfall',
        'Gyre Spume': 'Gischtblase',
        'Mantle Of The Whorl': 'Wogenmantel',
        'Spinning Dive': 'Drehsprung',
        'Tail Whip': 'Schwanzpeitsche',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidal Wave': 'Flutwelle',
        'Veil Of The Whorl': 'Wogenschleier',
        'Waterspout': 'Wasserhose',
        'Wave Spume': 'Gischtwelle',
        'Wavespine Sahagin': 'Wellendorn-Sahagin',
        'Wavetooth Sahagin': 'Wellenzahn-Sahagin',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Elemental Converter': 'activateur de la barrière',
        'Leviathan(?!\'s)': 'Léviathan',
        'Leviathan\'s Tail': 'queue de Léviathan',
        'Gyre Spume': 'écume concentrique',
        'Wave Spume': 'écume ondulante',
        'Wavetooth Sahagin': 'Sahuagin dent-du-ressac',
        'Wavespine Sahagin': 'Sahuagin épine-du-ressac',
      },
      'replaceText': {
        '\\(NW\\)': '(NO)',
        'Aqua Breath': 'Aquasouffle',
        'Aqua Burst': 'Explosion aquatique',
        'Body Slam': 'Charge physique',
        'Briny Veil': 'Miroir d\'eau',
        'Dread Tide': 'Onde terrifiante',
        'Grand Fall': 'Chute grandiose',
        'Gyre Spume': 'écume concentrique',
        'Mantle Of The Whorl': 'Manteau du Déchaîneur',
        'Spinning Dive': 'Piqué tournant',
        'Tail Whip': 'Coup caudal',
        'Tidal Roar': 'Vague rugissante',
        'Tidal Wave': 'Raz-de-marée',
        'Veil Of The Whorl': 'Voile du Déchaîneur',
        'Waterspout': 'Inondation',
        'Wave Spume': 'écume ondulante',
        'Wavespine Sahagin': 'Sahuagin épine-du-ressac',
        'Wavetooth Sahagin': 'Sahuagin dent-du-ressac',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Elemental Converter': '魔法障壁発動器',
        'Leviathan(?!\'s)': 'リヴァイアサン',
        'Leviathan\'s Tail': 'リヴァイアサン・テール',
        'Gyre Spume': 'ジャイヤ・スピューム',
        'Wave Spume': 'ウェイブ・スピューム',
        'Wavetooth Sahagin': 'ウェイブトゥース・サハギン',
        'Wavespine Sahagin': 'ウェイブスパイン・サハギン',
      },
      'replaceText': {
        'Aqua Breath': 'アクアブレス',
        'Aqua Burst': 'アクアバースト',
        'Body Slam': 'ボディスラム',
        'Briny Veil': 'ウォーターミラー',
        'Dread Tide': 'ドレッドウォーター',
        'Grand Fall': 'グランドフォール',
        'Gyre Spume': 'ジャイヤ・スピューム',
        'Mantle Of The Whorl': '水神のマント',
        'Spinning Dive': 'スピニングダイブ',
        'Tail Whip': 'テールウィップ',
        'Tidal Roar': 'タイダルロア',
        'Tidal Wave': 'タイダルウェイブ',
        'Veil Of The Whorl': '水神のヴェール',
        'Waterspout': 'オーバーフラッド',
        'Wave Spume': 'ウェイブ・スピューム',
        'Wavespine Sahagin': 'ウェイブスパイン・サハギン',
        'Wavetooth Sahagin': 'ウェイブトゥース・サハギン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Elemental Converter': '魔法障壁发动器',
        'Leviathan(?!\'s)': '利维亚桑',
        'Leviathan\'s Tail': '利维亚桑的尾巴',
        'Gyre Spume': '游涡泡沫',
        'Wave Spume': '巨浪泡沫',
        'Wavetooth Sahagin': '波齿鱼人',
        'Wavespine Sahagin': '波棘鱼人',
      },
      'replaceText': {
        'Aqua Breath': '水流吐息',
        'Aqua Burst': '流水爆发',
        'Body Slam': '猛撞',
        'Briny Veil': '海水镜面',
        'Dread Tide': '恐慌潮水',
        'Grand Fall': '九天落水',
        'Gyre Spume': '游涡泡沫',
        'Mantle Of The Whorl': '水神的披风',
        'Spinning Dive': '旋转下潜',
        'Tail Whip': '扫尾',
        'Tidal Roar': '怒潮咆哮',
        'Tidal Wave': '巨浪',
        'Veil Of The Whorl': '水神的面纱',
        'Waterspout': '海龙卷',
        'Wave Spume': '巨浪泡沫',
        'Wavespine Sahagin': '波棘鱼人',
        'Wavetooth Sahagin': '波齿鱼人',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Elemental Converter': '마법 장벽 발동기',
        'Leviathan(?!\'s)': '리바이어선',
        'Leviathan\'s Tail': '리바이어선 꼬리',
        'Gyre Spume': '소용돌이치는 물거품',
        'Wave Spume': '파도치는 물거품',
        'Wavetooth Sahagin': '물결이빨 사하긴',
        'Wavespine Sahagin': '물결등뼈 사하긴',
      },
      'replaceText': {
        'Aqua Breath': '물의 숨결',
        'Aqua Burst': '물방울 폭발',
        'Body Slam': '몸통 박기',
        'Briny Veil': '물의 거울',
        'Dread Tide': '공포의 물결',
        'Grand Fall': '강우',
        'Gyre Spume': '소용돌이치는 물거품',
        'Mantle Of The Whorl': '수신의 망토',
        'Spinning Dive': '고속 돌진',
        'Tail Whip': '꼬리 채찍',
        'Tidal Roar': '바다의 포효',
        'Tidal Wave': '해일',
        'Veil Of The Whorl': '수신의 장막',
        'Waterspout': '물폭풍',
        'Wave Spume': '파도치는 물거품',
        'Wavespine Sahagin': '물결등뼈 사하긴',
        'Wavetooth Sahagin': '물결이빨 사하긴',
      },
    },
  ],
};
