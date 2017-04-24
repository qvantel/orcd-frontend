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

  parseName (target) {
    return target.replace(/.*[.]([\w]*[-:]?[\w]*),.*/i, '$1');
  }

  splitName (name) {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z])([a-z])/g, '$1 $2$3').replace(/([a-z])([0-9])/g, '$1 $2');
  }

  parseTimeType (target) {
    return target.replace(/.*,\s"\d(\w+)",.*/, '$1')
  }
}
