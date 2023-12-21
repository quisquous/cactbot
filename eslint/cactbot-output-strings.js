const { ASTUtils: t } = require('@typescript-eslint/utils');
const textProps = ['alarmText', 'alertText', 'infoText', 'tts'];

const isSpreadElement = (node) => {
  return node.type === 'SpreadElement';
};

const isMemberExpression = (node) => {
  return node.type === 'MemberExpression';
};

const isObjectExpression = (node) => {
  return node.type === 'ObjectExpression';
};

const isLiteral = (node) => {
  return node.type === 'Literal';
};

const isBinaryExpression = (node) => {
  return node.type === 'BinaryExpression';
};

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const ruleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'suggest outputStrings in cactbot',
      category: 'Stylistic Issues',
      recommended: true,
      url:
        'https://github.com/OverlayPlugin/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noOutputStrings: 'no outputStrings in trigger',
      notFoundProperty: 'no \'{{prop}}\' in \'{{outputParam}}\'',
      notFoundTemplate: '`output.{{prop}}(...)` doesn\'t have template \'{{template}}\'.',
      missingTemplateValue: 'template \'{{prop}}\' is missing in function call',
      incorrectObjectKey: 'template \'{{prop}}\' specifies an object key with too many parts',
    },
  },
  create: function(context) {
    const globalVars = new Map();
    const stack = {
      outputParam: null,
      outputProperties: [],
      inTriggerFunc: false,
    };
    /**
     * get all keys name from object literal expression
     * @param props
     * @return {string[]}
     */
    const getAllKeys = (props) => {
      const propKeys = [];

      if (!props)
        return propKeys;

      props.forEach((prop) => {
        if (prop.type === 'Property') {
          if (t.isIdentifier(prop.key)) {
            propKeys.push(prop.key.name);
          } else if (prop.key.type === 'Literal') {
            propKeys.push(prop.key.value);
          }
        } else if (isSpreadElement(prop)) {
          if (t.isIdentifier(prop.argument)) {
            (globalVars.get(prop.argument.name) || [])
              .forEach((name) => propKeys.push(name));
          }
        }
      });
      return propKeys;
    };

    /**
     * @param node {t.ObjectExpression}
     */
    const extractTemplate = function(node) {
      if (node.properties === undefined)
        return;
      const outputTemplateKey = {};
      for (
        const outputString of node.properties.filter((s) =>
          !isSpreadElement(s) && !isMemberExpression(s.value)
        )
      ) {
        // For each outputString...
        const properties = outputString.value.properties;
        // This could just be a literal, e.g. `outputStrings: { text: 'string' }`.
        if (!properties)
          return;

        const values = properties.map((x) => x.value)
          .map((x) => {
            if (isLiteral(x)) {
              return x.value;
            }

            if (isBinaryExpression(x)) {
              /*
                  outputStrings: {
                     text: {
                       en: Outputs.killAdds.en + '(back first)',
                       de: Outputs.killAdds.de + '(hinten zuerst)',
                       fr: Outputs.killAdds.fr + '(derrière en premier)',
                       ja: Outputs.killAdds.ja + '(下の雑魚から)',
                       cn: Outputs.killAdds.cn + '(先打后方的)',
                       ko: Outputs.killAdds.ko + '(아래쪽 먼저)',
                     },
                   },
               */
              return x.right.value;
            }

            throw new Error('unexpected outputStrings format', x.loc);
          }).filter((x) => x !== undefined) || [];

        const templateIds = values
          .map((x) => Array.from(x.matchAll(/\${\s*([^}\s]+)\s*}/g)))
          .map((x) => x.length ? x.map((v) => v[1]) : null);

        if (arrayContainSameElement(templateIds))
          outputTemplateKey[outputString.key.name] = templateIds[0];
      }
      return outputTemplateKey;
    };

    const arrayContainSameElement = (arr) => {
      return arr.every((v) => JSON.stringify(v) === JSON.stringify(arr[0]));
    };

    return {
      'Program > VariableDeclaration > VariableDeclarator > ObjectExpression'(node) {
        globalVars.set(node.parent.id.name, getAllKeys(node.properties));
      },
      'Program > VariableDeclaration > VariableDeclarator > TSAsExpression > ObjectExpression'(
        node,
      ) {
        /**
         * const eclipseOutputStrings = { ... } as const;
         */
        globalVars.set(node.parent.parent.id.name, getAllKeys(node.properties));
      },
      [`Property[key.name=/${textProps.join('|')}/] > :function`](node) {
        const props = getAllKeys(node.parent.parent.properties);
        if (props.find((prop) => prop === 'outputStrings')) {
          stack.inTriggerFunc = true;
          stack.outputParam = node.params[2] && node.params[2].name;
          const outputValue = node.parent.parent.properties.find((prop) =>
            prop.key && prop.key.name === 'outputStrings'
          ).value;
          stack.outputTemplates = extractTemplate(outputValue);
          stack.outputProperties = t.isIdentifier(outputValue)
            ? globalVars.get(outputValue.name) || []
            : getAllKeys(outputValue.properties);
          stack.triggerID = node.parent.parent.properties.find((prop) =>
            prop.key && prop.key.name === 'id'
          )?.value?.value;
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
          stack.outputTemplates = {};
        }
      },

      [
        `Property[key.name=/alarmText|alertTex|infoText|tts/] > :function[params.length=3] CallExpression > ChainExpression > MemberExpression`
      ](node) {
        // TODO: raise a error about using `?.` to call output
      },

      [
        `Property[key.name=/alarmText|alertTex|infoText|tts/] > :function[params.length=3] CallExpression > TSNonNullExpression > MemberExpression`
      ](node) {
        if (
          node.object.name === stack.outputParam &&
          node.computed === false &&
          t.isIdentifier(node.property) &&
          !stack.outputProperties.includes(node.property.name)
        ) {
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
          const args = node.parent.parent.callee.parent.arguments;
          const outputOfTriggerId = stack.outputTemplates ?? {};
          const outputTemplate = outputOfTriggerId?.[node.property.name];

          if (args.length === 0) {
            if (node.property.name in outputOfTriggerId) {
              if (outputOfTriggerId[node.property.name] !== null) {
                context.report({
                  node,
                  messageId: 'missingTemplateValue',
                  data: {
                    prop: outputTemplate,
                  },
                });
              }
            }
          } else if (args.length === 1) {
            if (isObjectExpression(args[0])) {
              const passedKeys = getAllKeys(args[0].properties);
              if (outputTemplate === null && passedKeys.length !== 0) {
                context.report({
                  node,
                  messageId: 'notFoundTemplate',
                  data: {
                    template: passedKeys.join(', '),
                    prop: node.property.name,
                  },
                });
              }
            }

            const keysInParams = getAllKeys(args[0].properties);
            if (outputTemplate !== null && outputTemplate !== undefined) {
              for (const key of outputTemplate) {
                const keyParts = key.split('.');
                if (keyParts.length > 2) {
                  context.report({
                    node,
                    messageId: 'incorrectObjectKey',
                    data: {
                      prop: key,
                    },
                  });
                }
                const trimmedKey = keyParts[0];
                if (!t.isIdentifier(args[0]) && !keysInParams.includes(trimmedKey)) {
                  context.report({
                    node,
                    messageId: 'missingTemplateValue',
                    data: {
                      prop: trimmedKey,
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
                      prop: node.property.name,
                      template: key,
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
