'use strict';

// This is meant to be used in a trigger as such:
// {
//   id: 'Some tankbuster',
//   regex: Regexes.startsUsing({source: 'Ye Olde Bosse', id: '666'}),
//   condition: Conditions.caresAboutMagical(data),
//   response: Responses.tankbuster(),
// },
//
// Note: Breaking out the condition like this lets people override it if they
// always (or never) want to know about it, rather than hiding the logic inside
// the tankbuster callback with a "is healer" check.
//
// If data.role is used, it should be only to differentiate between alert levels,
// and not whether a message is sent at all.
//
// Although this is not true of `response: ` fields on triggers in general,
// all responses in this file should either return an object or a single
// function that sets outputStrings and returns an object without doing
// anything with data or matches.  See `responses_test.js`.

const builtInResponseStr = 'cactbot-builtin-response';

const triggerFunctions = [
  'alarmText',
  'alertText',
  'condition',
  'delaySeconds',
  'disabled',
  'durationSeconds',
  'groupTTS',
  'id',
  'infoText',
  'preRun',
  'promise',
  'response',
  'run',
  'sound',
  'soundVolume',
  'suppressSeconds',
  'tts',
  'outputStrings',
];

const severityMap = {
  'info': 'infoText',
  'alert': 'alertText',
  'alarm': 'alarmText',
};

const getText = (sev) => {
  if (!(sev in severityMap))
    throw new Error(`Invalid severity: ${sev}.`);
  return severityMap[sev];
};

const defaultInfoText = (sev) => {
  if (!sev)
    return 'infoText';
  return getText(sev);
};

const defaultAlertText = (sev) => {
  if (!sev)
    return 'alertText';
  return getText(sev);
};

const defaultAlarmText = (sev) => {
  if (!sev)
    return 'alarmText';
  return getText(sev);
};

const getTarget = (matches) => {
  // Often tankbusters can be casted by the boss on the boss.
  // Consider this as "not having a target".
  if (!matches || matches.target === matches.source)
    return null;
  return matches.target || matches[1];
};

const getSource = (matches) => {
  return matches.source || matches[0];
};

// FIXME: make this work for any number of pairs of params
const combineFuncs = function(text1, func1, text2, func2) {
  let obj = {};

  if (text1 !== text2) {
    obj[text1] = func1;
    obj[text2] = func2;
  } else {
    obj[text1] = (data, matches, output) => {
      func1(data, matches, output) || func2(data, matches, output);
    };
  }
  return obj;
};

const isPlayerId = (id) => {
  return id[0] !== '4';
};

// For responses that unconditionally return static text.
const staticResponse = (field, text) => (data, _, output) => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    text: text,
  };
  return {
    [field]: (data, _, output) => output.text(),
  };
};

