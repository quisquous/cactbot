'use strict';

// O2S - Deltascape 2.0 Savage
[{
  zoneRegex: /(Deltascape V2.0 \(Savage\)|Unknown Zone \(2B8\))/,
  timelineFile: 'o2s.txt',
  timelineTriggers: [
    {
      id: 'O2S Double Stack',
      regex: /Double Stack/,
      beforeSeconds: 6,
      alertText: {
        en: 'DPS: Levitate',
        de: 'DDs hoch',
      },
    },
  ],
  triggers: [
    { // Phase Tracker: Maniacal Probe.
      regex: /:235A:Catastrophe starts using/,
      regexDe: /:235A:Katastroph starts using/,
      run: function(data) {
        data.probeCount = (data.probeCount || 0) + 1;
        data.dpsProbe = data.probeCount == 2 || data.probeCount == 4;
        data.myProbe = data.dpsProbe == data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation',
      regex: /:(\y{Name}) gains the effect of Levitation from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.levitating = true;
      },
    },
    {
      id: 'O2S Levitation',
      regex: /:(\y{Name}) loses the effect of Levitation/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.levitating = false;
      },
    },
    {
      id: 'O2S -100Gs',
      regex: /:235E:Catastrophe starts using/,
      regexDe: /:235E:Katastroph starts using/,
      infoText: {
        en: '-100 Gs: Go north/south and look away',
        de: '-100G: Nach Norden/Süden und wegschauen',
      },
      tts: {
        en: '100 gs',
        de: '-100 G',
      },
    },
    {
      id: 'O2S Death\'s Gaze',
      regex: /:236F:Catastrophe starts using/,
      regexDe: /:236F:Katastroph starts using/,
      alarmText: {
        en: 'Death\'s Gaze: Look away',
        de: 'Todesblick: Wegschauen',
      },
      tts: {
        en: 'look away',
        de: 'weckschauen',
      },
    },
    {
      id: 'O2S Earthquake',
      regex: /:2374:Catastrophe starts using/,
      regexDe: /:2374:Katastroph starts using/,
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: 'Earthquake',
            de: 'Erdbeben',
          };
        }
      },
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: 'Earthquake: Levitate',
            de: 'Erdbeben: Schweben',
          };
        }
      },
      tts: function(data) {
        if (!data.levitating) {
          return {
            en: 'levitate',
            de: 'schweben',
          };
        }
      },
    },
    {
      id: 'O2S Elevated',
      regex: /:(\y{Name}) gains the effect of Elevated from/,
      regexDe: /:(\y{Name}) gains the effect of Erhöht from/,
      infoText: function(data) {
        if (!data.role.startsWith('dps')) {
          return {
            en: 'DPS up, T/H down',
            de: 'DDs hoch, T/H runter',
          };
        }
      },
      alarmText: function(data) {
        if (data.role.startsWith('dps') && !data.levitating) {
          return {
            en: 'DPS: Levitate',
            de: 'DDs: Schweben',
          };
        }
      },
      tts: {
        en: 'dps up',
        de: 'dee dees hoch',
      },
    },
    {
      id: 'O2S Gravitational Wave',
      regex: /:2372:Catastrophe starts using/,
      regexDe: /:2372:Katastroph starts using/,
      infoText: 'Gravitational Wave: AOE damage',
      condition: function(data) {
        return data.role == 'healer';
      },
      tts: {
        en: 'wave',
        de: 'welle',
      },
    },
    {
      id: 'O2S Maniacal Probe',
      regex: /:235A:Catastrophe starts using/,
      regexDe: /:235A:Katastroph starts using/,
      infoText: function(data) {
        if (!data.myProbe) {
          if (!data.dpsProbe) {
            return {
              en: 'Maniacal Probe: Tanks & Healers',
              de: 'Tentakeltanz: Tanks & Heiler',
            };
          }
          return {
            en: 'Maniacal Probe: DPS',
            de: 'Tentakeltanz: DDs',
          };
        }
      },
      alertText: function(data) {
        if (data.myProbe) {
          if (!data.dpsProbe) {
            return {
              en: 'Maniacal Probe: Tanks & Healers',
              de: 'Tentakeltanz: Tanks & Heiler',
            };
          }
          return {
            en: 'Maniacal Probe: DPS',
            de: 'Tentakeltanz: DDs',
          };
        }
      },
      tts: function(data) {
        if (data.dpsProbe) {
          return {
            en: 'dps probe',
            de: 'dee dees tentakel',
          };
        }
        return {
          en: 'tank heal probe',
          de: 'tenks heiler tentakel',
        };
      },
    },
    {
      id: 'O2S Unstable Gravity',
      regex: /:(\y{Name}) gains the effect of Unstable Gravity from/,
      regexDe: /:(\y{Name}) gains the effect of Schwerkraftschwankung from/,
      delaySeconds: 9,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alarmText: {
        en: 'Unstable Gravity: Elevate and outside stack',
        de: 'Schwerkraftschwankung: Schweben und außen stacken',
      },
      tts: {
        en: 'float for bomb',
        de: 'schweben für bombe',
      },
    },
    {
      id: 'O2S 6 Fulms Under',
      regex: /:(\y{Name}) gains the effect of 6 Fulms Under from/,
      regexDe: /:(\y{Name}) gains the effect of Versinkend from/,
      delaySeconds: 5,
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: '6 Fulms Under',
            de: 'Versinkend',
          };
        }
      },
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: '6 Fulms Under: Levitate',
            de: 'Versinkend: Schweben',
          };
        }
      },
      condition: function(data, matches) {
        return !data.under && matches[1] == data.me;
      },
      tts: {
        en: 'float',
        de: 'schweben',
      },
      run: function(data) {
        data.under = true;
      },
    },
    {
      id: 'O2S 6 Fulms Under',
      regex: /:(\y{Name}) loses the effect of 6 Fulms Under from/,
      regexDe: /:(\y{Name}) loses the effect of Versinkend from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.under = false;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Catastrophe': 'Katastroph',
        'Engage!': 'Start!',
        'Fleshy Member': 'Tentakel',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        '-100 Gs': 'Minus 100 G',
        '100 Gs': '100 G',
        'Antilight': 'Dunkellicht',
        'Death\'s Gaze': 'Todesblick',
        'Earthquake': 'Erdbeben',
        'Enrage': 'Finalangriff',
        'Epicenter': 'Epizentrum',
        'Erosion': 'Erosion',
        'Evilsphere': 'Sphäre Des Bösen',
        'Explosion': 'Explosion',
        'Fourfold Sacrifice': 'Vier Heldenopfer',
        'Gravitational Collapse': 'Gravitationseinbruch',
        'Gravitational Distortion': 'Massenverzerrung',
        'Gravitational Explosion': 'Gravitationsknall',
        'Gravitational Manipulation': 'Schwerkraftmanipulation',
        'Gravitational Wave': 'Gravitationswelle',
        'Long Drop': 'Tiefer Fall',
        'Main Quake': 'Hauptbeben',
        'Maniacal Probe': 'Tentakeltanz',
        'Paranormal Wave': 'Paranormale Welle',
        'Tremblor': 'Erschütterung',
        'Unknown Ability': 'Unknown Ability',
        'Weighted Wing': 'Schwere Schwinge',
      },
      '~effectNames': {
        '6 Fulms Under': 'Versinkend',
        'Elevated': 'Erhöht',
        'Gradual Petrification': 'Steinwerdung',
        'Gravity Flip': 'Gravitationsumkehr',
        'Grounded': 'Erniedrigt',
        'Stone Curse': 'Steinfluch',
        'Unstable Gravity': 'Schwerkraftschwankung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Catastrophe': 'Catastrophe',
        'Engage!': 'À l\'attaque',
        'Fleshy Member': 'Tentacule',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        '-100 Gs': 'Gravité -100',
        '100 Gs': 'Gravité 100',
        'Antilight': 'Lumière Obscure',
        'Death\'s Gaze': 'Œil De La Mort',
        'Earthquake': 'Grand Séisme',
        'Enrage': 'Enrage',
        'Epicenter': 'Épicentre',
        'Erosion': 'Érosion',
        'Evilsphere': 'Sphère Démoniaque',
        'Explosion': 'Explosion',
        'Fourfold Sacrifice': 'Quatre Martyrs',
        'Gravitational Collapse': 'Effondrement Gravitationnel',
        'Gravitational Distortion': 'Distorsion Gravitationnelle',
        'Gravitational Explosion': 'Explosion Gravitationnelle',
        'Gravitational Manipulation': 'Manipulation Gravitationnelle',
        'Gravitational Wave': 'Onde Gravitationnelle',
        'Long Drop': 'Chute Ininterrompue',
        'Main Quake': 'Secousse Principale',
        'Maniacal Probe': 'Farandole De Tentacules',
        'Paranormal Wave': 'Onde Maudite',
        'Tremblor': 'Tremblement De Terre',
        'Unknown Ability': 'Unknown Ability',
        'Weighted Wing': 'Ailes Antigravitationnelles',
      },
      '~effectNames': {
        '6 Fulms Under': 'Enfoncement',
        'Elevated': 'Élévation',
        'Gradual Petrification': 'Pétrification Graduelle',
        'Gravity Flip': 'Inversion De Gravité',
        'Grounded': 'Abaissement',
        'Stone Curse': 'Piège De Pierre',
        'Unstable Gravity': 'Gravité Instable',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Catastrophe': 'カタストロフィー',
        'Engage!': '戦闘開始！',
        'Fleshy Member': '触手',
      },
      'replaceText': {
        '-100 Gs': '重力マイナス100',
        '100 Gs': '重力100',
        'Antilight': '暗黒光',
        'Death\'s Gaze': '死神の瞳',
        'Earthquake': '大地震',
        'Epicenter': '震源生成',
        'Erosion': '浸食',
        'Evilsphere': 'イビルスフィア',
        'Explosion': '爆散',
        'Fourfold Sacrifice': '犠牲の四戦士',
        'Gravitational Collapse': '重力崩壊',
        'Gravitational Distortion': '重力歪曲',
        'Gravitational Explosion': '重力爆発',
        'Gravitational Manipulation': '重力操作',
        'Gravitational Wave': '重力波',
        'Long Drop': '自由落下',
        'Main Quake': '本震',
        'Maniacal Probe': '触手乱舞',
        'Paranormal Wave': '呪詛波',
        'Tremblor': '地震',
        'Unknown Ability': 'Unknown Ability',
        'Weighted Wing': 'グラビティウィング',
      },
      '~effectNames': {
        '6 Fulms Under': '沈下',
        'Elevated': '高度固定：高',
        'Gradual Petrification': '徐々に石化',
        'Gravity Flip': '重力反転',
        'Grounded': '高度固定：低',
        'Stone Curse': '石化の呪い',
        'Unstable Gravity': 'グラビティバースト',
      },
    },
  ],
}];
