'use strict';

[{
  zoneId: ZoneId.AlexanderTheSoulOfTheCreator,
  timelineFile: 'a12n.txt',
  timelineTriggers: [
    {
      id: 'A12N Tank Limit Break',
      regex: /Divine Judgment/,
      beforeSeconds: 5,
      suppressSeconds: 9999, // Let's not spam tanks if they are unlucky enough to see enrage.
      alarmText: {
        en: 'Limit break now!',
        de: 'Limit break jetzt!',
        fr: 'Limit break maintenant !',
        cn: '坦克LB！',
      },
    },
    {
      id: 'A12N Divine Spear',
      regex: /Divine Spear/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'A12N Punishing Heat',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '1AE4' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '1AE4' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '1AE4' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '1AE4' }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '1AE4' }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '1AE4' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'A12N Blazing Scourge',
      netRegex: NetRegexes.headMarker({ id: '001E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'A12N Mega Holy',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '1AE7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '1AE7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '1AE7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '1AE7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '1AE7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '1AE7', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'A12N Aggravated Assault',
      netRegex: NetRegexes.headMarker({ id: '0010' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Spread (Don\'t Stack!)',
        de: 'Verteilen (Ohne stacken)',
        fr: 'Dispersez-vous (Pas de package !)',
        ja: '散開（重ならないように）',
        cn: '分散（不要重合!）',
        ko: '산개（모이지마세요!）',
      },
      // If the user is targeted for Assault, we need to ensure the stack trigger knows.
      run: function(data) {
        data.assault = true;
      },
    },
    {
      // Both Incinerating Heat and Shared Sentence use the same stack marker.
      id: 'A12N Heat And Solidarity',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      delaySeconds: 0.5,
      alertText: function(data, matches) {
        // If the user was targeted for Assault, they shouldn't stack.
        // Unfortunately, Assault comes after the Shared Sentence marker in the log,
        // so we have to use the collect + delay construction to make calls.
        if (data.assault)
          return;
        if (data.me == matches.target) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Packez-vous sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にスタック',
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
          ko: '쉐어;징 → ' + data.ShortName(matches.target),
        };
      },
      run: function(data) {
        delete data.assault;
      },
    },
    {
      id: 'A12N Laser Sacrament',
      netRegex: NetRegexes.startsUsing({ source: 'Alexander Prime', id: '1AE5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Prim-Alexander', id: '1AE5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Primo-Alexander', id: '1AE5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アレキサンダー・プライム', id: '1AE5', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '至尊亚历山大', id: '1AE5', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '알렉산더 프라임', id: '1AE5', capture: false }),
      infoText: {
        en: 'Lasers',
        de: 'Laser',
        fr: 'Lasers',
        cn: '十字圣礼',
        ko: '십자 성례',
      },
    },
    {
      id: 'A12N Communion Tether',
      netRegex: NetRegexes.tether({ source: 'Alexander', id: '0036' }),
      netRegexDe: NetRegexes.tether({ source: 'Alexander', id: '0036' }),
      netRegexFr: NetRegexes.tether({ source: 'Alexander', id: '0036' }),
      netRegexJa: NetRegexes.tether({ source: 'アレキサンダー', id: '0036' }),
      netRegexCn: NetRegexes.tether({ source: '亚历山大', id: '0036' }),
      netRegexKo: NetRegexes.tether({ source: '알렉산더', id: '0036' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Puddle Tether on YOU',
        de: 'Flächen-Verbindung auf dir',
        fr: 'Lien Zone au sol sur VOUS',
        cn: '放圈连线点名',
        ko: '장판 남기는 선 대상자',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Prim-Alexander',
      },
      'replaceText': {
        'Blazing Scourge': 'Peitschendes Licht',
        'Chronofoil': 'Zeitschwingen',
        'Communion': 'Kommunion',
        'Divine Judgment': 'Göttliches Urteil',
        'Divine Spear': 'Heiliger Speer',
        'Gravitational Anomaly': 'Gravitationsanomalie',
        'Incinerating Heat': 'Sengende Hitze',
        'Mega Holy': 'Super-Sanctus',
        'Plaint Of Solidarity': 'Kollektivurteil',
        'Punishing Heat': 'Brennendes Urteil',
        'Sacrament': 'Sakrament',
        'Summon Alexander': 'Alexanders Beschwörung',
        'Temporal Stasis': 'Zeitstillstand',
        'timegate(?!s)': 'Zeittor',
        'timegates active': 'Zeittore Aktiv',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Primo-Alexander',
      },
      'replaceText': {
        'Blazing Scourge': 'Lumière fustigeante',
        'Chronofoil': 'Ailes du temps',
        'Communion': 'Communion',
        'Divine Judgment': 'Jugement divin',
        'Divine Spear': 'Épieu divin',
        'Gravitational Anomaly': 'Anomalie gravitationnelle',
        'Incinerating Heat': 'Chaleur purifiante',
        'Mega Holy': 'Méga Miracle',
        'Plaint Of Solidarity': 'Ordalie de la solidarité',
        'Punishing Heat': 'Chaleur punitive',
        'Sacrament': 'Sacrement',
        'Summon Alexander': 'Invocation d\'Alexander',
        'Temporal Stasis': 'Stase temporelle',
        'timegate(?!s)': 'Porte temporelle',
        'timegates active': 'Porte temporelle active',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Alexander(?! )': 'アレキサンダー',
        'Alexander Prime': 'アレキサンダー・プライム',
      },
      'replaceText': {
        'Blazing Scourge': '白光の鞭',
        'Chronofoil': '時の翼',
        'Communion': 'コミュニオン',
        'Divine Judgment': '聖なる審判',
        'Divine Spear': '聖なる炎',
        'Gravitational Anomaly': '重力異常',
        'Incinerating Heat': '浄化の熱線',
        'Mega Holy': 'メガホーリー',
        'Plaint Of Solidarity': '連帯の神判',
        'Punishing Heat': '懲罰の熱線',
        'Sacrament': '十字の秘蹟',
        'Summon Alexander': 'アレキサンダー召喚',
        'Temporal Stasis': '時間停止',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '(?<! )Alexander(?! )': '亚历山大',
        'Alexander Prime': '至尊亚历山大',
      },
      'replaceText': {
        'Blazing Scourge': '白光之鞭',
        'Chronofoil': '光阴之翼',
        'Communion': '圣餐',
        'Divine Judgment': '神圣审判',
        'Divine Spear': '圣炎',
        'Gravitational Anomaly': '重力异常',
        'Incinerating Heat': '净化射线',
        'Mega Holy': '百万神圣',
        'Plaint Of Solidarity': '连带神判',
        'Punishing Heat': '惩戒射线',
        'Sacrament': '十字圣礼',
        'Summon Alexander': '召唤亚历山大',
        'Temporal Stasis': '时间停止',
        'timegate(?!s)': '时空门',
        'timegates active': '时空门激活',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '(?<! )Alexander(?! )': '알렉산더',
        'Alexander Prime': '알렉산더 프라임',
      },
      'replaceText': {
        'Blazing Scourge': '백광의 채찍',
        'Chronofoil': '시간의 날개',
        'Communion': '성체 배령',
        'Divine Judgment': '신성한 심판',
        'Divine Spear': '신성한 불꽃',
        'Gravitational Anomaly': '중력 이상',
        'Incinerating Heat': '정화의 열선',
        'Mega Holy': '메가 홀리',
        'Plaint Of Solidarity': '연대의 심판',
        'Punishing Heat': '징벌의 열선',
        'Sacrament': '십자 성례',
        'Summon Alexander': '알렉산더 소환',
        'Temporal Stasis': '시간 정지',
        'timegate(?!s)': '시간 차원문',
        'timegates active': '시간 차원문 활성화',
      },
    },
  ],
}];