const Responses = {
  tankBuster: (targetSev, otherSev) => {
    const outputStrings = {
      noTarget: {
        en: 'Tank Buster',
        de: 'Tank buster',
        fr: 'Tank buster',
        ja: 'タンクバスター',
        cn: '坦克死刑',
        ko: '탱버',
      },
      busterOnYou: {
        en: 'Tank Buster on YOU',
        de: 'Tank buster auf DIR',
        fr: 'Tank buster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
        ko: '탱버 대상자',
      },
      busterOnTarget: {
        en: 'Tank Buster on ${name}',
        de: 'Tank buster auf ${name}',
        fr: 'Tank buster sur ${name}',
        ja: '${name}にタンクバスター',
        cn: '死刑 点 ${name}',
        ko: '"${name}" 탱버',
      },
    };

    const targetFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (!target) {
        if (data.role !== 'tank' && data.role !== 'healer')
          return;
        return output.noTarget();
      }

      if (target === data.me)
        return output.busterOnYou();
    };

    const otherFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (!target) {
        if (data.role === 'tank' || data.role === 'healer')
          return;
        return output.noTarget();
      }
      if (target === data.me)
        return;

      return output.busterOnTarget({ name: data.ShortName(target) });
    };

    const combined = combineFuncs(defaultAlertText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
    return (data, _, output) => {
      // cactbot-builtin-response
      output.responseOutputStrings = outputStrings;
      return combined;
    };
  },
  tankBusterSwap: (busterSev, swapSev) => {
    const outputStrings = {
      tankSwap: {
        en: 'Tank Swap!',
        de: 'Tankwechsel!',
        fr: 'Tank swap !',
        ja: 'タンクスイッチ',
        cn: '换T！',
        ko: '탱 교대',
      },
      busterOnYou: {
        en: 'Tank Buster on YOU',
        de: 'Tank buster auf DIR',
        fr: 'Tank buster sur VOUS',
        ja: '自分にタンクバスター',
        cn: '死刑点名',
        ko: '탱버 대상자',
      },
      busterOnTarget: {
        en: 'Tank Buster on ${name}',
        de: 'Tank buster auf ${name}',
        fr: 'Tank buster sur ${name}',
        ja: '${name}にタンクバスター',
        cn: '死刑 点 ${name}',
        ko: '"${name}" 탱버',
      },
    };

    // Note: busterSev and swapSev can be the same priority.
    const tankSwapFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (data.role === 'tank' && target !== data.me)
        return output.tankSwap();
    };
    const busterFunc = (data, matches, output) => {
      const target = getTarget(matches);

      if (data.role === 'tank' && target !== data.me)
        return;

      if (target === data.me)
        return output.busterOnYou();
      return output.busterOnTarget({ name: data.ShortName(target) });
    };

    const combined = combineFuncs(defaultAlarmText(swapSev), tankSwapFunc,
        defaultAlertText(busterSev), busterFunc);
    return (data, _, output) => {
      // cactbot-builtin-response
      output.responseOutputStrings = outputStrings;
      return combined;
    };
  },
  tankCleave: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      cleaveOnYou: {
        en: 'Tank cleave on YOU',
        de: 'Tank Cleave aud DIR',
        fr: 'Tank cleave sur VOUS',
        ja: '自分に前方範囲攻撃',
        cn: '顺劈点名',
        ko: '나에게 광역 탱버',
      },
      cleaveNoTarget: {
        en: 'Tank cleave',
        de: 'Tank Cleave',
        fr: 'Tank cleave',
        ja: '前方範囲攻撃',
        cn: '顺劈',
        ko: '광역 탱버',
      },
      avoidCleave: {
        en: 'Avoid tank cleave',
        de: 'Tank Cleave ausweichen',
        fr: 'Évitez le tank cleave',
        ja: '前方範囲攻撃を避け',
        cn: '远离顺劈',
        ko: '광역 탱버 피하기',
      },
    };
    return {
      [defaultInfoText(sev)]: (data, matches, output) => {
        if (data.role === 'tank') {
          const target = getTarget(matches);
          if (target === data.me)
            return output.cleaveOnYou();
          // targetless tank cleave
          return output.cleaveNoTarget();
        }
        return output.avoidCleave();
      },
    };
  },
  miniBuster: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Mini Buster',
    de: 'Kleiner Tankbuster',
    fr: 'Mini Buster',
    ja: 'ミニバスター',
    cn: '小死刑',
    ko: '약한 탱버',
  }),
  aoe: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'aoe',
    de: 'AoE',
    fr: 'AoE',
    ja: 'AoE',
    cn: 'AoE',
    ko: '전체 공격',
  }),
  bigAoe: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'big aoe!',
    de: 'Große AoE!',
    fr: 'Grosse AoE !',
    ja: '大ダメージAoE',
    cn: '大AoE伤害！',
    ko: '강한 전체 공격!',
  }),
  spread: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Spread',
    de: 'Verteilen',
    fr: 'Dispersez-vous',
    ja: '散開',
    cn: '分散',
    ko: '산개',
  }),
  stackMarker: (sev) => staticResponse(defaultAlertText(sev), {
    // for stack marker
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '頭割り',
    cn: '分摊',
    ko: '쉐어뎀',
  }),
  getTogether: (sev) => staticResponse(defaultAlertText(sev), {
    // for getting together without stack marker
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '頭割り',
    cn: '分摊',
    ko: '쉐어뎀',
  }),
  stackMarkerOn: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      stackOnYou: {
        en: 'Stack on YOU',
        de: 'Auf DIR sammeln',
        fr: 'Package sur VOUS',
        ja: '自分にスタック',
        cn: '集合点名',
        ko: '쉐어징 대상자',
      },
      stackOnTarget: {
        en: 'Stack on ${name}',
        de: 'Auf ${name} sammeln',
        fr: 'Packez-vous sur ${name}',
        ja: '${name}にスタック',
        cn: '靠近 ${name}集合',
        ko: '"${name}" 쉐어징',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const target = getTarget(matches);
        if (target === data.me)
          return output.stackOnYou();
        return output.stackOnTarget({ name: data.ShortName(target) });
      },
    };
  },
  stackMiddle: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Stack in middle',
    fr: 'Packez-vous au milieu',
    de: 'In der Mitte sammeln',
    ja: '中央でスタック',
    cn: '中间集合',
    ko: '중앙에서 모이기',
  }),
  doritoStack: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Dorito Stack',
    de: 'Mit Marker sammeln',
    fr: 'Packez les marquages',
    ja: 'マーカー付けた人とスタック',
    cn: '点名集合',
    ko: '징끼리 모이기',
  }),
  spreadThenStack: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Spread => Stack',
    de: 'Verteilen => Sammeln',
    fr: 'Dispersion => Package',
    ja: '散開 => スタック',
    cn: '分散 => 集合',
    ko: '산개 => 집합',
  }),
  stackThenSpread: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Stack => Spread',
    de: 'Sammeln => Verteilen',
    fr: 'Package => Dispersion',
    ja: 'スタック => 散開',
    cn: '集合 => 分散',
    ko: '집합 => 산개',
  }),
  knockback: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Knockback',
    de: 'Rückstoß',
    fr: 'Poussée',
    ja: 'ノックバック',
    cn: '击退',
    ko: '넉백',
  }),
  knockbackOn: (targetSev, otherSev) => {
    const outputStrings = {
      knockbackOnYou: {
        en: 'Knockback on YOU',
        de: 'Rückstoß auf DIR',
        fr: 'Poussée sur VOUS',
        ja: '自分にノックバック',
        cn: '击退点名',
        ko: '넉백징 대상자',
      },
      knockbackOnTarget: {
        en: 'Knockback on ${name}',
        de: 'Rückstoß auf ${name}',
        fr: 'Poussée sur ${name}',
        ja: '${name}にノックバック',
        cn: '击退点名${name}',
        ko: '"${name}" 넉백징',
      },
    };

    const targetFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (target === data.me)
        return output.knockbackOnYou();
    };

    const otherFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (target !== data.me)
        return output.knockbackOnTarget({ name: data.ShortName(target) });
    };
    const combined = combineFuncs(defaultInfoText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
    return (data, _, output) => {
      // cactbot-builtin-response
      output.responseOutputStrings = outputStrings;
      return combined;
    };
  },
  lookTowards: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Look Towards Boss',
    de: 'Anschauen Boss',
    fr: 'Regardez le boss',
    ja: '見る',
    cn: '背对',
    ko: '쳐다보기',
  }),
  lookAway: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Look Away',
    de: 'Wegschauen',
    fr: 'Regardez ailleurs',
    ja: '見ない',
    cn: '背对',
    ko: '뒤돌기',
  }),
  lookAwayFromTarget: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      lookAwayFrom: {
        en: 'Look Away from ${name}',
        de: 'Schau weg von ${name}',
        fr: 'Ne regardez pas ${name}',
        ja: '${name}を見ない',
        cn: '背对${name}',
        ko: '${name}에게서 뒤돌기',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const target = getTarget(matches);
        if (target === data.me)
          return;
        const name = isPlayerId(matches.targetId) ? data.ShortName(target) : target;
        return output.lookAwayFrom({ name: name });
      },
    };
  },
  lookAwayFromSource: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      lookAwayFrom: {
        en: 'Look Away from ${name}',
        de: 'Schau weg von ${name}',
        fr: 'Ne regardez pas ${name}',
        ja: '${name}を見ない',
        cn: '背对${name}',
        ko: '${name}에게서 뒤돌기',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const source = getSource(matches);
        if (source === data.me)
          return;
        const name = isPlayerId(matches.sourceId) ? data.ShortName(source) : source;
        return output.lookAwayFrom({ name: name });
      },
    };
  },
  getBehind: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Get Behind',
    de: 'Hinter ihn',
    fr: 'Passez derrière',
    ja: '背面へ',
    cn: '去背后',
    ko: '보스 뒤로',
  }),
  goFrontOrSides: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Go Front / Sides',
    de: 'Gehe nach Vorne/ zu den Seiten',
    fr: 'Allez Devant / Côtés',
    ja: '前／横へ',
    cn: '去前侧方',
    ko: '보스 후방 피하기',
  }),
  // .getUnder() is used when you have to get into the bosses hitbox
  getUnder: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Get Under',
    de: 'Unter ihn',
    fr: 'En dessous',
    ja: 'ボスと貼り付く',
    cn: '去脚下',
    ko: '보스 아래로',
  }),
  // .getIn() is more like "get close but maybe even melee range is fine"
  getIn: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'In',
    de: 'Rein',
    fr: 'Intérieur',
    ja: '中へ',
    cn: '靠近',
    ko: '안으로',
  }),
  // .getOut() means get far away
  getOut: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Out',
    de: 'Raus',
    ja: '外へ',
    fr: 'Exterieur',
    cn: '远离',
    ko: '밖으로',
  }),
  outOfMelee: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Out of melee',
    de: 'Raus aus Nahkampf',
    fr: 'Hors de la mêlée',
    ja: '近接最大レンジ',
    cn: '近战最远距离回避',
    ko: '근접범위 밖으로',
  }),
  getInThenOut: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'In, then out',
    de: 'Rein, dann raus',
    fr: 'Intérieur, puis extérieur',
    ja: '中 => 外',
    cn: '先靠近，再远离',
    ko: '안으로 => 밖으로',
  }),
  getOutThenIn: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Out, then in',
    de: 'Raus, dann rein',
    fr: 'Extérieur, puis intérieur',
    ja: '外 => 中',
    cn: '先远离，再靠近',
    ko: '밖으로 => 안으로',
  }),
  getBackThenFront: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Back Then Front',
    de: 'Nach Hinten, danach nach Vorne',
    fr: 'Derrière puis devant',
    ja: '後ろ => 前',
    cn: '后 => 前',
    ko: '뒤로 => 앞으로',
  }),
  getFrontThenBack: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Front Then Back',
    de: 'Nach Vorne, danach nach Hinten',
    fr: 'Devant puis derrière',
    ja: '前 => 後ろ',
    cn: '前 => 后',
    ko: '앞으로 => 뒤로',
  }),
  goMiddle: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'go into middle',
    fr: 'Allez au milieu',
    de: 'in die Mitte gehen',
    ja: '中へ',
    cn: '去中间',
    ko: '중앙으로',
  }),
  goRight: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Right',
    de: 'Rechts',
    fr: 'Droite ',
    ja: '右へ',
    cn: '右',
    ko: '오른쪽',
  }),
  goLeft: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Left',
    de: 'Links',
    fr: 'Gauche',
    ja: '左へ',
    cn: '左',
    ko: '왼쪽',
  }),
  goWest: (sev) => staticResponse(defaultAlertText(sev), {
    en: '<= Get Left/West',
    de: '<= Nach Links/Westen',
    fr: '<= Allez à Gauche/Ouest',
    ja: '<= 左/西へ',
    cn: '<= 去左/西边',
    ko: '<= 왼쪽으로',
  }),
  goEast: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Get Right/East =>',
    de: 'Nach Rechts/Osten =>',
    fr: 'Allez à Droite/Est =>',
    ja: '右/東へ =>',
    cn: '去右/东边 =>',
    ko: '오른쪽으로 =>',
  }),
  goFrontBack: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Go Front/Back',
    de: 'Geh nach Vorne/Hinten',
    fr: 'Allez Devant/Derrière',
    ja: '縦へ',
    cn: '去前后',
    ko: '앞/뒤로',
  }),
  goSides: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Sides',
    de: 'Seiten',
    fr: 'Côtés',
    ja: '横へ',
    ko: '양옆으로',
    cn: '去侧面',
  }),
  // .killAdds() is used for adds that will always be available
  killAdds: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Kill adds',
    de: 'Adds besiegen',
    fr: 'Tuez les adds',
    ja: '雑魚を処理',
    ko: '쫄 잡기',
    cn: '击杀小怪',
  }),
  // .killExtraAdd() is used for adds that appear if a mechanic was not played correctly
  killExtraAdd: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Kill Extra Add',
    de: 'Add besiegen',
    ja: '雑魚を倒す',
    fr: 'Tuez l\'add',
    cn: '击杀小怪',
    ko: '쫄 잡기',
  }),
  awayFromFront: (sev) => staticResponse(defaultAlertText(sev), {
    en: 'Away From Front',
    de: 'Weg von Vorne',
    fr: 'Éloignez-vous du devant',
    ja: '前方から離れ',
    cn: '远离正面',
    ko: '보스 전방 피하기',
  }),
  sleep: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      sleep: {
        en: 'Sleep ${name}',
        de: 'Schlaf auf ${name}',
        fr: 'Sommeil sur ${name}',
        ja: '${name} にスリプル',
        cn: '催眠 ${name}',
        ko: '${name} 슬리플',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const source = getSource(matches);
        return output.sleep({ name: source });
      },
    };
  },
  stun: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      stun: {
        en: 'Stun ${name}',
        de: 'Betäubung auf ${name}',
        fr: 'Étourdissement sur ${name}',
        ja: '${name} にスタン',
        cn: '眩晕 ${name}',
        ko: '${name}기절',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const source = getSource(matches);
        return output.stun({ name: source });
      },
    };
  },
  interrupt: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      interrupt: {
        en: 'interrupt ${name}',
        de: 'unterbreche ${name}',
        fr: 'Interrompez ${name}',
        ja: '${name} に沈黙',
        cn: '打断${name}',
        ko: '${name}기술 시전 끊기',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const source = getSource(matches);
        return output.interrupt({ name: source });
      },
    };
  },
  preyOn: (targetSev, otherSev) => {
    const outputStrings = {
      preyOnYou: {
        en: 'Prey on YOU',
        de: 'Marker auf DIR',
        fr: 'Marquage sur VOUS',
        ja: '自分に捕食',
        cn: '掠食点名',
        ko: '홍옥징 대상자',
      },
      preyOnTarget: {
        en: 'Prey on ${name}',
        de: 'Marker auf ${name}',
        fr: 'Marquage sur ${name}',
        ja: '${name}に捕食',
        cn: '掠食点名${name}',
        ko: '"${name}" 홍옥징',
      },
    };

    const targetFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (data.me === target)
        return output.preyOnYou();
    };

    const otherFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (target !== data.me)
        return output.preyOnTarget({ name: data.ShortName(target) });
    };

    const combined = combineFuncs(defaultAlertText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
    return (data, _, output) => {
      // cactbot-builtin-response
      output.responseOutputStrings = outputStrings;
      return combined;
    };
  },
  awayFrom: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      awayFromGroup: {
        en: 'Away from Group',
        de: 'Weg von der Gruppe',
        fr: 'Éloignez-vous du groupe',
        ja: '外へ',
        cn: '远离人群',
        ko: '다른 사람들이랑 떨어지기',
      },
      awayFromTarget: {
        en: 'Away from ${name}',
        de: 'Weg von ${name}',
        fr: 'Éloignez-vous de ${name}',
        ja: '${name}から離れ',
        cn: '远离${name}',
        ko: '"${name}"에서 멀어지기',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const target = getTarget(matches);
        if (data.me === target)
          return output.awayFromGroup();
        return output.awayFromTarget({ name: data.ShortName(target) });
      },
    };
  },
  meteorOnYou: (sev) => staticResponse(defaultAlarmText(sev), {
    en: 'Meteor on YOU',
    de: 'Meteor auf DIR',
    fr: 'Météore sur VOUS',
    ja: '自分にメテオ',
    cn: '陨石点名',
    ko: '나에게 메테오징',
  }),
  stopMoving: (sev) => staticResponse(defaultAlarmText(sev), {
    en: 'Stop Moving!',
    de: 'Bewegung stoppen!',
    fr: 'Ne bougez pas !',
    ja: '移動禁止！',
    cn: '停止移动！',
    ko: '이동 멈추기!',
  }),
  stopEverything: (sev) => staticResponse(defaultAlarmText(sev), {
    en: 'Stop Everything!',
    de: 'Stoppe Alles!',
    fr: 'Arrêtez TOUT !',
    ja: '行動禁止！',
    cn: '停止行动！',
    ko: '행동 멈추기!',
  }),
  moveAway: (sev) => staticResponse(defaultInfoText(sev), {
    // move away to dodge aoes
    en: 'Move!',
    de: 'Bewegen!',
    fr: 'Bougez !',
    ja: '避けて！',
    cn: '快躲开！',
    ko: '이동하기!',
  }),
  moveAround: (sev) => staticResponse(defaultInfoText(sev), {
    // move around (e.g. jumping) to avoid being frozen
    en: 'Move!',
    de: 'Bewegen!',
    fr: 'Bougez !',
    ja: '動く！',
    cn: '快动！',
    ko: '움직이기!',
  }),
  breakChains: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Break chains',
    de: 'Kette zerbrechen',
    fr: 'Cassez les chaines',
    ja: '線を切る',
    cn: '切断连线',
    ko: '선 끊기',
  }),
  moveChainsTogether: (sev) => staticResponse(defaultInfoText(sev), {
    en: 'Move chains together',
    de: 'Ketten zusammen bewegen',
    fr: 'Bougez les chaines ensemble',
    ja: '線同士一緒に移動',
    cn: '连线一起移动',
    ko: '선 붙어서 같이 움직이기',
  }),
  earthshaker: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      earthshaker: {
        en: 'Earth Shaker on YOU',
        de: 'Erdstoß auf DIR',
        fr: 'Marque de terre sur VOUS',
        ja: '自分にアースシェイカー',
        cn: '大地摇动点名',
        ko: '어스징 대상자',
      },
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const target = getTarget(matches);
        if (target !== data.me)
          return;
        return output.earthshaker();
      },
    };
  },
  wakeUp: (sev) => staticResponse(defaultAlarmText(sev), {
    en: 'WAKE UP',
    de: 'AUFWACHEN',
    fr: 'RÉVEILLES-TOI',
    ja: '目を覚めて！',
    cn: '醒醒！动一动！！',
    ko: '강제 퇴장 7분 전',
  }),
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Responses: Responses,
    triggerFunctions: triggerFunctions,
    severityMap: severityMap,
    builtInResponseStr: builtInResponseStr,
  };
}
