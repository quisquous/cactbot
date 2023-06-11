const wings = {
  // vfx/lockon/eff/m0829_cst19_9s_c0v.avfx
  topLeftFirst: '01A5',
  // vfx/lockon/eff/m0829_cst20_9s_c0v.avfx
  topRightFirst: '01A6',
  // vfx/lockon/eff/m0829_cst21_6s_c0v.avfx
  middleLeftSecond: '01A7',
  // vfx/lockon/eff/m0829_cst22_6s_c0v.avfx
  middleRightSecond: '01A8',
  // vfx/lockon/eff/m0829_cst23_9s_c0v.avfx
  bottomLeftFirst: '01A9',
  // vfx/lockon/eff/m0829_cst24_9s_c0v.avfx
  bottomRightFirst: '01AA',
  // vfx/lockon/eff/m0829_cst19_3s_c0v.avfx
  topLeftThird: '01AF',
  // vfx/lockon/eff/m0829_cst20_3s_c0v.avfx
  topRightThird: '01B0',
  // vfx/lockon/eff/m0829_cst22_6s_c0v.avfx
  bottomLeftThird: '01B1',
  // vfx/lockon/eff/m0829_cst23_3s_c0v.avfx
  bottomRightThird: '01B2', // 82E5 damage
};
const headmarkers = {
  ...wings,
  // vfx/lockon/eff/tank_laser_5sec_lockon_c0a1.avfx
  glaukopis: '01D7',
  // vfx/lockon/eff/sph_lockon2_num01_s8p.avfx (through sph_lockon2_num04_s8p)
  limitCut1: '0150',
  limitCut2: '0151',
  limitCut3: '0152',
  limitCut4: '0153',
  // vfx/lockon/eff/sph_lockon2_num05_s8t.avfx (through sph_lockon2_num08_s8t)
  limitCut5: '01B5',
  limitCut6: '01B6',
  limitCut7: '01B7',
  limitCut8: '01B8',
  // vfx/lockon/eff/tank_lockonae_0m_5s_01t.avfx
  palladianGrasp: '01D4',
  // vfx/lockon/eff/m0376trg_fire3_a0p.avfx
  chains: '0061',
};
const limitCutMap = {
  [headmarkers.limitCut1]: 1,
  [headmarkers.limitCut2]: 2,
  [headmarkers.limitCut3]: 3,
  [headmarkers.limitCut4]: 4,
  [headmarkers.limitCut5]: 5,
  [headmarkers.limitCut6]: 6,
  [headmarkers.limitCut7]: 7,
  [headmarkers.limitCut8]: 8,
};
const limitCutIds = Object.keys(limitCutMap);
const wingIds = Object.values(wings);
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined) {
    if (data.expectedFirstHeadmarker === undefined) {
      console.error('missing expected first headmarker');
      return 'OOPS';
    }
    data.decOffset = parseInt(matches.id, 16) - parseInt(data.expectedFirstHeadmarker, 16);
  }
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  id: 'AnabaseiosTheTwelfthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
  timelineFile: 'p12s.txt',
  initData: () => {
    return {
      phase: 'door',
      wingCollect: [],
      wingCalls: [],
    };
  },
  triggers: [
    {
      id: 'P12S Phase Tracker',
      type: 'StartsUsing',
      // Ultima cast
      netRegex: { id: '8682', source: 'Pallas Athena', capture: false },
      run: (data) => {
        data.phase = 'final';
        data.expectedFirstHeadmarker = headmarkers.palladianGrasp;
      },
    },
    {
      id: 'P12S Door Boss Headmarker Tracker',
      type: 'StartsUsing',
      netRegex: { id: ['82E7', '82E8'], source: 'Athena' },
      suppressSeconds: 99999,
      run: (data, matches) => {
        // The first headmarker in the door boss is EITHER the bottom left or bottom right wing.
        const isBottomLeft = matches.id === '82E8';
        const first = isBottomLeft ? headmarkers.bottomLeftFirst : headmarkers.bottomRightFirst;
        data.expectedFirstHeadmarker = first;
      },
    },
    // --------------------- Phase 1 ------------------------
    {
      id: 'P12S First Wing',
      type: 'StartsUsing',
      netRegex: { id: ['82E7', '82E8', '82E1', '82E2'], source: 'Athena' },
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        data.wingCollect = [];
        data.wingCalls = [];
        const isLeft = matches.id === '82E8' || matches.id === '82E2';
        return isLeft ? output.right() : output.left();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'P12S Wing Collect',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        const id = getHeadmarkerId(data, matches);
        if (!wingIds.includes(id))
          return false;
        data.wingCollect.push(id);
        return true;
      },
      delaySeconds: (data) => data.decOffset === undefined ? 1 : 0,
      durationSeconds: (data) => data.wingCollect.length === 3 ? 7 : 2,
      infoText: (data, _matches, output) => {
        if (data.wingCollect.length !== 3 && data.wingCollect.length !== 2)
          return;
        const [first, second, third] = data.wingCollect;
        if (first === undefined || second === undefined)
          return;
        const isFirstLeft = first === wings.topLeftFirst || first === wings.bottomLeftFirst;
        const isSecondLeft = second === wings.middleLeftSecond;
        const isThirdLeft = third === wings.topLeftThird || third === wings.bottomLeftThird;
        const firstStr = isFirstLeft ? output.right() : output.left();
        const isFirstTop = first === wings.topLeftFirst || first === wings.topRightFirst;
        let secondCall;
        let thirdCall;
        if (isFirstTop) {
          secondCall = isFirstLeft === isSecondLeft ? 'stay' : 'swap';
          thirdCall = isSecondLeft === isThirdLeft ? 'stay' : 'swap';
        } else {
          secondCall = isFirstLeft === isSecondLeft ? 'swap' : 'stay';
          thirdCall = isSecondLeft === isThirdLeft ? 'swap' : 'stay';
        }
        data.wingCalls = [secondCall, thirdCall];
        // This is the second call only.
        if (third === undefined) {
          if (secondCall === 'stay')
            return output.secondWingCallStay();
          return output.secondWingCallSwap();
        }
        return output.allThreeWings({
          first: firstStr,
          second: output[secondCall](),
          third: output[thirdCall](),
        });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        swap: {
          en: 'Swap',
          de: 'Wechseln',
          fr: 'Swap',
        },
        stay: {
          en: 'Stay',
          de: 'bleib Stehen',
          fr: 'Restez',
        },
        secondWingCallStay: {
          en: '(stay)',
          de: '(bleib Stehen)',
          fr: '(restez)',
        },
        secondWingCallSwap: {
          en: '(swap)',
          de: '(Wechseln)',
          fr: '(swap)',
        },
        allThreeWings: {
          en: '${first} => ${second} => ${third}',
          de: '${first} => ${second} => ${third}',
          fr: '${first} => ${second} => ${third}',
        },
      },
    },
    {
      id: 'P12S Wing Followup',
      type: 'Ability',
      netRegex: {
        id: ['82E1', '82E2', '82E3', '82E4', '82E7', '82E8', '82E9', '82EA'],
        source: 'Athena',
        capture: false,
      },
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const call = data.wingCalls.shift();
        if (call === 'swap')
          return output.swap();
        if (call === 'stay')
          return output.stay();
      },
      outputStrings: {
        swap: {
          en: 'Swap',
          de: 'Wechseln',
          fr: 'Swap',
        },
        stay: {
          en: 'Stay',
          de: 'bleib Stehen',
          fr: 'Restez',
        },
      },
    },
    {
      id: 'P12S Peridialogos',
      type: 'StartsUsing',
      netRegex: { id: '82FF', source: 'Athena', capture: false },
      alertText: (data, _matches, output) =>
        data.role === 'tank' ? output.tanksInPartyOut() : output.partyOutTanksIn(),
      outputStrings: {
        partyOutTanksIn: {
          en: 'Party Out (Tanks In)',
          de: 'Gruppe Raus (Tanks Rein)',
          fr: 'Équipe à l\'extérieur (Tanks à l\'intérieur)',
        },
        tanksInPartyOut: {
          en: 'Tanks In (Party Out)',
          de: 'Gruppe Rein (Tanks Raus)',
          fr: 'Tanks à l\'intérieur (Équipe à l\'extérieur',
        },
      },
    },
    {
      id: 'P12S Apodialogos',
      type: 'StartsUsing',
      netRegex: { id: '82FE', source: 'Athena', capture: false },
      alertText: (data, _matches, output) =>
        data.role === 'tank' ? output.tanksInPartyOut() : output.partyInTanksOut(),
      outputStrings: {
        partyInTanksOut: {
          en: 'Party In (Tanks Out)',
          de: 'Gruppe Rein (Tanks Raus)',
          fr: 'Équipe à l\'intérieur (Tanks à l\'extérieur)',
        },
        tanksInPartyOut: {
          en: 'Tanks Out (Party In)',
          de: 'Tanks Raus (Gruppe Rein)',
          fr: 'Tanks à l\'extérieur (Équipe à l\'intérieur',
        },
      },
    },
    {
      id: 'P12S Limit Cut',
      type: 'HeadMarker',
      netRegex: {},
      condition: Conditions.targetIsYou(),
      durationSeconds: 20,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (!limitCutIds.includes(id))
          return;
        const num = limitCutMap[id];
        if (num === undefined)
          return;
        return output.text({ num: num });
      },
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    // --------------------- Phase 2 ------------------------
    {
      id: 'P12S Geocentrism Vertical',
      type: 'StartsUsing',
      netRegex: { id: '8329', source: 'Pallas Athena', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: 'Vertical',
      },
    },
    {
      id: 'P12S Geocentrism Circle',
      type: 'StartsUsing',
      netRegex: { id: '832A', source: 'Pallas Athena', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: 'Inny Spinny',
      },
    },
    {
      id: 'P12S Geocentrism Horizontal',
      type: 'StartsUsing',
      netRegex: { id: '832B', source: 'Pallas Athena', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: 'Horizontal',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceSync': {
        'Apodialogos/Peridialogos': 'Apodia/Peridia',
        'Astral Advance/Umbral Advance': 'Astral/Umbral Advance',
        'Astral Advent/Umbral Advent': 'Astral/Umbral Advent',
        'Astral Glow/Umbral Glow': 'Astral/Umbral Glow',
        'Astral Impact/Umbral Impact': 'Astral/Umbral Impact',
        'Superchain Coil/Superchain Burst': 'Superchain Coil/Burst',
        'Theos\'s Saltire/Theos\'s Cross': 'Saltire/Cross',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'Anthropos',
        'Athena': 'Athena',
      },
      'replaceText': {
        '\\(cast\\)': '(Wirken)',
        '\\(enrage\\)': '(Finalangriff)',
        '\\(proximity\\)': '(Entfernung)',
        '\\(spread\\)': '(Verteilen)',
        'Dialogos': 'Dialogos',
        'Engravement of Souls': 'Seelensiegel',
        'Glaukopis': 'Glaukopis',
        'On the Soul': 'Auf der Seele',
        'Palladion': 'Palladion',
        'Paradeigma': 'Paradigma',
        'Parthenos': 'Parthenos',
        'Ray of Light': 'Lichtstrahl',
        'Sample': 'Vielfraß',
        'Superchain Burst': 'Superkette - Ausbruch',
        'Superchain Coil': 'Superkette - Kreis',
        'Theos\'s Ultima': 'Theos Ultima',
        'Trinity of Souls': 'Dreifaltigkeit der Seelen',
        'Ultima Blade': 'Ultima-Klinge',
        'Unnatural Enchainment': 'Seelenfessel',
        'White Flame': 'Weißes Feuer',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'anthropos',
        'Athena': 'Athéna',
      },
      'replaceText': {
        'Dialogos': 'Dialogos',
        'Engravement of Souls': 'Marquage d\'âme',
        'Glaukopis': 'Glaukopis',
        'On the Soul': 'Sur les âmes',
        'Palladion': 'Palladion',
        'Paradeigma': 'Paradeigma',
        'Parthenos': 'Parthénon',
        'Ray of Light': 'Onde de lumière',
        'Sample': 'Voracité',
        'Superchain Burst': 'Salve des superchaînes',
        'Superchain Coil': 'Cercle des superchaînes',
        'Theos\'s Ultima': 'Ultima de théos',
        'Trinity of Souls': 'Âmes trinité',
        'Ultima Blade': 'Lames Ultima',
        'Unnatural Enchainment': 'Enchaînement d\'âmes',
        'White Flame': 'Feu blanc',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Anthropos': 'アンスロポス',
        'Athena': 'アテナ',
      },
      'replaceText': {
        'Dialogos': 'ディアロゴス',
        'Engravement of Souls': '魂の刻印',
        'Glaukopis': 'グラウコピス',
        'On the Soul': 'オン・ザ・ソウル',
        'Palladion': 'パラディオン',
        'Paradeigma': 'パラデイグマ',
        'Parthenos': 'パルテノン',
        'Ray of Light': '光波',
        'Sample': '貪食',
        'Superchain Burst': 'スーパーチェイン・バースト',
        'Superchain Coil': 'スーパーチェイン・サークル',
        'Theos\'s Ultima': 'テオス・アルテマ',
        'Trinity of Souls': 'トリニティ・ソウル',
        'Ultima Blade': 'アルテマブレイド',
        'Unnatural Enchainment': '魂の鎖',
        'White Flame': '白火',
      },
    },
  ],
});
