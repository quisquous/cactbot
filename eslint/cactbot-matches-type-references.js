const findTriggerIdFromSiblingProperty = (node) => {
  return node.parent.parent.properties.find((property) => property.key.name === 'id').value.value;
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
    const matchesTypeToNetRegexType = {
      'MatchesStartsUsing': 'startsUsing',
      'MatchesAbility': 'ability',
      'MatchesAbilityFull': 'abilityFull',
      'MatchesHeadMarker': 'headMarker',
      'MatchesAddedCombatant': 'addedCombatant',
      'MatchesAddedCombatantFull': 'addedCombatantFull',
      'MatchesRemovingCombatant': 'removingCombatant',
      'MatchesGainsEffect': 'gainsEffect',
      'MatchesStatusEffectExplicit': 'statusEffectExplicit',
      'MatchesLosesEffect': 'losesEffect',
      'MatchesTether': 'tether',
      'MatchesWasDefeated': 'wasDefeated',
      'MatchesEcho': 'echo',
      'MatchesDialog': 'dialog',
      'MatchesMessage': 'message',
      'MatchesGameLog': 'gameLog',
      'MatchesGameNameLog': 'gameNameLog',
      'MatchesStatChange': 'statChange',
      'MatchesChangeZone': 'changeZone',
      'MatchesNetwork6d': 'network6d',
      'MatchesNameToggle': 'nameToggle',
    };
    return {
      'Property[key.name=\'netRegex\'] > CallExpression[callee.object.name=\'NetRegexes\']': (node) => {
        const netRegexType = node.callee.property.name;
        const triggerId = findTriggerIdFromSiblingProperty(node);
        netRegexTypeByTriggerId[triggerId] = netRegexType;
      },
      'Property[key.name=\'id\'] ~ Property TSTypeReference[typeName.name=/Matches.*/]': (node) => {
        if (!Object.keys(matchesTypeToNetRegexType).includes(node.typeName.name))
          return;

        const triggerId = findTriggerIdFromSiblingProperty(node.parent.parent.parent);
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
