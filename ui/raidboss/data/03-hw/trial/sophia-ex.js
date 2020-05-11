'use strict';

[{
  zoneRegex: {
    en: /^Containment Bay P1T6 \(Extreme\)$/,
    cn: /^索菲娅歼殛战$/,
  },
  timelineFile: 'sophia-ex.txt',
  timelineTriggers: [
    {
      // Gnosis does in fact have a cast time, but it's only 2.7 seconds.
      // It's safer to warn via the timeline.
      id: 'SophiaEX Gnosis',
      regex: /Gnosis/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
    {
      // Onrush also has a 2.7 second cast time and thus is best notified from the timeline.
      id: 'SophiaEX Onrush',
      regex: /Onrush/,
      beforeSeconds: 5,
      infoText: {
        en: 'Avoid Dash Attack',
      },
    },
    {
      id: 'SophiaEX Cintamani',
      regex: /Cintamani/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'SophiaEX Dischordant Cleansing',
      regex: /Dischordant Cleansing/,
      beforeSeconds: 6,
      alertText: {
        en: 'Stack With Partner',
        de: 'Mit Partner stacken',
        fr: 'Packez-vous avec votre partenaire',
        ja: '白黒合わせて',
        cn: '黑白配',
        ko: '흑백 파트너랑 모이기',
      },
    },
    {
      id: 'SophiaEX Quasar Bait',
      regex: /Quasar \(Snapshot\)/,
      beforeSeconds: 6,
      infoText: {
        en: 'Bait Quasar Meteors',
      },
    },
  ],
  triggers: [
    {
      id: 'SophiaEX Tank Buster',
      netRegex: NetRegexes.startsUsing({ id: '19C4', source: 'Sophia' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'SophiaEX Thunder 2',
      netRegex: NetRegexes.startsUsing({ id: '19B0', source: 'Sophia', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'SophiaEX Thunder 3',
      netRegex: NetRegexes.startsUsing({ id: '19AC', source: 'Sophia', capture: false }),
      response: Responses.getUnder(),
    },
    {
      // Technically this one does have a telegraph, but it feels really weird
      // to have Thunder 3 with popup text and this one not.
      id: 'SophiaEX Aero 3',
      netRegex: NetRegexes.startsUsing({ id: '19AE', source: 'Sophia', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'SophiaEX Divine Spark',
      netRegex: NetRegexes.startsUsing({ id: '19B6', source: 'The Second Demiurge', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'SophiaEX Gnostic Rant',
      netRegex: NetRegexes.startsUsing({ id: '19B8', source: 'The Third Demiurge', capture: false }),
      infoText: {
        en: 'Get behind lancer',
      },
    },
    {
      // The Aion Teleos clones have 10 fixed points where they can appear, but not all
      // combinations are valid:
      // (0,9), (0,-9), (-10,9), (-10,-9), (10,9), (10,-9), (-15,9), (-15,-9), (15,9), (15,-9).
      // Each quadrant can contain 0 or 1 clones, and the center can have 0-2.
      // There will always be 4 clones.
      // There can never be more than 3 clones North or South.
      id: 'SophiaEX Clone Collect',
      netRegex: NetRegexes.addedCombatantFull({ name: 'Aion Teleos' }),
      run: function(data, matches) {
        data.cloneSpots = data.cloneSpots || {};
        const x = parseInt(matches.x, 10);
        const y = parseInt(matches.y, 10);
        // We start with Y since it's a binary choice.
        // Note that Y-values are inverted! (In-game, 0,1 is one unit South from the origin)
        let positionString = y > 0 ? 'S' : 'N';
        // The center two clones aren't exactly on the centerline, so we round the X coordinates.
        if (Math.round(x) != 0)
          positionString += Math.round(x) < 0 ? 'W' : 'E';
        // Yes, we have to specifically uppercase this for 03 log lines.
        // No, I don't know why. Blame Square/Ravahn/Hydaelyn.
        data.cloneSpots[matches.id.toUpperCase()] = positionString;
      },
    },
    {
      // Thunder is always cast first when the Aion Teleos spawn.
      // Because we don't know whether there will be one or two Thunder tethers,
      // we have to separate out the "seen Thunder" logic.
      id: 'SophiaEX Duplicate Collect',
      netRegex: NetRegexes.tether({ id: '002D' }),
      run: function(data, matches) {
        if (data.seenThunder) {
          data.aeroClones = data.aeroClones || [];
          data.aeroClones.push(data.cloneSpots[matches.sourceId]);
        } else {
          data.thunderClones = data.thunderClones || [];
          data.thunderClones.push(data.cloneSpots[matches.sourceId]);
        }
      },
    },
    {
      // The ability here is Duplicate. The first Duplicate is always used alongside Thunder 2/3.
      id: 'SophiaEX Thunder Seen',
      netRegex: NetRegexes.startsUsing({ id: '19AB', source: 'Aion Teleos', capture: false }),
      delaySeconds: 1,
      suppressSeconds: 5,
      run: function(data) {
        data.seenThunder = true;
      },
    },
    {
      // Quasar can either be meteor baits or a platform tilt,
      // but the platform will not tilt while clones are active.
      // Since both have the same tethers and initial cast,
      // our best way to call the mechanic is to check whether clones are active.
      id: 'SophiaEX Clones Active',
      netRegex: NetRegexes.addedCombatant({ name: 'Aion Teleos', capture: false }),
      suppressSeconds: 5, // Not strictly necessary, but why not.
      run: function(data) {
        data.clonesActive = true;
      },
    },
    {
      // During the first post-intermission clones sequence,
      // Barbelo separates and makes one safespot dangerous with Light Dew, the orange laser.
      // Unfortunately Barbelo doesn't have a cast time on Light Dew, so we can't use that.
      // Instead, we warn the user when Barbelo separates from Sophia, which is 1983.
      id: 'SophiaEX Light Dew',
      netRegex: NetRegexes.ability({ id: '1983', source: 'Sophia', capture: false }),
      condition: function(data) {
        return data.clonesActive;
      },
      infoText: {
        en: 'Avoid head laser',
      },
    },
    {
      id: 'SophiaEX Execute',
      netRegex: NetRegexes.startsUsing({ id: '19AA', source: 'Sophia' }),
      durationSeconds: function(data, matches) {
        return parseInt(matches.castTime, 10);
      },
      alertText: function(data) {
        const localeCompass = {
          'N': { en: 'North' },
          'S': { en: 'South' },
          'W': { en: 'West' },
          'E': { en: 'East' },
          'NW': { en: 'Northwest' },
          'NE': { en: 'Northeast' },
          'SW': { en: 'Southwest' },
          'SE': { en: 'Southeast' },
        };
        if (data.thunderClones.length === 1)
          return localeCompass[data.thunderClones[0]];
        const composite = localeCompass[data.thunderClones[0]][data.lang] + '/' + localeCompass[data.thunderClones[1]][data.lang];
        return composite;
      },
    },
    {
      id: 'SophiaEX Clone Cleanup',
      netRegex: NetRegexes.ability({ id: '19AA', source: 'Sophia', capture: false }),
      delaySeconds: 5,
      run: function(data) {
        const cloneData = [
          'aeroClones',
          'clonesActive',
          'cloneSpots',
          'thunderClones',
          'seenThunder',
        ];
        for (let i in cloneData)
          delete data[cloneData[i]];
      },
    },
    {
      // The eight Sophia entities on the scale pans have IDs that run sequentially,
      // from n + 0 to n + 7. They spawn into the instance in a random order, but the
      // locations where they spawn have a fixed association with their sequence number offset:

      // 0: (-55.0637, -3.496415)
      // 1: (-55.06367, -10.1404)
      // 2: (-55.06363, 9.5766)
      // 3: (-55.0637, 3.523648)
      // 4: (54.9907, 3.387837)
      // 5: (54.98699, 9.576593)
      // 6: (54.9907, -3.50686)
      // 7: (54.99068, -10.14043)

      // Because of this, we need only see one entity use a 21 log line and we can find the rest.
      id: 'SophiaEX Quasar Setup',
      netRegex: NetRegexes.abilityFull({ id: '19A[89]' }),
      condition: function(data) {
        return !data.scaleSophias;
      },
      // We *really* shouldn't have to suppress this...
      suppressSeconds: 5,
      run: function(data, matches) {
        // This might be slightly more compact with a switch fallthrough,
        // but it's somewhat clearer what's going on with a const enumeration.
        const scaleMap = {
          '-55.0637-3.496415': 0,
          '-55.06367-10.1404': 1,
          '-55.063639.5766': 2,
          '-55.06373.523648': 3,
          '54.99073.387837': 4,
          '54.986999.576593': 5,
          '54.9907-3.50686': 6,
          '54.99068-10.14043': 7,
        };
        // Horrible, awful string manipulation, whyyy, Javascript?
        const seqStart = parseInt(matches.sourceId, 16) - scaleMap[matches.x + matches.y];
        for (let i = 0; i < 8; i++) {
          data.scaleSophias = data.scaleSophias || [];
          data.scaleSophias.push((seqStart + i).toString(16).toUpperCase());
        }
      },
    },
    {
      // We collect tethers here for later use on Quasar calls.
      // Blue Quasars (19A9) weigh 3 units, while orange ones (19A8) weigh 1.
      // Meteor Quasars happen only when we have a 3/1 split of tethers (balanced).
      // If the tether split is not 3/1, it will always be one of these possibilities:
      // 1/1, 2/2, 3/3, 2/1, 3/2, 4/2, 4/3
      // If the difference of the sum of weights on each side is 1, the tilt will be soft.
      // Otherwise it will be hard.
      // There will always be exactly one blue Quasar, unless the split is 4/2.
      id: 'SophiaEX Quasar Tether Collect',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: function(data) {
        // We shouldn't run this while Aion Teleos mechanics are active.
        return !data.clonesActive && data.scaleSophias;
      },
      run: function(data, matches) {
        data.quasarTethers = data.quasarTethers || [];
        data.quasarTethers.push(matches.sourceId);
      },
    },
    {
      id: 'SophiaEX Tilt Via Tether',
      netRegex: NetRegexes.tether({ id: '0011', capture: false }),
      condition: function(data) {
        // No platform tilts if clones are up, and no tilts if it's the first one.
        return !data.clonesActive && data.scaleSophias;
      },
      // We let the storage triggers catch up before calling.
      delaySeconds: .5,
      durationSeconds: 12, // Ensuring that forgetful people aren't forgotten.
      suppressSeconds: 5,
      alertText: function(data) {
        // Tethers are ordered with all East tethers first. This *doesn't* mean that the East
        // or West tethers are themselves in order within their half!
        // The eight scale entities are listed in the data object, with West at indices 0-3,
        // under data.scaleSophias.
        let safeDir = 0;
        // If there's a side with more tethers, we know for sure that's the safe side.
        // This will give us the tilt direction for all but the 1/1, 2/2, and 3/3 cases.
        // The safe side is represented here by whether safeDir is positive or negative.
        // (West/negative, East/positive.)
        for (let i = 0; i < data.quasarTethers.length; i++)
          safeDir += data.scaleSophias.indexOf(data.quasarTethers[i]) < 4 ? -1 : 1;
        if (safeDir == 0) {
          // If it's the 1/1, 2/2, or 3/3 case, we sadly don't have enough information.
          // We have to quit here and wait for the actual cast.
          return;
        }
        return {
          '2': { en: 'Go East (Hard Tilt)' },
          '1': { en: 'Go East (Soft Tilt)' },
          '-2': { en: 'Go West (Hard Tilt)' },
          '-1': { en: 'Go West (Soft Tilt)' },
          // Stringified because Javascript doesn't do negative-integer key values.
        }[safeDir.toString()];
      },
    },
    {
      // This specifically calls the case where it's 1/1;2/2;3/3 tethers.
      // The blue Quasar, 19A9, is *alway* on the dangerous side.
      // The 20/startsUsing log lines don't actually have position data,
      // but we enumerated all the locations earlier,
      // so anytime one of these entities casts, we know where it is.
      id: 'SophiaEX Tilt Via Cast',
      netRegex: NetRegexes.startsUsing({ id: '19A9', source: 'Sophia' }),
      condition: function(data) {
        // No platform tilts if clones are up, and no tilts if it's the first one.
        return !data.clonesActive && data.scaleSophias;
      },
      // We let the storage triggers catch up before calling.
      delaySeconds: .5,
      suppressSeconds: 5,
      alertText: function(data, matches) {
        if (![2, 4, 6].includes(data.quasarTethers.length))
          return;
        let balance = 0;
        // It's possible a 6-tether group could be 4/2, so we have to eliminate that possibility.
        for (let i = 0; i < data.quasarTethers.length; i++)
          balance += data.scaleSophias.indexOf(data.quasarTethers[i]) < 4 ? -1 : 1;
        if (balance != 0)
          return;
        const safeDir = data.scaleSophias.indexOf(matches.sourceId) < 4 ? 'E' : 'W';
        return {
          'W': { en: 'Go West (Hard Tilt)' },
          'E': { en: 'Go East (Hard Tilt)' },
        }[safeDir];
      },
    },
    {
      id: 'SophiaEX Tether Cleanup',
      netRegex: NetRegexes.ability({ id: '1A4C', capture: false }),
      run: function(data) {
        delete data.quasarTethers;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aion Teleos': 'Aion Teleos',
        'Barbelo': 'Barbelo',
        'Sophia': 'Sophia',
        'The First Demiurge': 'Erst[a] Demiurg',
        'The Second Demiurge': 'Zweit[a] Demiurg',
        'The Third Demiurge': 'Dritt[a] Demiurg',
      },
      'replaceText': {
        'Aero III': 'Windga',
        'Arms of Wisdom': 'Arme der Weisheit',
        'Cintamani': 'Chintamani',
        'Cloudy Heavens': 'Nebulöse Himmel',
        'Dischordant Cleansing': 'Dissonante Buße',
        'Divine Spark': 'Göttlicher Funke',
        'Duplicate': 'Duplizieren',
        'Execute': 'Exekutieren',
        'Gnosis': 'Gnosis',
        'Gnostic Rant': 'Gnostischer Gegenlauf',
        'Gnostic Spear': 'Gnostischer Speer',
        'Horizontal Kenoma': 'Horizontales Kenoma',
        'Infusion': 'Schneisenschläger',
        'Light Dew': 'Lichttau',
        'Onrush': 'Heranstürmen',
        'Quasar': 'Quasar',
        'Ring of Pain': 'Ring des Schmerzes',
        'The Scales Of Wisdom': 'Waage der Weisheit',
        'Thunder II\/III': 'Blitzra/Blitzga',
        'Thunder II(?!(?:I|\/))': 'Blitzra',
        'Thunder III': 'Blitzga',
        'Vertical Kenoma': 'Vertikales Kenoma',
        '--clones appear--': '--klone erscheinen--',
        '--adds spawn--': '--adds spawn--',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aion Teleos': 'Aion Teleos',
        'Barbelo': 'Barbelo',
        'Sophia': 'Sophia',
        'The First Demiurge': 'Premier Démiurge',
        'The Second Demiurge': 'Second Démiurge',
        'The Third Demiurge': 'Troisième Démiurge',
      },
      'replaceText': {
        'Aero III': 'Méga Vent',
        'Arms of Wisdom': 'Bras de la sagesse',
        'Cintamani': 'Chintamani',
        'Cloudy Heavens': 'Ciel nébuleux',
        'Dischordant Cleansing': 'Purification Discordante',
        'Divine Spark': 'Étincelle divine',
        'Duplicate': 'Duplication',
        'Execute': 'Exécution',
        'Gnosis': 'Gnose',
        'Gnostic Rant': 'Diatribe gnostique',
        'Gnostic Spear': 'Épieu Gnostique',
        'Horizontal Kenoma': 'Kenoma horizontal',
        'Infusion': 'Infusion',
        'Light Dew': 'Rosée De Lumière',
        'Onrush': 'Charge',
        'Quasar': 'Quasar',
        'Ring of Pain': 'Anneau de douleur',
        'The Scales Of Wisdom': 'Balance de la sagesse',
        'Thunder II\/III': 'Extra Foudre/Mega Foudre',
        'Thunder II(?!(?:I|\/))': 'Extra Foudre',
        'Thunder III': 'Méga Foudre',
        'Vertical Kenoma': 'Kenoma Vertical',
        '--clones appear--': '--apparition des clones--',
        '--adds spawn--': '--adds spawn--',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aion Teleos': 'Aion Teleos',
        'Barbelo': 'バルベロ',
        'Sophia': 'ソフィア',
        'The First Demiurge': '一の従者',
        'The Second Demiurge': '二の従者',
        'The Third Demiurge': '三の従者',
      },
      'replaceText': {
        'Aero III': 'エアロガ',
        'Arms of Wisdom': 'ウィズダムアームズ',
        'Cintamani': 'チンターマニ',
        'Cloudy Heavens': 'クラウディヘヴン',
        'Dischordant Cleansing': '不調和の罰',
        'Divine Spark': '熱いまなざし',
        'Duplicate': 'デュプリケイト',
        'Execute': 'エクセキュート',
        'Gnosis': 'グノーシス',
        'Gnostic Rant': '魔槍乱舞',
        'Gnostic Spear': '魔槍突き',
        'Horizontal Kenoma': '側面堅守',
        'Infusion': '猛突進',
        'Light Dew': 'ライトデュー',
        'Onrush': 'オンラッシュ',
        'Quasar': 'クエーサー',
        'Ring of Pain': 'リング・オブ・ペイン',
        'The Scales Of Wisdom': 'バランス・オブ・ウィズダム',
        'Thunder II\/III': 'サンダー/サンダガ',
        'Thunder II(?!(?:I|\/))': 'サンダラ',
        'Thunder III': 'サンダガ',
        'Vertical Kenoma': '前後堅守',
        '--clones appear--': '--幻影が現れる--',
        '--adds spawn--': '--adds spawn--',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aion Teleos': '移涌',
        'Barbelo': '芭碧萝',
        'Sophia': '索菲娅',
        'The First Demiurge': '信徒其一',
        'The Second Demiurge': '信徒其二',
        'The Third Demiurge': '信徒其三',
      },
      'replaceText': {
        'Aero III': '暴风',
        'Arms of Wisdom': '睿智之秤',
        'Cintamani': '如意宝珠',
        'Cloudy Heavens': '阴云天堂',
        'Dischordant Cleansing': '不平衡之罚',
        'Divine Spark': '灼热视线',
        'Duplicate': '复制',
        'Execute': '处决',
        'Gnosis': '灵知',
        'Gnostic Rant': '魔枪乱舞',
        'Gnostic Spear': '魔枪突刺',
        'Horizontal Kenoma': '侧面坚守',
        'Infusion': '猛突进',
        'Light Dew': '光露',
        'Onrush': '突袭',
        'Quasar': '类星体',
        'Ring of Pain': '痛苦环刺',
        'The Scales Of Wisdom': '睿智之天平',
        'Thunder II\/III': '震雷/暴雷',
        'Thunder II(?!(?:I|\/))': '震雷',
        'Thunder III': '暴雷',
        'Vertical Kenoma': '前后坚守',
        '--clones appear--': '--clones appear--',
        '--adds spawn--': '--adds spawn--',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aion Teleos': '아이온 소피아',
        'Barbelo': '바르벨로',
        'Sophia': '소피아',
        'The First Demiurge': '제1신도',
        'The Second Demiurge': '제2신도',
        'The Third Demiurge': '제3신도',
      },
      'replaceText': {
        'Aero III': '에어로가',
        'Arms of Wisdom': '지혜의 무기',
        'Cintamani': '친타마니',
        'Cloudy Heavens': '흐린 낙원',
        'Dischordant Cleansing': '부조화의 벌',
        'Divine Spark': '뜨거운 시선',
        'Duplicate': '복제',
        'Execute': '이행',
        'Gnosis': '영적 지혜',
        'Gnostic Rant': '마창 난무',
        'Gnostic Spear': '마창 찌르기',
        'Horizontal Kenoma': '측면 견제',
        'Infusion': '맹돌진',
        'Light Dew': '빛의 이슬',
        'Onrush': '돌진',
        'Quasar': '퀘이사',
        'Ring Of Pain': '고통의 소용돌이',
        'The Scales Of Wisdom': '지혜의 저울',
        'Thunder II\/III': '선더라/선더가',
        'Thunder II(?!(?:I|\/))': '선더라',
        'Thunder III': '선더가',
        'Vertical Kenoma': '앞뒤 견제',
        '--clones appear--': '--clones appear--',
        '--adds spawn--': '--adds spawn--',
      },
    },
  ],
}];
