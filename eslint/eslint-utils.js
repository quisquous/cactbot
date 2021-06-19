const compareOrder = (orderList, a, b) => orderList.indexOf(a) - orderList.indexOf(b);

const generateValidList = (orderList, properties) => {
  const validList = [];

  const allPropertiesValid = properties.every((prop) => {
    return prop.key && orderList.includes(prop.key.name);
  });

  if (!allPropertiesValid)
    return validList;

  for (let i = 1; i < properties.length; i++) {
    if (compareOrder(orderList, properties[i - 1].key.name, properties[i].key.name) > 0) {
      validList.push({
        nextKey: properties[i - 1].key.name,
        beforeKey: properties[i].key.name,
      });
    }
  }

  return validList;
};

const generateValidObject = (orderList, properties, sourceCode) => {
  const sortedPropertiesText = [...properties]
    .sort((a, b) => compareOrder(orderList, a.key.name, b.key.name))
    .map((property) => {
      const whitespace = ' '.repeat(property.loc.start.column);
      let str = '';
      sourceCode.getCommentsBefore(property).forEach((comment) => {
        if (comment.type === 'Line')
          str += `${whitespace}//${comment.value}\n`;
        else if (comment.type === 'Block')
          str += `${whitespace}/*${comment.value}*/\n`;
      });
      str += `${whitespace}${sourceCode.getText(property)}`;
      return str;
    })
    .join(',\n');

  // Check after the last property for any additional comments
  const possibleComma = sourceCode.getTokenAfter(properties[properties.length - 1]);
  if (possibleComma.value === ',') {
    const nextNode = sourceCode.getTokenAfter(possibleComma, { includeComments: true });
    if (nextNode.type === 'Line' || nextNode.type === 'Block')
      return undefined;
  }

  return `{\n${sortedPropertiesText},\n${' '.repeat(properties[0].loc.start.column - 2)}}`;
};

module.exports = {
  generateValidList,
  generateValidObject,
};
