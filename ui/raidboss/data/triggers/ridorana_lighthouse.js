'use strict';

[{
  zoneRegex: /^The Ridorana Lighthouse$/,
  timelineFile: 'ridorana_lighthouse.txt',
  timelineTriggers: [
    {
      id: 'Ridorana Stone Breath',
      regex: /Stone Breath/,
      beforeSeconds: 7,
      alertText: {
        en: 'Get Behind',
        de: 'Hinter ihn laufen',
        fr: 'Allez derrière',
      },
    },
  ],
  triggers: [
    {
      id: 'Ridorana Famfrit Tide Pode',
      regex: / 14:2C3E:Famfrit, The Darkening Cloud starts using Tide Pod on (\y{Name})/,
      regexDe: / 14:2C3E:Dunkelfürst Famfrit starts using Gezeitenschlag on (\y{Name})/,
      regexFr: / 14:2C3E:Famfrit Le Nuage Ténébreux starts using Frappe Aqueuse on (\y{Name})/,
      regexJa: / 14:2C3E:暗黒の雲ファムフリート starts using 水流弾 on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tank Buster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      regexDe: / 14:2C50:Dunkelfürst Famfrit starts using Sturzflut/,
      regexFr: / 14:2C50:Famfrit Le Nuage Ténébreux starts using Tsunami/,
      regexJa: / 14:2C50:暗黒の雲ファムフリート starts using 大海嘯/,
      delaySeconds: 4.5,
      alertText: {
        en: 'Look for Tsunami',
        de: 'Auf Krug achten',
        fr: 'Attention Tsunami',
      },
      tts: {
        en: 'Tsunami',
        de: 'Krug',
        fr: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      regexDe: / 14:2C50:Dunkelfürst Famfrit starts using Sturzflut/,
      regexFr: / 14:2C50:Famfrit Le Nuage Ténébreux starts using Tsunami/,
      regexJa: / 14:2C50:暗黒の雲ファムフリート starts using 大海嘯/,
      delaySeconds: 16.5,
      alertText: {
        en: 'Look for Tsunami',
        de: 'Auf Krug achten',
        fr: 'Attention Tsunami',
      },
      tts: {
        en: 'Tsunami',
        de: 'Krug',
        fr: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Tsunami',
      regex: / 14:2C50:Famfrit, The Darkening Cloud starts using Tsunami/,
      regexDe: / 14:2C50:Dunkelfürst Famfrit starts using Sturzflut/,
      regexFr: / 14:2C50:Famfrit Le Nuage Ténébreux starts using Tsunami/,
      regexJa: / 14:2C50:暗黒の雲ファムフリート starts using 大海嘯/,
      delaySeconds: 28.5,
      alertText: {
        en: 'Look for Tsunami',
        de: 'Auf Krug achten',
        fr: 'Attention Tsunami',
      },
      tts: {
        en: 'Tsunami',
        de: 'Krug',
        fr: 'Tsunami',
      },
    },
    {
      id: 'Ridorana Famfrit Dark Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:0037:0000:0000:0000:/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Stack',
      },
    },
    {
      id: 'Ridorana Famfrit Briny Cannonade',
      regex: / 1B:........:(\y{Name}):....:....:008B:0000:0000:0000:/,
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
      id: 'Ridorana Famfrit Dark Rain',
      regex: / 03:Added new combatant Dark Rain\./,
      regexDe: / 03:Added new combatant Dunkler Regen\./,
      regexFr: / 03:Added new combatant Trombe D'eau\./,
      regexJa: / 03:Added new combatant 暗雲の雨水\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
        de: 'Adds',
        fr: 'Adds',
      },
      tts: {
        en: 'Adds',
        de: 'etz',
        fr: 'Adds',
      },
    },
    {
      id: 'Ridorana Belias Fire',
      regex: / 14:2CDB:Belias, The Gigas starts using Fire on (\y{Name})/,
      regexDe: / 14:2CDB:Dämonid Belias starts using Feuer on (\y{Name})/,
      regexFr: / 14:2CDB:Bélias Le Titan starts using Feu on (\y{Name})/,
      regexJa: / 14:2CDB:魔人ベリアス starts using ファイア on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'Ridorana Belias Time Eruption',
      regex: / 14:2CDE:Belias, The Gigas starts using Time Eruption/,
      regexDe: / 14:2CDE:Dämonid Belias starts using Zeiteruption/,
      regexFr: / 14:2CDE:Bélias Le Titan starts using Éruption À Retardement/,
      regexJa: / 14:2CDE:魔人ベリアス starts using タイムエラプション/,
      infoText: {
        en: 'Stand on Slow Clock',
        de: 'In der langsamen Uhr stehen',
        fr: 'Placez-vous sur une horloge lente',
      },
    },
    {
      id: 'Ridorana Belias Hand of Time',
      regex: / 1A:(\y{Name}) gains the effect of Burns from/,
      regexDe: / 1A:(\y{Name}) gains the effect of Brandwunde from/,
      regexFr: / 1A:(\y{Name}) gains the effect of Brûlure from/,
      regexJa: / 1A:(\y{Name}) gains the effect of 火傷 from/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      alertText: {
        en: 'Stretch Tether Outside',
        de: 'Verbindung nach außen strecken',
        fr: 'Lien vers l\'exterieur',
      },
    },
    {
      id: 'Ridorana Belias Time Bomb',
      regex: / 14:2CE6:Belias, The Gigas starts using Time Bomb/,
      regexDe: / 14:2CE6:Dämonid Belias starts using Zeitbombe/,
      regexFr: / 14:2CE6:Bélias Le Titan starts using Bombe À Retardement/,
      regexJa: / 14:2CE6:魔人ベリアス starts using タイムボム/,
      infoText: {
        en: 'Stop Clocks',
        de: 'Uhrzeiger nach außen',
        fr: 'Arrêtez horloge',
      },
    },
    {
      id: 'Ridorana Belias Gigas',
      regex: / 03:Added new combatant Gigas\./,
      regexDe: / 03:Added new combatant Diener Von Belias\./,
      regexFr: / 03:Added new combatant Serviteur De Bélias\./,
      regexJa: / 03:Added new combatant 魔人兵\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
        de: 'Adds',
        fr: 'Adds',
      },
    },
    {
      id: 'Ridorana Construct Destroy',
      regex: / 14:(?:2C5A|2C71):Construct 7 starts using Destroy on (\y{Name})/,
      regexDe: / 14:(?:2C5A|2C71):Automat Nr. 7 starts using Zerstören on (\y{Name})/,
      regexFr: / 14:(?:2C5A|2C71):Automate N°7 starts using Détruire on (\y{Name})/,
      regexJa: / 14:(?:2C5A|2C71):労働七号 starts using 破壊する on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'Ridorana Construct Accelerate Spread',
      regex: / 1B:........:(\y{Name}):....:....:008A:0000:0000:0000:/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      preRun: function(data) {
        data.accelerateSpreadOnMe = true;
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'Ridorana Construct Accelerate Stack',
      regex: / 1B:........:(\y{Name}):....:....:0064:0000:0000:0000:/,
      condition: function(data) {
        return !data.accelerateSpreadOnMe;
      },
      infoText: function(data, matches) {
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Stack auf ' + data.ShortName(matches[1]),
          fr: 'Stack sur ' + data.ShortName(matches[1]),
        };
      },
      tts: {
        en: 'Stack',
        de: 'Stek en',
        fr: 'Stack',
      },
    },
    {
      // Accelerate cleanup
      regex: / 14:2C65:Construct 7 starts using Accelerate/,
      regexDe: / 14:2C65:Automat Nr. 7 starts using Beschleunigen/,
      regexFr: / 14:2C65:Automate N°7 starts using Aplatir/,
      regexJa: / 14:2C65:労働七号 starts using 突貫する/,
      run: function(data) {
        delete data.accelerateSpreadOnMe;
      },
    },
    {
      // TODO: need an "always run this trigger when starting zone" option
      regex: / 14:2C6C:Construct 7 starts using Subtract/,
      regexDe: / 14:2C6C:Automat Nr. 7 starts using Subtrahieren/,
      regexFr: / 14:2C6C:Automate N°7 starts using Soustraire/,
      regexJa: / 14:2C6C:労働七号 starts using 減算する/,
      run: function(data) {
        data.mathBaseValue = 0;
        data.mathDirection = function() {
          if (!this.correctMath)
            return;
          if (data.mathBaseValue < 1 || data.mathBaseValue > 9) {
            console.error('Bad math: ' + data.mathBaseValue);
            return;
          }
          return [
            {
              en: 'Stay out',
              de: 'Draußen stehen',
              fr: 'Restez dehors',
            },
            {
              en: 'Stand in 1',
              de: 'In 1 stehen',
              fr: 'Allez sur le 1',
            },
            {
              en: 'Stand in 2',
              de: 'In 2 stehen',
              fr: 'Allez sur le 2',
            },
            {
              en: 'Stand in 3',
              de: 'In 3 stehen',
              fr: 'Allez sur le 3',
            },
            {
              en: 'Stand in 4',
              de: 'In 4 stehen',
              fr: 'Allez sur le 4',
            },
          ][this.correctMath[data.mathBaseValue]];
        };
      },
    },
    {
      regex: / 1A:(\y{Name}) gains the effect of Hp Penalty/,
      regexDe: / 1A:(\y{Name}) gains the effect of LP-Malus/,
      regexFr: / 1A:(\y{Name}) gains the effect of Malus De PV\+/,
      regexJa: / 1A:(\y{Name}) gains the effect of 最大ＨＰ低下\[強\]/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      preRun: function(data) {
        if (!data.mathBaseValue && data.currentHP > 0 && data.currentHP < 10)
          data.mathBaseValue = data.currentHP;
      },
    },
    {
      // Not 100% convinced that hp will have updated exactly when the hp penalty
      // trigger happens.  However, by t=1 second in testing, standing a circle
      // will apply.  So, hope for the best by testing at t=0.5 as well, but not
      // overwriting any results from t=0 if that was valid.
      regex: / 1A:(\y{Name}) gains the effect of Hp Penalty/,
      regexDe: / 1A:(\y{Name}) gains the effect of LP-Malus/,
      regexFr: / 1A:(\y{Name}) gains the effect of Malus De Pv\+/,
      regexJa: / 1A:(\y{Name}) gains the effect of 最大ＨＰ低下\[強\]/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      delaySeconds: 0.5,
      preRun: function(data) {
        if (!data.mathBaseValue && data.currentHP > 0 && data.currentHP < 10)
          data.mathBaseValue = data.currentHP;
      },
    },
    {
      id: 'Ridorana Construct Divide By Five',
      regex: / 14:2CCD:Construct 7 starts using Divide By Five/,
      regexDe: / Der Automat Nr. 7 beginnt, Arithmetik: Durch 5 teilen einzusetzen./,
      regexFr: / 14:2CCD:Automate N°7 starts using Arithmétique : Multiples De 5/,
      regexJa: / 14:2CCD:労働七号 starts using 算術：5倍数/,
      preRun: function(data) {
        data.correctMath = [-1, 4, 3, 2, 1, 0, 4, 3, 2, 1];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Divide By Four',
      regex: / 14:2CCC:Construct 7 starts using Divide By Four/,
      regexDe: / Der Automat Nr. 7 beginnt, Arithmetik: Durch 4 teilen einzusetzen./,
      regexFr: / 14:2CCC:Automate N°7 starts using Arithmétique : Multiples De 4/,
      regexJa: / 14:2CCC:労働七号 starts using 算術：4倍数/,
      preRun: function(data) {
        data.correctMath = [-1, 3, 2, 1, 0, 3, 2, 1, 0, 3];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Divide By Three',
      regex: / 14:2CCA:Construct 7 starts using Divide By Three/,
      regexDe: / Der Automat Nr. 7 beginnt, Arithmetik: Durch 3 teilen einzusetzen./,
      regexFr: / 14:2CCA:Automate N°7 starts using Arithmétique : Multiples De 3/,
      regexJa: / 14:2CCA:労働七号 starts using 算術：3倍数/,
      preRun: function(data) {
        data.correctMath = [-1, 2, 1, 0, 2, 1, 0, 2, 1, 0];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Indivisible',
      regex: / 14:2CCE:Construct 7 starts using Indivisible/,
      regexDe: / 14:2CCE:Automat Nr. 7 starts using Unteilbar/,
      regexFr: / 14:2CCE:Automate N°7 starts using Arithmétique : Nombres Premiers/,
      regexJa: / 14:2CCE:労働七号 starts using 算術：素数/,
      preRun: function(data) {
        data.correctMath = [-1, 1, 0, 0, 1, 0, 1, 0, 3, 2];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Pulverize',
      regex: / 14:2C61:Construct 7 starts using Pulverize/,
      regexDe: / 14:2C61:Automat Nr. 7 starts using Zermahlen/,
      regexFr: / 14:2C61:Automate N°7 starts using Broyer/,
      regexJa: / 14:2C61:労働七号 starts using 粉砕する/,
      // 16 yalms
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Eloignez-vous',
      },
    },
    {
      id: 'Ridorana Construct Dispose',
      regex: / 14:(?:2C5F|2CE9):Construct 7 starts using Dispose/,
      regexDe: / 14:(?:2C5F|2CE9):Automat Nr. 7 starts using Entsorgen/,
      regexFr: / 14:(?:2C5F|2CE9):Automate N°7 starts using Annihiler/,
      regexJa: / 14:(?:2C5F|2CE9):労働七号 starts using 処理する/,
      alertText: {
        en: 'Get Behind',
        de: 'Boss von hinten umkreisen',
        fr: 'Allez derrière le boss',
      },
    },
    {
      id: 'Ridorana Construct Acceleration Bomb',
      regex: /1A:(\y{Name}) gains the effect of Acceleration Bomb from .*? for (\y{Float}) Seconds/,
      regexDe: /1A:(\y{Name}) gains the effect of Beschleunigungsbombe from .*? for (\y{Float}) Seconds/,
      regexFr: /1A:(\y{Name}) gains the effect of Bombe À Accélération from .*? for (\y{Float}) Seconds/,
      regexJa: /1A:(\y{Name}) gains the effect of 加速度爆弾 from .*? for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      delaySeconds: 2,
      alarmText: {
        en: 'Stop',
        de: 'Stopp',
        fr: 'Stop',
      },
    },
    {
      id: 'Ridorana Yiazmat Rake Buster',
      regex: / 14:2D4E:Yiazmat starts using Rake on (\y{Name})/,
      regexDe: / 14:2D4E:Yiasmat starts using Prankenhieb on (\y{Name})/,
      regexFr: / 14:2D4E:Yiazmat starts using Griffes on (\y{Name})/,
      regexJa: / 14:2D4E:鬼龍ヤズマット starts using ひっかき on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'Ridorana Yiazmat Rake Charge',
      regex: / 14:2E32:Yiazmat starts using Rake/,
      regexDe: / 14:2E32:Yiasmat starts using Prankenhieb/,
      regexFr: / 14:2E32:Yiazmat starts using Griffes/,
      regexJa: / 14:2E32:鬼龍ヤズマット starts using ひっかき/,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Out of Front',
        de: 'Vorm Boss weg',
        fr: 'Ne restez pas devant',
      },
    },
    {
      id: 'Ridorana Yiazmat White Breath',
      regex: / 14:2C31:Yiazmat starts using White Breath/,
      regexDe: / 14:2C31:Yiasmat starts using Kalkatem/,
      regexFr: / 14:2C31:Yiazmat starts using Souffle Blanc/,
      regexJa: / 14:2C31:鬼龍ヤズマット starts using ホワイトブレス/,
      alertText: {
        en: 'Get Under',
        de: 'Reingehen',
        fr: 'Allez sous le boss',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Negative',
      regex: / 1A:(\y{Name}) gains the effect of Magnetic Lysis - from/,
      regexDe: / 1A:(\y{Name}) gains the effect of Negatives Magnetfeld from/,
      regexFr: / 1A:(\y{Name}) gains the effect of Charge Négative from/,
      regexJa: / 1A:(\y{Name}) gains the effect of 磁場崩壊【－】 from/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      infoText: {
        en: 'Move to Postive',
        de: 'Ins Positive laufen',
        fr: 'Allez sur le plus',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Positive',
      regex: / 1A:(\y{Name}) gains the effect of Magnetic Lysis \+ from/,
      regexDe: / 1A:(\y{Name}) gains the effect of Positives Magnetfeld from/,
      regexFr: / 1A:(\y{Name}) gains the effect of Charge Positive from/,
      regexJa: / 1A:(\y{Name}) gains the effect of 磁場崩壊【＋】 from/,
      condition: function(data, matches) {
        return (matches[1] == data.me);
      },
      infoText: {
        en: 'Move to Negative',
        de: 'Ins Negative laufen',
        fr: 'Allez sur le moins',
      },
    },
    {
      id: 'Ridorana Yiazmat Archaeodemon',
      regex: / 03:Added new combatant Archaeodemon\./,
      regexDe: / 03:Added new combatant Archaeodämon\./,
      regexFr: / 03:Added new combatant Archéodémon\./,
      regexJa: / 03:Added new combatant アルケオデーモン\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
        de: 'Adds',
        fr: 'Adds',
      },
      tts: {
        en: 'Adds',
        de: 'Etz',
        fr: 'Adds',
      },
    },
    {
      id: 'Ridorana Yiazmat Heart',
      regex: / 03:Added new combatant Heart Of The Dragon\./,
      regexDe: / 03:Added new combatant Herz Des Drachen\./,
      regexFr: / 03:Added new combatant Cœur De Yiazmat\./,
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Heart',
        de: 'Herz',
        fr: 'Tuer le cœur',
      },
      tts: {
        en: 'Heart',
        de: 'Herz',
        fr: 'Cœur',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Dark Rain': 'Dunkler Regen',
        'Famfrit, The Darkening Cloud': 'Dunkelfürst Famfrit',
        'Belias, The Gigas': 'Dämonid Belias',
        'Gigas': 'Diener Von Belias',
        'Construct 7': 'Automat Nr. 7',
        'Construct 7.1': 'Verbesserter Automat Nr. 7',
        'Missile': 'Rakete',
        'Archaeodemon': 'Archaeodämon',
        'Heart of the Dragon': 'Heart of the Dragon',
        'Wind Azer': 'Windseele',
        'Yiazmat': 'Yiasmat',

        ':Echoes from Time\'s Garden will be sealed off': ':Garten Ewiger Zeit schließt',
        ':The Spire\'s Bounds will be sealed off': ':Katastase schließt',
        ':The Cleft of Profaning Wind will be sealed off': ':Kluft Entweihender Winde schließt',
        ':The Clockwork Coliseum will be sealed off': ':Kolosseum Von Gog schließt',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Enrage': 'Finalangriff',
        'Briny Cannonade': 'Aquarion',
        'Dark Cannonade': 'Dunkler Blitz',
        'Dark Ewer': 'Dunkler Wasserkrug',
        'Dark Rain': 'Dunkler Regen',
        'Darkening Deluge': 'Düstere Flut',
        'Darkening Rainfall': 'Verdunkelnder Niederschlag',
        'Explosion': 'Explosion',
        'Jet': 'Strahl',
        'Materialize': 'Trugbild',
        'Tide Pod': 'Gezeitenschlag',
        'Tsunami': 'Sturzflut',
        'Water IV': 'Giga-Aqua',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Eruption': 'Eruption',
        'Fire': 'Feuer',
        'Fire IV': 'Feuka',
        'Hellfire': 'Höllenfeuer',
        'The Hand Of Time': 'Die Hand Der Zeit',
        'Time Bomb': 'Zeitbombe',
        'Time Eruption': 'Zeiteruption',
        'Accelerate': 'Beschleunigen',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Annihilation Mode': 'Auslöschungsmodul',
        'Ballistic Missile': 'Ballistische Rakete',
        'Compress': 'Zerdrücken',
        'Computation Mode': 'Standardmodul',
        'Destroy': 'Zerstören',
        'Dispose': 'Entsorgen',
        'Divide By Five': 'Arithmetik: Durch 5 Teilen',
        'Divide By Four': 'Arithmetik: Durch 4 Teilen',
        'Divide By Three': 'Arithmetik: Durch 3 Teilen',
        'Explosion': 'Explosion',
        'Ferrofluid': 'Magnet',
        'Ignite': 'Entzünden',
        'Incinerate': 'Einäschern',
        'Indivisible': 'Unteilbar',
        'Lithobrake': 'Erledigen',
        'Magnetism': 'Magnetismus',
        'Pulverize': 'Zermahlen',
        'Subtract': 'Subtrahieren',
        'Tartarus': 'Tartarus',
        'Tartarus Mode': 'Tartarus-Modul',
        'Triboelectricity': 'Elekrostatische Entladung',
        'Ultramagnetism': 'Ultramagnetismus',
        'Ventilate': 'Abkühlen',
        'Ancient Aero': 'Antiker Wind',
        'Cyclone': 'Zyklon',
        'Death Strike': 'Extonso Tod',
        'Dust Storm': 'Staubsturm',
        'Face Off': 'Unbeugsamkeit',
        'Growing Threat': 'Mirakel',
        'Gust Front': 'Böenfront',
        'Karma': 'Lebensbruch',
        'Magnetic Genesis': 'Magnetische Stabilisierung',
        'Magnetic Lysis': 'Magnetische Auflösung',
        'Rake': 'Prankenhieb',
        'Solar Storm': 'Sonnensturm',
        'Stone Breath': 'Petri-Atem',
        'Summon': 'Beschwörung',
        'Turbulence': 'Turbulenz',
        'Unholy Darkness': 'Unheiliges Dunkel',
        'White Breath': 'Kalkatem',

        'Fast Hands': 'Schnelle Hände',
        'Slow Hands': 'Langsame Hände',
        'Gigas spawns': 'Gigas erscheint',
        'Division': 'Division',
        'Area Lockdown': 'Gebiet geschlossen',
        'Archaeodemon spawn': 'Archaeodämon erscheint',
        'Gale Gaol': 'Windgefängnis',
      },
      '~effectNames': {
        'Dropsy': 'Wassersucht',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Burns': 'Brandwunde',
        'Slow': 'Gemach',
        'Slow+': 'Gemach +',
        'Temporal Barrier': 'Lauf Der Zeit',
        'Temporal Displacement': 'Zeitstillstand',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Computation Boost': 'Verbesserte Rechenleistung',
        'Computation Error': 'Rechenfehler',
        'Damage Down': 'Schaden -',
        'Down For The Count': 'Am Boden',
        'HP Boost +1': 'LP-Bonus +1',
        'HP Boost +2': 'LP-Bonus +2',
        'HP Boost +3': 'LP-Bonus +3',
        'HP Boost +4': 'LP-Bonus +4',
        'HP Penalty': 'LP-Malus',
        'Invincibility': 'Unverwundbar',
        'Minimum': 'Wicht',
        'Negative Charge': 'Negative Ladung',
        'Positive Charge': 'Positive Ladung',
        'Stun': 'Betäubung',
        'Borne Heart': 'Freies Herz',
        'Damage Down': 'Schaden -',
        'Heartless': 'Herzlos',
        'Magnetic Levitation': 'Magnetschwebe',
        'Magnetic Lysis +': 'Positives Magnetfeld',
        'Magnetic Lysis -': 'Negatives Magnetfeld',
        'Petrification': 'Stein',
        'Slow': 'Gemach',
        'The One Dragon': 'Absoluter Drache',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Dark Rain': 'Sphère D\'eau Ténébreuse',
        'Famfrit, The Darkening Cloud': 'Famfrit Le Nuage Ténébreux',
        'Belias, The Gigas': 'Bélias Le Titan',
        'Gigas': 'Serviteur De Bélias',
        'Construct 7': 'Automate N°7',
        'Construct 7.1': 'Automate N°7 Amélioré',
        'Missile': 'Missile',
        'Archaeodemon': 'Archéodémon',
        'Heart of the Dragon': 'Cœur De Yiazmat',
        'Wind Azer': 'Aze De Vent',
        'Yiazmat': 'Yiazmat',

        ':Echoes from Time\'s Garden will be sealed off': ':Fermeture du Jardin d\'un autre temps dans',
        ':The Spire\'s Bounds will be sealed off': ':Fermeture de l\'orée des Cieux dans',
        ':The Cleft of Profaning Wind will be sealed off': ':Fermeture de la corniche des Vents distordants dans',
        ':The Clockwork Coliseum will be sealed off': ':Fermeture de l\'arène de Goug dans',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Briny Cannonade': 'Aqua-canon',
        'Dark Cannonade': 'Bombardement Ténébreux',
        'Dark Ewer': 'Aiguières Ténèbreuses',
        'Dark Rain': 'Trombe D\'eau',
        'Darkening Deluge': 'Nuage Stagnant',
        'Darkening Rainfall': 'Averse Ténébreuse',
        'Explosion': 'Éclatement',
        'Jet': 'Torrent',
        'Materialize': 'Apparition',
        'Tide Pod': 'Frappe Aqueuse',
        'Tsunami': 'Tsunami',
        'Water IV': 'Giga Eau',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Eruption': 'Éruption',
        'Fire': 'Feu',
        'Fire IV': 'Giga Feu',
        'Hellfire': 'Flammes De L\'enfer',
        'The Hand Of Time': 'Trotteuse De L\'au-delà',
        'Time Bomb': 'Bombe à Retardement',
        'Time Eruption': 'Éruption à Retardement',
        'Accelerate': 'Aplatir',
        'Acceleration Bomb': 'Bombe Accélératrice',
        'Annihilation Mode': 'Module Exterminator',
        'Ballistic Missile': 'Missiles Balistiques',
        'Compress': 'Écraser',
        'Computation Mode': 'Module D\'arithmétique',
        'Destroy': 'Détruire',
        'Dispose': 'Annihiler',
        'Divide By Five': 'Arithmétique : Multiples De 5',
        'Divide By Four': 'Arithmétique : Multiples De 4',
        'Divide By Three': 'Arithmétique : Multiples De 3',
        'Explosion': 'Explosion',
        'Ferrofluid': 'Ferrofluide',
        'Ignite': 'Carboniser',
        'Incinerate': 'Incinérer',
        'Indivisible': 'Arithmétique : Nombres Premiers',
        'Lithobrake': 'Percuter',
        'Magnetism': 'Magnétisme',
        'Pulverize': 'Broyer',
        'Subtract': 'Soustraire',
        'Tartarus': 'Tartaros',
        'Tartarus Mode': 'Module Tartaros',
        'Triboelectricity': 'Décharge électrostatique',
        'Ultramagnetism': 'Ultra-magnétisme',
        'Ventilate': 'Réfrigérer',
        'Ancient Aero': 'Vent Ancien',
        'Cyclone': 'Cyclone',
        'Death Strike': 'Pentacle Mortel',
        'Dust Storm': 'Tempête De Poussière',
        'Face Off': 'Défiguration',
        'Growing Threat': 'Exacerbation',
        'Gust Front': 'Front De Rafales',
        'Karma': 'Souffrance',
        'Magnetic Genesis': 'Stabilisation Du Champ Magnétique',
        'Magnetic Lysis': 'Dérèglement Magnétique',
        'Rake': 'Griffes',
        'Solar Storm': 'Tempête Solaire',
        'Stone Breath': 'Souffle Pétrifiant',
        'Summon': 'Invocation',
        'Turbulence': 'Turbulence',
        'Unholy Darkness': 'Miracle Sombre',
        'White Breath': 'Souffle Blanc',

        'Fast Hands': 'Mains rapides',
        'Slow Hands': 'Mains lente',
        'Gigas spawns': 'Apparition des serviteurs de Bélias',
        'Division': 'Division',
        'Area Lockdown': 'Verrouillage de la zone',
        'Archaeodemon spawn': 'Apparition des Archéodémons',
        'Gale Gaol': 'Prison De Vent',
      },
      '~effectNames': {
        'Dropsy': 'Œdème',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Burns': 'Brûlure',
        'Slow': 'Lenteur',
        'Slow+': 'Lenteur +',
        'Temporal Barrier': 'Barrière Anti-stase',
        'Temporal Displacement': 'Stase Temporelle',
        'Acceleration Bomb': 'Bombe à Accélération',
        'Computation Boost': 'Bonne Réponse',
        'Computation Error': 'Mauvaise Réponse',
        'Damage Down': 'Malus De Dégâts',
        'Down For The Count': 'Au Tapis',
        'HP Boost +1': 'Bonus De PV (+1)',
        'HP Boost +2': 'Bonus De PV (+2)',
        'HP Boost +3': 'Bonus De PV (+3)',
        'HP Boost +4': 'Bonus De PV (+4)',
        'HP Penalty': 'Malus De PV+',
        'Invincibility': 'Invulnérable',
        'Minimum': 'Mini',
        'Negative Charge': 'Charge Négative',
        'Positive Charge': 'Charge Positive',
        'Stun': 'Étourdissement',
        'Borne Heart': 'Faiblesse Apparente',
        'Damage Down': 'Malus De Dégâts',
        'Heartless': 'Cœur Brisé',
        'Magnetic Levitation': 'Lévitation Magnétique',
        'Magnetic Lysis +': 'Charge Positive',
        'Magnetic Lysis -': 'Charge Négative',
        'Petrification': 'Pétrification',
        'Slow': 'Lenteur',
        'The One Dragon': 'Dragon Ultime',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Dark Rain': '暗黒の雨水',
        'Engage!': '戦闘開始！',
        'Famfrit, The Darkening Cloud': '暗黒の雲ファムフリート',
        'Belias, The Gigas': '魔人ベリアス',
        'Gigas': '魔人兵',
        'Construct 7': '労働七号',
        'Construct 7.1': '労働七号・改',
        'Missile': 'ミサイル',
        'Archaeodemon': 'アルケオデーモン',
        'Heart of the Dragon': 'Heart of the Dragon',
        'Wind Azer': '風のアーゼ',
        'Yiazmat': '鬼龍ヤズマット',

        // FIXME
        ':Echoes from Time\'s Garden will be sealed off': ':Echoes from Time\'s Garden will be sealed off',
        ':The Spire\'s Bounds will be sealed off': ':The Spire\'s Bounds will be sealed off',
        ':The Cleft of Profaning Wind will be sealed off': ':The Cleft of Profaning Wind will be sealed off',
        ':The Clockwork Coliseum will be sealed off': ':The Clockwork Coliseum will be sealed off',
      },
      'replaceText': {
        'Briny Cannonade': '蒼の砲撃',
        'Dark Cannonade': '闇の砲撃',
        'Dark Ewer': '暗雲の水瓶',
        'Dark Rain': '暗雲の雨水',
        'Darkening Deluge': '暗雲の淀み',
        'Darkening Rainfall': '暗雲の雨',
        'Explosion': '爆散',
        'Jet': '激流',
        'Materialize': '幻出',
        'Tide Pod': '水流弾',
        'Tsunami': '大海嘯',
        'Water IV': 'ウォタジャ',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Eruption': 'エラプション',
        'Fire': 'ファイア',
        'Fire IV': 'ファイジャ',
        'Hellfire': '地獄の火炎',
        'The Hand Of Time': '異界の時針',
        'Time Bomb': 'タイムボム',
        'Time Eruption': 'タイムエラプション',
        'Accelerate': '突貫する',
        'Acceleration Bomb': '加速度爆弾',
        'Annihilation Mode': 'ジェノサイドチップ',
        'Ballistic Missile': 'ミサイル発射',
        'Compress': '圧縮する',
        'Computation Mode': '算術チップ',
        'Destroy': '破壊する',
        'Dispose': '処理する',
        'Divide By Five': '算術：5倍数',
        'Divide By Four': '算術：4倍数',
        'Divide By Three': '算術：3倍数',
        'Explosion': '爆発',
        'Ferrofluid': 'マグネット',
        'Ignite': '放熱する',
        'Incinerate': '焼却する',
        'Indivisible': '算術：素数',
        'Lithobrake': '落着する',
        'Magnetism': '磁力',
        'Pulverize': '粉砕する',
        'Subtract': '減算する',
        'Tartarus': 'タルタロス',
        'Tartarus Mode': 'タルタロスチップ',
        'Triboelectricity': '高速回転',
        'Ultramagnetism': '強磁力',
        'Ventilate': '冷却する',
        'Ancient Aero': 'エンシェントエアロ',
        'Cyclone': 'サイクロン',
        'Death Strike': '必殺',
        'Dust Storm': 'ダストストーム',
        'Face Off': 'フェイスオフ',
        'Growing Threat': '驚異',
        'Gust Front': 'ガストフロント',
        'Karma': 'ライフブレイク',
        'Magnetic Genesis': '磁場生成',
        'Magnetic Lysis': '磁場崩壊',
        'Rake': 'ひっかき',
        'Solar Storm': 'ソーラーストーム',
        'Stone Breath': 'ペトロブレス',
        'Summon': '召喚',
        'Turbulence': '乱気流',
        'Unholy Darkness': 'ダークホーリー',
        'White Breath': 'ホワイトブレス',

        // FIXME:
        'Fast Hands': 'Fast Hands',
        'Slow Hands': 'Slow Hands',
        'Gigas spawns': 'Gigas spawns',
        'Division': 'Division',
        'Area Lockdown': 'Area Lockdown',
        'Archaeodemon spawn': 'Archaeodemon spawn',
        'Gale Gaol': 'Gale Gaol',
      },
      '~effectNames': {
        'Dropsy': '水毒',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Burns': '火傷',
        'Slow': 'スロウ',
        'Slow+': 'スロウ＋',
        'Temporal Barrier': '時間停止無効',
        'Temporal Displacement': '時間停止',
        'Acceleration Bomb': '加速度爆弾',
        'Computation Boost': '算術正解',
        'Computation Error': '算術不正解',
        'Damage Down': 'ダメージ低下',
        'Down For The Count': 'ノックダウン',
        'HP Boost +1': '最大ＨＰ＋1',
        'HP Boost +2': '最大ＨＰ＋2',
        'HP Boost +3': '最大ＨＰ＋3',
        'HP Boost +4': '最大ＨＰ＋4',
        'HP Penalty': '最大ＨＰ低下[強]',
        'Invincibility': '無敵',
        'Minimum': 'ミニマム',
        'Negative Charge': '磁力【－】',
        'Positive Charge': '磁力【＋】',
        'Stun': 'スタン',
        'Borne Heart': '心核露出',
        'Damage Down': 'ダメージ低下',
        'Heartless': '心核破壊',
        'Magnetic Levitation': '磁気浮上',
        'Magnetic Lysis +': '磁場崩壊【＋】',
        'Magnetic Lysis -': '磁場崩壊【－】',
        'Petrification': '石化',
        'Slow': 'スロウ',
        'The One Dragon': '絶対竜',
      },
    },
  ],
}];
