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
];

const severityMap = {
  'info': 'infoText',
  'alert': 'alertText',
  'alarm': 'alarmText',
};

let getText = (sev) => {
  if (!(sev in severityMap))
    throw new Error(`Invalid severity: ${sev}.`);
  return severityMap[sev];
};

let defaultInfoText = (sev) => {
  if (!sev)
    return 'infoText';
  return getText(sev);
};

let defaultAlertText = (sev) => {
  if (!sev)
    return 'alertText';
  return getText(sev);
};

let defaultAlarmText = (sev) => {
  if (!sev)
    return 'alarmText';
  return getText(sev);
};

let getTarget = (matches) => {
  // Often tankbusters can be casted by the boss on the boss.
  // Consider this as "not having a target".
  if (!matches || matches.target == matches.source)
    return null;
  return matches.target || matches[1];
};

let getSource = (matches) => {
  return matches.source || matches[0];
};

// FIXME: make this work for any number of pairs of params
let combineFuncs = function(text1, func1, text2, func2) {
  let obj = {};

  if (text1 != text2) {
    obj[text1] = func1;
    obj[text2] = func2;
  } else {
    obj[text1] = (data, matches) => {
      func1(data, matches) || func2(data, matches);
    };
  }
  return obj;
};

let isPlayerId = (id) => {
  return id[0] !== '4';
};

