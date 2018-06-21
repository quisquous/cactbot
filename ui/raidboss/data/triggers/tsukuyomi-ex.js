'use strict';

// Tsukuyomi Extreme
[{
  zoneRegex: /^The Minstrel's Ballad: Tsukuyomi's Pain$/,
  timelineFile: 'tsukuyomi-ex.txt',
  triggers: [
    {
      id: 'Tsukuyomi Nightfall Gun',
      regex: / 14:2BBC:Tsukuyomi starts using Nightfall/,
      regexDe: / 14:2BBC:Tsukuyomi starts using Einbruch Der Dunkelheit/,
      regexFr: / 14:2BBC:Tsukuyomi starts using Jeune Nuit/,
      alertText: {
        en: 'Gun: Stack',
        de: 'Pistole: Stack',
        fr: 'Pistolet : Pack',
      },
    },
    {
      id: 'Tsukuyomi Nightfall Spear',
      regex: / 14:2BBD:Tsukuyomi starts using Nightfall/,
      regexDe: / 14:2BBD:Tsukuyomi starts using Einbruch Der Dunkelheit/,
      regexFr: / 14:2BBD:Tsukuyomi starts using Jeune Nuit/,
      alertText: {
        en: 'Spear: Spread',
        de: 'Speer: Verteilen',
        fr: 'Lance : Ecartez-vous',
      },
    },
    {
      id: 'Tsukuyomi Torment',
      regex: / 14:(?:2BBB|2EB2):Tsukuyomi starts using Torment Unto Death on (\y{Name})/,
      regexDe: / 14:(?:2BBB|2EB2):Tsukuyomi starts using Todesqualen on (\y{Name})/,
      regexFr: / 14:(?:2BBB|2EB2):Tsukuyomi starts using Brimade Meurtrière on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'tank')
          return;

        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
        };
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role == 'tank' || data.role == 'healer')
          return;

        return {
          en: 'Get out of front',
          de: 'Weg von vorn',
          fr: 'Ne restez pas devant !',
        };
      },
      tts: function(data, matches) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      regex: /:Tsukuyomi gains the effect of Full Moon/,
      regexDe: /:Tsukuyomi gains the effect of Vollmond/,
      regexFr: /:Tsukuyomi gains the effect of Force De La Pleine Lune/,
      run: function(data) {
        let moonInOut = {
          en: 'Out',
          de: 'Raus',
          fr: 'Loin',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      regex: /:Tsukuyomi gains the effect of New Moon/,
      regexDe: /:Tsukuyomi gains the effect of Neumond/,
      regexFr: /:Tsukuyomi gains the effect of Force De La Nouvelle Lune/,
      run: function(data) {
        let moonInOut = {
          en: 'In',
          de: 'Rein',
          fr: 'Près',
        };
        data.moonInOut = moonInOut[data.lang] || moonInOut['en'];
      },
    },
    {
      id: 'Tsukuyomi Dark Blade',
      regex: / 14:2BDA:Tsukuyomi starts using Dark Blade/,
      regexDe: / 14:2BDA:Tsukuyomi starts using Dunkle Klinge/,
      regexFr: / 14:2BDA:Tsukuyomi starts using Lame Ténébreuse/,
      infoText: function(data) {
        return {
          en: 'Left + ' + data.moonInOut,
          fr: 'Gauche + ' + data.moonInOut,
          de: 'Links + ' + data.moonInOut,
        };
      },
    },
    {
      id: 'Tsukuyomi Bright Blade',
      regex: / 14:2BDB:Tsukuyomi starts using Bright Blade/,
      regexDe: / 14:2BDB:Tsukuyomi starts using Helle Klinge/,
      regexFr: / 14:2BDB:Tsukuyomi starts using Lame Blafarde/,
      infoText: function(data) {
        return {
          en: 'Right + ' + data.moonInOut,
          fr: 'Droite + ' + data.moonInOut,
          de: 'Rechts + ' + data.moonInOut,
        };
      },
    },
    {
      id: 'Tsukuyomi Meteor Marker',
      regex: / 1B:........:(\y{Name}):....:....:0083:0000:0000:0000:/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      alarmText: {
        en: 'Meteor on YOU',
        de: 'Meteor auf DIR',
        fr: 'Météore sur VOUS',
      },
    },
    {
      id: 'Tsukuyomi Lunacy',
      regex: / 1B:........:(\y{Name}):....:....:003E:0000:0000:0000:/,
      alertText: {
        en: 'Stack',
        de: 'Stack',
        fr: 'Pack',
      },
    },
    {
      id: 'Tsukuyomi Hagetsu',
      regex: / 1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'Tsukuyomi Dance of the Dead',
      // There's no "starts using" here.  She pushes at 35% to this ability.
      // This happens after 2nd meteors naturally, but if dps is good
      // then this could push unexpectedly earlier (or paired with buster).
      regex: /00:0044:No\. No\.\.\. Not yet\. Not\. Yet\./,
      regexFr: /00:0044:Non\, je ne peux pas\.\.\. échouer\.\.\./,
      infoText: {
        en: 'aoe',
        de: 'aoe',
        fr: 'aoe',
      },
      tts: {
        en: 'aoe',
        de: 'a o e',
        fr: 'a o e',
      },
    },
    {
      id: 'Tsukuyomi Supreme Selenomancy',
      regex: /:Tsukuyomi:2EB0:/,
      run: function(data) {
        delete data.moonlitCount;
        delete data.moonshadowedCount;
      },
      suppressSeconds: 5,
    },
    {
      id: 'Tsukuyomi Moonlit Debuff Logic',
      regex: / 1A:(\y{Name}) gains the effect of Moonlit/,
      regexDe: / 1A:(\y{Name}) gains the effect of Mondschein/,
      regexFr: / 1A:(\y{Name}) gains the effect of Pleine Lune/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonlitCount === 'undefined')
          data.moonlitCount = 3;

        data.moonlitCount += 1;
        data.moonshadowedCount = 0;
        // dead/reset?
        if (data.moonlitCount > 4)
          data.moonlitCount = 0;
      },
    },
    {
      id: 'Tsukuyomi Moonlit Debuff',
      regex: / 1A:(\y{Name}) gains the effect of Moonlit/,
      regexDe: / 1A:(\y{Name}) gains the effect of Mondschein/,
      regexFr: / 1A:(\y{Name}) gains the effect of Pleine Lune/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.moonlitCount >= 4;
      },
      infoText: {
        en: 'Move to Black!',
        de: 'In\'s schwarze laufen!',
        fr: 'Bougez en zone noire !',
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff Logic',
      regex: / 1A:(\y{Name}) gains the effect of Moonshadowed/,
      regexDe: / 1A:(\y{Name}) gains the effect of Mondschatten/,
      regexFr: / 1A:(\y{Name}) gains the effect of Nouvelle Lune/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      preRun: function(data) {
        // init at 3 so we can start at 4 stacks to give the initial instruction to move
        if (typeof data.moonshadowedCount === 'undefined')
          data.moonshadowedCount = 3;

        data.moonshadowedCount += 1;
        data.moonlitCount = 0;
        // dead/reset?
        if (data.moonshadowedCount > 4)
          data.moonshadowedCount = 0;
      },
    },
    {
      id: 'Tsukuyomi Moonshadowed Debuff',
      regex: / 1A:(\y{Name}) gains the effect of Moonshadowed/,
      regexDe: / 1A:(\y{Name}) gains the effect of Mondschatten/,
      regexFr: / 1A:(\y{Name}) gains the effect of Nouvelle Lune/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.moonshadowedCount >= 4;
      },
      infoText: {
        en: 'Move to White!',
        de: 'In\'s weiße laufen!',
        fr: 'Bougez en zone blanche !',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Dancing Fan': 'Tanzend[a] Fächer',
        'Engage!': 'Start!',
        'Specter': 'Schemen',
        'Specter Of Asahi': 'Asahi',
        'Specter Of The Empire': 'Garleisch[a] Soldat',
        'Specter Of The Homeland': 'Domaner',
        'Specter Of The Matriarch': 'Yotsuyus Ziehmutter',
        'Specter Of The Patriarch': 'Yotsuyus Ziehvater',
        'Specter Of Zenos': 'Zenos',
        'Tsukuyomi': 'Tsukuyomi',

        'Moondust': 'Mondfragment',
        'Moonlight': 'Mondlichtkugel',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Bright Blade': 'Helle Klinge',
        'Concentrativity': 'Konzentriertheit',
        'Crater': 'Krater',
        'Dance Of The Dead': 'Tanz Der Toten',
        'Dark Blade': 'Dunkle Klinge',
        'Dispersivity': 'Dispersivität',
        'Enrage': 'Finalangriff',
        'Hagetsu': 'Hagetsu',
        'Lead Of The Underworld': 'Blei Der Unterwelt',
        'Lunacy': 'Mondscheinblüte',
        'Lunar Halo': 'Flammender Mond',
        'Lunar Rays': 'Mondschimmer',
        'Midnight Rain': 'Mitternachtsregen',
        'Moonbeam': 'Mondstrahl',
        'Moonfall': 'Mondfall',
        'Nightbloom': 'Monddämmerung',
        'Nightfall': 'Einbruch Der Dunkelheit',
        'Perilune': 'Zenit Des Mondes',
        'Reprimand': 'Maßregelung',
        'Steel Of The Underworld': 'Stahl Der Unterwelt',
        'Supreme Selenomancy': 'Hohe Mondprophezeiung',
        'Torment Unto Death': 'Todesqualen',
        'Tsuki-no-Kakera': 'Mondsplitter',
        'Tsuki-no-Maiogi': 'Mondfächer',
        'Unmoving Troika': 'Unbewegte Troika',
        'Waning Grudge': 'Schwindender Groll',
        'Waxing Grudge': 'Wachsender Groll',
        'Zashiki-asobi': 'Zashiki-Asobi',

        'Lead/Steel': 'Blei/Stahl',
        'Steel/Lead': 'Stahl/Blei',
        'Homeland adds .E->W.': 'Domaner Adds (O->W)',
        'Empire adds .SW->NW.': 'Garlear Adds (SW->NW)',
        'Moonburst': 'Mondeinschlag',
        'Antitwilight': 'Schönheit Der Nacht',
      },
      '~effectNames': {
        'Bleeding': 'Blutung',
        'Damage Down': 'Schaden -',
        'Doom': 'Verhängnis',
        'Down For The Count': 'Am Boden',
        'Grudge': 'Groll',
        'Haunt': 'Verfolgung',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Moonlit': 'Mondschein',
        'Moonshadowed': 'Mondschatten',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Stun': 'Betäubung',
        'Transfiguration': 'Verwandlung',
        'Veil Of Light': 'Lichtschleier',
        'Veil Of Shadow': 'Schattenschleier',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dancing Fan': 'Maiôgi',
        'Engage!': 'À l\'attaque',
        'Specter': 'Spectre',
        'Specter Of Asahi': 'Apparition d\'Asahi',
        'Specter Of The Empire': 'Spectre de soldat impérial',
        'Specter Of The Homeland': 'Spectre de Domien',
        'Specter Of The Matriarch': 'Spectre de la marâtre',
        'Specter Of The Patriarch': 'Spectre du parâtre',
        'Specter Of Zenos': 'Spectre de Zenos',
        'Tsukuyomi': 'Tsukuyomi',
        'Moondust': 'Fragment de lune',
        'Moonlight': 'Flamboiement Lunaire',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Bright Blade': 'Lame Blafarde',
        'Concentrativity': 'Kenki Concentré',
        'Crater': 'Explosion De Fragment Lunaire',
        'Dance Of The Dead': 'Danse Des Morts',
        'Dark Blade': 'Lame Ténébreuse',
        'Dispersivity': 'Onde Kenki',
        'Enrage': 'Enragement',
        'Hagetsu': 'Pulvérisation Lunaire',
        'Lead Of The Underworld': 'Tir De L\'au-delà',
        'Lunacy': 'Efflorescence Au Clair De Lune',
        'Lunar Halo': 'Flamboiement Lunaire',
        'Lunar Rays': 'Rayons Lunaires',
        'Midnight Rain': 'Bruine Nocturne',
        'Moonbeam': 'Faisceau Lunaire',
        'Moonfall': 'Impact De Fragment Lunaire',
        'Nightbloom': 'Lis Araignée',
        'Nightfall': 'Jeune Nuit',
        'Perilune': 'Zénith Lunaire',
        'Reprimand': 'Correction',
        'Steel Of The Underworld': 'Pointes De L\'au-delà',
        'Supreme Selenomancy': 'Sélénomancie Suprême',
        'Torment Unto Death': 'Brimade Meurtrière',
        'Tsuki-no-Kakera': 'Fragments Lunaires',
        'Tsuki-no-Maiogi': 'Maiôgi Lunaire',
        'Unmoving Troika': 'Troïka Immobile',
        'Waning Grudge': 'Rancœur Ténébreuse',
        'Waxing Grudge': 'Rancœur Blafarde',
        'Zashiki-asobi': 'Zashiki Asobi',
        'Homeland adds .E->W.': 'Soldats Domiens (E->O)',
        'Empire adds .SW->NW.': 'Soldats Impériaux (SO->NO)',
        'Moonburst': 'Entrechoc De Fragments Lunaires',
        'Antitwilight': 'Belle-de-nuit',
        'Lead/Steel': 'Tir De L\'au-delà/Pointes De L\'au-delà',
        'Steel/Lead': 'Pointes De L\'au-delà/Tir De L\'au-delà',
      },
      '~effectNames': {
        'Bleeding': 'Saignant',
        'Damage Down': 'Malus De Dégâts',
        'Doom': 'Glas',
        'Down For The Count': 'Au Tapis',
        'Grudge': 'Acariâtre',
        'Haunt': 'Cauchemar Corporel',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Moonlit': 'Pleine Lune',
        'Moonshadowed': 'Nouvelle Lune',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Stun': 'Étourdissement',
        'Transfiguration': 'Transformation',
        'Veil Of Light': 'Résistance à La Nouvelle Lune',
        'Veil Of Shadow': 'Résistance à La Pleine Lune',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Dancing Fan': '舞扇',
        'Engage!': '戦闘開始！',
        'Specter': 'スペクター',
        'Specter Of Asahi': 'アサヒの幻影',
        'Specter Of The Empire': '帝国兵の幻影',
        'Specter Of The Homeland': 'ドマ人の幻影',
        'Specter Of The Matriarch': '養母の幻影',
        'Specter Of The Patriarch': '養父の幻影',
        'Specter Of Zenos': 'ゼノスの幻影',
        'Tsukuyomi': 'ツクヨミ',

        // FIXME
        'Moondust': 'Moondust',
        'Moonlight': 'Moonlight',
      },
      'replaceText': {
        'Bright Blade': '月刀左近',
        'Concentrativity': '圧縮剣気',
        'Crater': '氷輪',
        'Dance Of The Dead': '黄泉の舞',
        'Dark Blade': '月刀右近',
        'Dispersivity': '剣気波動',
        'Hagetsu': '破月',
        'Lead Of The Underworld': '黄泉の銃弾',
        'Lunacy': '月下繚乱',
        'Lunar Halo': '百月光',
        'Lunar Rays': '残月',
        'Midnight Rain': '月時雨',
        'Moonbeam': '月光流転',
        'Moonfall': '月片落下',
        'Nightbloom': '月下彼岸花',
        'Nightfall': '宵の早替え',
        'Perilune': '月天心',
        'Reprimand': '折檻',
        'Steel Of The Underworld': '黄泉の穂先',
        'Supreme Selenomancy': '極の月読 ',
        'Torment Unto Death': 'なぶり殺し',
        'Tsuki-no-Kakera': '月の欠片',
        'Tsuki-no-Maiogi': '月の舞扇',
        'Unmoving Troika': '不動三段',
        'Waning Grudge': '黒き怨念',
        'Waxing Grudge': '白き怨念',
        'Zashiki-asobi': '座敷遊び',

        // FIXME
        'Lead/Steel': 'Lead/Steel',
        'Steel/Lead': 'Steel/Lead',
        'Homeland adds .E->W.': 'Homeland adds (E->W)',
        'Empire adds .SW->NW.': 'Empire adds (SW->NW)',
        'Moonburst': 'Moonburst',
        'Antitwilight': 'Antitwilight',
      },
      '~effectNames': {
        'Bleeding': 'ペイン',
        'Damage Down': 'ダメージ低下',
        'Doom': '死の宣告',
        'Down For The Count': 'ノックダウン',
        'Grudge': '怨念',
        'Haunt': '思念体',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Moonlit': '満月下',
        'Moonshadowed': '新月下',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Stun': 'スタン',
        'Transfiguration': '変身',
        'Veil Of Light': '新月耐性',
        'Veil Of Shadow': '満月耐性',
      },
    },
  ],
}];
