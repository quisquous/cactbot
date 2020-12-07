const orderMap = {
  en: 0,
  de: 1,
  fr: 2,
  ja: 3,
  cn: 4,
  ko: 5,
};

/**
 * Determines whether the given node is a `null` literal.
 * @param {ASTNode} node The node to check
 * @return {boolean} `true` if the node is a `null` literal
 */
function isNullLiteral(node) {
  /*
   * Checking `node.value === null` does not guarantee that a literal is a null literal.
   * When parsing values that cannot be represented in the current environment (e.g. unicode
   * regexes in Node 4), `node.value` is set to `null` because it wouldn't be possible to
   * set `node.value` to a unicode regex. To make sure a literal is actually `null`, check
   * `node.regex` instead. Also see: https://github.com/eslint/eslint/issues/8020
   */
  return node.type === 'Literal' && node.value === null && !node.regex && !node.bigint;
}


/**
 * Returns the result of the string conversion applied to the evaluated value of the given expression node,
 * if it can be determined statically.
 *
 * This function returns a `string` value for all `Literal` nodes and simple `TemplateLiteral` nodes only.
 * In all other cases, this function returns `null`.
 * @param {ASTNode} node Expression node.
 * @return {string|null} String value if it can be determined. Otherwise, `null`.
 */
function getStaticStringValue(node) {
  switch (node.type) {
  case 'Literal':
    if (node.value === null) {
      if (isNullLiteral(node))
        return String(node.value); // "null"

      if (node.regex)
        return `/${node.regex.pattern}/${node.regex.flags}`;

      if (node.bigint)
        return node.bigint;


      // Otherwise, this is an unknown literal. The function will return null.
    } else {
      return String(node.value);
    }
    break;
  case 'TemplateLiteral':
    if (node.expressions.length === 0 && node.quasis.length === 1)
      return node.quasis[0].value.cooked;

    break;

    // no default
  }

  return null;
}


/**
 * Gets the property name of a given node.
 * The node can be a MemberExpression, a Property, or a MethodDefinition.
 *
 * If the name is dynamic, this returns `null`.
 *
 * For examples:
 *
 *     a.b           // => "b"
 *     a["b"]        // => "b"
 *     a['b']        // => "b"
 *     a[`b`]        // => "b"
 *     a[100]        // => "100"
 *     a[b]          // => null
 *     a["a" + "b"]  // => null
 *     a[tag`b`]     // => null
 *     a[`${b}`]     // => null
 *
 *     let a = {b: 1}            // => "b"
 *     let a = {["b"]: 1}        // => "b"
 *     let a = {['b']: 1}        // => "b"
 *     let a = {[`b`]: 1}        // => "b"
 *     let a = {[100]: 1}        // => "100"
 *     let a = {[b]: 1}          // => null
 *     let a = {["a" + "b"]: 1}  // => null
 *     let a = {[tag`b`]: 1}     // => null
 *     let a = {[`${b}`]: 1}     // => null
 * @param {ASTNode} node The node to get.
 * @return {string|null} The property name if static. Otherwise, null.
 */
function getStaticPropertyName(node) {
  let prop;

  switch (node && node.type) {
  case 'ChainExpression':
    return getStaticPropertyName(node.expression);

  case 'Property':
  case 'MethodDefinition':
    prop = node.key;
    break;

  case 'MemberExpression':
    prop = node.property;
    break;

    // no default
  }

  if (prop) {
    if (prop.type === 'Identifier' && !node.computed)
      return prop.name;


    return getStaticStringValue(prop);
  }

  return null;
}


/**
 * Gets the property name of the given `Property` node.
 *
 * - If the property's key is an `Identifier` node, this returns the key's name
 *   whether it's a computed property or not.
 * - If the property has a static name, this returns the static name.
 * - Otherwise, this returns null.
 * @param {ASTNode} node The `Property` node to get.
 * @return {string|null} The property name or null.
 * @private
 */
function getPropertyName(node) {
  const staticName = getStaticPropertyName(node);

  if (staticName !== null)
    return staticName;


  return node.key.name || null;
}

function isValidOrder(a, b) {
  const orderA = orderMap[a];
  const orderB = orderMap[b];

  if (orderA === undefined || orderB === undefined)
    return true;


  return orderA <= orderB;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'suggest the locale object key order',
      category: 'Stylistic Issues',
      recommended: true,
      url: 'https://github.com/quisquous/cactbot/blob/main/docs/RaidbossGuide.md#trigger-elements',
    },
    fixable: 'code',
    schema: [],
    messages: {
      sortKeys: 'Expected locale object keys to be in an order like [en, de, fr, ja, cn, ko]. \'{{thisName}}\' should be before \'{{prevName}}\'.',
    },
  },
  create: function(context) {
    // The stack to save the previous property's name for each object literals.
    let stack = null;
    return {
      ObjectExpression(node) {
        stack = {
          upper: stack,
          prevName: null,
          numKeys: node.properties.length,
        };
      },

      'ObjectExpression:exit'() {
        stack = stack.upper;
      },
      Property(node) {
        if (node.parent.type === 'ObjectPattern')
          return;


        const prevName = stack.prevName;
        const thisName = getPropertyName(node);

        if (thisName !== null)
          stack.prevName = thisName;


        if (prevName === null || thisName === null)
          return;


        if (!isValidOrder(prevName, thisName)) {
          context.report({
            node,
            loc: node.key.loc,
            messageId: 'sortKeys',
            data: {
              thisName,
              prevName,
            },
          });
        }
      },
    };
  },
};
