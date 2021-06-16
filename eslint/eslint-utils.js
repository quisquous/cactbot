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
    .map((property) => ' '.repeat(property.loc.start.column) + sourceCode.getText(property))
    .join(',\n');
  return `{\n${sortedPropertiesText},\n${' '.repeat(properties[0].loc.start.column - 2)}}`;
};

module.exports = {
  generateValidList,
  generateValidObject,
};
