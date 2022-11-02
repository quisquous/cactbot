import { ASTUtils, TSESTree } from '@typescript-eslint/utils';
import { Rule } from 'eslint';
import * as ESTree from 'estree';

const textProps = ['alarmText', 'alertText', 'infoText', 'tts'];

const isSpreadElement = (node: TSESTree.Node): node is TSESTree.SpreadElement => {
  return node.type === 'SpreadElement';
};

const isMemberExpression = (node: TSESTree.Node): node is TSESTree.MemberExpression => {
  return node.type === 'MemberExpression';
};

const isObjectExpression = (node: TSESTree.Node): node is TSESTree.ObjectExpression => {
  return node.type === 'ObjectExpression';
};

const isLiteral = (node: TSESTree.Node): node is TSESTree.Literal => {
  return node.type === 'Literal';
};

const ruleModule: Rule.RuleModule = {
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
    },
  },
  create: function(context) {
    const globalVars = new Map<string, string[]>();
    const stack = {
      outputParam: null,
      outputProperties: [] as string[],
      inTriggerFunc: false,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      outputTemplates: {} as Record<string, string[]>,
    };

    const getAllKeys = (
      props?: (TSESTree.Property | TSESTree.SpreadElement)[],
    ): string[] => {
      const propKeys: string[] = [];

      if (!props)
        return propKeys;

      props.forEach((prop) => {
        if (prop.type === 'Property') {
          if (ASTUtils.isIdentifier(prop.key)) {
            propKeys.push(prop.key.name);
          } else if (isLiteral(prop.key)) {
            if (typeof prop.key.value === 'string') {
              propKeys.push(prop.key.value);
            } else {
              throw new Error(`unexpected AST ${prop.key.value.toString()}`);
            }
          }
        } else {
          if (isSpreadElement(prop)) {
            if (ASTUtils.isIdentifier(prop.argument)) {
              (globalVars.get(prop.argument.name) || [])
                .forEach((name) => propKeys.push(name));
            }
          }
        }
      });
      return propKeys;
    };

    const extractTemplate = function(node: TSESTree.ObjectExpression) {
      if (node.properties === undefined)
        return;
      const outputTemplateKey: Record<string, string[]> = {};
      for (
        const outputString of node.properties.filter((s) =>
        !isSpreadElement(s) && !isMemberExpression(s.value),
      )
        ) {
        // For each outputString...
        const properties = (outputString.value as ESTree.ObjectExpression).properties;
        // This could just be a literal, e.g. `outputStrings: { text: 'string' }`.
        if (!properties)
          return;

        const values = properties.map((x) => x.value)
          .map((x) => {
            if (isLiteral(x)) {
              return x.value;
            }

            if (x.type === 'BinaryExpression') {
              /*
                  outputStrings: {
                     text: {
                       en: Outputs.killAdds.en + '(back first)',
                       de: Outputs.killAdds.de + '(hinten zuerst)',
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
          .map((x): string[] => Array.from(x.matchAll(/\${\s*([^}\s]+)\s*}/g)))
          .map((x) => x.length ? x.map((v) => v[1]) : null);

        if (arrayContainSameElement(templateIds))
          outputTemplateKey[outputString.key.name] = templateIds[0];
      }
      return outputTemplateKey;
    };

    const arrayContainSameElement = (arr: unknown[]): boolean => {
      return arr.every((v) => JSON.stringify(v) === JSON.stringify(arr[0]));
    };

    return {
      /**
       * @param node {ASTUtils.ObjectExpression & {parent: ASTUtils.VariableDeclarator}}
       */
      'Program > VariableDeclaration > VariableDeclarator > ObjectExpression'(node) {
        globalVars.set(node.parent.id.name, getAllKeys(node.properties));
      },

      [`Property[key.name=/${textProps.join('|')}/] > :function`](node: ESTree.Function) {
        const props = getAllKeys(node.parent.parent.properties);

        if (props.find((prop) => prop === 'outputStrings')) {
          stack.inTriggerFunc = true;
          stack.outputParam = node.params[2] && node.params[2].name;
          const outputValue = node.parent.parent.properties.find((prop) =>
            prop.key && prop.key.name === 'outputStrings',
          ).value;
          stack.outputTemplates = extractTemplate(outputValue);
          stack.outputProperties = ASTUtils.isIdentifier(outputValue)
            ? globalVars.get(outputValue.name) || []
            : getAllKeys(outputValue.properties);
          stack.triggerID = node.parent.parent.properties.find((prop) =>
            prop.key && prop.key.name === 'id',
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
        `Property[key.name=/alarmText|alertTex|infoText|tts/] > :function[params.length=3] CallExpression > TSNonNullExpression > MemberExpression`
        ](node: TSESTree.MemberExpression & { parent: { parent: TSESTree.CallExpression } }) {
        if (
          ASTUtils.isIdentifier(node.object) &&
          node.object.name === stack.outputParam &&
          node.computed === false &&
          ASTUtils.isIdentifier(node.property) &&
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

        if (
          ASTUtils.isIdentifier(node.property) &&
          stack.outputProperties.includes(node.property.name)
        ) {
          const args = node.parent.parent.callee.parent.arguments;
          const outputOfTriggerId: Record<string, string[]> = stack.outputTemplates ?? {};
          const outputTemplate: string[] = outputOfTriggerId?.[node.property.name] ?? [];

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
                if (!ASTUtils.isIdentifier(args[0]) && !keysInParams.includes(key)) {
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
                    node: node as ESTree.Node,
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
