module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'prevent explicit overrides where the response default is being used',
      category: 'Stylistic Issues',
      recommended: true,
      url:
        'https://github.com/OverlayPlugin/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [],
  },

  create: (context) => {
    const defaultSeverityResponseMap = {
      'info': [
        'tankCleave',
        'miniBuster',
        'aoe',
        'bigAoe',
        'spread',
        'stackMiddle',
        'knockbackOn',
        'lookTowards',
        'lookAway',
        'getUnder',
        'outOfMelee',
        'getInThenOut',
        'getOutThenIn',
        'getBackThenFront',
        'getFrontThenBack',
        'killAdds',
        'killExtraAdd',
        'moveAway',
        'moveAround',
        'breakChains',
        'moveChainsTogether',
      ],
      'alert': [
        'tankBuster',
        'stackMarker',
        'getTogether',
        'stackMarkerOn',
        'doritoStack',
        'spreadThenStack',
        'stackThenSpread',
        'knockback',
        'lookAwayFromTarget',
        'lookAwayFromSource',
        'getBehind',
        'goFrontOrSides',
        'getIn',
        'getOut',
        'goMiddle',
        'goRight',
        'goLeft',
        'goWest',
        'goEast',
        'goFrontBack',
        'goSides',
        'awayFromFront',
        'sleep',
        'stun',
        'interrupt',
        'preyOn',
        'awayFrom',
        'earthshaker',
      ],
      'alarm': [
        'tankBusterSwap',
        'meteorOnYou',
        'stopMoving',
        'stopEverything',
        'wakeUp',
      ],
      'info, info': [
        'knockbackOn',
      ],
      'alert, info': [
        'tankBuster',
        'preyOn',
      ],
      'alarm, alert': [
        'tankBusterSwap',
      ],
    };
    return {
      'Property[key.name=\'response\'] > CallExpression[callee.object.name=\'Responses\'][arguments.length!=0]':
        (node) => {
          const responseSeverity = node.arguments.map((arg) => arg.value).join(', ');
          const defaultSeverity = defaultSeverityResponseMap[responseSeverity];
          if (defaultSeverity && defaultSeverity.includes(node.callee.property.name)) {
            context.report({
              node,
              message:
                'Use default severity in cases where the severity override matches the response default',

              fix: (fixer) => {
                return fixer.replaceTextRange(
                  [node.arguments[0].range[0], node.arguments[node.arguments.length - 1].range[1]],
                  '',
                );
              },
            });
          }
        },
    };
  },
};
