'use strict'

export default class TargetParser {
  parseCategories (dataList) {
    return dataList.map(function (data) {
      return data.target.replace(/.*\.(\w+)\..*/, '$1');
    }).filter(function (category, index, array) {
      return array.indexOf(category) === index;
    });
  }

  parseCategory (target) {
    return target.replace(/.\.*(\w+)\..*/);
  }
}
