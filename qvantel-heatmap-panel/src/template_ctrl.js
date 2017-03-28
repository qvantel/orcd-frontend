import {MetricsPanelCtrl} from 'app/plugins/sdk';
import Circles from './Circles';
import './css/template-panel.css!';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

    var panelDefaults = {
      circleWidth: 100,
      min: 0,
      max: 1000
    };

    for (var key in panelDefaults) {
      if (typeof this.panel[key] === 'undefined') {
        this.panel[key] = panelDefaults[key];
      }
    }

    this.circles = new Circles(this);
    this.selected = [];
    this.showTooltip = false;
    this.tooltipName = '';
    this.tooltipValue = 0;

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    // this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onDataError () {
    this.series = [];
    this.render();
  }

  onDataReceived (dataList) {
    this.currentDataList = dataList;

    this.circles.drawCircles(dataList);
  }

  onRender () {
    // When is this used?
  }

  parseName (target) {
    return target.replace(/.*[.]([\w])/i, '$1');
  }

  handleCircleClick (index) {
    if (this.selected[index]) {
      if (this.selected[index] === true) {
        this.selected[index] = false;
        this.circles.setCircleColor(this.currentDataList, index, '.circle', 'white'); // set white
      } else {
        this.selected[index] = true;
        this.circles.setCircleColor(this.currentDataList, index, '.circle'); // set random color
      }
    } else {
      this.selected[index] = true;
      this.circles.setCircleColor(this.currentDataList, index, '.circle'); // set random color
    }
  }

  handleMouseEnter (data) {
    this.tooltipName = this.parseName(data.target);
    this.tooltipValue = data.datapoints[data.datapoints.length - this.circles.getOffset() - 1][0];

    this.showTooltip = true;
  }

  handleMouseOver (mEvent) {
    var tooltip = document.getElementById('circle-tooltip');

    tooltip.style.top = mEvent.clientY + 'px';
    tooltip.style.left = mEvent.clientX - tooltip.offsetWidth / 2 - 10 + 'px';
  }
}

TemplateCtrl.templateUrl = 'module.html';
