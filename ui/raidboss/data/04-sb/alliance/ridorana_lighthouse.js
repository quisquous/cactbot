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
      regex: Regexes.startsUsing({ id: '2C3E', source: 'Famfrit, The Darkening Cloud' }),
      regexDe: Regexes.startsUsing({ id: '2C3E', source: 'Dunkelfürst Famfrit' }),
      regexFr: Regexes.startsUsing({ id: '2C3E', source: 'Famfrit Le Nuage Ténébreux' }),
      regexJa: Regexes.startsUsing({ id: '2C3E', source: '暗黒の雲ファムフリート' }),
      regexCn: Regexes.startsUsing({ id: '2C3E', source: '暗黑之云法姆弗里特' }),
      regexKo: Regexes.startsUsing({ id: '2C3E', source: '암흑의 구름 팜프리트' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tank Buster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
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
      regex: Regexes.startsUsing({ id: '2C50', source: 'Famfrit, The Darkening Cloud', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C50', source: 'Dunkelfürst Famfrit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C50', source: 'Famfrit Le Nuage Ténébreux', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C50', source: '暗黒の雲ファムフリート', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C50', source: '暗黑之云法姆弗里特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C50', source: '암흑의 구름 팜프리트', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2C50', source: 'Famfrit, The Darkening Cloud', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C50', source: 'Dunkelfürst Famfrit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C50', source: 'Famfrit Le Nuage Ténébreux', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C50', source: '暗黒の雲ファムフリート', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C50', source: '暗黑之云法姆弗里特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C50', source: '암흑의 구름 팜프리트', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2C50', source: 'Famfrit, The Darkening Cloud', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C50', source: 'Dunkelfürst Famfrit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C50', source: 'Famfrit Le Nuage Ténébreux', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C50', source: '暗黒の雲ファムフリート', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C50', source: '暗黑之云法姆弗里特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C50', source: '암흑의 구름 팜프리트', capture: false }),
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
      regex: Regexes.headMarker({ id: '0037' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: {
        en: 'Dorito Stack',
        de: 'Stacken',
        fr: 'Stack',
      },
    },
    {
      id: 'Ridorana Famfrit Briny Cannonade',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Ecartez-vous',
      },
    },
    {
      id: 'Ridorana Famfrit Dark Rain',
      regex: Regexes.addedCombatant({ name: 'Dark Rain', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Dunkl(?:e|er|es|en) Regen', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Sphère D\'Eau Ténébreuse', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '暗黒の雨水', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '暗黑雨水', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '암흑의 빗물', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2CDB', source: 'Belias, The Gigas' }),
      regexDe: Regexes.startsUsing({ id: '2CDB', source: 'Dämonid Belias' }),
      regexFr: Regexes.startsUsing({ id: '2CDB', source: 'Bélias Le Titan' }),
      regexJa: Regexes.startsUsing({ id: '2CDB', source: '魔人ベリアス' }),
      regexCn: Regexes.startsUsing({ id: '2CDB', source: '魔人贝利亚斯' }),
      regexKo: Regexes.startsUsing({ id: '2CDB', source: '마인 벨리아스' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
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
      regex: Regexes.startsUsing({ id: '2CDE', source: 'Belias, The Gigas', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2CDE', source: 'Dämonid Belias', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2CDE', source: 'Bélias Le Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2CDE', source: '魔人ベリアス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2CDE', source: '魔人贝利亚斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2CDE', source: '마인 벨리아스', capture: false }),
      infoText: {
        en: 'Stand on Slow Clock',
        de: 'In der langsamen Uhr stehen',
        fr: 'Placez-vous sur une horloge lente',
      },
    },
    {
      id: 'Ridorana Belias Hand of Time',
      regex: Regexes.gainsEffect({ effect: 'Burns' }),
      regexDe: Regexes.gainsEffect({ effect: 'Brandwunde' }),
      regexFr: Regexes.gainsEffect({ effect: 'Brûlure' }),
      regexJa: Regexes.gainsEffect({ effect: '火傷' }),
      regexCn: Regexes.gainsEffect({ effect: '火伤' }),
      regexKo: Regexes.gainsEffect({ effect: '화상' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      alertText: {
        en: 'Stretch Tether Outside',
        de: 'Verbindung nach außen strecken',
        fr: 'Lien vers l\'exterieur',
      },
    },
    {
      id: 'Ridorana Belias Time Bomb',
      regex: Regexes.startsUsing({ id: '2CE6', source: 'Belias, The Gigas', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2CE6', source: 'Dämonid Belias', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2CE6', source: 'Bélias Le Titan', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2CE6', source: '魔人ベリアス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2CE6', source: '魔人贝利亚斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2CE6', source: '마인 벨리아스', capture: false }),
      infoText: {
        en: 'Stop Clocks',
        de: 'Uhrzeiger nach außen',
        fr: 'Arrêtez horloge',
      },
    },
    {
      id: 'Ridorana Belias Gigas',
      regex: Regexes.addedCombatant({ name: 'Gigas', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Diener Von Belias', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Serviteur De Bélias', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '魔人兵', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '魔人兵', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '마인병', capture: false }),
      suppressSeconds: 10,
      infoText: {
        en: 'Kill Adds',
        de: 'Adds',
        fr: 'Adds',
      },
    },
    {
      id: 'Ridorana Construct Destroy',
      regex: Regexes.startsUsing({ id: ['2C5A', '2C71'], source: 'Construct 7' }),
      regexDe: Regexes.startsUsing({ id: ['2C5A', '2C71'], source: 'Automat Nr\\. 7' }),
      regexFr: Regexes.startsUsing({ id: ['2C5A', '2C71'], source: 'Bâtisseur N°7' }),
      regexJa: Regexes.startsUsing({ id: ['2C5A', '2C71'], source: '労働七号' }),
      regexCn: Regexes.startsUsing({ id: ['2C5A', '2C71'], source: '劳动七号' }),
      regexKo: Regexes.startsUsing({ id: ['2C5A', '2C71'], source: '노동 7호' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
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
      regex: Regexes.headMarker({ id: '008A' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
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
      regex: Regexes.headMarker({ id: '0064' }),
      condition: function(data) {
        return !data.accelerateSpreadOnMe;
      },
      infoText: function(data, matches) {
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Stack auf ' + data.ShortName(matches.target),
          fr: 'Stack sur ' + data.ShortName(matches.target),
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
      regex: Regexes.startsUsing({ id: '2C65', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C65', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C65', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C65', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C65', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C65', source: '노동 7호', capture: false }),
      run: function(data) {
        delete data.accelerateSpreadOnMe;
      },
    },
    {
      // TODO: need an "always run this trigger when starting zone" option
      regex: Regexes.startsUsing({ id: '2C6C', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C6C', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C6C', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C6C', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C6C', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C6C', source: '노동 7호', capture: false }),
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
      regex: Regexes.gainsEffect({ effect: 'Hp Penalty' }),
      regexDe: Regexes.gainsEffect({ effect: 'Lp-Malus' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pv Maximum Réduits' }),
      regexJa: Regexes.gainsEffect({ effect: '最大Ｈｐダウン' }),
      regexCn: Regexes.gainsEffect({ effect: '最大体力减少' }),
      regexKo: Regexes.gainsEffect({ effect: '최대 Hp 감소' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
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
      regex: Regexes.gainsEffect({ effect: 'Hp Penalty' }),
      regexDe: Regexes.gainsEffect({ effect: 'Lp-Malus' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pv Maximum Réduits' }),
      regexJa: Regexes.gainsEffect({ effect: '最大Ｈｐダウン' }),
      regexCn: Regexes.gainsEffect({ effect: '最大体力减少' }),
      regexKo: Regexes.gainsEffect({ effect: '최대 Hp 감소' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      delaySeconds: 0.5,
      preRun: function(data) {
        if (!data.mathBaseValue && data.currentHP > 0 && data.currentHP < 10)
          data.mathBaseValue = data.currentHP;
      },
    },
    {
      id: 'Ridorana Construct Divide By Five',
      regex: Regexes.startsUsing({ id: '2CCD', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2CCD', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2CCD', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2CCD', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2CCD', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2CCD', source: '노동 7호', capture: false }),
      preRun: function(data) {
        data.correctMath = [-1, 4, 3, 2, 1, 0, 4, 3, 2, 1];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Divide By Four',
      regex: Regexes.startsUsing({ id: '2CCC', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2CCC', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2CCC', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2CCC', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2CCC', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2CCC', source: '노동 7호', capture: false }),
      preRun: function(data) {
        data.correctMath = [-1, 3, 2, 1, 0, 3, 2, 1, 0, 3];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Divide By Three',
      regex: Regexes.startsUsing({ id: '2CCA', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2CCA', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2CCA', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2CCA', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2CCA', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2CCA', source: '노동 7호', capture: false }),
      preRun: function(data) {
        data.correctMath = [-1, 2, 1, 0, 2, 1, 0, 2, 1, 0];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Indivisible',
      regex: Regexes.startsUsing({ id: '2CCE', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2CCE', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2CCE', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2CCE', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2CCE', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2CCE', source: '노동 7호', capture: false }),
      preRun: function(data) {
        data.correctMath = [-1, 1, 0, 0, 1, 0, 1, 0, 3, 2];
      },
      alertText: function(data) {
        return data.mathDirection();
      },
    },
    {
      id: 'Ridorana Construct Pulverize',
      regex: Regexes.startsUsing({ id: '2C61', source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C61', source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C61', source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C61', source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C61', source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C61', source: '노동 7호', capture: false }),
      // 16 yalms
      alertText: {
        en: 'Get Out',
        de: 'Raus da',
        fr: 'Eloignez-vous',
      },
    },
    {
      id: 'Ridorana Construct Dispose',
      regex: Regexes.startsUsing({ id: ['2C5F', '2CE9'], source: 'Construct 7', capture: false }),
      regexDe: Regexes.startsUsing({ id: ['2C5F', '2CE9'], source: 'Automat Nr\\. 7', capture: false }),
      regexFr: Regexes.startsUsing({ id: ['2C5F', '2CE9'], source: 'Bâtisseur N°7', capture: false }),
      regexJa: Regexes.startsUsing({ id: ['2C5F', '2CE9'], source: '労働七号', capture: false }),
      regexCn: Regexes.startsUsing({ id: ['2C5F', '2CE9'], source: '劳动七号', capture: false }),
      regexKo: Regexes.startsUsing({ id: ['2C5F', '2CE9'], source: '노동 7호', capture: false }),
      alertText: {
        en: 'Get Behind',
        de: 'Boss von hinten umkreisen',
        fr: 'Allez derrière le boss',
      },
    },
    {
      id: 'Ridorana Construct Acceleration Bomb',
      regex: Regexes.gainsEffect({ effect: 'Acceleration Bomb' }),
      regexDe: Regexes.gainsEffect({ effect: 'Beschleunigungsbombe' }),
      regexFr: Regexes.gainsEffect({ effect: 'Bombe À Accélération' }),
      regexJa: Regexes.gainsEffect({ effect: '加速度爆弾' }),
      regexCn: Regexes.gainsEffect({ effect: '加速度炸弹' }),
      regexKo: Regexes.gainsEffect({ effect: '가속도 폭탄' }),
      condition: function(data, matches) {
        return matches.target == data.me;
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
      regex: Regexes.startsUsing({ id: '2D4E', source: 'Yiazmat' }),
      regexDe: Regexes.startsUsing({ id: '2D4E', source: 'Yiasmat' }),
      regexFr: Regexes.startsUsing({ id: '2D4E', source: 'Yiazmat' }),
      regexJa: Regexes.startsUsing({ id: '2D4E', source: '鬼龍ヤズマット' }),
      regexCn: Regexes.startsUsing({ id: '2D4E', source: '鬼龙雅兹玛特' }),
      regexKo: Regexes.startsUsing({ id: '2D4E', source: '귀룡 야즈마트' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches.target == data.me || data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches.target),
          de: 'Tankbuster auf ' + data.ShortName(matches.target),
          fr: 'Tankbuster sur ' + data.ShortName(matches.target),
        };
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
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
      regex: Regexes.startsUsing({ id: '2E32', source: 'Yiazmat', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2E32', source: 'Yiasmat', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2E32', source: 'Yiazmat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2E32', source: '鬼龍ヤズマット', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2E32', source: '鬼龙雅兹玛特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2E32', source: '귀룡 야즈마트', capture: false }),
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
      regex: Regexes.startsUsing({ id: '2C31', source: 'Yiazmat', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2C31', source: 'Yiasmat', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2C31', source: 'Yiazmat', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2C31', source: '鬼龍ヤズマット', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2C31', source: '鬼龙雅兹玛特', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2C31', source: '귀룡 야즈마트', capture: false }),
      alertText: {
        en: 'Get Under',
        de: 'Reingehen',
        fr: 'Allez sous le boss',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Negative',
      regex: Regexes.gainsEffect({ effect: 'Magnetic Lysis -' }),
      regexDe: Regexes.gainsEffect({ effect: 'Negatives Magnetfeld' }),
      regexFr: Regexes.gainsEffect({ effect: 'Charge Négative' }),
      regexJa: Regexes.gainsEffect({ effect: '磁場崩壊【－】' }),
      regexCn: Regexes.gainsEffect({ effect: '磁场崩坏 负极' }),
      regexKo: Regexes.gainsEffect({ effect: '자기장 붕괴\\[-\\]' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      infoText: {
        en: 'Move to Postive',
        de: 'Ins Positive laufen',
        fr: 'Allez sur le plus',
      },
    },
    {
      id: 'Ridorana Yiazmat Magnetic Positive',
      regex: Regexes.gainsEffect({ effect: 'Magnetic Lysis \\+' }),
      regexDe: Regexes.gainsEffect({ effect: 'Positives Magnetfeld' }),
      regexFr: Regexes.gainsEffect({ effect: 'Charge positive' }),
      regexJa: Regexes.gainsEffect({ effect: '磁場崩壊【＋】' }),
      regexCn: Regexes.gainsEffect({ effect: '磁场崩坏 正极' }),
      regexKo: Regexes.gainsEffect({ effect: '자기장 붕괴\\[\\+\\]' }),
      condition: function(data, matches) {
        return (matches.target == data.me);
      },
      infoText: {
        en: 'Move to Negative',
        de: 'Ins Negative laufen',
        fr: 'Allez sur le moins',
      },
    },
    {
      id: 'Ridorana Yiazmat Archaeodemon',
      regex: Regexes.addedCombatant({ name: 'Archaeodemon', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Archaeodämon', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Archéodémon', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'アルケオデーモン', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '古恶魔', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '원시 악마', capture: false }),
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
      regex: Regexes.addedCombatant({ name: 'Heart Of The Dragon', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Herz Des Drachen', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Cœur De Yiazmat', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ヤズマットの心核', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '鬼龙的核心', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '야즈마트의 심핵', capture: false }),
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
        'Heartless': 'Herzlos',
        'Magnetic Levitation': 'Magnetschwebe',
        'Magnetic Lysis +': 'Positives Magnetfeld',
        'Magnetic Lysis -': 'Negatives Magnetfeld',
        'Petrification': 'Stein',
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
        'Heartless': 'Cœur Brisé',
        'Magnetic Levitation': 'Lévitation Magnétique',
        'Magnetic Lysis +': 'Charge Positive',
        'Magnetic Lysis -': 'Charge Négative',
        'Petrification': 'Pétrification',
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
        'Heartless': '心核破壊',
        'Magnetic Levitation': '磁気浮上',
        'Magnetic Lysis +': '磁場崩壊【＋】',
        'Magnetic Lysis -': '磁場崩壊【－】',
        'Petrification': '石化',
        'The One Dragon': '絶対竜',
      },
    },
  ],
}];
