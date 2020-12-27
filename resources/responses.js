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

import Outputs from './outputs.js';

export const builtInResponseStr = 'cactbot-builtin-response';

// All valid trigger fields.
export const triggerFunctions = [
  'alarmText',
  'alertText',
  'condition',
  'delaySeconds',
  'disabled',
  'durationSeconds',
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

// Trigger fields that can produce output.
export const triggerOutputFunctions = [
  'alarmText',
  'alertText',
  'infoText',
  'response',
  'tts',
];

export const severityMap = {
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
  const obj = {};

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

export const Responses = {
  tankBuster: (targetSev, otherSev) => {
    const outputStrings = {
      noTarget: Outputs.tankBuster,
      busterOnYou: Outputs.tankBusterOnYou,
      busterOnTarget: Outputs.tankBusterOnPlayer,
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

      return output.busterOnTarget({ player: data.ShortName(target) });
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
      tankSwap: Outputs.tankSwap,
      busterOnYou: Outputs.tankBusterOnYou,
      busterOnTarget: Outputs.tankBusterOnPlayer,
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
      return output.busterOnTarget({ player: data.ShortName(target) });
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
      cleaveOnYou: Outputs.tankCleaveOnYou,
      cleaveNoTarget: Outputs.tankCleave,
      avoidCleave: Outputs.avoidTankCleave,
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
  miniBuster: (sev) => staticResponse(defaultInfoText(sev), Outputs.miniBuster),
  aoe: (sev) => staticResponse(defaultInfoText(sev), Outputs.aoe),
  bigAoe: (sev) => staticResponse(defaultInfoText(sev), Outputs.bigAoe),
  spread: (sev) => staticResponse(defaultInfoText(sev), Outputs.spread),
  // for stack marker situations.
  stackMarker: (sev) => staticResponse(defaultAlertText(sev), Outputs.stackMarker),
  // for getting together without stack marker
  getTogether: (sev) => staticResponse(defaultAlertText(sev), Outputs.getTogether),
  stackMarkerOn: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      stackOnYou: Outputs.stackOnYou,
      stackOnTarget: Outputs.stackOnPlayer,
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const target = getTarget(matches);
        if (target === data.me)
          return output.stackOnYou();
        return output.stackOnTarget({ player: data.ShortName(target) });
      },
    };
  },
  stackMiddle: (sev) => staticResponse(defaultInfoText(sev), Outputs.stackMiddle),
  doritoStack: (sev) => staticResponse(defaultAlertText(sev), Outputs.doritoStack),
  spreadThenStack: (sev) => staticResponse(defaultAlertText(sev), Outputs.spreadThenStack),
  stackThenSpread: (sev) => staticResponse(defaultAlertText(sev), Outputs.stackThenSpread),
  knockback: (sev) => staticResponse(defaultAlertText(sev), Outputs.knockback),
  knockbackOn: (targetSev, otherSev) => {
    const outputStrings = {
      knockbackOnYou: Outputs.knockbackOnYou,
      knockbackOnTarget: Outputs.knockbackOnPlayer,
    };

    const targetFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (target === data.me)
        return output.knockbackOnYou();
    };

    const otherFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (target !== data.me)
        return output.knockbackOnTarget({ player: data.ShortName(target) });
    };
    const combined = combineFuncs(defaultInfoText(targetSev), targetFunc,
        defaultInfoText(otherSev), otherFunc);
    return (data, _, output) => {
      // cactbot-builtin-response
      output.responseOutputStrings = outputStrings;
      return combined;
    };
  },
  lookTowards: (sev) => staticResponse(defaultInfoText(sev), Outputs.lookTowardsBoss),
  lookAway: (sev) => staticResponse(defaultInfoText(sev), Outputs.lookAway),
  lookAwayFromTarget: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      lookAwayFrom: Outputs.lookAwayFromTarget,
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
      lookAwayFrom: Outputs.lookAwayFromTarget,
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
  getBehind: (sev) => staticResponse(defaultAlertText(sev), Outputs.getBehind),
  goFrontOrSides: (sev) => staticResponse(defaultAlertText(sev), Outputs.goFrontOrSides),
  // .getUnder() is used when you have to get into the bosses hitbox
  getUnder: (sev) => staticResponse(defaultInfoText(sev), Outputs.getUnder),
  // .getIn() is more like "get close but maybe even melee range is fine"
  getIn: (sev) => staticResponse(defaultAlertText(sev), Outputs.in),
  // .getOut() means get far away
  getOut: (sev) => staticResponse(defaultAlertText(sev), Outputs.out),
  outOfMelee: (sev) => staticResponse(defaultInfoText(sev), Outputs.outOfMelee),
  getInThenOut: (sev) => staticResponse(defaultInfoText(sev), Outputs.inThenOut),
  getOutThenIn: (sev) => staticResponse(defaultInfoText(sev), Outputs.outThenIn),
  getBackThenFront: (sev) => staticResponse(defaultInfoText(sev), Outputs.backThenFront),
  getFrontThenBack: (sev) => staticResponse(defaultInfoText(sev), Outputs.frontThenBack),
  goMiddle: (sev) => staticResponse(defaultAlertText(sev), Outputs.goIntoMiddle),
  goRight: (sev) => staticResponse(defaultAlertText(sev), Outputs.right),
  goLeft: (sev) => staticResponse(defaultAlertText(sev), Outputs.left),
  goWest: (sev) => staticResponse(defaultAlertText(sev), Outputs.getLeftAndWest),
  goEast: (sev) => staticResponse(defaultAlertText(sev), Outputs.getRightAndEast),
  goFrontBack: (sev) => staticResponse(defaultAlertText(sev), Outputs.goFrontBack),
  goSides: (sev) => staticResponse(defaultAlertText(sev), Outputs.sides),
  // .killAdds() is used for adds that will always be available
  killAdds: (sev) => staticResponse(defaultInfoText(sev), Outputs.killAdds),
  // .killExtraAdd() is used for adds that appear if a mechanic was not played correctly
  killExtraAdd: (sev) => staticResponse(defaultInfoText(sev), Outputs.killExtraAdd),
  awayFromFront: (sev) => staticResponse(defaultAlertText(sev), Outputs.awayFromFront),
  sleep: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      sleep: Outputs.sleepTarget,
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
      stun: Outputs.stunTarget,
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
      interrupt: Outputs.interruptTarget,
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
      preyOnYou: Outputs.preyOnYou,
      preyOnTarget: Outputs.preyOnPlayer,
    };

    const targetFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (data.me === target)
        return output.preyOnYou();
    };

    const otherFunc = (data, matches, output) => {
      const target = getTarget(matches);
      if (target !== data.me)
        return output.preyOnTarget({ player: data.ShortName(target) });
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
      awayFromGroup: Outputs.awayFromGroup,
      awayFromTarget: Outputs.awayFromPlayer,
    };
    return {
      [defaultAlertText(sev)]: (data, matches, output) => {
        const target = getTarget(matches);
        if (data.me === target)
          return output.awayFromGroup();
        return output.awayFromTarget({ player: data.ShortName(target) });
      },
    };
  },
  meteorOnYou: (sev) => staticResponse(defaultAlarmText(sev), Outputs.meteorOnYou),
  stopMoving: (sev) => staticResponse(defaultAlarmText(sev), Outputs.stopMoving),
  stopEverything: (sev) => staticResponse(defaultAlarmText(sev), Outputs.stopEverything),
  // move away to dodge aoes
  moveAway: (sev) => staticResponse(defaultInfoText(sev), Outputs.moveAway),
  // move around (e.g. jumping) to avoid being frozen
  moveAround: (sev) => staticResponse(defaultInfoText(sev), Outputs.moveAround),
  breakChains: (sev) => staticResponse(defaultInfoText(sev), Outputs.breakChains),
  moveChainsTogether: (sev) => staticResponse(defaultInfoText(sev),
      Outputs.moveChainsTogether),
  earthshaker: (sev) => (data, _, output) => {
    // cactbot-builtin-response
    output.responseOutputStrings = {
      earthshaker: Outputs.earthshakerOnYou,
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
  wakeUp: (sev) => staticResponse(defaultAlarmText(sev), Outputs.wakeUp),
};
