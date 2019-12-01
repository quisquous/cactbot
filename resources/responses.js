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
        };
      }
      return {
        en: 'Buster on ' + data.ShortName(target),
        de: 'Tankbuster auf ' + data.ShortName(target),
        fr: 'Tankbuster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 -> ' + data.ShortName(target),
      };
    };
    return obj;
  },
  tankBusterSwap: (busterSev, swapSev) => {
    // Note: busterSev and swapSev can be the same priority.
    let obj = {};
    let tankSwapFunc = (data) => {
      let target = getTarget(matches);
      if (data.role == 'tank' && target != data.me) {
        return {
          en: 'Tank Swap!',
          de: 'Tankwechsel!',
          fr: 'Tank swap !',
          cn: '换T！',
        };
      }
    };
    let busterFunc = (data) => {
      let target = getTarget(matches);
      if (target == data.me) {
        return {
          en: 'Tank Buster on YOU',
          de: 'Tankbuster auf DIR',
          fr: 'Tankbuster sur VOUS',
          ja: '自分にタンクバスター',
          cn: '死刑点名',
        };
      }
      return {
        en: 'Buster on ' + data.ShortName(target),
        de: 'Tankbuster auf ' + data.ShortName(target),
        fr: 'Tankbuster sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にタンクバスター',
        cn: '死刑 -> ' + data.ShortName(target),
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
            };
          }
        } else {
          // targetless tank cleave
          return {
            en: 'Tank cleave',
          };
        }
      }
      return {
        en: 'Avoid tank cleave',
      };
    };
    return obj;
  },
  miniBuster: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Mini Buster',
      de: 'Kleiner Tankbuster',
    };
    return obj;
  },
  aoe: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'aoe',
      de: 'AoE',
      fr: 'Dégâts de zone',
      ja: 'AoE',
      cn: 'AOE',
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
        };
      }
      return {
        en: 'Stack on ' + data.ShortName(target),
        de: 'Auf ' + data.ShortName(target) + ' sammeln',
        fr: 'Package sur ' + data.ShortName(target),
        ja: data.ShortName(target) + 'にスタック',
        cn: '靠近 ' + data.ShortName(target) + '集合',
      };
    };
    return obj;
  },
  stack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Stack',
      de: 'Sammeln',
      fr: 'Package',
      cn: '集合',
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
          de: 'Knockback auf DIR',
          fr: 'Poussée sur VOUS',
        };
      }
      return {
        en: 'Knockback on ' + data.ShortName(target),
        de: 'Knockback auf ' + data.ShortName(target),
        fr: 'Poussée sur ' + data.ShortName(target),
      };
    };
    return obj;
  },
  getUnder: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Get Under',
      de: 'Unter ihn',
      fr: 'Intérieur',
      ja: '中へ',
    };
    return obj;
  },
  lookTowards: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Look Towards',
      de: 'Anschauen',
      fr: 'Regardez le boss',
    };
    return obj;
  },
  lookAway: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Look Away',
      de: 'Wegschauen',
      fr: 'Regardez ailleurs',
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
    };
    return obj;
  },
  getIn: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'In',
      de: 'Rein',
      fr: 'Dedans',
      ja: '中へ',
      cn: '靠近',
    };
    return obj;
  },
  getOut: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Out',
      de: 'Raus',
      ja: '外へ',
      fr: 'Dehors',
      cn: '远离',
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
    };
    return obj;
  },
  goWest: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: '<= Get Left/West',
      fr: '<= Allez à Gauche/Ouest',
      de: '<= Nach Links/Westen',
      ko: '<= 왼쪽이 안전',
      ja: '<= 左/西へ',
    };
    return obj;
  },
  goEast: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Get Right/East =>',
      fr: 'Allez à Droite/Est =>',
      de: 'Nach Rechts/Osten =>',
      ko: '오른쪽이 안전 =>',
      ja: '右/東へ =>',
    };
    return obj;
  },
  goFrontBack: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Go Front/Back',
      de: 'Geh nach Vorne/ Hinten',
      fr: 'Devant/Derrière',
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
    };
    return obj;
  },
  outOfFront: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Out of Front',
      de: 'Weg von Vorne',
      fr: 'Ne restez pas devant',
    };
    return obj;
  },
  killExtraAdd: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Kill Extra Add',
      de: 'Add angreifen',
      ja: '水の精倒して',
      fr: 'Tuez l\'add',
      cn: '击杀小怪',
    };
    return obj;
  },
  killAdds: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Kill adds',
    };
    return obj;
  },
  awayFromFront: (sev) => {
    let obj = {};
    obj[defaultAlertText(sev)] = {
      en: 'Away From Front',
      de: 'Weg von Vorne',
      fr: 'Eloignez vous de l\'avant',
    };
    return obj;
  },
  silence: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Silence',
      de: 'Verstummen',
      fr: 'Silence',
      ja: 'ストンスキン',
      cn: '沉默石肤',
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
          de: 'Rakete auf DIR',
          fr: 'Marquage sur VOUS',
          ko: '빨간징 → 나',
          ja: 'マーカー on YOU',
        };
      }
      return {
        en: 'Prey on ' + data.ShortName(target),
        de: 'Beute auf ' + data.ShortName(target),
        fr: 'Marquage sur ' + data.ShortName(target),
        ko: '빨간징 → ' + data.ShortName(target),
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
    };
    return obj;
  },
  stopMoving: (sev) => {
    let obj = {};
    obj[defaultAlarmText(sev)] = {
      en: 'Stop Moving!',
    };
    return obj;
  },
  stopEverything: (sev) => {
    let obj = {};
    obj[defaultAlarmText(sev)] = {
      en: 'Stop Everything!',
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
      ko: '이동',
    };
    return obj;
  },
  outOfMelee: (sev) => {
    let obj = {};
    obj[defaultInfoText(sev)] = {
      en: 'Out of melee',
      de: 'Raus aus Nahkampf',
      fr: 'Eloignez-vous de la mélée',
      cn: '远离近战',
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
