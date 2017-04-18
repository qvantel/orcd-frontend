import {MetricsPanelCtrl} from 'app/plugins/sdk';
import Circles from './Circles';
import TrendCalculator from './TrendCalculator';
import TemplateHandler from './templateHandler';
import './css/template-panel.css!';
import angular from 'angular';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope, templateSrv, variableSrv, $interval) {
    super($scope, $injector);
    this.$rootScope = $rootScope;
    this.$interval = $interval;

    this.templateHandler = new TemplateHandler(this, templateSrv, variableSrv);
    this.templateHandler.buildSimple('products', []);

    var panelDefaults = {
      circleWidth: 100,
      min: 0,
      max: 1000,
      colors: ['#7EB26D', '#EAB839', '#6ED0E0', '#EF843C', '#E24D42', '#1F78C1', '#BA43A9', '#705DA0', '#508642', '#CCA300', '#447EBC', '#C15C17', '#890F02', '#0A437C', '#6D1F62']
    };

    for (var key in panelDefaults) {
      if (angular.isUndefined(this.panel[key])) {
        this.panel[key] = panelDefaults[key];
      }
    }

    this.circles = new Circles(this);
    this.trendCalculator = new TrendCalculator();
    this.currentTrend = [];
    this.selected = [];
    this.timeType = 's';
    this.currentMax = [];
    this.timelapse = {
      'state': 'stop',
      'index': 0,
      'range': 0,
      'step': 1
    }

    this.showTooltip = false;
    this.tooltip = {
      'name': '',
      'value': 0,
      'trend': 0,
      'max': 6000,
      'offset': {
        'top': 0,
        'left': 0
      }
    }
    this.selectedMap = [];

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
    this.calculateTrend(dataList);

    if (this.timelapse.state === 'stop') {
      this.circles.drawCircles(dataList);
    }
  }

  calculateTrend (dataList) {
    this.timeType = this.parseTimeType(dataList[0].target);
    for (var i = 0; i < dataList.length; i++) {
      var oldDir = 'middle';
      if (this.currentTrend[i]) {
        oldDir = this.currentTrend[i].arrowDir;
      }
      var trend = this.trendCalculator.getSimpleTrend(dataList[i].datapoints, this.timeType);
      var arrowDir = '';
      if (trend < 0.5 && trend > -0.5 || isNaN(trend)) {
        arrowDir = 'middle';
      } else if (trend < 0) {
        arrowDir = 'down';
      } else {
        arrowDir = 'up';
      }

      this.currentTrend[i] = {
        'trend': trend,
        'arrowDir': arrowDir,
        'oldDir': oldDir
      }
    }
  }

  onRender () {
    // When is this used?
  }

  parseName (target) {
    return target.replace(/.*[.]([\w]*:?[\w]*),.*/i, '$1');
  }

  parseTimeType (target) {
    return target.replace(/.*,\s"\d(\w+)",.*/, '$1')
  }

  handleCircleClick (data, index) {
    var serviceName = this.parseName(data.target);
    if (this.selected.includes(serviceName)) { // If service is in selected
      this.selected = this.selected.filter(function (name) {
        return name !== serviceName;
      })
      this.selectedMap = this.selectedMap.filter(function (k) {
        return k !== index;
      })
      this.circles.setCircleColor(this.currentDataList, index, '.circle', 'white'); // set white

      for (var i = 0; i < this.selected.length; i++) {
        this.circles.setCircleColor(this.currentDataList, this.selectedMap[i], '.circle', this.panel.colors[i]);
      }
    } else {
      var n = 0;
      while (serviceName > this.selected[n]) {
        n++;
      }

      this.selected = this.selected.slice(0, n).concat(serviceName).concat(this.selected.slice(n));
      this.selectedMap = this.selectedMap.slice(0, n).concat(index).concat(this.selectedMap.slice(n));

      // this.circles.setCircleColor(this.currentDataList, index, '.circle', this.panel.colors[n]); // set random color
      for (var k = 0; k < this.selected.length; k++) {
        this.circles.setCircleColor(this.currentDataList, this.selectedMap[k], '.circle', this.panel.colors[k]);
      }
    }

    this.templateHandler.buildSimple('products', this.selected);
  }

  handleMouseEnter (data, index, mEvent) { // Change this
    var submenus = document.getElementsByClassName('submenu-controls');
    var panelRows = document.getElementsByClassName('panels-wrapper');

    this.tooltip.name = this.parseName(data.target);
    this.tooltip.value = data.datapoints[data.datapoints.length - this.circles.getOffset() - 1][0];
    this.tooltip.trend = this.currentTrend[index].trend;
    this.tooltip.max = this.currentMax[index];

    this.tooltip.offset.left = 0;
    this.tooltip.offset.top = 0;

    for (let i = 0; i < submenus.length; i++) {
      this.tooltip.offset.top += submenus[i].offsetHeight;
    }

    var i = 0;
    while (i < panelRows.length && (this.tooltip.offset.top + panelRows[i].offsetHeight + 100) < mEvent.clientY) {
      this.tooltip.offset.top += panelRows[i].offsetHeight;
      i++;
    }

    var panelContainers = panelRows[i].getElementsByClassName('panel-container');
    var k = 0;

    while (k < panelContainers.length && (this.tooltip.offset.left + panelContainers[k].offsetWidth + 100) < mEvent.clientX) {
      this.tooltip.offset.left += panelContainers[k].offsetWidth;
      k++;
    }

    this.showTooltip = true;
  }

  handleMouseOver (mEvent) {
    var tooltip = document.getElementById('circle-tooltip');

    tooltip.style.top = mEvent.clientY - this.tooltip.offset.top + 'px';
    tooltip.style.left = mEvent.clientX - this.tooltip.offset.left - tooltip.offsetWidth / 2 - 10 + 'px';
  }

  tiltArrow (index) {
    return this.currentTrend[index].oldDir + '-' + this.currentTrend[index].arrowDir;
  }

  handlePlayPress () {
    if (this.timelapse.state === 'pause' && this.timelapse.range >= 100) {
      this.timelapse.range = 0;
      this.timelapse.index = 0;
    }
    this.timelapse.state = 'play';
    this.playTimelapse();
  }

  handlePausePress () {
    this.$interval.cancel(this.interval);
    this.timelapse.state = 'pause';
    this.timelapse.index--;
  }

  playTimelapse () {
    var dataList = this.currentDataList.slice();
    this.timelapse.step = 100 / (dataList[0].datapoints.length - 1);
    this.circles.drawCircles(dataList, this.timelapse.index);
    this.timelapse.index++;

    var ctrl = this;
    this.interval = ctrl.$interval(play, 1500);

    function play () {
      if (ctrl.timelapse.state !== 'play') {
        ctrl.$interval.cancel(ctrl.interval);

        if (ctrl.timelapse.state === 'end') {
          ctrl.circles.drawCircles(dataList, ctrl.timelapse.index);
          ctrl.timelapse.range = 100;
          ctrl.timelapse.state = 'pause';
        } else if (ctrl.timelapse.state === 'pause') {
          ctrl.timelapse.index--;
        }
      } else {
        ctrl.circles.drawCircles(dataList, ctrl.timelapse.index);
        if (ctrl.timelapse.index < dataList[0].datapoints.length - 2) {
          ctrl.timelapse.range = ctrl.timelapse.index * ctrl.timelapse.step;
          ctrl.timelapse.index++;
        } else {
          ctrl.timelapse.range = ctrl.timelapse.index * ctrl.timelapse.step;
          ctrl.timelapse.index++;
          ctrl.timelapse.state = 'end';
        }
      }
    }
  }

  stopTimelapse () {
    this.timelapse.state = 'stop';
    this.timelapse.index = 0;
    this.timelapse.range = 0;
    this.onDataReceived(this.currentDataList);
  }

  handleRangePress () {
    this.$interval.cancel(this.interval);
  }

  setTimelapseRange () {
    let i = 0;
    while (((this.timelapse.step / 2) * i) < this.timelapse.range) {
      i++;
    }

    if (i % 2 === 0) {
      this.timelapse.index = (i / 2);
      this.timelapse.range = this.timelapse.index * this.timelapse.step;
    } else {
      this.timelapse.index = Math.floor(i / 2);
      this.timelapse.range = this.timelapse.index * this.timelapse.step;
    }

    if (this.timelapse.state === 'play') {
      this.playTimelapse();
    }
  }
}

TemplateCtrl.templateUrl = 'module.html';
