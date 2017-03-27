export default class LinearScale {
  constructor (range, domain) {
    if (range) {
      this._range = range;
    } else {
      this._range = [0, 0];
    }

    if (domain) {
      this._domain = domain;
    } else {
      this._domain = [0, 0];
    }
  }

  scale (value) {
    var fraction = value / (this._range[0] - this._range[1]);
    return fraction * (this._domain[0] - this._domain[1]);
  }

  getRange () {
    return this._domain;
  }

  setRange (range) {
    this._range = range;
  }

  getDomain () {
    return this._domain;
  }

  setDomain (domain) {
    this._domain = domain;
  }
}
