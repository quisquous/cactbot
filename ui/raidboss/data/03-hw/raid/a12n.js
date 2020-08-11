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
            cn: '分摊点名',
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
        'Judgment Crystal': 'Urteilskristall',
        'The General\'s Might': 'Arrhidaios (?:der|die|das) Stark(?:e|er|es|en)',
        'The General\'s Time': 'Arrhidaios (?:der|die|das) Kolossal(?:e|er|es|en)',
        'The General\'s Wing': 'Arrhidaios (?:der|die|das) Überwältigend(?:e|er|es|en)',
      },
      'replaceText': {
        '(?<!Radiant )Sacrament': 'Sakrament',
        'Almost Holy': 'Semi-Sanctus',
        'Arrhidaeus\'s Lanner': 'Arrhidaios (?:der|die|das) Bot(?:e|er|es|en)',
        'Blazing Scourge': 'Peitschendes Licht',
        'Chastening Heat': 'Brennende Verdammung',
        'Chronofoil': 'Zeitschwingen',
        'Communion': 'Kommunion',
        'Confession': 'Bekenntnis',
        'Divine Judgment': 'Göttliches Urteil',
        'Divine Spear': 'Heiliger Speer',
        'Gravitational Anomaly': 'Gravitationsanomalie',
        'Half Gravity': 'Semi-Gravitas',
        'Holy Bleed': 'Sanctus-Einschlag',
        'Holy Scourge': 'Peitschende Gloriole',
        'Inception': 'Raumzeit-Eingriff',
        'Incinerating Heat': 'Sengende Hitze',
        'Judgment Crystal': 'Urteilskristall',
        'Mega Holy': 'Super-Sanctus',
        'Plaint Of Solidarity': 'Kollektivurteil',
        'Punishing Heat': 'Brennendes Urteil',
        'Radiant Sacrament': 'Brennendes Sakrament',
        'Smash': 'Schmettern',
        'Summon Alexander': 'Alexanders Beschwörung',
        'Temporal Stasis': 'Zeitstillstand',
        'Tetrashatter': 'Kristallbruch',
        'The General\'s Might': 'Arrhidaios (?:der|die|das) Stark(?:e|er|es|en)',
        'The General\'s Time': 'Arrhidaios (?:der|die|das) Kolossal(?:e|er|es|en)',
        'The General\'s Wing': 'Arrhidaios (?:der|die|das) Überwältigend(?:e|er|es|en)',
        'Void Of Repentance': 'Kammer der Buße',
        'timegate(?!s)': 'Zeittor',
        'timegates active': 'Zeittore Aktiv',
        'timestop': 'Zeitstopp',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Primo-Alexander',
        'Judgment Crystal': 'Cristal du jugement',
        'The General\'s Might': 'Pouvoir d\'Arrhabée',
        'The General\'s Time': 'Temps d\'Arrhabée',
        'The General\'s Wing': 'Aile d\'Arrhabée',
      },
      'replaceText': {
        '(?<! )Sacrament': 'Sacrement',
        '--timestop--': '--arrêt du temps--',
        '\\(Radiant\\?\\) Sacrament': 'Sacrement (rayonnant ?)',
        '\\(W\\)': '(O)',
        'Almost Holy(?!\\?)': 'Quasi-Miracle',
        'Almost Holy\\?': 'Quasi-Miracle ?',
        'Arrhidaeus\'s Lanner': 'Messager d\'Arrhabée',
        'Blazing Scourge': 'Lumière fustigeante',
        'Chastening Heat': 'Chaleur de l\'ordalie',
        'Chronofoil': 'Ailes du temps',
        'Communion': 'Communion',
        'Confession': 'Confession',
        'Divine Judgment': 'Jugement divin',
        'Divine Spear': 'Épieu divin',
        'Gravitational Anomaly': 'Anomalie gravitationnelle',
        'Half Gravity': 'Demi-Pesanteur',
        'Holy Bleed': 'Impact miraculeux',
        'Holy Scourge': 'Lumière fustigeante',
        'Inception': 'Commencement',
        'Incinerating Heat': 'Chaleur purifiante',
        'Judgment Crystal': 'Cristal du jugement',
        'Mega Holy': 'Méga Miracle',
        'Plaint Of Solidarity': 'Ordalie de la solidarité',
        'Punishing Heat': 'Chaleur punitive',
        'Radiant Sacrament': 'Sacrement rayonnant',
        'Smash': 'Fracassement',
        'Summon Alexander': 'Invocation d\'Alexander',
        'Temporal Stasis': 'Stase temporelle',
        'Tetrashatter': 'Rupture',
        'The General\'s Might': 'Pouvoir d\'Arrhabée',
        'The General\'s Time': 'Temps d\'Arrhabée',
        'The General\'s Wing': 'Aile d\'Arrhabée',
        'timegate': 'Porte temporelle',
        'Void Of Repentance': 'Vide du repentir',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Alexander(?! )': 'アレキサンダー',
        'Alexander Prime': 'アレキサンダー・プライム',
        'Judgment Crystal': '審判の結晶',
        'The General\'s Might': 'アリダイオス・マイト',
        'The General\'s Time': 'アリダイオス・タイム',
        'The General\'s Wing': 'アリダイオス・ウィング',
      },
      'replaceText': {
        '(?<!Radiant )Sacrament': '十字の秘蹟',
        'Almost Holy': 'プチホーリー',
        'Arrhidaeus\'s Lanner': 'アリダイオス・ランナー',
        'Blazing Scourge': '白光の鞭',
        'Chastening Heat': '神罰の熱線',
        'Chronofoil': '時の翼',
        'Communion': 'コミュニオン',
        'Confession': '強制告解',
        'Divine Judgment': '聖なる審判',
        'Divine Spear': '聖なる炎',
        'Gravitational Anomaly': '重力異常',
        'Half Gravity': 'プチグラビデ',
        'Holy Bleed': 'ホーリーバースト',
        'Holy Scourge': '聖光の鞭',
        'Inception': '時空潜行',
        'Incinerating Heat': '浄化の熱線',
        'Judgment Crystal': '審判の結晶',
        'Mega Holy': 'メガホーリー',
        'Plaint Of Solidarity': '連帯の神判',
        'Punishing Heat': '懲罰の熱線',
        'Radiant Sacrament': '拝火の秘蹟',
        'Smash': 'スマッシュ',
        'Summon Alexander': 'アレキサンダー召喚',
        'Temporal Stasis': '時間停止',
        'Tetrashatter': '結晶破裂',
        'The General\'s Might': 'アリダイオス・マイト',
        'The General\'s Time': 'アリダイオス・タイム',
        'The General\'s Wing': 'アリダイオス・ウィング',
        'Void Of Repentance': '懺悔の間',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '(?<! )Alexander(?! )': '亚历山大',
        'Alexander Prime': '至尊亚历山大',
        'Judgment Crystal': '审判结晶',
        'The General\'s Might': '阿里达乌斯之力',
        'The General\'s Time': '阿里达乌斯之时',
        'The General\'s Wing': '阿里达乌斯之翼',
      },
      'replaceText': {
        '(?<!Radiant )Sacrament': '十字圣礼',
        'Almost Holy': '小神圣',
        'Arrhidaeus\'s Lanner': '阿里达乌斯之速',
        'Blazing Scourge': '白光之鞭',
        'Chastening Heat': '神罚射线',
        'Chronofoil': '光阴之翼',
        'Communion': '圣餐',
        'Confession': '强制告解',
        'Divine Judgment': '神圣审判',
        'Divine Spear': '圣炎',
        'Gravitational Anomaly': '重力异常',
        'Half Gravity': '小重力',
        'Holy Bleed': '神圣爆发',
        'Holy Scourge': '圣光之鞭',
        'Inception': '时空潜行',
        'Incinerating Heat': '净化射线',
        'Judgment Crystal': '审判结晶',
        'Mega Holy': '百万神圣',
        'Plaint Of Solidarity': '连带神判',
        'Punishing Heat': '惩戒射线',
        'Radiant Sacrament': '拜火圣礼',
        'Smash': '碎击斩',
        'Summon Alexander': '召唤亚历山大',
        'Temporal Stasis': '时间停止',
        'Tetrashatter': '结晶破碎',
        'The General\'s Might': '阿里达乌斯之力',
        'The General\'s Time': '阿里达乌斯之时',
        'The General\'s Wing': '阿里达乌斯之翼',
        'Void Of Repentance': '忏悔区',
        'timegate(?!s)': '时空门',
        'timegates active': '时空门激活',
        'timestop': '时停',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        '(?<! )Alexander(?! )': '알렉산더',
        'Alexander Prime': '알렉산더 프라임',
        'Judgment Crystal': '심판의 결정체',
        'The General\'s Might': '아리다이오스의 권력',
        'The General\'s Time': '아리다이오스의 시간',
        'The General\'s Wing': '아리다이오스의 날개',
      },
      'replaceText': {
        '(?<!Radiant )Sacrament': '십자 성례',
        'Almost Holy': '프티 홀리',
        'Arrhidaeus\'s Lanner': '아리다이오스의 전령',
        'Blazing Scourge': '백광의 채찍',
        'Chastening Heat': '신벌의 열선',
        'Chronofoil': '시간의 날개',
        'Communion': '성체 배령',
        'Confession': '강제 고해',
        'Divine Judgment': '신성한 심판',
        'Divine Spear': '신성한 불꽃',
        'Gravitational Anomaly': '중력 이상',
        'Half Gravity': '프티 그라비데',
        'Holy Bleed': '성스러운 폭발',
        'Holy Scourge': '성광의 채찍',
        'Inception': '시공 잠행',
        'Incinerating Heat': '정화의 열선',
        'Judgment Crystal': '심판의 결정체',
        'Mega Holy': '메가 홀리',
        'Plaint Of Solidarity': '연대의 심판',
        'Punishing Heat': '징벌의 열선',
        'Radiant Sacrament': '원형 성례',
        'Smash': '박살',
        'Summon Alexander': '알렉산더 소환',
        'Temporal Stasis': '시간 정지',
        'Tetrashatter': '결정체 파열',
        'The General\'s Might': '아리다이오스의 권력',
        'The General\'s Time': '아리다이오스의 시간',
        'The General\'s Wing': '아리다이오스의 날개',
        'Void Of Repentance': '참회의 방',
        'timegate(?!s)': '시간 차원문',
        'timegates active': '시간 차원문 활성화',
        'timestop': '시간 정지',
      },
    },
  ],
}];
