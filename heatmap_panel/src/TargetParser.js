'use strict'

/** Class for parsing query targets from grafana data source */
export default class TargetParser {
  /**
  * Parses name from target.
  *
  * @param {String} target - A grafana query string with a summary. Example: summarize(qvantel.products.data.freeFacebook, '1h', ...)
  */
  parseName (target) {
    return target.replace(/.*[.]([\w]*[-:]?[\w]*),.*/i, '$1');
  }

  /**
  * Splits camelcase names from target.
  *
  * @param {String} target - A grafana query string with a summary. Example: summarize(qvantel.products.data.freeFacebook, '1h', ...)
  */
  splitName (name) {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z])([a-z])/g, '$1 $2$3').replace(/([a-z])([0-9])/g, '$1 $2');
  }

  /**
  * Parses the timetype from target. Example: 1h
  *
  * @param {String} target - A grafana query string with a summary. Example: summarize(qvantel.products.data.freeFacebook, '1h', ...)
  */
  parseTimeType (target) {
    return target.replace(/.*,\s"\d(\w+)",.*/, '$1')
  }
}