let Responses = {
  tankBuster: (targetSev, otherSev) => {
    let noTargetText = {
      en: 'Tank Buster',
      de: 'Tank buster',
      fr: 'Tank buster',
      ja: 'タンクバスター',
      cn: '坦克死刑',
      ko: '탱버',
    };

    let targetFunc = (data, matches) => {
      let target = getTarget(matches);
      if (!target) {
        if (data.role != 'tank' && data.role != 'healer')
          return;
        return noTargetText;
      }

      if (target == data.me) {
        return {
          en: 'Tank Buster on YOU',
          de: 'Tank buster auf DIR',
          fr: 'Tank buster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '탱버 대상자',
        };
      }
    };

    let otherFunc = (data, matches) => {
      let target = getTarget(matches);
      if (!target) {
        if (data.role == 'tank' || data.role == 'healer')
          return;
        return noTargetText;
      }
      if (target == data.me)
        return;

      return {
        en: 'Tank Buster on ' + data.ShortName(target),
        de: 'Tank buster auf ' + data.ShortName(target),
        fr: 'Tank buster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 点 ' + data.ShortName(target),
        ko: '"' + data.ShortName(target) + '" 탱버',
      };
    };

    return combineFuncs(defaultAlertText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
  },
  tankBusterSwap: (busterSev, swapSev) => {
    // Note: busterSev and swapSev can be the same priority.
    let tankSwapFunc = (data, matches) => {
      let target = getTarget(matches);
      if (data.role == 'tank' && target != data.me) {
        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          ja: 'タンクスイッチ',
          cn: '换T！',
          ko: '탱 교대',
        };
      }
    };
    let busterFunc = (data, matches) => {
      let target = getTarget(matches);

      if (data.role == 'tank' && target != data.me)
        return;

      if (target == data.me) {
        return {
          en: 'Tank Buster on YOU',
          de: 'Tank buster auf DIR',
          fr: 'Tank buster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '탱버 대상자',
        };
      }
      return {
        en: 'Tank Buster on ' + data.ShortName(target),
        de: 'Tank buster auf ' + data.ShortName(target),
        fr: 'Tank buster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 点 ' + data.ShortName(target),
        ko: '"' + data.ShortName(target) + '" 탱버',
      };
    };

    return combineFuncs(defaultAlarmText(swapSev), tankSwapFunc,
        defaultAlertText(busterSev), busterFunc);
  },
  tankCleave: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = (data, matches) => {
      if (data.role == 'tank') {
        let target = getTarget(matches);
        if (target == data.me) {
          return {
            en: 'Tank cleave on YOU',
            de: 'Tank Cleave aud DIR',
            fr: 'Tank cleave sur VOUS',
            ja: '自分に前方範囲攻撃',
            cn: '顺劈点名',
            ko: '나에게 광역 탱버',
          };
        }
        // targetless tank cleave
        return {
          en: 'Tank cleave',
          de: 'Tank Cleave',
          fr: 'Tank cleave',
          ja: '前方範囲攻撃',
          cn: '顺劈',
          ko: '광역 탱버',
        };
      }
      return {
        en: 'Avoid tank cleave',
        de: 'Tank Cleave ausweichen',
        fr: 'Évitez le tank cleave',
        ja: '前方範囲攻撃を避け',
        cn: '远离顺劈',
        ko: '광역 탱버 피하기',
      };
    };
    return obj;
  },
  miniBuster: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Mini Buster',
      de: 'Kleiner Tankbuster',
      fr: 'Mini Buster',
      ja: 'ミニバスター',
      cn: '小死刑',
      ko: '약한 탱버',
    };
    return obj;
  },
  aoe: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'aoe',
      de: 'AoE',
      fr: 'AoE',
      ja: 'AoE',
      cn: 'AoE',
      ko: '전체 공격',
    };
    return obj;
  },
  bigAoe: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'big aoe!',
      de: 'Große AoE!',
      fr: 'Grosse AoE !',
      ja: '大ダメージAoE',
      cn: '大AoE伤害！',
      ko: '강한 전체 공격!',
    };
    return obj;
  },
  spread: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Spread',
      de: 'Verteilen',
      fr: 'Dispersez-vous',
      ja: '散開',
      cn: '分散',
      ko: '산개',
    };
    return obj;
  },
  stackMarker: (sev) => {
    // for stack marker
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stack',
      de: 'Sammeln',
      fr: 'Packez-vous',
      ja: '頭割り',
      cn: '分摊',
      ko: '쉐어뎀',
    };
    return obj;
  },
  getTogether: (sev) => {
    // for getting together without stack marker
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stack',
      de: 'Sammeln',
      fr: 'Packez-vous',
      ja: '固まる',
      cn: '集合',
      ko: '모이기',
    };
    return obj;
  },
  stackMarkerOn: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let target = getTarget(matches);
      if (target == data.me) {
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
        en: 'Stack on ' + data.ShortName(target),
        de: 'Auf ' + data.ShortName(target) + ' sammeln',
        fr: 'Packez-vous sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にスタック',
        cn: '靠近 ' + data.ShortName(target) + '集合',
        ko: '"' + data.ShortName(target) + '" 쉐어징',
      };
    };
    return obj;
  },
  stackMiddle: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Stack in middle',
      fr: 'Packez-vous au milieu',
      de: 'In der Mitte sammeln',
      ja: '中央でスタック',
      cn: '中间集合',
      ko: '중앙에서 모이기',
    };
    return obj;
  },
  doritoStack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Dorito Stack',
      de: 'Mit Marker sammeln',
      fr: 'Packez les marquages',
      ja: 'マーカー付けた人とスタック',
      cn: '点名集合',
      ko: '징끼리 모이기',
    };
    return obj;
  },
  spreadThenStack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Spread => Stack',
      de: 'Verteilen => Sammeln',
      fr: 'Dispersion => Package',
      ja: '散開 => スタック',
      cn: '分散 => 集合',
      ko: '산개 => 집합',
    };
    return obj;
  },
  stackThenSpread: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stack => Spread',
      de: 'Sammeln => Verteilen',
      fr: 'Package => Dispersion',
      ja: 'スタック => 散開',
      cn: '集合 => 分散',
      ko: '집합 => 산개',
    };
    return obj;
  },
  knockback: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Knockback',
      de: 'Rückstoß',
      fr: 'Poussée',
      ja: 'ノックバック',
      cn: '击退',
      ko: '넉백',
    };
    return obj;
  },
  knockbackOn: (targetSev, otherSev) => {
    let targetFunc = (data, matches) => {
      let target = getTarget(matches);
      if (target == data.me) {
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
          fr: 'Poussée sur VOUS',
          ja: '自分にノックバック',
          cn: '击退点名',
          ko: '넉백징 대상자',
        };
      }
    };

    let otherFunc = (data, matches) => {
      let target = getTarget(matches);
      if (target != data.me) {
        return {
          en: 'Knockback on ' + data.ShortName(target),
          de: 'Rückstoß auf ' + data.ShortName(target),
          fr: 'Poussée sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'にノックバック',
          cn: '击退点名' + data.ShortName(target),
          ko: '"' + data.ShortName(target) + '" 넉백징',
        };
      }
    };
    return combineFuncs(defaultInfoText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
  },
  lookTowards: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Look Towards Boss',
      de: 'Anschauen Boss',
      fr: 'Regardez le boss',
      ja: '見る',
      cn: '背对',
      ko: '쳐다보기',
    };
    return obj;
  },
  lookAway: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Look Away',
      de: 'Wegschauen',
      fr: 'Regardez ailleurs',
      ja: '見ない',
      cn: '背对',
      ko: '뒤돌기',
    };
    return obj;
  },
  lookAwayFromTarget: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      const target = getTarget(matches);
      if (target === data.me)
        return;
      const name = isPlayerId(matches.targetId) ? data.ShortName(target) : target;
      return {
        en: 'Look Away from ' + name,
        de: 'Schau weg von ' + name,
        fr: 'Ne regardez pas ' + name,
        ja: name + 'を見ない',
        cn: '背对' + name,
        ko: name + '에게서 뒤돌기',
      };
    };
    return obj;
  },
  lookAwayFromSource: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      const source = getSource(matches);
      if (source === data.me)
        return;
      const name = isPlayerId(matches.sourceId) ? data.ShortName(source) : source;
      return {
        en: 'Look Away from ' + name,
        de: 'Schau weg von ' + name,
        fr: 'Ne regardez pas ' + name,
        ja: name + 'を見ない',
        cn: '背对' + name,
        ko: name + '에게서 뒤돌기',
      };
    };
    return obj;
  },
  getBehind: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Get Behind',
      de: 'Hinter ihn',
      fr: 'Passez derrière',
      ja: '背面へ',
      cn: '去背后',
      ko: '보스 뒤로',
    };
    return obj;
  },
  goFrontOrSides: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Go Front / Sides',
      de: 'Gehe nach Vorne/ zu den Seiten',
      fr: 'Allez Devant / Côtés',
      ja: '前／横へ',
      cn: '去前侧方',
      ko: '보스 후방 피하기',
    };
    return obj;
  },
  // .getUnder() is used when you have to get into the bosses hitbox
  getUnder: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Get Under',
      de: 'Unter ihn',
      fr: 'En dessous',
      ja: 'ボスと貼り付く',
      cn: '去脚下',
      ko: '보스 아래로',
    };
    return obj;
  },
  // .getIn() is more like "get close but maybe even melee range is fine"
  getIn: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'In',
      de: 'Rein',
      fr: 'Intérieur',
      ja: '中へ',
      cn: '靠近',
      ko: '안으로',
    };
    return obj;
  },
  // .getOut() means get far away
  getOut: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Out',
      de: 'Raus',
      ja: '外へ',
      fr: 'Exterieur',
      cn: '远离',
      ko: '밖으로',
    };
    return obj;
  },
  outOfMelee: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Out of melee',
      de: 'Raus aus Nahkampf',
      fr: 'Hors de la mêlée',
      ja: '近接最大レンジ',
      cn: '近战最远距离回避',
      ko: '근접범위 밖으로',
    };
    return obj;
  },
  getInThenOut: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'In, then out',
      de: 'Rein, dann raus',
      fr: 'Intérieur, puis extérieur',
      ja: '中 => 外',
      cn: '先靠近，再远离',
      ko: '안으로 => 밖으로',
    };
    return obj;
  },
  getOutThenIn: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Out, then in',
      de: 'Raus, dann rein',
      fr: 'Extérieur, puis intérieur',
      ja: '外 => 中',
      cn: '先远离，再靠近',
      ko: '밖으로 => 안으로',
    };
    return obj;
  },
  getBackThenFront: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Back Then Front',
      de: 'Nach Hinten, danach nach Vorne',
      fr: 'Derrière puis devant',
      ja: '後ろ => 前',
      cn: '后 => 前',
      ko: '뒤로 => 앞으로',
    };
    return obj;
  },
  getFrontThenBack: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Front Then Back',
      de: 'Nach Vorne, danach nach Hinten',
      fr: 'Devant puis derrière',
      ja: '前 => 後ろ',
      cn: '前 => 后',
      ko: '앞으로 => 뒤로',
    };
    return obj;
  },
  goMiddle: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'go into middle',
      fr: 'Allez au milieu',
      de: 'in die Mitte gehen',
      ja: '中へ',
      cn: '去中间',
      ko: '중앙으로',
    };
    return obj;
  },
  goRight: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Right',
      de: 'Rechts',
      fr: 'Droite ',
      ja: '右へ',
      cn: '右',
      ko: '오른쪽',
    };
    return obj;
  },
  goLeft: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Left',
      de: 'Links',
      fr: 'Gauche',
      ja: '左へ',
      cn: '左',
      ko: '왼쪽',
    };
    return obj;
  },
  goWest: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: '<= Get Left/West',
      de: '<= Nach Links/Westen',
      fr: '<= Allez à Gauche/Ouest',
      ja: '<= 左/西へ',
      cn: '<= 去左/西边',
      ko: '<= 왼쪽으로',
    };
    return obj;
  },
  goEast: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Get Right/East =>',
      de: 'Nach Rechts/Osten =>',
      fr: 'Allez à Droite/Est =>',
      ja: '右/東へ =>',
      cn: '去右/东边 =>',
      ko: '오른쪽으로 =>',
    };
    return obj;
  },
  goFrontBack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Go Front/Back',
      de: 'Geh nach Vorne/Hinten',
      fr: 'Allez Devant/Derrière',
      ja: '縦へ',
      cn: '去前后',
      ko: '앞/뒤로',
    };
    return obj;
  },
  goSides: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Sides',
      de: 'Seiten',
      fr: 'Côtés',
      ja: '横へ',
      ko: '양옆으로',
      cn: '去侧面',
    };
    return obj;
  },
  // .killAdds() is used for adds that will always be available
  killAdds: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Kill adds',
      de: 'Adds besiegen',
      fr: 'Tuez les adds',
      ja: '雑魚を処理',
      ko: '쫄 잡기',
      cn: '击杀小怪',
    };
    return obj;
  },
  // .killExtraAdd() is used for adds that appear if a mechanic was not played correctly
  killExtraAdd: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Kill Extra Add',
      de: 'Add besiegen',
      ja: '雑魚を倒す',
      fr: 'Tuez l\'add',
      cn: '击杀小怪',
      ko: '쫄 잡기',
    };
    return obj;
  },
  awayFromFront: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Away From Front',
      de: 'Weg von Vorne',
      fr: 'Éloignez-vous du devant',
      ja: '前方から離れ',
      cn: '远离正面',
      ko: '보스 전방 피하기',
    };
    return obj;
  },
  sleep: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let source = getSource(matches);
      return {
        en: 'Sleep ' + source,
        de: 'Schlaf auf ' + source,
        fr: 'Sommeil sur ' + source,
        ja: source + ' にスリプル',
        cn: '催眠 ' + source,
        ko: source + ' 슬리플',
      };
    };
    return obj;
  },
  stun: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let source = getSource(matches);
      return {
        en: 'Stun ' + source,
        de: 'Betäubung auf ' + source,
        fr: 'Étourdissement sur ' + source,
        ja: source + ' にスタン',
        cn: '眩晕 ' + source,
        ko: source + '기절',
      };
    };
    return obj;
  },
  interrupt: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let source = getSource(matches);
      return {
        en: 'interrupt ' + source,
        de: 'unterbreche ' + source,
        fr: 'Interrompez ' + source,
        ja: source + ' に沈黙',
        cn: '打断' + source,
        ko: source + '기술 시전 끊기',
      };
    };
    return obj;
  },
  preyOn: (targetSev, otherSev) => {
    let targetFunc = (data, matches) => {
      let target = getTarget(matches);
      if (data.me == target) {
        return {
          en: 'Prey on YOU',
          de: 'Marker auf DIR',
          fr: 'Marquage sur VOUS',
          ja: '自分に捕食',
          cn: '掠食点名',
          ko: '홍옥징 대상자',
        };
      }
    };

    let otherFunc = (data, matches) => {
      let target = getTarget(matches);
      if (target != data.me) {
        return {
          en: 'Prey on ' + data.ShortName(target),
          de: 'Marker auf ' + data.ShortName(target),
          fr: 'Marquage sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'に捕食',
          cn: '掠食点名' + data.ShortName(target),
          ko: '"' + data.ShortName(target) + '" 홍옥징',
        };
      }
    };
    return combineFuncs(defaultAlertText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
  },
  awayFrom: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let target = getTarget(matches);
      if (data.me == target) {
        return {
          en: 'Away from Group',
          de: 'Weg von der Gruppe',
          fr: 'Éloignez-vous du groupe',
          ja: '外へ',
          cn: '远离人群',
          ko: '다른 사람들이랑 떨어지기',
        };
      }
      return {
        en: 'Away from ' + data.ShortName(target),
        de: 'Weg von ' + data.ShortName(target),
        fr: 'Éloignez-vous de ' + data.ShortName(target),
        ja: data.ShortName(target) + 'から離れ',
        cn: '远离' + data.ShortName(target),
        ko: '"' + data.ShortName(target) + '"에서 멀어지기',
      };
    };
    return obj;
  },
  meteorOnYou: (sev) => {
    let obj = {};
    obj[defaultAlarmText(sev)] = {
      en: 'Meteor on YOU',
      de: 'Meteor auf DIR',
      fr: 'Météore sur VOUS',
      ja: '自分にメテオ',
      cn: '陨石点名',
      ko: '나에게 메테오징',
    };
    return obj;
  },
  stopMoving: (sev) => {
    let obj = {};
    obj[defaultAlarmText(sev)] = {
      en: 'Stop Moving!',
      de: 'Bewegung stoppen!',
      fr: 'Ne bougez pas !',
      ja: '移動禁止！',
      cn: '停止移动！',
      ko: '이동 멈추기!',
    };
    return obj;
  },
  stopEverything: (sev) => {
    let obj = {};
    obj[defaultAlarmText(sev)] = {
      en: 'Stop Everything!',
      de: 'Stoppe Alles!',
      fr: 'Arrêtez TOUT !',
      ja: '行動禁止！',
      cn: '停止行动！',
      ko: '행동 멈추기!',
    };
    return obj;
  },
  moveAway: (sev) => {
    // to dodge aoes
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Move!',
      de: 'Bewegen!',
      fr: 'Bougez !',
      ja: '避けて！',
      cn: '快躲开！',
      ko: '이동하기!',
    };
    return obj;
  },
  moveAround: (sev) => {
    // should jump or move
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Move!',
      de: 'Bewegen!',
      fr: 'Bougez !',
      ja: '動く！',
      cn: '快动！',
      ko: '움직이기!',
    };
    return obj;
  },
  breakChains: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Break chains',
      de: 'Kette zerbrechen',
      fr: 'Cassez les chaines',
      ja: '線を切る',
      cn: '切断连线',
      ko: '선 끊기',
    };
    return obj;
  },
  moveChainsTogether: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Move chains together',
      de: 'Ketten zusammen bewegen',
      fr: 'Bougez les chaines ensemble',
      ja: '線同士一緒に移動',
      cn: '连线一起移动',
      ko: '선 붙어서 같이 움직이기',
    };
    return obj;
  },
  earthshaker: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let target = getTarget(matches);
      if (target != data.me)
        return;
      return {
        en: 'Earth Shaker on YOU',
        de: 'Erdstoß auf DIR',
        fr: 'Marque de terre sur VOUS',
        ja: '自分にアースシェイカー',
        cn: '大地摇动点名',
        ko: '어스징 대상자',

      };
    };
    return obj;
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Responses: Responses,
    triggerFunctions: triggerFunctions,
    severityMap: severityMap,
  };
}
