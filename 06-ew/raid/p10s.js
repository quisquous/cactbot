const bossNameUnicode = 'Pand\u00e6monium';
const headmarkers = {
  // vfx/lockon/eff/com_share6_5s0c.avfx
  soulGrasp: '01D3',
  // vfx/lockon/eff/m0834trg_b0c.avfx
  webShare: '01AC',
  // vfx/lockon/eff/m0834trg_d0c.avfx
  webEntangling: '01AE',
  // vfx/lockon/eff/m0834trg_a0c.avfx
  webSpread: '01AB',
  // vfx/lockon/eff/lockon5_t0h.avfx
  spread: '0017',
};
const firstHeadmarker = parseInt(headmarkers.soulGrasp, 16);
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
  id: 'AnabaseiosTheTenthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
  timelineFile: 'p10s.txt',
  initData: () => {
    return {
      dividingWingsTethers: [],
      dividingWingsStacks: [],
      dividingWingsEntangling: [],
      meltdownSpreads: [],
    };
  },
  triggers: [
    {
      id: 'P10S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'P10S Ultima',
      type: 'StartsUsing',
      netRegex: { id: '82A5', source: bossNameUnicode, capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'P10S Soul Grasp',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.soulGrasp,
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P10S Pandaemon\'s Holy',
      type: 'StartsUsing',
      netRegex: { id: '82A6', source: bossNameUnicode, capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'P10S Circles of Pandaemonium',
      type: 'StartsUsing',
      netRegex: { id: '82A7', source: bossNameUnicode, capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'P10S Wicked Step',
      type: 'StartsUsing',
      netRegex: { id: '8299', source: bossNameUnicode, capture: false },
      alertText: (data, _matches, output) => {
        if (data.party.isTank(data.me))
          return output.soak();
      },
      infoText: (data, _matches, output) => {
        if (!data.party.isTank(data.me))
          return output.avoid();
      },
      outputStrings: {
        soak: {
          en: 'Soak tower',
          de: 'Türme nehmen',
          fr: 'Prenez une tour',
        },
        avoid: {
          en: 'Avoid towers',
          de: 'Türme vermeiden',
          fr: 'Évitez les tours',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '8297', source: bossNameUnicode, capture: false },
      run: (data) => {
        data.dividingWingsTethers = [];
        data.dividingWingsStacks = [];
        data.dividingWingsEntangling = [];
      },
    },
    {
      id: 'P10S Dividing Wings Tether',
      type: 'Tether',
      netRegex: { id: '00F2', source: bossNameUnicode },
      alarmText: (data, matches, output) => {
        data.dividingWingsTethers.push(matches.target);
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Point Tether Away',
          de: 'Zeige Verbindung weg',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Tether Break',
      type: 'Ability',
      netRegex: { id: '827F', source: bossNameUnicode, capture: false },
      condition: (data) => data.dividingWingsTethers.includes(data.me),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Break Tethers',
          de: 'Verbindung brechen',
          fr: 'Cassez les liens',
        },
      },
    },
    {
      id: 'P10S Dividing Wings Stack You',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.webShare,
      alertText: (data, matches, output) => {
        data.dividingWingsStacks.push(matches.target);
        if (data.me === matches.target)
          return output.stackOnYou();
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'P10S Dividing Wings Stacks',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.webShare,
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        // Need to check these conditions after the delay as they are ordered:
        // tethers, stack(s), (optional) entangling.
        if (data.dividingWingsTethers.includes(data.me))
          return;
        if (data.dividingWingsStacks.includes(data.me))
          return;
        if (data.dividingWingsEntangling.includes(data.me))
          return;
        return output.text();
      },
      outputStrings: {
        text: {
          en: 'Stack',
          de: 'Sammeln',
          fr: 'Package',
        },
      },
    },
    {
      id: 'P10S Entangling Web',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => {
        if (data.me !== matches.target)
          return false;
        return getHeadmarkerId(data, matches) === headmarkers.webEntangling;
      },
      alertText: (_data, _matches, output) => output.text(),
      // This will happen for non-dividing entangling web headmarkers,
      // but will get cleaned up in time for the next dividing wings.
      run: (data, matches) => data.dividingWingsEntangling.push(matches.target),
      outputStrings: {
        text: {
          // TODO: should we say "on posts" or "on back wall" based on count?
          en: 'Overlap Webs',
          de: 'Netze überlappen',
          fr: 'Superposez les toiles',
        },
      },
    },
    {
      id: 'P10S Pandaemoniac Pillars',
      type: 'StartsUsing',
      netRegex: { id: '8280', source: bossNameUnicode, capture: false },
      response: Responses.getTowers('info'),
    },
    {
      id: 'P10S Pandaemoniac Turrets',
      type: 'StartsUsing',
      netRegex: { id: '87AF', source: bossNameUnicode, capture: false },
      response: Responses.getTowers('info'),
    },
    {
      id: 'P10S Silkspit',
      type: 'StartsUsing',
      netRegex: { id: '827C', source: bossNameUnicode, capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Spread for Webs',
          de: 'Für Netze verteilen',
          fr: 'Écartez-vous pour les toiles',
        },
      },
    },
    {
      id: 'P10S Pandaemoniac Meltdown Spread',
      // These come out before the meltdown cast below.
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) => getHeadmarkerId(data, matches) === headmarkers.spread,
      alertText: (data, matches, output) => {
        data.meltdownSpreads.push(matches.target);
        if (data.me === matches.target)
          return output.spread();
      },
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'P10S Pandaemoniac Meltdown Stack',
      type: 'StartsUsing',
      netRegex: { id: '829D', source: bossNameUnicode, capture: false },
      infoText: (data, _matches, output) => {
        if (!data.meltdownSpreads.includes(data.me))
          return output.text();
      },
      run: (data) => data.meltdownSpreads = [],
      outputStrings: {
        text: {
          en: 'Line stack',
          de: 'Linien-Stack',
          fr: 'Packez-vous en ligne',
          ja: 'スタック',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
    {
      // Daemoniac Bonds starts casting
      // Then all of the Daemoniac Bonds DDE (spread) effects go out
      // Then 4x DDF or 2x E70 effects go out.
      id: 'P10S Pandaemoniac Bonds Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '82A1', source: bossNameUnicode, capture: false },
      run: (data) => {
        delete data.daemonicBondsTime;
        delete data.bondsSecondMechanic;
      },
    },
    {
      id: 'P10S Daemoniac Bonds Timer',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDE' },
      condition: (data) => data.daemonicBondsTime === undefined,
      run: (data, matches) => data.daemonicBondsTime = parseFloat(matches.duration),
    },
    {
      id: 'P10S Dueodaemoniac Bonds Future',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDF' },
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (data, matches, output) => {
        if (data.daemonicBondsTime === undefined) {
          console.error(`Daemoniac Bonds: ${matches.effectId} effect before DDE?`);
          return;
        }
        const duration = parseFloat(matches.duration);
        if (duration > data.daemonicBondsTime) {
          data.bondsSecondMechanic = 'partners';
          return output.spreadThenPartners();
        }
        data.bondsSecondMechanic = 'spread';
        return output.partnersThenSpread();
      },
      outputStrings: {
        spreadThenPartners: {
          en: '(spread => partners, for later)',
          de: '(Verteilen => Partner, für später)',
          fr: '(Écartez-vous => Partenaires, pour après)',
        },
        partnersThenSpread: {
          en: '(partners => spread, for later)',
          de: '(Partner => Verteilen, für später)',
          fr: '(Partenaires => Écartez-vous, pour après)',
        },
      },
    },
    {
      id: 'P10S TetraDaemoniac Bonds Future',
      type: 'GainsEffect',
      netRegex: { effectId: 'E70' },
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (data, matches, output) => {
        if (data.daemonicBondsTime === undefined) {
          console.error(`Daemoniac Bonds: ${matches.effectId} effect before DDE?`);
          return;
        }
        const duration = parseFloat(matches.duration);
        if (duration > data.daemonicBondsTime) {
          data.bondsSecondMechanic = 'stack';
          return output.spreadThenStack();
        }
        data.bondsSecondMechanic = 'spread';
        return output.stackThenSpread();
      },
      outputStrings: {
        spreadThenStack: {
          en: '(spread => role stack, for later)',
          de: '(Verteilen => Rollengruppe, für später)',
          fr: '(Écartez-vous => Package par rôle, pour après)',
        },
        stackThenSpread: {
          en: '(role stack => spread, for later)',
          de: '(Rollengruppe => Verteilen, für später)',
          fr: '(Package par rôle => Écartez-vous, pour après)',
        },
      },
    },
    {
      id: 'P10S Daemoniac Bonds First',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDE' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        // If this is undefined, then this is the second mechanic and will be called out elsewhere.
        // We can't make this a `condition` as this is not known until after some delay.
        if (data.bondsSecondMechanic === 'stack')
          return output.spreadThenStack();
        if (data.bondsSecondMechanic === 'partners')
          return output.spreadThenPartners();
      },
      outputStrings: {
        spreadThenStack: {
          en: 'Spread => Role Stack',
          de: 'Verteilen => Rollengruppe',
          fr: 'Écartez-vous => Package par rôle',
        },
        spreadThenPartners: {
          en: 'Spread => Partners',
          de: 'Verteilen => Partner',
          fr: 'Écartez-vous => Partenaires',
        },
      },
    },
    {
      id: 'P10S Dueodaemoniac Bonds First',
      type: 'GainsEffect',
      netRegex: { effectId: 'DDF' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.bondsSecondMechanic === 'stack')
          return output.partnersThenStack();
        if (data.bondsSecondMechanic === 'spread')
          return output.partnersThenSpread();
      },
      outputStrings: {
        partnersThenStack: {
          en: 'Partners => Role Stack',
          de: 'Partner => Rollengruppe',
          fr: 'Partenaires => Package par rôle',
        },
        partnersThenSpread: {
          en: 'Partners => Spread',
          de: 'Partner => Verteilen',
          fr: 'Partenaires => Écartez-vous',
        },
      },
    },
    {
      id: 'P10S TetraDaemoniac Bonds First',
      type: 'GainsEffect',
      netRegex: { effectId: 'E70' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.bondsSecondMechanic === 'partners')
          return output.stackThenPartners();
        if (data.bondsSecondMechanic === 'spread')
          return output.stackThenSpread();
      },
      outputStrings: {
        stackThenPartners: {
          en: 'Role Stack => Partners',
          de: 'Rollengruppe => Partner',
          fr: 'Package par rôle => Partenaires',
        },
        stackThenSpread: {
          en: 'Role Stack => Spread',
          de: 'Rollengruppe => Verteilen',
          fr: 'Package par rôle => Écartez-vous',
        },
      },
    },
    {
      id: 'P10S Daemoniac Bonds Followup',
      type: 'Ability',
      // 82A2 = Daemoniac Bonds (spread)
      // 82A3 = Dueodaemoniac Bonds (partners)
      // 87AE = TetraDaemoniac Bonds (4 person stacks)
      netRegex: { id: ['82A2', '82A3', '87AE'], source: bossNameUnicode, capture: false },
      condition: (data) => data.bondsSecondMechanic !== undefined,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.bondsSecondMechanic === 'spread')
          return output.spread();
        if (data.bondsSecondMechanic === 'partners')
          return output.partners();
        if (data.bondsSecondMechanic === 'stack')
          return output.stack();
      },
      run: (data) => delete data.bondsSecondMechanic,
      outputStrings: {
        spread: Outputs.spread,
        partners: {
          en: 'Partners',
          de: 'Partner',
          fr: 'Partenaires',
        },
        stack: {
          en: 'Role Stack',
          de: 'Rollengruppe',
          fr: 'Package par rôle',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Pandaemon\'s Holy/Circles of Pandaemonium': 'Holy/Circles',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sphere': 'arkan(?:e|er|es|en) Sphäre',
        'Pand\\\\u00e6moniac Pillar': 'pand\\u00e6monisch(?:e|er|es|en) Turm',
        'Pand\\\\u00e6monium': 'Pand\\u00e6monium',
      },
      'replaceText': {
        '\\(cast\\)': '(Wirken)',
        '\\(cone\\)': '(Kegel-AoE)',
        '\\(knockback\\)': '(Rückstoß)',
        '\\(share\\)': '(Teilen)',
        'Bury': 'Impakt',
        'Circles of Pandaemonium': 'Pandaemonischer Ring',
        'Dividing Wings': 'Teilungsstrahl',
        'Entangling Web': 'Großnetz',
        'Harrowing Hell': 'Höllenpein der Tiefe',
        'Jade Passage': 'Jadeweg',
        'Pandaemoniac Meltdown': 'Pandaemonischer Kollaps',
        'Pandaemoniac Pillars': 'Pandaemonische Säule',
        'Pandaemoniac Ray': 'Pandaemonischer Strahl',
        'Pandaemon\'s Holy': 'Pandaemonisches Sanctus',
        'Parted Plumes': 'Teilungsstrahl',
        'Peal of Condemnation': 'Verdammungsschub',
        'Peal of Damnation': 'Kanone der Verdammnis',
        'Silkspit': 'Spucknetz',
        'Soul Grasp': 'Seelengreifer',
        'Touchdown': 'Himmelssturz',
        'Ultima': 'Ultima',
        'Wicked Step': 'Übler Schritt',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sphere': 'sphère arcanique',
        'Pand\\\\u00e6moniac Pillar': 'pilier pand\\u00e6moniaque',
        'Pand\\\\u00e6monium': 'Pand\\u00e6monium',
      },
      'replaceText': {
        'Bury': 'Impact',
        'Circles of Pandaemonium': 'Anneau pandaemoniaque',
        'Dividing Wings': 'Ailes fendantes',
        'Entangling Web': 'Grande toile',
        'Harrowing Hell': 'Assaut sismique',
        'Jade Passage': 'Sentier de Jade',
        'Pandaemoniac Meltdown': 'Fusion pandaemoniaque',
        'Pandaemoniac Pillars': 'Piliers pandaemoniaques',
        'Pandaemoniac Ray': 'Rayon pandaemoniaque',
        'Pandaemon\'s Holy': 'Miracle pandaemoniaque',
        'Parted Plumes': 'Plumes fendantes',
        'Peal of Condemnation': 'Électrochoc condamnant',
        'Peal of Damnation': 'Électrochoc damnant',
        'Silkspit': 'Crachat de toile',
        'Soul Grasp': 'Saisie d\'âme',
        'Touchdown': 'Atterrissage',
        'Ultima': 'Ultima',
        'Wicked Step': 'Pattes effilées',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Arcane Sphere': '立体魔法陣',
        'Pand\\\\u00e6moniac Pillar': '万魔殿の塔',
        'Pand\\\\u00e6monium': 'パンデモニウム',
      },
      'replaceText': {
        'Bury': '衝撃',
        'Circles of Pandaemonium': 'パンデモニックリング',
        'Dividing Wings': 'ディバイドウィング',
        'Entangling Web': 'グランドウェブ',
        'Harrowing Hell': '魔殿の震撃',
        'Jade Passage': 'ロード・オブ・ジェイド',
        'Pandaemoniac Meltdown': 'パンデモニックメルトン',
        'Pandaemoniac Pillars': 'パンデモニックピラー',
        'Pandaemoniac Ray': 'パンデモニックレイ',
        'Pandaemon\'s Holy': 'パンデモニックホーリー',
        'Parted Plumes': 'ディバイドプルーム',
        'Peal of Condemnation': 'コンデムブラスター',
        'Peal of Damnation': 'ダムドブラスター',
        'Silkspit': 'スピットウェブ',
        'Soul Grasp': 'ソウルグラスプ',
        'Touchdown': 'タッチダウン',
        'Ultima': 'アルテマ',
        'Wicked Step': '尖脚',
      },
    },
  ],
});
