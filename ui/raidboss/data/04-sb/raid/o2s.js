'use strict';

// O2S - Deltascape 2.0 Savage
[{
  zoneRegex: /^Deltascape V2.0 \(Savage\)$/,
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
      regex: / 14:235A:Catastrophe starts using Maniacal Probe/,
      regexDe: / 14:235A:Katastroph starts using Tentakeltanz/,
      regexFr: / 14:235A:Catastrophe starts using Farandole De Tentacules/,
      regexJa: / 14:235A:カタストロフィー starts using 触手乱舞/,
      run: function(data) {
        data.probeCount = (data.probeCount || 0) + 1;
        data.dpsProbe = data.probeCount == 2 || data.probeCount == 4;
        data.myProbe = data.dpsProbe == data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Levitation from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Levitation from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Lévitation from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of レビテト from/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.levitating = true;
      },
    },
    {
      id: 'O2S Levitation',
      regex: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Levitation/,
      regexDe: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Levitation/,
      regexFr: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Lévitation/,
      regexJa: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of レビテト/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.levitating = false;
      },
    },
    {
      id: 'O2S -100Gs',
      regex: / 14:235E:Catastrophe starts using -100 Gs/,
      regexDe: / 14:235E:Katastroph starts using Minus 100 G/,
      regexFr: / 14:235E:Catastrophe starts using Gravité -100/,
      regexJa: / 14:235E:カタストロフィー starts using 重力マイナス100/,
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
      regex: / 14:236F:Catastrophe starts using Death's Gaze/,
      regexDe: / 14:236F:Katastroph starts using Todesblick/,
      regexFr: / 14:236F:Catastrophe starts using Œil De La Mort/,
      regexJa: / 14:236F:カタストロフィー starts using 死神の瞳/,
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
      regex: / 14:2374:Catastrophe starts using Earthquake/,
      regexDe: / 14:2374:Katastroph starts using Erdbeben/,
      regexFr: / 14:2374:Catastrophe starts using Grand Séisme/,
      regexJa: / 14:2374:カタストロフィー starts using 大地震/,
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
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Elevated from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Erhöht from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Élévation from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 高度固定：高 from/,
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
      regex: / 14:2372:Catastrophe starts using Gravitational Wave/,
      regexDe: / 14:2372:Katastroph starts using Gravitationswelle/,
      regexFr: / 14:2372:Catastrophe starts using Onde Gravitationnelle/,
      regexJa: / 14:2372:カタストロフィー starts using 重力波/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
      tts: {
        en: 'wave',
        de: 'welle',
      },
    },
    {
      id: 'O2S Maniacal Probe',
      regex: / 14:235A:Catastrophe starts using Maniacal Probe/,
      regexDe: / 14:235A:Katastroph starts using Tentakeltanz/,
      regexFr: / 14:235A:Catastrophe starts using Farandole De Tentacules/,
      regexJa: / 14:235A:カタストロフィー starts using 触手乱舞/,
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
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Unstable Gravity from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Schwerkraftschwankung from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Gravité Instable from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of グラビティバースト from/,
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
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 6 Fulms Under from/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Versinkend from/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Enfoncement from/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 沈下 from/,
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
      regex: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of 6 Fulms Under from/,
      regexDe: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Versinkend from/,
      regexFr: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Enfoncement from/,
      regexJa: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of 沈下 from/,
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
