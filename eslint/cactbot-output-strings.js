const t = require('@babel/types');
const textProps = ['alarmText', 'alertText', 'infoText', 'tts'];


/**
 * @type {import("eslint").Rule.RuleModule}
 */
const ruleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'suggest outputStrings in cactbot',
      category: 'Stylistic Issues',
      recommended: true,
      url: 'https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noOutputStrings: 'no outputStrings in trigger',
      notFoundProperty: 'no \'{{prop}}\' in \'{{outputParam}}\'',
      notFoundTemplate: 'no \'{{prop}}\' in \'{{outputParam}}\'',
      inConsistentlyFormat: 'output string has different template on key \'{{key}}\'',
    },
  },
  create: function(context) {
    const globalVars = new Map();
    const outputTemplates = new Map();
    const stack = {
      outputParam: null,
      outputProperties: [],
      inTriggerFunc: false,
    };
    /**
     * get all keys name from object literal expression
     * @param {(t.Property|t.SpreadElement)[]} props
     * @return {string[]}
     */
    const getAllKeys = (props) => {
      const propKeys = [];

      if (!props) return propKeys;

      props.forEach((prop) => {
        if (t.isProperty(prop)) {
          if (t.isIdentifier(prop.key))
            propKeys.push(prop.key.name);
          else if (t.isLiteral(prop.key))
            propKeys.push(prop.key.value);
        } else if (t.isSpreadElement(prop)) {
          if (t.isIdentifier(prop.argument)) {
            (globalVars.get(prop.argument.name) || [])
              .forEach((name) => propKeys.push(name));
          }
        }
      });
      return propKeys;
    };

    const arrayContainSameElement = (arr) => {
      return arr.every((v) => JSON.stringify(v) === JSON.stringify(arr[0]));
    };

    return {
      /**
       *
       * @param node {t.ObjectExpression}
       */
      'Property[key.name=/outputStrings/] > ObjectExpression': function(node) {
        const outputTemplateKey = {};
        for (const outputString of node.properties) {
          // each outputString
          const values = [];
          outputString.value.properties.forEach((x) => {
            values.push(x.value.value);
          });
          const v = values.map((x) => Array.from(x.matchAll(/\${\s*([^}\s]+)\s*}/g))).map((x) => x.length ? x.map((v) => v[1]) : null);
          if (!arrayContainSameElement(v)) {
            context.report({
              node: outputString.key,
              messageId: 'inConsistentlyFormat',
              data: {
                key: outputString.key.name,
              },
            });
          } else {
            outputTemplateKey[outputString.key.name] = v[0];
          }
          const triggerID = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'id').value.value;
          outputTemplates.set(triggerID, outputTemplateKey);
        }
      },
      'Program > VariableDeclaration > VariableDeclarator > ObjectExpression': function(node) {
        globalVars.set(node.parent.id.name, getAllKeys(node.properties));
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function`]: function(node) {
        const props = getAllKeys(node.parent.parent.properties);
        if (props.find((prop) => prop === 'outputStrings')) {
          stack.inTriggerFunc = true;
          stack.outputParam = node.params[2] && node.params[2].name;
          const outputValue = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'outputStrings').value;
          stack.outputProperties =
            t.isIdentifier(outputValue)
              ? (globalVars.get(outputValue.name) || [])
              : getAllKeys(outputValue.properties);
          stack.triggerID = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'id').value.value;
          return;
        }
        context.report({
          node: node.parent.key,
          messageId: 'noOutputStrings',
        });
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function:exit`]: function() {
        if (stack.inTriggerFunc) {
          stack.inTriggerFunc = false;
          stack.outputParam = null;
          stack.outputProperties = [];
          stack.triggerID = null;
        }
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function[params.length=3] CallExpression > MemberExpression`]: function(node) {
        if (node.object.name === stack.outputParam &&
          node.computed === false &&
          t.isIdentifier(node.property) &&
          !stack.outputProperties.includes(node.property.name)) {
          context.report({
            node: node,
            messageId: 'notFoundProperty',
            data: {
              prop: node.property.name,
              outputParam: stack.outputParam,
            },
          });
        }
      },
    };
  },
};

module.exports = ruleModule;
