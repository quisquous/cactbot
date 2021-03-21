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
      notFoundTemplate: '`output.{{prop}}(...)` doesn\'t have template \'{{template}}\'.',
      missingTemplateValue: 'template \'{{prop}}\' is missing in function call',
      tooManyParams: 'function `output.{{call}}()` take only {{num}} params',
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

    const extractTemplate = function(node) {
      if (node.properties === undefined) return;
      const outputTemplateKey = {};
      for (const outputString of node.properties.filter((s) => s.type !== 'SpreadElement' && s.value.type !== 'MemberExpression')) {
        // each outputString
        const values = [];

        outputString.value.properties.forEach((x) => {
          if (x.value.value !== undefined)
            values.push(x.value.value);
        });
        const templateIds = values.map((x) => Array.from(x.matchAll(/\${\s*([^}\s]+)\s*}/g))).map((x) => x.length ? x.map((v) => v[1]) : null);
        const triggerId = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'id').value.value;

        if (arrayContainSameElement(templateIds))
          outputTemplateKey[outputString.key.name] = templateIds[0];

        outputTemplates.set(triggerId, outputTemplateKey);
      }
    };

    const arrayContainSameElement = (arr) => {
      return arr.every((v) => JSON.stringify(v) === JSON.stringify(arr[0]));
    };

    return {
      /**
       *
       * @param node {t.ObjectExpression}
       */
      'Program > VariableDeclaration > VariableDeclarator > ObjectExpression'(node) {
        globalVars.set(node.parent.id.name, getAllKeys(node.properties));
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function`](node) {
        const props = getAllKeys(node.parent.parent.properties);
        if (props.find((prop) => prop === 'outputStrings')) {
          stack.inTriggerFunc = true;
          stack.outputParam = node.params[2] && node.params[2].name;
          const outputValue = node.parent.parent.properties.find((prop) => prop.key && prop.key.name === 'outputStrings').value;
          extractTemplate(outputValue);
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
      [`Property[key.name=/${textProps.join('|')}/] > :function:exit`]() {
        if (stack.inTriggerFunc) {
          stack.inTriggerFunc = false;
          stack.outputParam = null;
          stack.outputProperties = [];
          stack.triggerID = null;
        }
      },
      /**
       *
       * @param node {t.MemberExpression}
       */
      [`Property[key.name=/${textProps.join('|')}/] > :function[params.length=3] CallExpression > MemberExpression`](node) {
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
        if (t.isIdentifier(node.property) && stack.outputProperties.includes(node.property.name)) {
          const args = node.parent.callee.parent.arguments;
          const outputOfTriggerID = outputTemplates.get(stack.triggerID) ?? {};
          const outputTemplate = outputOfTriggerID[node.property.name];
          if (args.length === 0) {
            if ((node.property.name in outputOfTriggerID) &&
              outputTemplate === undefined) {
              context.report({
                node,
                messageId: 'tooManyParams',
                data: {
                  call: node.property.name,
                  num: '0',
                },
              });
            }
          } else if (args.length !== 1) {
            context.report({
              node,
              messageId: 'tooManyParams',
              data: {
                call: node.property.name,
                num: '1',
              },
            });
          } else {
            const keysInParams = getAllKeys(args[0].properties);
            if (outputTemplate !== null && outputTemplate !== undefined) {
              for (const key of outputTemplate) {
                if (args[0].type !== 'Identifier' && !keysInParams.includes(key)) {
                  context.report({
                    node,
                    messageId: 'missingTemplateValue',
                    data: {
                      prop: key,
                    },
                  });
                }
              }

              for (const key of keysInParams) {
                if (!outputTemplate.includes(key)) {
                  context.report({
                    node,
                    messageId: 'notFoundTemplate',
                    data: {
                      prop: key,
                      outputParam: node.property.name,
                    },
                  });
                }
              }
            }
          }
        }
      },
    };
  },
};

module.exports = ruleModule;
