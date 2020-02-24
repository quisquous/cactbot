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
  return matches.target || matches[1];
};

let Responses = {
  tankBuster: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
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
      return {
        en: 'Buster on ' + data.ShortName(target),
        de: 'Tankbuster auf ' + data.ShortName(target),
        fr: 'Tankbuster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 -> ' + data.ShortName(target),
        ko: '"' + data.ShortName(target) + '" 탱버',
      };
    };
    return obj;
  },
  tankBusterSwap: (busterSev, swapSev) => {
    // Note: busterSev and swapSev can be the same priority.
    let obj = {};
    let tankSwapFunc = (data, matches) => {
      let target = getTarget(matches);
      if (data.role == 'tank' && target != data.me) {
        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
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

    let swapText = defaultAlarmText(swapSev);
    let busterText = defaultAlertText(busterSev);

    if (swapText != busterText) {
      obj[swapText] = tankSwapFunc;
      obj[busterText] = busterFunc;
    } else {
      obj[swapText] = (data) => {
        tankSwapFunc(data) || busterFunc(data);
      };
    }
    return obj;
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
      ja: '散開',
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
      de: 'In der Mitte sammeln',
      ko: '중앙에서 모이기',
    };
    return obj;
  },
  spreadThanStack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Spread => Stack',
      de: 'Verteilen => Sammeln',
      fr: 'Dispersez-vous => Package',
      ja: '散開 => 散開',
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
      ja: '散開 => 散開',
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
  knockbackOn: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = (data, matches) => {
      let target = getTarget(matches);
      if (target == data.me) {
        return {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
          fr: 'Poussée sur VOUS',
          ko: '넉백징 대상자',
        };
      }
      return {
        en: 'Knockback on ' + data.ShortName(target),
        de: 'Rückstoß auf ' + data.ShortName(target),
        fr: 'Poussée sur ' + data.ShortName(target),
        ko: '넉백징 → ' + data.ShortName(target),
      };
    };
    return obj;
  },
  lookTowards: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Look Towards',
      de: 'Anschauen',
      fr: 'Regardez le boss',
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
  goRight: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Right',
      de: 'Rechts',
      fr: 'Droite ',
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
      ko: '보스 전방 피하기',
    };
    return obj;
  },
  sleep: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Sleep',
      de: 'Schlaf',
      fr: 'Sommeil',
      ja: 'スリプル',
      cn: '催眠',
      ko: '슬리플',
    };
    return obj;
  },
  stun: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stun',
      de: 'Betäubung',
      fr: 'Étourdissement ',
      ja: 'スタン',
      cn: '眩晕',
      ko: '기절',
    };
    return obj;
  },
  interupt: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'interupt',
      de: 'unterbrechen',
      ko: '기술 시전 끊기',
    };
    return obj;
  },
  preyOn: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = (data, matches) => {
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
      return {
        en: 'Prey on ' + data.ShortName(target),
        de: 'Marker auf ' + data.ShortName(target),
        fr: 'Marquage sur ' + data.ShortName(target),
        ko: '홍옥징 → ' + data.ShortName(target),
        ja: 'マーカー on ' + data.ShortName(target),
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
      ja: 'フェザーレイン',
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
      ko: '선 끊기',
    };
    return obj;
  },
  moveChainsTogether: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Move chains together',
      de: 'Ketten zusammen bewegen',
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
