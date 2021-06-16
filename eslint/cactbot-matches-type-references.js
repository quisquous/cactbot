const findTriggerIdFromSiblingProperty = (node) => {
  const currentProperty = node.parent;
  const currentTrigger = currentProperty.parent;
  // Value refers to the value in the [key, value] pair for 'id'
  // return the value's value, eg the actual trigger id string
  return currentTrigger.properties.find((property) => property.key.name === 'id')?.value.value;
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'prevent syntax issues from incorrect matches type references',
      category: 'Syntax Issues',
      recommended: true,
      url: 'https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [],
  },

  create: (context) => {
    const netRegexTypeByTriggerId = {};
    const matchesTypes = [
      'MatchesStartsUsing',
      'MatchesAbility',
      'MatchesAbilityFull',
      'MatchesHeadMarker',
      'MatchesAddedCombatant',
      'MatchesAddedCombatantFull',
      'MatchesRemovingCombatant',
      'MatchesGainsEffect',
      'MatchesStatusEffectExplicit',
      'MatchesLosesEffect',
      'MatchesTether',
      'MatchesWasDefeated',
      'MatchesEcho',
      'MatchesDialog',
      'MatchesMessage',
      'MatchesGameLog',
      'MatchesGameNameLog',
      'MatchesStatChange',
      'MatchesChangeZone',
      'MatchesNetwork6d',
      'MatchesNameToggle',
    ];
    const matchesTypeToNetRegexType = {};
    matchesTypes.forEach((matchesType) => {
      const noPrefix = matchesType.slice(7);
      const netRegexType = noPrefix.charAt(0).toLowerCase() + noPrefix.slice(1);
      matchesTypeToNetRegexType[matchesType] = netRegexType;
    });
    return {
      // Collect expected type annotation
      'Property[key.name=\'netRegex\'] > CallExpression[callee.object.name=\'NetRegexes\']': (node) => {
        const netRegexType = node.callee.property.name;
        const triggerId = findTriggerIdFromSiblingProperty(node);
        netRegexTypeByTriggerId[triggerId] = netRegexType;
      },
      // Check if there is a type annotation at all
      'Property[key.name=\'id\'] ~ Property > ArrowFunctionExpression > Identifier[name=\'matches\']': (node) => {
        if (Object.keys(node).includes('typeAnnotation'))
          return;

        const triggerId = findTriggerIdFromSiblingProperty(node.parent);
        const expectedNetRegexType = netRegexTypeByTriggerId[triggerId];
        const expectedType = Object.entries(matchesTypeToNetRegexType).find(([_key, value]) => {
          return value === expectedNetRegexType;
        })[0];
        context.report({
          node,
          message: `Missing type declaration for parameter 'matches'.`,

          fix: (fixer) => {
            return fixer.insertTextAfter(node, `: ${expectedType}`);
          },
        });
      },
      // Report if expected type annotation does not match actual annotation
      'Property[key.name=\'id\'] ~ Property TSTypeReference[typeName.name=/Matches.*/]': (node) => {
        if (!Object.keys(matchesTypeToNetRegexType).includes(node.typeName.name))
          return;

        // Property > Function > Parameter > TypeReference
        const currentProperty = node.parent.parent.parent;
        const triggerId = findTriggerIdFromSiblingProperty(currentProperty);
        const netRegexType = matchesTypeToNetRegexType[node.typeName.name];
        const expectedNetRegexType = netRegexTypeByTriggerId[triggerId];
        if (!expectedNetRegexType || expectedNetRegexType !== netRegexType) {
          const expectedType = Object.entries(matchesTypeToNetRegexType).find(([_key, value]) => {
            return value === expectedNetRegexType;
          })[0];
          context.report({
            node,
            message: `Function matches type does not match trigger matches type: expected ${expectedType}, found ${node.typeName.name}.`,

            fix: (fixer) => {
              return fixer.replaceTextRange([node.range[0], node.range[1]], expectedType);
            },
          });
        }
      },
    };
  },
};
