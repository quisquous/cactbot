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
        'Archaeodemon': 'Archaeodämon',
        'Belias, The Gigas': 'Dämonid Belias',
        'Construct 7': 'Automat Nr. 7',
        'Construct 7.1': 'verbessert(?:e|er|es|en) Automat Nr. 7',
        'Dark Rain': 'Dunkler Regen',
        'Echoes from Time\'s Garden will be sealed off': 'Garten ewiger Zeit schließt',
        'Engage!': 'Start!',
        'Famfrit, The Darkening Cloud': 'Dunkelfürst Famfrit',
        'Gigas': 'Diener von Belias',
        'Heart of the Dragon': 'Herz des Drachen',
        'Missile': 'Rakete',
        'The Cleft of Profaning Wind will be sealed off': 'Kluft entweihender Winde schließt',
        'The Clockwork Coliseum will be sealed off': 'Kolosseum von Gog schließt',
        'The Spire\'s Bounds will be sealed off': 'Katastase schließt',
        'Wind Azer': 'Windseele',
        'Yiazmat': 'Yiasmat',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Accelerate': 'Beschleunigen',
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Ancient Aero': 'Antiker Wind',
        'Annihilation Mode': 'Auslöschungsmodul',
        'Archaeodemon spawn': 'Archaeodämon erscheint',
        'Area Lockdown': 'Gebiet geschlossen',
        'Ballistic Missile': 'Ballistische Rakete',
        'Briny Cannonade': 'Aquarion',
        'Compress': 'Zerdrücken',
        'Computation Mode': 'Standardmodul',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Cyclone': 'Zyklon',
        'Dark Cannonade': 'Dunkler Blitz',
        'Dark Ewer': 'Dunkler Wasserkrug',
        'Dark Rain': 'Dunkler Regen',
        'Darkening Deluge': 'Düstere Flut',
        'Darkening Rainfall': 'Verdunkelnder Niederschlag',
        'Death Strike': 'Extonso Tod',
        'Destroy': 'Zerstören',
        'Dispose': 'Entsorgen',
        'Divide By Five': 'Arithmetik: Durch 5 teilbar',
        'Divide By Four': 'Arithmetik: Durch 4 teilbar',
        'Divide By Three': 'Arithmetik: Durch 3 teilbar',
        'Division': 'Division',
        'Dust Storm': 'Staubsturm',
        'Enrage': 'Finalangriff',
        'Eruption': 'Eruption',
        'Explosion': 'Explosion',
        'Face Off': 'Unbeugsamkeit',
        'Fast Hands': 'Schnelle Hände',
        'Ferrofluid': 'Magnet',
        'Fire': 'Feuer',
        'Fire IV': 'Feuka',
        'Gale Gaol': 'Windgefängnis',
        'Gigas spawns': 'Gigas erscheint',
        'Growing Threat': 'Mirakel',
        'Gust Front': 'Böenfront',
        'Hellfire': 'Höllenfeuer',
        'Ignite': 'Entzünden',
        'Incinerate': 'Einäschern',
        'Indivisible': 'Arithmetik: Primzahl',
        'Jet': 'Strahl',
        'Karma': 'Lebensbruch',
        'Lithobrake': 'Erledigen',
        'Magnetic Genesis': 'Magnetische Stabilisierung',
        'Magnetic Lysis': 'Magnetische Auflösung',
        'Magnetism': 'Magnetismus',
        'Materialize': 'Materialisierung',
        'Pulverize': 'Zermahlen',
        'Rake': 'Prankenhieb',
        'Slow Hands': 'Langsame Hände',
        'Solar Storm': 'Sonnensturm',
        'Stone Breath': 'Petri-Atem',
        'Subtract': 'Subtrahieren',
        'Summon': 'Beschwörung',
        'Tartarus': 'Tartarus',
        'Tartarus Mode': 'Tartarus-Modul',
        'The Hand Of Time': 'Die Hand der Zeit',
        'Tide Pod': 'Gezeitenschlag',
        'Time Bomb': 'Zeitbombe',
        'Time Eruption': 'Zeiteruption',
        'Triboelectricity': 'Elektrostatische Entladung',
        'Tsunami': 'Sturzflut',
        'Turbulence': 'Turbulenz',
        'Ultramagnetism': 'Ultramagnetismus',
        'Unholy Darkness': 'Unheiliges Dunkel',
        'Ventilate': 'Abkühlen',
        'Water IV': 'Giga-Aqua',
        'White Breath': 'Kalkatem',
      },
      '~effectNames': {
        'Acceleration Bomb': 'Beschleunigungsbombe',
        'Borne Heart': 'Freies Herz',
        'Burns': 'Brandwunde',
        'Computation Boost': 'Verbesserte Rechenleistung',
        'Computation Error': 'Rechenfehler',
        'Damage Down': 'Schaden -',
        'Down For The Count': 'Am Boden',
        'Dropsy': 'Wassersucht',
        'HP Boost +1': 'LP-Bonus +1',
        'HP Boost +2': 'LP-Bonus +2',
        'HP Boost +3': 'LP-Bonus +3',
        'HP Boost +4': 'LP-Bonus +4',
        'HP Penalty': 'LP-Malus',
        'Heartless': 'Kalte Klinge',
        'Invincibility': 'Unverwundbar',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Magnetic Levitation': 'Magnetschwebe',
        'Magnetic Lysis +': 'Positives Magnetfeld',
        'Magnetic Lysis -': 'Negatives Magnetfeld',
        'Minimum': 'Wicht',
        'Negative Charge': 'Negative Ladung',
        'Petrification': 'Stein',
        'Positive Charge': 'Positive Ladung',
        'Slow': 'Gemach',
        'Slow+': 'Gemach +',
        'Stun': 'Betäubung',
        'Temporal Barrier': 'Lauf der Zeit',
        'Temporal Displacement': 'Zeitstillstand',
        'The One Dragon': 'Absoluter Drache',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Archaeodemon': 'archéodémon',
        'Belias, The Gigas': 'Bélias le Titan',
        'Construct 7': 'Bâtisseur n°7',
        'Construct 7.1': 'Bâtisseur n°7 amélioré',
        'Dark Rain': 'Trombe d\'eau',
        'Echoes from Time\'s Garden will be sealed off': 'Fermeture du Jardin d\'un autre temps dans',
        'Engage!': 'À l\'attaque !',
        'Famfrit, The Darkening Cloud': 'Famfrit le Nuage Ténébreux',
        'Gigas': 'serviteur de Bélias',
        'Heart of the Dragon': 'cœur de Yiazmat',
        'Missile': 'Missile',
        'The Cleft of Profaning Wind will be sealed off': 'Fermeture de la corniche des Vents distordants dans',
        'The Clockwork Coliseum will be sealed off': 'Fermeture de l\'arène de Goug dans',
        'The Spire\'s Bounds will be sealed off': 'Fermeture de l\'orée des Cieux dans',
        'Wind Azer': 'aze de vent',
        'Yiazmat': 'Yiazmat',
      },
      'replaceText': {
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Accelerate': 'Aplatir',
        'Acceleration Bomb': 'Bombe accélératrice',
        'Ancient Aero': 'Vent ancien',
        'Annihilation Mode': 'Module Exterminator',
        'Archaeodemon spawn': 'Apparition des Archéodémons',
        'Area Lockdown': 'Verrouillage de la zone',
        'Ballistic Missile': 'Missiles balistiques',
        'Briny Cannonade': 'Aqua-canon',
        'Compress': 'Écraser',
        'Computation Mode': 'Module d\'arithmétique',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Cyclone': 'Cyclone',
        'Dark Cannonade': 'Bombardement ténébreux',
        'Dark Ewer': 'Aiguières ténèbreuses',
        'Dark Rain': 'Trombe d\'eau',
        'Darkening Deluge': 'Nuage stagnant',
        'Darkening Rainfall': 'Averse ténébreuse',
        'Death Strike': 'Pentacle mortel',
        'Destroy': 'Détruire',
        'Dispose': 'Annihiler',
        'Divide By Five': 'Arithmétique : multiples de 5',
        'Divide By Four': 'Arithmétique : multiples de 4',
        'Divide By Three': 'Arithmétique : multiples de 3',
        'Division': 'Division',
        'Dust Storm': 'Tempête de poussière',
        'Enrage': 'Enrage',
        'Eruption': 'Éruption',
        'Explosion': 'Explosion',
        'Face Off': 'Défiguration',
        'Fast Hands': 'Mains rapides',
        'Ferrofluid': 'Ferrofluide',
        'Fire': 'Feu',
        'Fire IV': 'Giga Feu',
        'Gale Gaol': 'Prison de vent',
        'Gigas spawns': 'Apparition des serviteurs de Bélias',
        'Growing Threat': 'Exacerbation',
        'Gust Front': 'Front de rafales',
        'Hellfire': 'Flammes de l\'enfer',
        'Ignite': 'Carboniser',
        'Incinerate': 'Incinération',
        'Indivisible': 'Arithmétique : nombres premiers',
        'Jet': 'Torrent',
        'Karma': 'Souffrance',
        'Lithobrake': 'Percuter',
        'Magnetic Genesis': 'Stabilisation du champ magnétique',
        'Magnetic Lysis': 'Dérèglement magnétique',
        'Magnetism': 'Magnétisme',
        'Materialize': 'Matérialisation',
        'Pulverize': 'Broyer',
        'Rake': 'Griffes',
        'Slow Hands': 'Mains lente',
        'Solar Storm': 'Tempête solaire',
        'Stone Breath': 'Souffle pétrifiant',
        'Subtract': 'Soustraire',
        'Summon': 'Invocation',
        'Tartarus': 'Tartaros',
        'Tartarus Mode': 'Module Tartaros',
        'The Hand Of Time': 'Trotteuse de l\'au-delà',
        'Tide Pod': 'Frappe aqueuse',
        'Time Bomb': 'Bombe à retardement',
        'Time Eruption': 'Éruption à retardement',
        'Triboelectricity': 'Décharge électrostatique',
        'Tsunami': 'Tsunami',
        'Turbulence': 'Turbulence',
        'Ultramagnetism': 'Ultra-magnétisme',
        'Unholy Darkness': 'Miracle sombre',
        'Ventilate': 'Réfrigérer',
        'Water IV': 'Giga eau',
        'White Breath': 'Souffle blanc',
      },
      '~effectNames': {
        'Acceleration Bomb': 'Bombe accélératrice',
        'Borne Heart': 'Faiblesse apparente',
        'Burns': 'Brûlure',
        'Computation Boost': 'Bonne réponse',
        'Computation Error': 'Mauvaise réponse',
        'Damage Down': 'Malus de dégâts',
        'Down For The Count': 'Au tapis',
        'Dropsy': 'Œdème',
        'HP Boost +1': 'Bonus de PV (+1)',
        'HP Boost +2': 'Bonus de PV (+2)',
        'HP Boost +3': 'Bonus de PV (+3)',
        'HP Boost +4': 'Bonus de PV (+4)',
        'HP Penalty': 'PV maximum réduits',
        'Heartless': 'Sans-cœur',
        'Invincibility': 'Invulnérable',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Magnetic Levitation': 'Lévitation magnétique',
        'Magnetic Lysis +': 'Charge positive',
        'Magnetic Lysis -': 'Charge négative',
        'Minimum': 'Mini',
        'Negative Charge': 'Charge négative',
        'Petrification': 'Pétrification',
        'Positive Charge': 'Charge positive',
        'Slow': 'Lenteur',
        'Slow+': 'Lenteur +',
        'Stun': 'Étourdissement',
        'Temporal Barrier': 'Barrière anti-stase',
        'Temporal Displacement': 'Stase temporelle',
        'The One Dragon': 'Dragon ultime',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Archaeodemon': 'アルケオデーモン',
        'Belias, The Gigas': '魔人ベリアス',
        'Construct 7': '労働七号',
        'Construct 7.1': '労働七号・改',
        'Dark Rain': '暗雲の雨水',
        'Echoes from Time\'s Garden will be sealed off': 'Echoes from Time\'s Garden will be sealed off', // FIXME
        'Engage!': '戦闘開始！',
        'Famfrit, The Darkening Cloud': '暗黒の雲ファムフリート',
        'Gigas': '魔人兵',
        'Heart of the Dragon': 'ヤズマットの心核',
        'Missile': 'ミサイル',
        'The Cleft of Profaning Wind will be sealed off': 'The Cleft of Profaning Wind will be sealed off', // FIXME
        'The Clockwork Coliseum will be sealed off': 'The Clockwork Coliseum will be sealed off', // FIXME
        'The Spire\'s Bounds will be sealed off': 'The Spire\'s Bounds will be sealed off', // FIXME
        'Wind Azer': '風のアーゼ',
        'Yiazmat': '鬼龍ヤズマット',
      },
      'replaceText': {
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Accelerate': '突貫する',
        'Acceleration Bomb': '加速度爆弾',
        'Ancient Aero': 'エンシェントエアロ',
        'Annihilation Mode': 'ジェノサイドチップ',
        'Archaeodemon spawn': 'Archaeodemon spawn', // FIXME
        'Area Lockdown': 'Area Lockdown', // FIXME
        'Ballistic Missile': 'ミサイル発射',
        'Briny Cannonade': '蒼の砲撃',
        'Compress': '圧縮する',
        'Computation Mode': '算術チップ',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Cyclone': 'サイクロン',
        'Dark Cannonade': '闇の砲撃',
        'Dark Ewer': '暗雲の水瓶',
        'Dark Rain': '暗雲の雨水',
        'Darkening Deluge': '暗雲の淀み',
        'Darkening Rainfall': '暗雲の雨',
        'Death Strike': '必殺',
        'Destroy': '破壊する',
        'Dispose': '処理する',
        'Divide By Five': '算術：5倍数',
        'Divide By Four': '算術：4倍数',
        'Divide By Three': '算術：3倍数',
        'Division': 'Division', // FIXME
        'Dust Storm': 'ダストストーム',
        'Enrage': 'Enrage',
        'Eruption': 'エラプション',
        'Explosion': '爆発',
        'Face Off': 'フェイスオフ',
        'Fast Hands': 'Fast Hands', // FIXME
        'Ferrofluid': 'マグネット',
        'Fire': 'ファイア',
        'Fire IV': 'ファイジャ',
        'Gale Gaol': '風牢',
        'Gigas spawns': 'Gigas spawns', // FIXME
        'Growing Threat': '驚異',
        'Gust Front': 'ガストフロント',
        'Hellfire': '地獄の火炎',
        'Ignite': '放熱する',
        'Incinerate': 'インシネレート',
        'Indivisible': '算術：素数',
        'Jet': '激流',
        'Karma': 'ライフブレイク',
        'Lithobrake': '落着する',
        'Magnetic Genesis': '磁場生成',
        'Magnetic Lysis': '磁場崩壊',
        'Magnetism': '磁力',
        'Materialize': '実体化',
        'Pulverize': '粉砕する',
        'Rake': 'ひっかき',
        'Slow Hands': 'Slow Hands', // FIXME
        'Solar Storm': 'ソーラーストーム',
        'Stone Breath': 'ペトロブレス',
        'Subtract': '減算する',
        'Summon': '召喚',
        'Tartarus': 'タルタロス',
        'Tartarus Mode': 'タルタロスチップ',
        'The Hand Of Time': '異界の時針',
        'Tide Pod': '水流弾',
        'Time Bomb': 'タイムボム',
        'Time Eruption': 'タイムエラプション',
        'Triboelectricity': '高速回転',
        'Tsunami': '大海嘯',
        'Turbulence': '乱気流',
        'Ultramagnetism': '強磁力',
        'Unholy Darkness': 'ダークホーリー',
        'Ventilate': '冷却する',
        'Water IV': 'ウォタジャ',
        'White Breath': 'ホワイトブレス',
      },
      '~effectNames': {
        'Acceleration Bomb': '加速度爆弾',
        'Borne Heart': '心核露出',
        'Burns': '火傷',
        'Computation Boost': '算術正解',
        'Computation Error': '算術不正解',
        'Damage Down': 'ダメージ低下',
        'Down For The Count': 'ノックダウン',
        'Dropsy': '水毒',
        'HP Boost +1': '最大ＨＰ＋1',
        'HP Boost +2': '最大ＨＰ＋2',
        'HP Boost +3': '最大ＨＰ＋3',
        'HP Boost +4': '最大ＨＰ＋4',
        'HP Penalty': '最大ＨＰダウン',
        'Heartless': '冷血剣',
        'Invincibility': '無敵',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Magnetic Levitation': '磁気浮上',
        'Magnetic Lysis +': '磁場崩壊【＋】',
        'Magnetic Lysis -': '磁場崩壊【－】',
        'Minimum': 'ミニマム',
        'Negative Charge': '磁力【－】',
        'Petrification': '石化',
        'Positive Charge': '磁力【＋】',
        'Slow': 'スロウ',
        'Slow+': 'スロウ＋',
        'Stun': 'スタン',
        'Temporal Barrier': '時間停止無効',
        'Temporal Displacement': '時間停止',
        'The One Dragon': '絶対竜',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Archaeodemon': '古恶魔',
        'Belias, The Gigas': '魔人贝利亚斯',
        'Construct 7': '劳动七号',
        'Construct 7.1': '劳动七号改',
        'Dark Rain': '暗云雨水',
        'Echoes from Time\'s Garden will be sealed off': 'Echoes from Time\'s Garden will be sealed off', // FIXME
        'Engage!': '战斗开始！',
        'Famfrit, The Darkening Cloud': '暗黑之云法姆弗里特',
        'Gigas': '魔人兵',
        'Heart of the Dragon': '鬼龙的核心',
        'Missile': '导弹',
        'The Cleft of Profaning Wind will be sealed off': 'The Cleft of Profaning Wind will be sealed off', // FIXME
        'The Clockwork Coliseum will be sealed off': 'The Clockwork Coliseum will be sealed off', // FIXME
        'The Spire\'s Bounds will be sealed off': 'The Spire\'s Bounds will be sealed off', // FIXME
        'Wind Azer': '风魔',
        'Yiazmat': '鬼龙雅兹玛特',
      },
      'replaceText': {
        '--targetable--': '--可选中--',
        '--untargetable--': '--不可选中--',
        'Accelerate': '执行贯穿',
        'Acceleration Bomb': '加速度炸弹',
        'Ancient Aero': '古代疾风',
        'Annihilation Mode': '灭绝芯片',
        'Archaeodemon spawn': 'Archaeodemon spawn', // FIXME
        'Area Lockdown': 'Area Lockdown', // FIXME
        'Ballistic Missile': '导弹发射',
        'Briny Cannonade': '苍炮击',
        'Compress': '执行压缩',
        'Computation Mode': '算术芯片',
        'Crimson Cyclone': '深红旋风',
        'Cyclone': '气旋',
        'Dark Cannonade': '暗炮击',
        'Dark Ewer': '暗云水瓶',
        'Dark Rain': '暗云雨水',
        'Darkening Deluge': '暗云沉淀',
        'Darkening Rainfall': '暗云之雨',
        'Death Strike': '必杀',
        'Destroy': '执行破坏',
        'Dispose': '执行清理',
        'Divide By Five': '算术：5的倍数',
        'Divide By Four': '算术：4的倍数',
        'Divide By Three': '算术：3的倍数',
        'Division': 'Division', // FIXME
        'Dust Storm': '尘暴',
        'Enrage': 'Enrage', // FIXME
        'Eruption': '地火喷发',
        'Explosion': '爆炸',
        'Face Off': '对决',
        'Fast Hands': 'Fast Hands', // FIXME
        'Ferrofluid': '磁铁',
        'Fire': '火炎',
        'Fire IV': '炽炎',
        'Gale Gaol': '风牢',
        'Gigas spawns': 'Gigas spawns', // FIXME
        'Growing Threat': '惊异',
        'Gust Front': '飑风',
        'Hellfire': '地狱之火炎',
        'Ignite': '执行放热',
        'Incinerate': '烈焰焚烧',
        'Indivisible': '算术：质数',
        'Jet': '激流',
        'Karma': '生命停止',
        'Lithobrake': '执行落地',
        'Magnetic Genesis': '磁场生成',
        'Magnetic Lysis': '磁场崩坏',
        'Magnetism': '磁力',
        'Materialize': '实体化',
        'Pulverize': '执行粉碎',
        'Rake': '利爪',
        'Slow Hands': 'Slow Hands', // FIXME
        'Solar Storm': '太阳风暴',
        'Stone Breath': '石化吐息',
        'Subtract': '执行减算',
        'Summon': '召唤',
        'Tartarus': '冥狱',
        'Tartarus Mode': '冥狱芯片',
        'The Hand Of Time': '异界时针',
        'Tide Pod': '水流弹',
        'Time Bomb': '时空爆弹',
        'Time Eruption': '时空地火喷发',
        'Triboelectricity': '高速旋转',
        'Tsunami': '大海啸',
        'Turbulence': '乱气流',
        'Ultramagnetism': '强磁力',
        'Unholy Darkness': '黑暗神圣',
        'Ventilate': '执行冷却',
        'Water IV': '骇水',
        'White Breath': '苍白吐息',
      },
      '~effectNames': {
        'Acceleration Bomb': '加速度炸弹',
        'Borne Heart': '核心露出',
        'Burns': '火伤',
        'Computation Boost': '回答正确',
        'Computation Error': '回答错误',
        'Damage Down': '伤害降低',
        'Down For The Count': '击倒',
        'Dropsy': '水毒',
        'HP Boost +1': '最大体力+1',
        'HP Boost +2': '最大体力+2',
        'HP Boost +3': '最大体力+3',
        'HP Boost +4': '最大体力+4',
        'HP Penalty': '最大体力减少',
        'Heartless': '冷血剑',
        'Invincibility': '无敌',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Magnetic Levitation': '磁悬浮',
        'Magnetic Lysis +': '磁场崩坏 正极',
        'Magnetic Lysis -': '磁场崩坏 负极',
        'Minimum': '缩小',
        'Negative Charge': '磁力（-）',
        'Petrification': '石化',
        'Positive Charge': '磁力（+）',
        'Slow': '减速',
        'Slow+': '减速＋',
        'Stun': '眩晕',
        'Temporal Barrier': '时间停止无效',
        'Temporal Displacement': '时间停止',
        'The One Dragon': '绝对之龙',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Archaeodemon': '원시 악마',
        'Belias, The Gigas': '마인 벨리아스',
        'Construct 7': '노동 7호',
        'Construct 7.1': '개량형 노동 7호',
        'Dark Rain': '암운의 빗물',
        'Echoes from Time\'s Garden will be sealed off': 'Echoes from Time\'s Garden will be sealed off', // FIXME
        'Engage!': '전투 시작!',
        'Famfrit, The Darkening Cloud': '암흑의 구름 팜프리트',
        'Gigas': '마인병',
        'Heart of the Dragon': '야즈마트의 심핵',
        'Missile': '미사일',
        'The Cleft of Profaning Wind will be sealed off': 'The Cleft of Profaning Wind will be sealed off', // FIXME
        'The Clockwork Coliseum will be sealed off': 'The Clockwork Coliseum will be sealed off', // FIXME
        'The Spire\'s Bounds will be sealed off': 'The Spire\'s Bounds will be sealed off', // FIXME
        'Wind Azer': '바람 원소',
        'Yiazmat': '귀룡 야즈마트',
      },
      'replaceText': {
        '--targetable--': '--대상 지정 가능--',
        '--untargetable--': '--대상 지정 불가--',
        'Accelerate': '관통',
        'Acceleration Bomb': '가속도 폭탄',
        'Ancient Aero': '에인션트 에어로',
        'Annihilation Mode': '제노사이드 칩',
        'Archaeodemon spawn': 'Archaeodemon spawn', // FIXME
        'Area Lockdown': 'Area Lockdown', // FIXME
        'Ballistic Missile': '미사일 발사',
        'Briny Cannonade': '푸른 포격',
        'Compress': '압축',
        'Computation Mode': '계산 칩',
        'Crimson Cyclone': '진홍 회오리',
        'Cyclone': '돌개바람',
        'Dark Cannonade': '어둠의 포격',
        'Dark Ewer': '암운의 물병',
        'Dark Rain': '암운의 빗물',
        'Darkening Deluge': '암운의 웅덩이',
        'Darkening Rainfall': '암운의 비',
        'Death Strike': '필살',
        'Destroy': '파괴',
        'Dispose': '처리',
        'Divide By Five': '5배수 계산',
        'Divide By Four': '4배수 계산',
        'Divide By Three': '3배수 계산',
        'Division': 'Division', // FIXME
        'Dust Storm': '먼지 폭풍',
        'Enrage': '전멸기',
        'Eruption': '용암 분출',
        'Explosion': '폭발',
        'Face Off': '경기 시작',
        'Fast Hands': 'Fast Hands', // FIXME
        'Ferrofluid': '자석',
        'Fire': '파이어',
        'Fire IV': '파이쟈',
        'Gale Gaol': '바람 감옥',
        'Gigas spawns': 'Gigas spawns', // FIXME
        'Growing Threat': '경이',
        'Gust Front': '돌풍전선',
        'Hellfire': '지옥의 화염',
        'Ignite': '열 방출',
        'Incinerate': '소각',
        'Indivisible': '소수 계산',
        'Jet': '격류',
        'Karma': '생명 파괴',
        'Lithobrake': '착륙',
        'Magnetic Genesis': '자기장 생성',
        'Magnetic Lysis': '자기장 붕괴',
        'Magnetism': '자력',
        'Materialize': '실체화',
        'Pulverize': '분쇄',
        'Rake': '할퀴기',
        'Slow Hands': 'Slow Hands', // FIXME
        'Solar Storm': '태양 폭풍',
        'Stone Breath': '석화 숨결',
        'Subtract': '뺄셈',
        'Summon': '소환',
        'Tartarus': '타르타로스',
        'Tartarus Mode': '타르타로스 칩',
        'The Hand Of Time': '이계의 시침',
        'Tide Pod': '물 탄환',
        'Time Bomb': '시간 폭탄',
        'Time Eruption': '시간의 불기둥',
        'Triboelectricity': '고속 회전',
        'Tsunami': '대해일',
        'Turbulence': '난기류',
        'Ultramagnetism': '강자력',
        'Unholy Darkness': '다크 홀리',
        'Ventilate': '냉각',
        'Water IV': '워터쟈',
        'White Breath': '하얀 숨결',
      },
      '~effectNames': {
        'Acceleration Bomb': '가속도 폭탄',
        'Borne Heart': '심핵 노출',
        'Burns': '화상',
        'Computation Boost': '계산 정답',
        'Computation Error': '계산 오답',
        'Damage Down': '주는 피해량 감소',
        'Down For The Count': '넉다운',
        'Dropsy': '물독',
        'HP Boost +1': '최대 HP +1',
        'HP Boost +2': '최대 HP +2',
        'HP Boost +3': '최대 HP +3',
        'HP Boost +4': '최대 HP +4',
        'HP Penalty': '최대 HP 감소',
        'Heartless': '냉혈검',
        'Invincibility': '무적',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Magnetic Levitation': '자기부상',
        'Magnetic Lysis +': '자기장 붕괴[+]',
        'Magnetic Lysis -': '자기장 붕괴[-]',
        'Minimum': '미니멈',
        'Negative Charge': '자력[-]',
        'Petrification': '석화',
        'Positive Charge': '자력[+]',
        'Slow': '슬로우',
        'Slow+': '둔화+',
        'Stun': '기절',
        'Temporal Barrier': '시간 정지 무효',
        'Temporal Displacement': '시간 정지',
        'The One Dragon': '절대룡',
      },
    },
  ],
}];
