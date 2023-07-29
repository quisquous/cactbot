// TODO: find network lines for Yozakura Seal of Riotous Bloom arrows (nothing in network logs)
// TODO: find network lines for Enenra Out of the Smoke (nothing in network logs)
// TODO: Yozakura Seasons of the Fleeting
//       you would need to track 8384 (pinwheel) and 8383 (line) *abilities* (not incorrect casts)
//       and use their positions and rotations to know whether to say front/back/card/intercard
//       she repositions beforehand, so front/back of her is a known safe position.
// TODO: Moko safe spots for Iron Rain
// TODO: Gorai path 06 Humble Hammer safe spots for which Ball of Levin hit by Humble Hammer
const sealMap = {
  '837A': 'fire',
  '837B': 'wind',
  '837C': 'thunder',
  '837D': 'rain',
};
const sealDamageMap = {
  '8375': 'fire',
  '8376': 'wind',
  '8377': 'rain',
  '8378': 'thunder',
};
const sealIds = Object.keys(sealMap);
const sealDamageIds = Object.keys(sealDamageMap);
const mokoVfxMap = {
  '248': 'back',
  '249': 'left',
  '24A': 'front',
  '24B': 'right',
};
Options.Triggers.push({
  id: 'MountRokkon',
  zoneId: ZoneId.MountRokkon,
  timelineFile: 'mount_rokkon.txt',
  initData: () => {
    return {
      yozakuraSeal: [],
      yozakuraTatami: [],
      enenraPipeCleanerCollect: [],
    };
  },
  triggers: [
    // --------- Yozakura the Fleeting ----------
    {
      id: 'Rokkon Yozakura Glory Neverlasting',
      type: 'StartsUsing',
      netRegex: { id: '83A9', source: 'Yozakura the Fleeting' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Yozakura Art of the Windblossom',
      type: 'StartsUsing',
      netRegex: { id: '8369', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.getIn('info'),
    },
    {
      id: 'Rokkon Yozakura Art of the Fireblossom',
      type: 'StartsUsing',
      netRegex: { id: '8368', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.getOut('info'),
    },
    {
      id: 'Rokkon Yozakura Shadowflight',
      type: 'StartsUsing',
      netRegex: { id: '8380', source: 'Mirrored Yozakura', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'Rokkon Yozakura Kuge Rantsui',
      type: 'StartsUsing',
      netRegex: { id: '83AA', source: 'Yozakura the Fleeting', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Yozakura Drifting Petals',
      type: 'StartsUsing',
      netRegex: { id: '86F0', source: 'Yozakura the Fleeting', capture: false },
      alertText: (_data, _matches, output) => output.knockback(),
      outputStrings: {
        knockback: {
          en: 'Unavoidable Knockback',
          de: 'Unvermeidbarer Rückstoß',
          fr: 'Poussée inévitable',
          ja: '避けないノックバック',
          cn: '击退 (防击退无效)',
          ko: '넉백 방지 불가',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Seal Collect',
      type: 'Ability',
      netRegex: { id: sealIds, source: 'Yozakura the Fleeting' },
      run: (data, matches) => {
        // Collect flowers as they appear.
        // TODO: there are no network lines for which ones are active.
        // So we do the best we can, which is:
        // * show an alert for the first set (with only two)
        // * show nothing on the first pair of further sets (this is probably confusing to players)
        // * by process of elimination show the second pair on further sets
        const looseSealMap = sealMap;
        const seal = looseSealMap[matches.id];
        if (seal !== undefined)
          data.yozakuraSeal.push(seal);
      },
    },
    {
      id: 'Rokkon Yozakura Seal of Riotous Bloom',
      type: 'StartsUsing',
      netRegex: { id: '8374', source: 'Yozakura the Fleeting', capture: false },
      alertText: (data, _matches, output) => {
        // If we know what this is, show something. Otherwise, sorry.
        if (data.yozakuraSeal.length !== 2)
          return;
        const isIn = data.yozakuraSeal.includes('wind');
        const isCardinals = data.yozakuraSeal.includes('rain');
        if (isIn && isCardinals)
          return output.inAndCards();
        if (isIn && !isCardinals)
          return output.inAndIntercards();
        if (!isIn && isCardinals)
          return output.outAndCards();
        if (!isIn && !isCardinals)
          return output.outAndIntercards();
      },
      outputStrings: {
        inAndCards: {
          en: 'In + Cardinals',
          de: 'Rein + Kardinal',
          ko: '안 + 십자방향',
        },
        outAndCards: {
          en: 'Out + Cardinals',
          de: 'Raus + Kardinal',
          ko: '밖 + 십자방향',
        },
        inAndIntercards: {
          en: 'In + Intercards',
          de: 'Rein + Interkardinal',
          ko: '안 + 대각선',
        },
        outAndIntercards: {
          en: 'Out + Intercards',
          de: 'Raus + Interkardinal',
          ko: '밖 + 대각선',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Seal Damage Collect',
      type: 'StartsUsing',
      netRegex: { id: sealDamageIds, source: 'Yozakura the Fleeting' },
      run: (data, matches) => {
        // Remove abilities that have happened so we can know the second pair.
        const seal = sealDamageMap[matches.id];
        data.yozakuraSeal = data.yozakuraSeal.filter((x) => x !== seal);
      },
    },
    {
      id: 'Rokkon Yozakura Art of the Fluff',
      type: 'StartsUsing',
      netRegex: { id: '839E', source: 'Shiromaru' },
      alertText: (_data, matches, output) => {
        const xPos = parseFloat(matches.x);
        // center = 737
        // east = 765
        // west = 709
        if (xPos > 737)
          return output.lookWest();
        return output.lookEast();
      },
      outputStrings: {
        lookWest: {
          en: 'Look West',
          de: 'Schau nach Westen',
        },
        lookEast: {
          en: 'Look East',
          de: 'Schau nach Osten',
        },
      },
    },
    {
      id: 'Rokkon Yozakura Tatami Collect',
      type: 'MapEffect',
      // 00020001 = shake
      // 00080004 = go back to normal
      // 80038CA2 = flip
      netRegex: { flags: '00020001' },
      run: (data, matches) => data.yozakuraTatami.push(matches.location),
    },
    {
      id: 'Rokkon Yozakura Tatami-gaeshi',
      type: 'StartsUsing',
      netRegex: { id: '8395', source: 'Yozakura the Fleeting', capture: false },
      alertText: (data, _matches, output) => {
        const map = {
          '37': 'outsideNorth',
          '38': 'insideNorth',
          '39': 'insideSouth',
          '3A': 'outsideSouth',
        };
        for (const location of data.yozakuraTatami)
          delete map[location];
        // Call inside before outside.
        const callOrder = ['38', '39', '37', '3A'];
        for (const key of callOrder) {
          const outputKey = map[key];
          if (outputKey !== undefined)
            return output[outputKey]();
        }
      },
      run: (data) => data.yozakuraTatami = [],
      outputStrings: {
        outsideNorth: {
          en: 'Outside North',
          de: 'Nördlich außen',
        },
        insideNorth: {
          en: 'Inside North',
          de: 'Nördlich innen',
        },
        insideSouth: {
          en: 'Inside South',
          de: 'Südlich innen',
        },
        outsideSouth: {
          en: 'Outside South',
          de: 'Südlich außen',
        },
      },
    },
    // --------- Moko the Restless ----------
    {
      id: 'Rokkon Moko Kenki Release',
      type: 'StartsUsing',
      netRegex: { id: '85AD', source: 'Moko the Restless', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Moko Scarlet Auspice',
      type: 'StartsUsing',
      netRegex: { id: '8598', source: 'Moko the Restless', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rokkon Moko Azure Auspice',
      type: 'StartsUsing',
      netRegex: { id: '859C', source: 'Moko the Restless', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Rokkon Moko Double Kasumi-Giri Checker',
      type: 'StartsUsing',
      // This cast comes out prior to the BA9 vfx.
      netRegex: { id: '858[BCDE]', source: 'Moko the Restless', capture: false },
      run: (data) => data.isDoubleKasumiGiri = true,
    },
    {
      id: 'Rokkon Moko Iai-kasumi-giri',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => !data.isDoubleKasumiGiri,
      alertText: (_data, matches, output) => {
        const map = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]();
      },
      outputStrings: {
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'Rokkon Moko Double Kasumi-giri Second',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => data.isDoubleKasumiGiri && data.firstKasumiGiri !== undefined,
      durationSeconds: 6,
      alertText: (data, matches, output) => {
        const map = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        const firstDir = data.firstKasumiGiri;
        if (firstDir === undefined)
          return;
        const dir1 = output[firstDir]();
        const secondMap = {
          front: output.through(),
          back: output.stay(),
          left: output.rotateLeft(),
          right: output.rotateRight(),
        };
        const dir2 = secondMap[thisAbility];
        return output.combo({ dir1: dir1, dir2: dir2 });
      },
      run: (data) => {
        delete data.firstKasumiGiri;
        delete data.isDoubleKasumiGiri;
      },
      outputStrings: {
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        through: {
          en: 'Run Through',
          de: 'Renn durch',
          ko: '가로지르기',
        },
        stay: {
          en: 'Stay',
          de: 'Stehen bleiben',
          ko: '그대로',
        },
        rotateLeft: {
          en: 'Rotate Left',
          de: 'Links rotieren',
          ko: '왼쪽으로',
        },
        rotateRight: {
          en: 'Rotate Right',
          de: 'Rechts rotieren',
          ko: '오른쪽으로',
        },
        combo: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    {
      id: 'Rokkon Moko Double Kasumi-giri First',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      condition: (data) => data.isDoubleKasumiGiri && data.firstKasumiGiri === undefined,
      infoText: (data, matches, output) => {
        const map = mokoVfxMap;
        const thisAbility = map[matches.count];
        if (thisAbility === undefined)
          return;
        data.firstKasumiGiri = thisAbility;
        return output.text({ dir: output[thisAbility]() });
      },
      outputStrings: {
        text: {
          en: '(${dir} First)',
          de: '(${dir} Zuerst)',
          ko: '(${dir} 먼저)',
        },
        back: Outputs.back,
        front: Outputs.front,
        left: Outputs.left,
        right: Outputs.right,
        combo: {
          en: '${dir1} => ${dir2}',
          de: '${dir1} => ${dir2}',
          ko: '${dir1} => ${dir2}',
        },
      },
    },
    // --------- Gorai the Uncaged ----------
    {
      id: 'Rokkon Gorai Unenlightemnment',
      type: 'StartsUsing',
      netRegex: { id: '8500', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Fighting Spirits',
      type: 'StartsUsing',
      netRegex: { id: '84F8', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Biwa Breaker',
      type: 'StartsUsing',
      netRegex: { id: '84FD', source: 'Gorai the Uncaged', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Gorai Torching Torment',
      type: 'StartsUsing',
      netRegex: { id: '84FE', source: 'Gorai the Uncaged' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rokkon Gorai Summon Collect',
      type: 'StartsUsing',
      // 84D5 = Flickering Flame
      // 84D6 = Sulphuric Stone
      // 84D7 = Flame and Sulphur
      netRegex: { id: ['84D5', '84D6', '84D7'], source: 'Gorai the Uncaged' },
      run: (data, matches) => data.goraiSummon = matches,
    },
    {
      id: 'Rokkon Gorai Plectrum of Power',
      type: 'StartsUsing',
      netRegex: { id: '84D8', source: 'Gorai the Uncaged', capture: false },
      alertText: (data, _matches, output) => {
        const id = data.goraiSummon?.id;
        if (id === '84D5')
          return output.lines();
        if (id === '84D6')
          return output.rocks();
        if (id === '84D7')
          return output.both();
      },
      run: (data) => delete data.goraiSummon,
      outputStrings: {
        lines: {
          en: 'Avoid Expanding Lines',
          de: 'Weiche den expandierenden Linien aus',
        },
        rocks: {
          en: 'Avoid Expanding Rocks',
          de: 'Weiche den expandierenden Steinen aus',
        },
        both: {
          en: 'Avoid Expanding Rocks/Lines',
          de: 'Weiche den expandierenden Steinen/Linien aus',
        },
      },
    },
    {
      id: 'Rokkon Gorai Morphic Melody',
      type: 'StartsUsing',
      netRegex: { id: '84D9', source: 'Gorai the Uncaged', capture: false },
      alertText: (data, _matches, output) => {
        const id = data.goraiSummon?.id;
        if (id === '84D5')
          return output.lines();
        if (id === '84D6')
          return output.rocks();
        if (id === '84D7')
          return output.both();
      },
      run: (data) => delete data.goraiSummon,
      outputStrings: {
        lines: Outputs.goIntoMiddle,
        rocks: {
          en: 'Stand on Rock',
          de: 'Steh auf einem Stein',
        },
        both: {
          en: 'Stand on Rock + Line',
          de: 'Steh auf einem Stein + Linie',
        },
      },
    },
    {
      id: 'Rokkon Gorai Malformed Prayer',
      type: 'StartsUsing',
      netRegex: { id: '84E1', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand in All Towers',
          de: 'Steh in allen Türmen',
        },
      },
    },
    // --------- Enenra ----------
    {
      id: 'Rokkon Enenra Flagrant Combustion',
      type: 'StartsUsing',
      netRegex: { id: '8042', source: 'Enenra', capture: false },
      // Can be used during Smoke and Mirrors clone phase
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'Rokkon Enenra Smoke Rings',
      type: 'StartsUsing',
      netRegex: { id: '8053', source: 'Enenra', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rokkon Enenra Clearing Smoke',
      type: 'StartsUsing',
      netRegex: { id: '8052', source: 'Enenra', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'Rokkon Enenra Pipe Cleaner Collect',
      type: 'Tether',
      netRegex: { id: '0011' },
      run: (data, matches) => data.enenraPipeCleanerCollect.push(matches.source),
    },
    {
      id: 'Rokkon Enenra Pipe Cleaner',
      type: 'StartsUsing',
      netRegex: { id: '8054', source: 'Enenra', capture: false },
      condition: (data) => data.enenraPipeCleanerCollect.includes(data.me),
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => data.enenraPipeCleanerCollect = [],
      outputStrings: {
        text: Outputs.earthshakerOnYou,
      },
    },
    {
      id: 'Rokkon Enenra Snuff',
      type: 'StartsUsing',
      netRegex: { id: '8056', source: 'Enenra' },
      response: Responses.tankCleave(),
    },
    {
      id: 'Rokkon Enenra Uplift',
      type: 'Ability',
      // If hit by snuff, move away from uplift.
      netRegex: { id: '8056', source: 'Enenra' },
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Clearing Smoke/Smoke Rings': 'Clearing Smoke/Rings',
        'Morphic Melody/Plectrum of Power': 'Morphic/Plectrum',
        'Plectrum of Power/Morphic Melody': 'Plectrum/Morphic',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Katana': 'antik(?:e|er|es|en) Katana',
        'Ashigaru Kyuhei': 'Ashigaru Kyuhei',
        'Ball of Levin': 'Elektrosphäre',
        'Enenra': 'Enenra',
        'Gorai the Uncaged': 'Gorai (?:der|die|das) Entfesselt(?:e|er|es|en)',
        'Ill-come Tengu': 'ungebeten(?:e|er|es|en) Tengu',
        'Last Glimpse': 'Letzter Blick',
        'Mirrored Yozakura': 'gedoppelt(?:e|er|es|en) Yozakura',
        'Moko the Restless': 'Moko (?:der|die|das) Rastlos(?:e|er|es|en)',
        'Oni\'s Claw': 'Oni-Klaue',
        'Shiromaru': 'Shiromaru',
        'Shishu White Baboon': 'weiß(?:e|er|es|en) Shishu-Pavian',
        'The Hall Of Becoming': 'Halle des Werdens',
        'The Hall Of Temptation': 'Halle der Versuchungen',
        'The Hall Of The Unseen': 'Halle der Verhüllung',
        'The Pond Of Spring Rain': 'Teich des Frühlingsregens',
        'Yozakura the Fleeting': 'Yozakura (?:der|die|das) Vergänglich(?:e|er|es|en)',
      },
      'replaceText': {
        '\\(cast\\)': '(wirken)',
        'Art of the Fireblossom': 'Kunst der Feuerblüte',
        'Art of the Fluff': 'Kunst der Flauschigkeit',
        'Art of the Windblossom': 'Kunst der Windblüte',
        'Azure Auspice': 'Azurblauer Kenki-Fokus',
        'Biwa Breaker': 'Biwa-Brecher',
        'Boundless Azure': 'Grenzenloses Azurblau',
        'Boundless Scarlet': 'Grenzenloses Scharlachrot',
        'Bunshin': 'Doppeltes Ich',
        'Burst': 'Explosion',
        'Clearing Smoke': 'Rauchauflösung',
        'Clearout': 'Ausräumung',
        'Donden-gaeshi': 'Donden-gaeshi',
        'Double Kasumi-giri': 'Doppeltes Kasumi-giri',
        'Drifting Petals': 'Blütenblätterregen',
        'Explosion': 'Explosion',
        'Falling Rock': 'Steinschlag',
        'Fighting Spirits': 'Kräftigender Schluck',
        'Fire Spread': 'Brandstiftung',
        'Fireblossom Flare': 'Auflodern der Feuerblüte',
        'Flagrant Combustion': 'Abscheuliches Anfackeln',
        'Flame and Sulphur': 'Flamme und Schwefel',
        'Flickering Flame': 'Flackernde Flamme',
        'Ghastly Grasp': 'Gruselgriff',
        'Glory Neverlasting': 'Trichterwinde',
        'Humble Hammer': 'Entehrender Hammer',
        'Iai-kasumi-giri': 'Iai-kasumi-giri',
        'Icebloom': 'Eisblüte',
        'Impure Purgation': 'Flammenwind',
        'Into the Fire': 'Blutgrätsche',
        'Iron Rain': 'Eisenregen',
        'Kenki Release': 'Kenki-Entfesselung',
        'Kiseru Clamor': 'Blutschwaden-Klatsche',
        'Kuge Rantsui': 'Kuge Rantsui',
        'Levinblossom Lance': 'Blitz der Gewitterblüte',
        'Levinblossom Strike': 'Grollen der Gewitterblüte',
        'Malformed Prayer': 'Unheil des Perlenkranzes',
        'Moonless Night': 'Mondlose Nacht',
        'Morphic Melody': 'Morphende Melodie',
        'Mud Pie': 'Schlammklumpen',
        'Mudrain': 'Schlammblüte',
        'Oka Ranman': 'Oka Ranman',
        'Out of the Smoke': 'Rauchwolke',
        'Pipe Cleaner': 'Klärende Aktion',
        'Plectrum of Power': 'Plektron der Macht',
        'Pure Shock': 'Elektrische Entladung',
        'Rousing Reincarnation': 'Fluch der Verwandlung',
        'Scarlet Auspice': 'Scharlachroter Kenki-Fokus',
        'Seal Marker': 'Siegel Marker',
        'Seal of Riotous Bloom': 'Siegel des Wildblühens',
        'Seal of the Blossom': 'Siegel der Blüte',
        'Seal of the Fleeting': 'Kunst des Blütensiegels',
        'Season Indicator': 'Shikunshi Indikator',
        'Season of Element': 'Shikunshi des Elements',
        'Seasons of the Fleeting': 'Shikunshi',
        'Self-destruct': 'Selbstzerstörung',
        'Shadowflight': 'Schattenschlag',
        '(?<! )Shock': 'Entladung',
        'Silent Whistle': 'Hasenmedium',
        'Smoke Rings': 'Rauchringe',
        'Smoke Stack': 'Rauchschwade',
        'Smoke and Mirrors': 'Viel Rauch um nichts',
        'Smoldering(?! Damnation)': 'Schwelendes Feuer',
        'Smoldering Damnation': 'Schwelende Verdammnis',
        'Snuff': 'Klatsche',
        'Soldiers of Death': 'Soldaten des Todes',
        'Spearman\'s Orders': 'Lanze vor!',
        'Spike of Flame': 'Flammenstachel',
        'Spiritflame': 'Geisterflamme',
        'Spiritspark': 'Geisterfunke',
        'String Snap': 'Bebende Erde',
        'Sulphuric Stone': 'Schwefliger Stein',
        'Tatami Trap': 'Fallenstellen',
        'Tatami-gaeshi': 'Tatami-gaeshi',
        'Tengu-yobi': 'Tengu-yobi',
        'Thundercall': 'Donnerruf',
        'Torching Torment': 'Höllische Hitze',
        'Unenlightenment': 'Glühende Geißel',
        'Unsheathing': 'Ziehen des Schwertes',
        'Untempered Sword': 'Zügelloses Schwert',
        'Uplift': 'Erhöhung',
        'Upwell': 'Strömung',
        'Veil Sever': 'Schleierdurchtrennung',
        'Wily Wall': 'Missliche Mauerung',
        'Windblossom Whirl': 'Wirbel der Windblüte',
        'Worldly Pursuit': 'Springender Schmerzschlag',
        'Yama-kagura': 'Yama-kagura',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': 'katana ancien',
        'Ashigaru Kyuhei': 'ashigaru kyûhei',
        'Ball of Levin': 'orbe de foudre',
        'Enenra': 'Enenra',
        'Gorai the Uncaged': 'Gôrai le fureteur',
        'Ill-come Tengu': 'tengu du Rokkon',
        'Last Glimpse': 'Clairière du Discernement',
        'Mirrored Yozakura': 'double de Yozakura',
        'Moko the Restless': 'Môko le tourmenté',
        'Oni\'s Claw': 'griffe d\'oni',
        'Shiromaru': 'Shiromaru',
        'Shishu White Baboon': 'babouin de Shishû',
        'The Hall Of Becoming': 'Salle des trésors du Shôjôin',
        'The Hall Of Temptation': 'Vestibule doré',
        'The Pond Of Spring Rain': 'Bassin de la Pureté absolue',
        'Yozakura the Fleeting': 'Yozakura l\'élusive',
      },
      'replaceText': {
        'Art of the Fireblossom': 'Art floral de feu',
        'Art of the Fluff': 'Art molletonné',
        'Art of the Windblossom': 'Art floral de vent',
        'Azure Auspice': 'Auspice azuré',
        'Biwa Breaker': 'Biwa désaccordé',
        'Boundless Azure': 'Lueur azurée',
        'Boundless Scarlet': 'Lueur écarlate',
        'Bunshin': 'Bunshin',
        'Burst': 'Explosion',
        'Clearing Smoke': 'Fumée dissipante',
        'Clearout': 'Fauchage',
        'Donden-gaeshi': 'Donden-gaeshi',
        'Double Kasumi-giri': 'Kasumi-giri double',
        'Drifting Petals': 'Pétales faillissants',
        'Explosion': 'Explosion',
        'Falling Rock': 'Chute de pierre',
        'Fighting Spirits': 'Esprits spiritueux',
        'Fire Spread': 'Nappe de feu',
        'Fireblossom Flare': 'Éruption en fleur',
        'Flagrant Combustion': 'Combustion incandescente',
        'Flame and Sulphur': 'Soufre enflammé',
        'Flickering Flame': 'Flamme vacillante',
        'Ghastly Grasp': 'Étreinte funeste',
        'Glory Neverlasting': 'Gloire éphémère',
        'Humble Hammer': 'Marteau d\'humilité',
        'Iai-kasumi-giri': 'Iai-kasumi-giri',
        'Icebloom': 'Floraison de givre',
        'Impure Purgation': 'Purgation impure',
        'Into the Fire': 'Onde sanglante',
        'Iron Rain': 'Pluie de fer',
        'Kenki Release': 'Décharge Kenki',
        'Kiseru Clamor': 'Pipe sanglante',
        'Kuge Rantsui': 'Kuge Rantsui',
        'Levinblossom Lance': 'Lumière en fleur',
        'Levinblossom Strike': 'Tonnerre en fleur',
        'Malformed Prayer': 'Prière difforme',
        'Moonless Night': 'Nuit noire',
        'Morphic Melody': 'Mélodie mutante',
        'Mud Pie': 'Boule de boue',
        'Mudrain': 'Lotus de boue',
        'Oka Ranman': 'Oka Ranman',
        'Out of the Smoke': 'Nuée de fumée',
        'Pipe Cleaner': 'Onde fumeuse',
        'Plectrum of Power': 'Plectre du pouvoir',
        'Pure Shock': 'Choc électrisant',
        'Rousing Reincarnation': 'Réincarnation vibrante',
        'Scarlet Auspice': 'Auspice écarlate',
        'Seal of Riotous Bloom': 'Sceau de floraison vivace',
        'Seal of the Fleeting': 'Sceau de floraison',
        'Seasons of the Fleeting': 'Quatre saisons',
        'Self-destruct': 'Auto-destruction',
        'Shadowflight': 'Vol ombrageux',
        '(?<! )Shock': 'Décharge électrostatique',
        'Silent Whistle': 'Kuchiyose',
        'Smoke Rings': 'Ronds de fumée',
        'Smoke Stack': 'Signaux de fumée',
        'Smoke and Mirrors': 'Fumée sans feu',
        'Smoldering(?! Damnation)': 'Combustion consumante',
        'Smoldering Damnation': 'Damnation consumante',
        'Snuff': 'Pipe écrasante',
        'Soldiers of Death': 'Guerriers de la mort',
        'Spearman\'s Orders': 'Ordre d\'attaque',
        'Spike of Flame': 'Explosion de feu',
        'Spiritflame': 'Flamme spirituelle',
        'Spiritspark': 'Étincelle spirituelle',
        'String Snap': 'Corde cassée',
        'Sulphuric Stone': 'Soufre rocheux',
        'Tatami Trap': 'Piège de paille',
        'Tatami-gaeshi': 'Tatami-gaeshi',
        'Tengu-yobi': 'Tengu-yobi',
        'Thundercall': 'Drain fulminant',
        'Torching Torment': 'Brasier de tourments',
        'Unenlightenment': 'Sommeil spirituel',
        'Unsheathing': 'Défouraillage',
        'Untempered Sword': 'Lame impulsive',
        'Uplift': 'Exhaussement',
        'Upwell': 'Torrent violent',
        'Veil Sever': 'Voile déchiré',
        'Wily Wall': 'Mur retors',
        'Windblossom Whirl': 'Pétales tournoyants',
        'Worldly Pursuit': 'Matérialisme',
        'Yama-kagura': 'Yama-kagura',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Ancient Katana': '古刀',
        'Ashigaru Kyuhei': '足軽弓兵',
        'Ball of Levin': '雷球',
        'Enenra': '煙々羅',
        'Gorai the Uncaged': '鉄鼠ゴウライ',
        'Ill-come Tengu': '六根天狗',
        'Last Glimpse': '眼根の木間',
        'Mirrored Yozakura': 'ヨザクラの分身',
        'Moko the Restless': '怨霊モウコ',
        'Oni\'s Claw': '鬼腕',
        'Shiromaru': '忍犬シロマル',
        'Shishu White Baboon': 'シシュウ・ヒヒ',
        'The Hall Of Becoming': '宝蔵の間',
        'The Hall Of Temptation': '金堂',
        'The Pond Of Spring Rain': '浄桜湖',
        'Yozakura the Fleeting': '花遁のヨザクラ',
      },
      'replaceText': {
        'Art of the Fireblossom': '火花の術',
        'Art of the Fluff': 'もふもふの術',
        'Art of the Windblossom': '風花の術',
        'Azure Auspice': '青帝剣気',
        'Biwa Breaker': '琵琶誅撃',
        'Boundless Azure': '青帝空閃刃',
        'Boundless Scarlet': '赤帝空閃刃',
        'Bunshin': '分身の術',
        'Burst': '爆発',
        'Clearing Smoke': '衝撃煙管打ち',
        'Clearout': 'なぎ払い',
        'Donden-gaeshi': 'どんでん返しの術',
        'Double Kasumi-giri': '霞二段',
        'Drifting Petals': '落花流水の術',
        'Explosion': '爆発',
        'Falling Rock': '落石',
        'Fighting Spirits': '般若湯',
        'Fire Spread': '放火',
        'Fireblossom Flare': '火花上騰の術',
        'Flagrant Combustion': '赤熱爆煙',
        'Flame and Sulphur': '岩火招来',
        'Flickering Flame': '怪火招来',
        'Ghastly Grasp': '妖気刃',
        'Glory Neverlasting': '槿花一朝',
        'Humble Hammer': '打ち出の小槌',
        'Iai-kasumi-giri': '居合霞斬り',
        'Icebloom': '氷花満開の術',
        'Impure Purgation': '炎流',
        'Into the Fire': '血煙重波撃',
        'Iron Rain': '矢の雨',
        'Kenki Release': '剣気解放',
        'Kiseru Clamor': '血煙重打撃',
        'Kuge Rantsui': '空花乱墜',
        'Levinblossom Lance': '雷花閃光の術',
        'Levinblossom Strike': '雷花鳴響の術',
        'Malformed Prayer': '呪珠印',
        'Moonless Night': '闇夜斬り',
        'Morphic Melody': '変剋の旋律',
        'Mud Pie': '泥団子',
        'Mudrain': '泥中蓮花の術',
        'Oka Ranman': '桜花爛漫',
        'Out of the Smoke': '雲煙飛動',
        'Pipe Cleaner': '重波撃',
        'Plectrum of Power': '強勢の旋律',
        'Pure Shock': '放雷衝',
        'Rousing Reincarnation': '変現の呪い',
        'Scarlet Auspice': '赤帝剣気',
        'Seal of Riotous Bloom': '花押印・乱咲',
        'Seal of the Fleeting': '花押印の術',
        'Seasons of the Fleeting': '四君子の術',
        'Self-destruct': '自爆',
        'Shadowflight': '影討ち',
        '(?<! )Shock': '放電',
        'Silent Whistle': '口寄せの術',
        'Smoke Rings': '円撃煙管打ち',
        'Smoke Stack': '集煙法',
        'Smoke and Mirrors': '分煙法',
        'Smoldering(?! Damnation)': '噴煙燃焼',
        'Smoldering Damnation': '噴煙地獄',
        'Snuff': '重打撃',
        'Soldiers of Death': '屍兵呼び',
        'Spearman\'s Orders': '突撃命令',
        'Spike of Flame': '爆炎',
        'Spiritflame': '怪火',
        'Spiritspark': '怪火呼び',
        'String Snap': '鳴弦震動波',
        'Sulphuric Stone': '霊岩招来',
        'Tatami Trap': '罠仕込み',
        'Tatami-gaeshi': '畳返しの術',
        'Tengu-yobi': '天狗呼び',
        'Thundercall': '招雷',
        'Torching Torment': '煩熱',
        'Unenlightenment': '煩悩熾盛',
        'Unsheathing': '妖刀具現',
        'Untempered Sword': '有構無構',
        'Uplift': '隆起',
        'Upwell': '水流',
        'Veil Sever': '血地裂き',
        'Wily Wall': '法力障壁',
        'Windblossom Whirl': '風花旋回の術',
        'Worldly Pursuit': '跳鼠痛撃',
        'Yama-kagura': '山神楽',
      },
    },
  ],
});
