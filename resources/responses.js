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

let Responses = {
  tankBuster: (targetSev, otherSev) => {
    let targetFunc = (data, matches) => {
      if (!matches) {
        if (data.role != 'tank' && data.role != 'healer')
          return;
        return {
          en: 'Tank Buster',
          de: 'Tankbuster',
          fr: 'Tankbuster',
          ko: '탱버',
        };
      }
      let target = getTarget(matches);
      if (target == data.me) {
        return {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tankbuster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '탱버 대상자',
        };
      }
    };

    let otherFunc = (data, matches) => {
      if (!matches || getTarget(matches) == data.me)
        return;
      return {
        en: 'Buster on ' + data.ShortName(target),
        de: 'Tankbuster auf ' + data.ShortName(target),
        fr: 'Tankbuster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 -> ' + data.ShortName(target),
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
          ja: 'スイッチ',
          cn: '换T！',
          ko: '탱 교대',
        };
      }
    };
    let busterFunc = (data, matches) => {
      let target = getTarget(matches);
      if (target == data.me) {
        return {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tankbuster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
          ko: '탱버 대상자',
        };
      }
      return {
        en: 'Buster on ' + data.ShortName(target),
        de: 'Tankbuster auf ' + data.ShortName(target),
        fr: 'Tankbuster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 -> ' + data.ShortName(target),
        ko: '탱버 → ' + data.ShortName(target),
      };
    };

    return combineFuncs(defaultAlarmText(swapSev), tankSwapFunc,
        defaultAlertText(busterSev), busterFunc);
  },
  tankCleave: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = (data, matches) => {
      if (data.role == 'tank') {
        if (matches) {
          let target = getTarget(matches);
          if (target == data.me) {
            return {
              en: 'Tank cleave on YOU',
              de: 'Tank Cleave aud DIR',
              fr: 'Tank cleave sur VOUS',
              ko: '나에게 광역 탱버',
            };
          }
        } else {
          // targetless tank cleave
          return {
            en: 'Tank cleave',
            de: 'Tank Cleave',
            fr: 'Tank cleave',
            ko: '광역 탱버',
          };
        }
      }
      return {
        en: 'Avoid tank cleave',
        de: 'Tank Cleave ausweichen',
        fr: 'Evitez le cleave sur le tank',
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
      cn: 'AOE',
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
  stack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stack',
      de: 'Sammeln',
      fr: 'Package',
      ja: 'スタック',
      cn: '集合',
      ko: '집합',
    };
    return obj;
  },
  stackOn: (sev) => {
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
        fr: 'Package sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にスタック',
        cn: '靠近 ' + data.ShortName(target) + '集合',
        ko: '쉐어징 → ' + data.ShortName(target),
      };
    };
    return obj;
  },
  stackMiddle: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Stack in middle',
      fr: 'Packez-vous au centre',
      de: 'In der Mitte sammeln',
      ja: '中央でスタック',
      ko: '중앙에서 모이기',
    };
    return obj;
  },
  doritoStack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Dorito Stack',
      de: 'Mit Marker sammeln',
      cn: '点名集合',
    };
    return obj;
  },
  spreadThanStack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Spread => Stack',
      de: 'Verteilen => Sammeln',
      fr: 'Dispersez-vous => Package',
      ja: '散開 => スタック',
      cn: '分散 => 集合',
      ko: '산개 => 집합',
    };
    return obj;
  },
  stackThanSpread: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stack => Spread',
      de: 'Sammeln => Verteilen',
      fr: 'Package => Dispersez-vous',
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
          ko: '넉백징 대상자',
        };
      }
    };

    let otherFunc = (data, matches) => {
      if (matches && getTarget(matches) != data.me) {
        return {
          en: 'Knockback on ' + data.ShortName(target),
          de: 'Rückstoß auf ' + data.ShortName(target),
          fr: 'Poussée sur ' + data.ShortName(target),
          ja: data.ShortName(target) + 'にノックバック',
          ko: '넉백징 → ' + data.ShortName(target),
        };
      }
    };
    return combineFuncs(defaultInfoText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
  },
  lookTowards: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Look Towards',
      de: 'Anschauen',
      fr: 'Regardez le boss',
      ja: '見る',
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
      ko: '뒤돌기',
    };
    return obj;
  },
  lookAwayFrom: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let target = getTarget(matches);
      if (target == data.me)
        return;
      return {
        en: 'Look Away from ' + data.ShortName(target),
        de: 'Schau weg von ' + data.ShortName(target),
        fr: 'Ne regardez pas '+ data.ShortName(target),
        ja: data.ShortName(target) + 'を見ない',
        ko: data.ShortName(target) + '에게서 뒤돌기',
      };
    };
    return obj;
  },
  getBehind: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Get Behind',
      de: 'Hinter ihn',
      fr: 'Derrière le boss',
      ja: '背面へ',
      ko: '보스 뒤로',
    };
    return obj;
  },
  // .getUnder() is used when you have to get into the bosses hitbox
  getUnder: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Get Under',
      de: 'Unter ihn',
      fr: 'Intérieur',
      ja: '中へ',
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
      fr: 'Dedans',
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
      fr: 'Dehors',
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
      fr: 'Eloignez-vous du CaC',
      ja: '近接最大レンジ',
      cn: '远离近战',
      ko: '근접범위 밖으로',
    };
    return obj;
  },
  getInThenOut: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'In, then out',
      de: 'Rein, dann raus',
      fr: 'Dedans, puis dehors',
      ja: '中から外',
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
      fr: 'Dehors, puis dedans',
      ja: '外から中',
      cn: '先远离，再靠近',
      ko: '밖으로 => 안으로',
    };
    return obj;
  },
  goMiddle: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'go into middle',
      de: 'in die Mitte gehen',
    };
    return obj;
  },
  goRight: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Right',
      de: 'Rechts',
      fr: 'Droite ',
      ja: '右',
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
      ja: '左',
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
      ko: '오른쪽으로 =>',
    };
    return obj;
  },
  goFrontBack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Go Front/Back',
      de: 'Geh nach Vorne/ Hinten',
      fr: 'Devant/Derrière',
      ja: '縦へ',
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
    };
    return obj;
  },
  // .killExtraAdd() is used for adds that appear if a mechanic was not played correctly
  killExtraAdd: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Kill Extra Add',
      de: 'Add besiegen',
      ja: '水の精倒して',
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
      fr: 'Eloignez vous de l\'avant',
      ja: '前方から離れて',
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
        fr: 'Sommeil => ' + source,
        ja: 'スリプル => ' + source,
        cn: '催眠 => ' + source,
        ko: '슬리플 => ' + source,
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
        fr: 'Étourdissement => ' + source,
        ja: 'スタン => ' + source,
        cn: '眩晕 => ' + source,
        ko: '기절 => ' + source,
      };
    };
    return obj;
  },
  interupt: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
      let source = getSource(matches);
      return {
        en: 'interupt ' + source,
        de: 'unterbreche ' + source,
        ko: '기술 시전 끊기 => ' + source,
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
          ko: '홍옥징 대상자',
          ja: 'マーカー on YOU',
        };
      }
    };

    let otherFunc = (data, matches) => {
      if (matches && getTarget(matches) != data.me) {
        return {
          en: 'Prey on ' + data.ShortName(target),
          de: 'Marker auf ' + data.ShortName(target),
          fr: 'Marquage sur ' + data.ShortName(target),
          ko: '홍옥징 → ' + data.ShortName(target),
          ja: 'マーカー on ' + data.ShortName(target),
        };
      }
    };
    return combineFuncs(defaultAlertText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
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
      ko: '이동 멈추기!',
    };
    return obj;
  },
  stopEverything: (sev) => {
    let obj = {};
    obj[defaultAlarmText(sev)] = {
      en: 'Stop Everything!',
      de: 'Stoppe Alles!',
      fr: 'Stoppez TOUT !',
      ja: '行動禁止！',
      ko: '행동 멈추기!',
    };
    return obj;
  },
  move: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Move!',
      de: 'Bewegen',
      fr: 'Bougez',
      ja: '動く！',
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
        ko: '어스징 대상자',
      };
    };
    return obj;
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    responses: Responses,
    triggerFunctions: triggerFunctions,
    severityMap: severityMap,
  };
}
