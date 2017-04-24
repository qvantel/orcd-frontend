import TargetParser from './TargetParser';
import IndexCalculator from './IndexCalculator';

export default class Tooltip {
  constructor (ctrl) {
    this.ctrl = ctrl;
    this.targetParser = new TargetParser();
    this.indexCalculator = new IndexCalculator();
    this.show = false;
    this.name = '';
    this.value = 0;
    this.trend = 0;
    this.max = 6000;
    this.offset = {
      'top': 0,
      'left': 0
    }
  }

  updateTooltip (data, index, clientX, clientY) { // Change this
    var submenus = document.getElementsByClassName('submenu-controls');
    var panelRows = document.getElementsByClassName('panels-wrapper');
    var navbar = document.getElementsByClassName('navbar')[0];

    this.name = this.targetParser.splitName(this.targetParser.parseName(data.target));
    this.value = data.datapoints[this.indexCalculator.getLatestPointIndex(data.datapoints)][0];
    this.trend = this.ctrl.currentTrend[index].trend;
    this.max = this.ctrl.currentMax[index];

    this.offset.left = 0;
    this.offset.top = 0;

    for (let i = 0; i < submenus.length; i++) {
      this.offset.top += submenus[i].offsetHeight;
    }

    var i = 0;
    while (i < panelRows.length && (this.offset.top + panelRows[i].offsetHeight + navbar.offsetHeight + 50) < clientY) {
      this.offset.top += panelRows[i].offsetHeight;
      i++;
    }

    var panelContainers = panelRows[i].getElementsByClassName('panel-container');
    var k = 0;

    while (k < panelContainers.length && (this.offset.left + panelContainers[k].offsetWidth + navbar.offsetWidth + 50) < clientX) {
      this.offset.left += panelContainers[k].offsetWidth;
      k++;
    }

    this.show = true;
  }

  moveTooltip (posX, posY) {
    var tooltip = document.getElementById('circle-tooltip');

    tooltip.style.top = posY - this.offset.top + 'px';
    tooltip.style.left = posX - this.offset.left - tooltip.offsetWidth / 2 - 10 + 'px';
  }
}
