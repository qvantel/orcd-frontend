import {MetricsPanelCtrl} from 'app/plugins/sdk';
import Circles from './Circles';
import TrendCalculator from './TrendCalculator';
import TemplateHandler from './templateHandler';
import './css/template-panel.css!';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope, templateSrv, variableSrv) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

    this.templateHandler = new TemplateHandler(this, templateSrv, variableSrv);
    this.templateHandler.buildSimple('Select products', []);

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
    this.trendCalculator = new TrendCalculator();
    this.currentTrend = [];
    this.selected = [];
    this.showTooltip = false;
    this.tooltipName = '';
    this.tooltipValue = 0;
    this.tooltipTrend = 0;

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

    for (var i = 0; i < dataList.length; i++) {
      this.currentTrend[i] = this.trendCalculator.getSimpleTrend(dataList[i].datapoints);
    }
  }

  onRender () {
    // When is this used?
  }

  parseName (target) {
    return target.replace(/.*[.]([\w])/i, '$1');
  }

  handleCircleClick (data, index) {
    var serviceName = this.parseName(data.target);

    if (this.selected.includes(serviceName)) { // If service is in selected
      this.selected = this.selected.filter(function (name) {
        return name !== serviceName;
      })
      this.circles.setCircleColor(this.currentDataList, index, '.circle', 'white'); // set white
    } else {
      this.selected.push(serviceName)
      this.circles.setCircleColor(this.currentDataList, index, '.circle'); // set random color
    }

    this.templateHandler.buildSimple('Select products', this.selected);
  }

  handleMouseEnter (data, index) { // Change this
    this.tooltipName = this.parseName(data.target);
    this.tooltipValue = data.datapoints[data.datapoints.length - this.circles.getOffset() - 1][0];
    this.tooltipTrend = this.currentTrend[index];

    this.showTooltip = true;
  }

  handleMouseOver (mEvent) {
    var tooltip = document.getElementById('circle-tooltip');

    tooltip.style.top = mEvent.clientY + 'px';
    tooltip.style.left = mEvent.clientX - tooltip.offsetWidth / 2 - 10 + 'px';
  }

  tiltArrow (direction, index) {
    if (this.currentTrend[index] === 0) {
      return 'tilt-straight';
    } else if (this.currentTrend[index] > 0) {
      if (direction === 'left') {
        return 'tilt-up';
      } else {
        return 'tilt-down';
      }
    } else {
      if (direction === 'right') {
        return 'tilt-down';
      } else {
        return 'tilt-up';
      }
    }
  }
}

TemplateCtrl.templateUrl = 'module.html';
