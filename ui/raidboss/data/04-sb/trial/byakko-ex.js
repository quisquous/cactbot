'use strict';

// Byakko Extreme
[{
  zoneRegex: {
    en: /^The Jade Stoa \(Extreme\)$/,
    cn: /^白虎诗魂战$/,
    ko: /^극 백호 토벌전$/,
  },
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Heavenly Strike',
      regex: Regexes.startsUsing({ id: '27DA', source: 'Byakko' }),
      regexDe: Regexes.startsUsing({ id: '27DA', source: 'Byakko' }),
      regexFr: Regexes.startsUsing({ id: '27DA', source: 'Byakko' }),
      regexJa: Regexes.startsUsing({ id: '27DA', source: '白虎' }),
      regexCn: Regexes.startsUsing({ id: '27DA', source: '白虎' }),
      regexKo: Regexes.startsUsing({ id: '27DA', source: '백호' }),
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'ByaEx Flying Donut',
      regex: Regexes.startsUsing({ id: '27F4', source: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27F4', source: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27F4', source: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27F4', source: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27F4', source: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27F4', source: '백호', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'ByaEx Sweep The Leg',
      regex: Regexes.startsUsing({ id: '27DB', source: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27DB', source: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27DB', source: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27DB', source: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27DB', source: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27DB', source: '백호', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'ByaEx Storm Pulse',
      regex: Regexes.startsUsing({ id: '27DC', source: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27DC', source: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27DC', source: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27DC', source: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27DC', source: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27DC', source: '백호', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'ByaEx Distant Clap',
      regex: Regexes.startsUsing({ id: '27DD', source: 'Byakko', target: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27DD', source: 'Byakko', target: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27DD', source: 'Byakko', target: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27DD', source: '白虎', target: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27DD', source: '白虎', target: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27DD', source: '백호', target: '백호', capture: false }),
      alertText: {
        en: 'Distant Clap',
        de: 'Donnergrollen',
        fr: 'Tonnerre Lointain',
        ja: '遠雷',
        cn: '远雷',
        ko: '원뢰',
      },
      tts: {
        en: 'clap',
        de: 'grollen',
        fr: 'tonnerre',
        ja: '遠雷',
        cn: '远雷',
        ko: '원뢰',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      regex: Regexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      regexDe: Regexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      regexFr: Regexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      regexJa: Regexes.startsUsing({ id: '27E0', source: '白虎' }),
      regexCn: Regexes.startsUsing({ id: '27E0', source: '白虎' }),
      regexKo: Regexes.startsUsing({ id: '27E0', source: '백호' }),
      condition: function(data, matches) {
        return data.role == 'tank' && matches.target != data.me;
      },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss abspotten',
        fr: 'Provoquez !',
        ja: '挑発',
        cn: '挑衅',
        ko: '보스 도발',
      },
      tts: {
        en: 'Provoke',
        de: 'abspotten',
        fr: 'provoquez',
        ja: '挑発',
        cn: '挑衅',
        ko: '도발',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      regex: Regexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      regexDe: Regexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      regexFr: Regexes.startsUsing({ id: '27E0', source: 'Byakko' }),
      regexJa: Regexes.startsUsing({ id: '27E0', source: '白虎' }),
      regexCn: Regexes.startsUsing({ id: '27E0', source: '白虎' }),
      regexKo: Regexes.startsUsing({ id: '27E0', source: '백호' }),
      condition: function(data, matches) {
        return data.role == 'tank' && matches.target == data.me;
      },
      delaySeconds: 12,
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss abspotten',
        fr: 'Provoquez !',
        ja: '挑発',
        cn: '挑衅',
        ko: '보스 도발',
      },
      tts: {
        en: 'Provoke',
        de: 'abspotten',
        fr: 'provoquez',
        ja: '挑発',
        cn: '挑衅',
        ko: '도발',
      },
    },
    {
      id: 'ByaEx Roar Counter',
      regex: Regexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27F9', source: '하얀 제왕', capture: false }),
      run: function(data) {
        data.roarCount = data.roarCount || 0;
        data.roarCount += 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      regex: Regexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27F9', source: 'Hakutei', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27F9', source: '白帝', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27F9', source: '하얀 제왕', capture: false }),
      delaySeconds: 14,
      alarmText: function(data) {
        if (data.roarCount != 2)
          return;

        if (data.role == 'tank') {
          return {
            en: 'Tank LB NOW',
            de: 'JETZT Tank LB',
            fr: 'LB Tank maintenant !',
            ja: '今タンクLB',
            cn: '坦克LB',
            ko: '탱리밋',
          };
        }
      },
    },
    {
      id: 'ByaEx Bubble',
      regex: Regexes.headMarker({ id: '0065' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Drop bubble outside',
        de: 'Blase außen ablegen',
        fr: 'Déposez à l\'extérieur',
        ja: '外にマーカーを置く',
        cn: '边缘放点名',
        ko: '장판 바깥에 깔기',
      },
      tts: {
        en: 'drop outside',
        de: 'außen ablegen',
        fr: 'déposez extérieur',
        ja: '外にマーカー',
        cn: '边缘放点名',
        ko: '장판 바깥으로',
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      regex: Regexes.gainsEffect({ effect: 'Ominous Wind' }),
      regexDe: Regexes.gainsEffect({ effect: 'Unheilvoller Wind' }),
      regexFr: Regexes.gainsEffect({ effect: 'Vent Mauvais' }),
      regexJa: Regexes.gainsEffect({ effect: '祟り風' }),
      regexCn: Regexes.gainsEffect({ effect: '妖风' }),
      regexKo: Regexes.gainsEffect({ effect: '불길한 바람' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Pink bubble',
        de: 'Pinke Blase',
        fr: 'Bulle violette',
        ja: '祟り目',
        cn: '泡泡',
        ko: '핑크 구슬',
      },
      tts: {
        en: 'bubble',
        de: 'blase',
        fr: 'bulle',
        ja: '祟り目',
        cn: '泡泡',
        ko: '구슬',
      },
    },
    {
      id: 'ByaEx Puddle Marker',
      regex: Regexes.headMarker({ id: '0004' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      alarmText: {
        en: 'Puddles on YOU',
        de: 'Pfützen auf DIR',
        fr: 'Mare sur VOUS',
        ja: '自分に床範囲',
        cn: '点名',
        ko: '장판 바깥에 깔기 (3번)',
      },
      tts: {
        en: 'puddles',
        de: 'pfützen',
        fr: 'mare',
        ja: '床範囲',
        cn: '点名',
        ko: '장판 바깥으로',
      },
    },
    {
      id: 'ByaEx G100',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      infoText: {
        en: 'Get away',
        de: 'Weg da',
        fr: 'Eloignez-vous',
        ja: '離れ',
        cn: '远离',
        ko: '멀리가기',
      },
      tts: {
        en: 'get away',
        de: 'weck da',
        fr: 'eloignez vous',
        ja: '離れ',
        cn: '远离',
        ko: '멀리가기',
      },
    },
    {
      id: 'ByaEx Tiger Add',
      regex: Regexes.dialog({ line: '[^:]*:Twofold is my wrath, twice-cursed my foes!.*?', capture: false }),
      regexCn: Regexes.dialog({ line: '[^:]*:半身分离，助我杀敌！向胆敢抵抗的家伙们露出你的爪牙！.*?', capture: false }),
      regexDe: Regexes.dialog({ line: '[^:]*:Stürmt los, meine zwei Gesichter!.*?', capture: false }),
      regexFr: Regexes.dialog({ line: '[^:]*:Ma colère devient double.*?!.*?', capture: false }),
      regexJa: Regexes.dialog({ line: '[^:]*:駆けろ、我が半身ッ！歯向かう者どもに、牙と爪を突き立ててやれ！.*?', capture: false }),
      regexKo: Regexes.dialog({ line: '[^:]*:달려라! 나의 반신이여! 맞서는 자들에게 이빨과 발톱을 찔러넣어라!.*?', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tiger Add',
            de: 'Tiger Add',
            fr: 'Add Tigre',
            ja: '虎分離',
            cn: '虎分离',
            ko: '호랑이 쫄',
          };
        }
      },
    },
    {
      id: 'ByaEx Stake Counter',
      regex: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27E2', source: '백호', capture: false }),
      run: function(data) {
        data.stakeCount = data.stakeCount || 0;
        data.stakeCount += 1;
      },
    },
    {
      id: 'ByaEx Stake Counter Cleanup',
      regex: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27E2', source: '백호', capture: false }),
      delaySeconds: 20,
      run: function(data) {
        delete data.stakeCount;
      },
    },
    {
      id: 'ByaEx Highest Stakes',
      regex: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexDe: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexFr: Regexes.startsUsing({ id: '27E2', source: 'Byakko', capture: false }),
      regexJa: Regexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      regexCn: Regexes.startsUsing({ id: '27E2', source: '白虎', capture: false }),
      regexKo: Regexes.startsUsing({ id: '27E2', source: '백호', capture: false }),
      infoText: function(data) {
        return {
          en: 'Stack #' + data.stakeCount,
          de: 'Stack #' + data.stakeCount,
          fr: 'Stack #' + data.stakeCount,
          cn: '集合 #' + data.stakeCount,
          ko: '쉐어 #' + data.stakeCount,
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'All creation trembles before my might!': 'Himmel und Erde, erzittert!',
        'Aratama Force': 'Aratama-Kraft',
        'Aratama Soul': 'Aratama-Seele',
        'Byakko': 'Byakko',
        'Hakutei': 'Hakutei',
        'There is no turning back!': 'Mein Jagdtrieb ist erwacht!',
        'Twofold is my wrath, twice-cursed my foes!': 'Stürmt los, meine zwei Gesichter!',
      },
      'replaceText': {
        'Answer On High': 'Himmlische Antwort',
        'Aratama': 'Einschlag',
        'Bombogenesis': 'Plötzliches Orkantief',
        'Clutch': 'Umklammerung',
        'Dance Of The Incomplete': 'Tanz der zwei Gesichter',
        'Distant Clap': 'Donnergrollen',
        'Donut AOE': 'Donut AoE',
        'Fell Swoop': 'Auf einen Streich',
        'Fire And Lightning': 'Feuer und Blitz',
        'Gale Force': 'Orkan',
        'Hakutei Add': 'Hakutei Add',
        'Heavenly Strike': 'Himmlischer Schlag',
        'Highest Stakes': 'Höchstes Risiko',
        'Hundredfold Havoc': 'Hundertfache Verwüstung',
        'Imperial Guard': 'Herbststurm',
        'Line AOE': 'Linien AoE',
        'Ominous Wind': 'Unheilvoller Wind',
        'Orb Marker': 'Orb Marker',
        'Puddle Markers': 'Flächen Marker',
        'Roar Of Thunder': 'Brüllen Des Donners',
        'State Of Shock': 'Bannblitze',
        'Steel Claw': 'Stahlklaue',
        'Storm Pulse': 'Gewitterwelle',
        'Sweep The Leg': 'Vertikalität',
        'TP Orbs': 'TP Orbs',
        'The Roar Of Thunder': 'Brüllen des Donners',
        'The Voice Of Thunder': 'Stimme des Donners',
        'Tiger Cleave': 'Tiger Cleave',
        'Unrelenting Anguish': 'Pandämonium',
        'Vacuum Claw': 'Vakuumklaue',
        'White Herald': 'Herbstböe',
        'leap middle': 'Sprung in die Mitte',
        'leap north': 'Sprung nach Norden',
        'tiger lands': 'Tiger landet',
        'tiger untargetable': 'Tiger nicht anvisierbar',
      },
      '~effectNames': {
        'Area Of Influence Up': 'Erweiterter Radius',
        'Down For The Count': 'Am Boden',
        'Falling': 'Freier Fall',
        'Fetters': 'Gefesselt',
        'Ominous Wind': 'Unheilvoller Wind',
        'Paralysis': 'Paralyse',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'All creation trembles before my might!': 'Tremblez devant mon pouvoir !',
        'Aratama Force': 'aramitama',
        'Aratama Soul': 'Aramitama',
        'Byakko': 'Byakko',
        'Hakutei': 'Hakutei',
        'There is no turning back!': 'Grrraaaah ! ... Trop tard pour les regrets !',
      },
      'replaceText': {
        'Answer On High': 'Foudre céleste',
        'Aratama': 'Aratama',
        'Bombogenesis': 'Bombogénèse',
        'Clutch': 'Empoignement',
        'Dance Of The Incomplete': 'Danse semi-bestiale',
        'Distant Clap': 'Tonnerre lointain',
        'Fell Swoop': 'Éléments déchaînés',
        'Fire And Lightning': 'Feu et foudre',
        'Gale Force': 'Coup de rafale',
        'Heavenly Strike': 'Frappe céleste',
        'Highest Stakes': 'Tout pour le tout',
        'Hundredfold Havoc': 'Ravages centuples',
        'Imperial Guard': 'Garde impériale',
        'Ominous Wind': 'Vent mauvais',
        'State Of Shock': 'Foudroiement brutal',
        'Steel Claw': 'Griffe d\'acier',
        'Storm Pulse': 'Pulsion de tempête',
        'Sweep The Leg': 'Verticalité',
        'The Roar Of Thunder': 'Rugissement du tonnerre',
        'The Voice Of Thunder': 'Voix du tonnerre',
        'Unrelenting Anguish': 'Douleur continuelle',
        'Vacuum Claw': 'Griffe de vide',
        'White Herald': 'Héraut blanc',
      },
      '~effectNames': {
        'Area Of Influence Up': 'Aire D\'effet Augmentée',
        'Down For The Count': 'Au Tapis',
        'Falling': 'Chute Libre',
        'Fetters': 'Empoignement',
        'Ominous Wind': 'Vent Mauvais',
        'Paralysis': 'Paralysie',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'All creation trembles before my might!': '震天動地の力を、見せてやろうッ！',
        'Aratama Force': '荒弾',
        'Aratama Soul': '荒魂',
        'Byakko': '白虎',
        'Hakutei': '白帝',
        'There is no turning back!': 'オオオオオ……この衝動、もはや止められん！',
      },
      'replaceText': {
        'Answer On High': '天つ雷',
        'Aratama': '着弾',
        'Bombogenesis': '爆弾低気圧',
        'Clutch': '掌握',
        'Dance Of The Incomplete': '半獣舞踏',
        'Distant Clap': '遠雷',
        'Fell Swoop': '迅雷風烈波',
        'Fire And Lightning': '雷火一閃',
        'Gale Force': '暴風',
        'Heavenly Strike': '天雷掌',
        'Highest Stakes': '乾坤一擲',
        'Hundredfold Havoc': '百雷繚乱',
        'Imperial Guard': '白帝一陣',
        'Ominous Wind': '祟り風',
        'State Of Shock': '呪縛雷',
        'Steel Claw': '鉄爪斬',
        'Storm Pulse': '風雷波動',
        'Sweep The Leg': '旋体脚',
        'The Roar Of Thunder': '雷轟',
        'The Voice Of Thunder': '雷声',
        'Unrelenting Anguish': '無間地獄',
        'Vacuum Claw': '真空爪',
        'White Herald': '白帝衝',
      },
      '~effectNames': {
        'Area Of Influence Up': 'アクション効果範囲拡大',
        'Down For The Count': 'ノックダウン',
        'Falling': '自由落下',
        'Fetters': '拘束',
        'Ominous Wind': '祟り風',
        'Paralysis': '麻痺',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Stun': 'スタン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'All creation trembles before my might!': '世间万物皆因天惊地动而颤抖！',
        'Aratama Force': '荒弹',
        'Aratama Soul': '荒魂',
        'Byakko': '白虎',
        'Hakutei': '白帝',
        'There is no turning back!': '我体内的冲动已无法抑制！',
      },
      'replaceText': {
        'Answer On High': '天雷',
        'Aratama': '荒弹',
        'Bombogenesis': '炸弹低气压',
        'Clutch': '紧握',
        'Dance Of The Incomplete': '半兽舞蹈',
        'Distant Clap': '远雷',
        'Donut AOE': '月环',
        'Fell Swoop': '迅雷风烈波',
        'Fire And Lightning': '雷火一闪',
        'Gale Force': '暴风',
        'Hakutei Add': '白帝出现',
        'Heavenly Strike': '天雷掌',
        'Highest Stakes': '乾坤一掷',
        'Hundredfold Havoc': '百雷缭乱',
        'Imperial Guard': '白帝降临',
        'Line AOE': '直线AOE',
        'Ominous Wind': '妖风',
        'Orb Marker': '点名',
        'Puddle Markers': '点名',
        'Roar Of Thunder': '雷轰',
        'State Of Shock': '咒缚雷',
        'Steel Claw': '铁爪斩',
        'Storm Pulse': '风雷波动',
        'Sweep The Leg': '旋体脚',
        'TP Orbs': '撞球',
        'The Roar Of Thunder': '雷轰',
        'The Voice Of Thunder': '雷声',
        'Tiger Cleave': '白帝爪',
        'Unrelenting Anguish': '无间地狱',
        'Vacuum Claw': '真空爪',
        'White Herald': '白帝冲',
        'leap middle': '跳中间',
        'leap north': '跳北',
        'tiger lands': '白帝落地',
        'tiger untargetable': '白帝无法选中',
      },
      '~effectNames': {
        'Area Of Influence Up': '扩大技能效果范围',
        'Down For The Count': '击倒',
        'Falling': '自由落体',
        'Fetters': '拘束',
        'Ominous Wind': '妖风',
        'Paralysis': '麻痹',
        'Physical Vulnerability Up': '物理受伤加重',
        'Stun': '眩晕',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'All creation trembles before my might!': '천지를 뒤흔드는 힘을 보여주지!',
        'Byakko': '백호',
        'Hakutei': '하얀 제왕',
        'There is no turning back!': '오오오오오…… 이 충동, 더는 억누를 수 없다!',
      },
      'replaceText': {
        'Answer On High': '하늘의 번개',
        'Aratama': '아라미타마 탄환',
        'Bombogenesis': '폭탄 저기압',
        'Clutch': '장악',
        'Dance Of The Incomplete': '반수의 춤',
        'Distant Clap': '원뢰',
        'Donut AOE': '도넛 장판',
        'Fell Swoop': '신뢰풍렬파',
        'Fire And Lightning': '뇌화일섬',
        'Gale Force': '폭풍',
        'Add': '쫄',
        'Heavenly Strike': '천뢰장',
        'Highest Stakes': '건곤일척',
        'Hundredfold Havoc': '백뢰요란',
        'Imperial Guard': '제왕의 진격',
        'Line AOE': '직선 장판',
        'Ominous Wind': '불길한 바람',
        'Orb Marker': '장판 징',
        'Puddle Markers': '장판 징',
        'Roar Of Thunder': '뇌굉',
        'State Of Shock': '주박뢰',
        'Steel Claw': '강철 발톱',
        'Storm Pulse': '풍뢰파동',
        'Sweep The Leg': '돌려차기',
        'TP Orbs': '구슬',
        'The Voice Of Thunder': '뇌성',
        'Tiger Cleave': '호랑이 범위 탱버',
        'Unrelenting Anguish': '무간지옥',
        'Vacuum Claw': '진공 할퀴기',
        'White Herald': '제왕의 충격',
        'leap middle': '보스 중앙으로 이동',
        'leap north': '보스 북쪽으로 이동',
        'tiger lands': '호랑이 착지',
        'tiger untargetable': '호랑이 타겟 불가',
      },
      '~effectNames': {
        'Area Of Influence Up': '기술 범위 확대',
        'Down For The Count': '넉다운',
        'Falling': '자유 낙하',
        'Fetters': '구속',
        'Ominous Wind': '불길한 바람',
        'Paralysis': '마비',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Stun': '기절',
      },
    },
  ],
}];
