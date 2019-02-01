'use strict';

// Byakko Extreme
[{
  zoneRegex: /^The Jade Stoa \(Extreme\)$/,
  timelineFile: 'byakko-ex.txt',
  triggers: [
    {
      id: 'ByaEx Heavenly Strike',
      regex: / 14:27DA:Byakko starts using Heavenly Strike on (\y{Name})/,
      regexDe: / 14:27DA:Byakko starts using Himmlischer Schlag on (\y{Name})/,
      regexFr: / 14:27DA:Byakko starts using Frappe Céleste on (\y{Name})/,
      regexJa: / 14:27DA:白虎 starts using 天雷掌 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            ja: '自分にタンク即死級',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
            ja: 'タンク即死級に' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'タンク即死級',
          };
        }
      },
    },
    {
      id: 'ByaEx Flying Donut',
      regex: / 14:27F4:Byakko starts using Sweep The Leg/,
      regexDe: / 14:27F4:Byakko starts using Vertikalität/,
      regexFr: / 14:27F4:Byakko starts using Verticalité/,
      regexJa: / 14:27F4:白虎 starts using 旋体脚/,
      alertText: function(data, matches) {
        return {
          en: 'Get Inside',
          de: 'Reingehen',
          fr: 'Allez au centre',
          ja: '密着',
        };
      },
      tts: {
        en: 'inside',
        de: 'rein',
        fr: 'centre',
        ja: '密着',
      },
    },
    {
      id: 'ByaEx Sweep The Leg',
      regex: / 14:27DB:Byakko starts using Sweep The Leg/,
      regexDe: / 14:27DB:Byakko starts using Vertikalität/,
      regexFr: / 14:27DB:Byakko starts using Verticalité/,
      regexJa: / 14:27DB:白虎 starts using 旋体脚/,
      alertText: function(data, matches) {
        return {
          en: 'Get Behind',
          de: 'Hinter ihn laufen',
          fr: 'Allez derrière le boss',
          ja: '後ろ',
        };
      },
      tts: {
        en: 'behind',
        de: 'hinter ihn',
        fr: 'derrière',
        ja: '後ろ',
      },
    },
    {
      id: 'ByaEx Storm Pulse',
      regex: / 14:27DC:Byakko starts using Storm Pulse/,
      regexDe: / 14:27DC:Byakko starts using Gewitterwelle/,
      regexFr: / 14:27DC:Byakko starts using Pulsion De Tempête/,
      regexJa: / 14:27DC:白虎 starts using 風雷波動/,
      infoText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'AOE',
            de: 'AoE',
            fr: 'AoE',
            ja: 'AoE',
          };
        }
      },
      tts: {
        en: 'aoe',
        de: 'a o e',
        fr: ' a o e',
        ja: 'AoE',
      },
    },
    {
      id: 'ByaEx Distant Clap',
      regex: / 14:27DD:Byakko starts using Distant Clap on Byakko/,
      regexDe: / 14:27DD:Byakko starts using Donnergrollen on Byakko/,
      regexFr: / 14:27DD:Byakko starts using Tonnerre Lointain on Byakko/,
      regexJa: / 14:27DD:白虎 starts using 遠雷 on 白虎/,
      alertText: function(data, matches) {
        return {
          en: 'Distant Clap',
          de: 'Donnergrollen',
          fr: 'Tonnerre Lointain',
          ja: '遠雷',
        };
      },
      tts: {
        en: 'clap',
        de: 'grollen',
        fr: 'tonnerre',
        ja: '遠雷',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 1',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      regexFr: / 14:27E0:Byakko starts using État De Choc on (\y{Name})/,
      regexJa: / 14:27E0:白虎 starts using 呪縛雷 on (\y{Name})/,
      condition: function(data, matches) {
        return data.role == 'tank' && matches[1] != data.me;
      },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss abspotten',
        fr: 'Provoquez !',
        ja: '挑発',
      },
      tts: {
        en: 'Provoke',
        de: 'abspotten',
        fr: 'provoquez',
        ja: '挑発',
      },
    },
    {
      id: 'ByaEx State Of Shock Tank 2',
      regex: / 14:27E0:Byakko starts using State Of Shock on (\y{Name})/,
      regexDe: / 14:27E0:Byakko starts using Bannblitze on (\y{Name})/,
      regexFr: / 14:27E0:Byakko starts using État De Choc on (\y{Name})/,
      regexJa: / 14:27E0:白虎 starts using 呪縛雷 on (\y{Name})/,
      delaySeconds: 12,
      condition: function(data, matches) {
        return data.role == 'tank' && matches[1] == data.me;
      },
      alertText: {
        en: 'Provoke Boss',
        de: 'Boss abspotten',
        fr: 'Provoquez !',
        ja: '挑発',
      },
      tts: {
        en: 'Provoke',
        de: 'abspotten',
        fr: 'provoquez',
        ja: '挑発',
      },
    },
    {
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      regexFr: / 14:27F9:Hakutei starts using Rugissement Du Tonnerre/,
      regexJa: / 14:27F9:Hakutei starts using 雷轟/,
      run: function(data) {
        data.roarCount = data.roarCount || 0;
        data.roarCount += 1;
      },
    },
    {
      id: 'ByaEx Roar of Thunder',
      regex: / 14:27F9:Hakutei starts using The Roar Of Thunder/,
      regexDe: / 14:27F9:Hakutei starts using Brüllen Des Donners/,
      regexFr: / 14:27F9:Hakutei starts using Rugissement Du Tonnerre/,
      regexJa: / 14:27F9:白帝 starts using 雷轟/,
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
          };
        }
      },
    },
    {
      id: 'ByaEx Bubble',
      regex: /1B:........:(\y{Name}):....:....:0065:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Drop bubble outside',
          de: 'Blase außen ablegen',
          fr: 'Déposez à l\'extérieur',
          ja: '外にマーカーを置く',
        };
      },
      tts: {
        en: 'drop outside',
        de: 'außen ablegen',
        fr: 'déposez extérieur',
        ja: '外にマーカー',
      },
    },
    {
      id: 'ByaEx Ominous Wind',
      regex: /1A:(\y{Name}) gains the effect of Ominous Wind/,
      regexDe: /1A:(\y{Name}) gains the effect of Unheilvoller Wind/,
      regexFr: /1A:(\y{Name}) gains the effect of Vent Mauvais/,
      regexJa: /1A:(\y{Name}) gains the effect of 祟り目/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Pink bubble',
          de: 'Pinke Blase',
          fr: 'Bulle violette',
          ja: '祟り目',
        };
      },
      tts: {
        en: 'bubble',
        de: 'blase',
        fr: 'bulle',
        ja: '祟り目',
      },
    },
    {
      id: 'ByaEx Puddle Marker',
      regex: /1B:........:(\y{Name}):....:....:0004:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: function(data) {
        return {
          en: 'Puddles on YOU',
          de: 'Pfützen auf DIR',
          fr: 'Mare sur VOUS',
          ja: '自分に床範囲',
        };
      },
      tts: {
        en: 'puddles',
        de: 'pfützen',
        fr: 'mare',
        ja: '床範囲',
      },
    },
    {
      id: 'ByaEx G100',
      regex: /1B:........:(\y{Name}):....:....:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      infoText: function(data) {
        return {
          en: 'Get away',
          de: 'Weg da',
          fr: 'Eloignez-vous',
          ja: '離れる',
        };
      },
      tts: {
        en: 'get away',
        de: 'weck da',
        fr: 'eloignez vous',
        ja: '離れる',
      },
    },
    {
      id: 'ByaEx Tiger Add',
      regex: / 00:0044:Twofold is my wrath, twice-cursed my foes!/,
      regexDe: / 00:0044:Stürmt los, meine zwei Gesichter!/,
      regexFr: / 00:0044:Ma colère devient double.*?!/,
      regexJa: / 00:0044:駆けろ、我が半身ッ！歯向かう者どもに、牙と爪を突き立ててやれ！/,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tiger Add',
            de: 'Tiger Add',
            fr: 'Add Tigre',
            ja: '虎分離',
          };
        }
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      regexFr: / 14:27E2:Byakko starts using Tout Pour Le Tout/,
      regexJa: / 14:27E2:Byakko starts using 乾坤一擲/,
      run: function(data) {
        data.stakeCount = data.stakeCount || 0;
        data.stakeCount += 1;
      },
    },
    {
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      regexFr: / 14:27E2:Byakko starts using Tout Pour Le Tout/,
      regexJa: / 14:27E2:Byakko starts using 乾坤一擲/,
      delaySeconds: 20,
      run: function(data) {
        delete data.stakeCount;
      },
    },
    {
      id: 'ByaEx Highest Stakes',
      regex: / 14:27E2:Byakko starts using Highest Stakes/,
      regexDe: / 14:27E2:Byakko starts using Höchstes Risiko/,
      regexFr: / 14:27E2:Byakko starts using Tout Pour Le Tout/,
      regexJa: / 14:27E2:Byakko starts using 乾坤一擲/,
      infoText: function(data) {
        return {
          en: 'Stack #' + data.stakeCount,
          de: 'Stack #' + data.stakeCount,
          fr: 'Stack #' + data.stakeCount,
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aratama Force': 'Aratama-Kraft',
        'Aratama Soul': 'Aratama-Seele',
        'Byakko': 'Byakko',
        'Engage!': 'Start!',
        'Hakutei': 'Hakutei',

        // FIXME
        'There is no turning back!': 'There is no turning back!',
        'All creation trembles before my might!': 'All creation trembles before my might!',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Answer On High': 'Himmlische Antwort',
        'Aratama': 'Einschlag',
        'Bombogenesis': 'Plötzliches Orkantief',
        'Clutch': 'Umklammerung',
        'Dance Of The Incomplete': 'Tanz Der Zwei Gesichter',
        'Distant Clap': 'Donnergrollen',
        'Enrage': 'Finalangriff',
        'Fell Swoop': 'Auf Einen Streich',
        'Fire And Lightning': 'Feuer Und Blitz',
        'Gale Force': 'Orkan',
        'Heavenly Strike': 'Himmlischer Schlag',
        'Highest Stakes': 'Höchstes Risiko',
        'Hundredfold Havoc': 'Hundertfache Verwüstung',
        'Imperial Guard': 'Herbststurm',
        'Ominous Wind': 'Unheilvoller Wind',
        'State Of Shock': 'Bannblitze',
        'Steel Claw': 'Stahlklaue',
        'Storm Pulse': 'Gewitterwelle',
        'Sweep The Leg': 'Vertikalität',
        'The Roar Of Thunder': 'Brüllen Des Donners',
        'The Voice Of Thunder': 'Stimme Des Donners',
        'Unrelenting Anguish': 'Pandämonium',
        'Vacuum Claw': 'Vakuumklaue',
        'White Herald': 'Herbstböe',

        // FIXME
        'leap north': 'leap north',
        'Puddle Markers': 'Puddle Markers',
        'Hakutei Add': 'Hakutei Add',
        'Tiger Cleave': 'Tiger Cleave',
        'tiger untargetable': 'tiger untargetable',
        'tiger lands': 'tiger lands',
        'TP Orbs': 'TP Orbs',
        'Roar Of Thunder': 'Brüllen Des Donners',
        'Donut AOE': 'Donut AOE',
        'Line AOE': 'Line AOE',
        'Orb Marker': 'Orb Marker',
        'leap middle': 'leap middle',
      },
      '~effectNames': {
        'Area Of Influence Up': 'Erweiterter Radius',
        'Down For The Count': 'Am Boden',
        'Falling': 'Freier Fall',
        'Fetters': 'Gefesselt',
        'Ominous Wind': 'Unheilvoller Wind',
        'Paralysis': 'Paralyse',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aratama Force': 'Aramitama',
        'Aratama Soul': 'Aramitama',
        'Byakko': 'Byakko',
        'Engage!': 'À l\'attaque',
        'Hakutei': 'Byakko',

        // FIXME
        'There is no turning back!': 'There is no turning back!',
        'All creation trembles before my might!': 'All creation trembles before my might!',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Answer On High': 'Foudre Céleste',
        'Aratama': 'Aratama',
        'Bombogenesis': 'Bombogénèse',
        'Clutch': 'Empoignement',
        'Dance Of The Incomplete': 'Danse Semi-bestiale',
        'Distant Clap': 'Tonnerre Lointain',
        'Enrage': 'Enrage',
        'Fell Swoop': 'Éléments Déchaînés',
        'Fire And Lightning': 'Feu Et Foudre',
        'Gale Force': 'Coup De Rafale',
        'Heavenly Strike': 'Frappe Céleste',
        'Highest Stakes': 'Tout Pour Le Tout',
        'Hundredfold Havoc': 'Ravages Centuples',
        'Imperial Guard': 'Garde Impériale',
        'Ominous Wind': 'Vent Mauvais',
        'State Of Shock': 'État De Choc',
        'Steel Claw': 'Griffe D\'acier',
        'Storm Pulse': 'Pulsion De Tempête',
        'Sweep The Leg': 'Verticalité',
        'The Roar Of Thunder': 'Rugissement Du Tonnerre',
        'The Voice Of Thunder': 'Voix Du Tonnerre',
        'Unrelenting Anguish': 'Douleur Continuelle',
        'Vacuum Claw': 'Griffe De Vide',
        'White Herald': 'Héraut Blanc',

        // FIXME
        'leap north': 'leap north',
        'Puddle Markers': 'Puddle Markers',
        'Hakutei Add': 'Hakutei Add',
        'Tiger Cleave': 'Tiger Cleave',
        'tiger untargetable': 'tiger untargetable',
        'tiger lands': 'tiger lands',
        'TP Orbs': 'TP Orbs',
        'Roar Of Thunder': 'Brüllen Des Donners',
        'Donut AOE': 'Donut AOE',
        'Line AOE': 'Line AOE',
        'Orb Marker': 'Orb Marker',
        'leap middle': 'leap middle',
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
      'replaceSync': {
        'Aratama Force': '荒弾',
        'Aratama Soul': '荒魂',
        'Byakko': '白虎',
        'Engage!': '戦闘開始！',
        'Hakutei': '白帝',

        // FIXME
        'There is no turning back!': 'There is no turning back!',
        'All creation trembles before my might!': 'All creation trembles before my might!',
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

        // FIXME
        'leap north': 'leap north',
        'Puddle Markers': 'Puddle Markers',
        'Hakutei Add': 'Hakutei Add',
        'Tiger Cleave': 'Tiger Cleave',
        'tiger untargetable': 'tiger untargetable',
        'tiger lands': 'tiger lands',
        'TP Orbs': 'TP Orbs',
        'Roar Of Thunder': 'Brüllen Des Donners',
        'Donut AOE': 'Donut AOE',
        'Line AOE': 'Line AOE',
        'Orb Marker': 'Orb Marker',
        'leap middle': 'leap middle',
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
  ],
}];
