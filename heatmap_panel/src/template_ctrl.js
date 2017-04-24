import {MetricsPanelCtrl} from 'app/plugins/sdk';
import Circles from './Circles';
import TrendCalculator from './TrendCalculator';
import TemplateHandler from './templateHandler';
import IndexCalculator from './IndexCalculator';
import TargetParser from './TargetParser';
import Timelapse from './Timelapse';
import Tooltip from './Tooltip';
import './css/template-panel.css!';
import angular from 'angular';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope, templateSrv, variableSrv, $interval) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

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

    this.productSelector = new TemplateHandler(this, templateSrv, variableSrv);
    this.productSelector.buildSimple('products', []);
    this.timelapse = new Timelapse(this, $interval);
    this.tooltip = new Tooltip(this);
    this.circles = new Circles(this);
    this.trendCalculator = new TrendCalculator();
    this.targetParser = new TargetParser();
    this.currentTrend = [];
    this.selected = [];
    this.timeType = 's';
    this.currentMax = [];
    this.selectedMap = [];
    this.testCounter = 0;
    this.indexCalculator = new IndexCalculator();

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
    if (dataList[0]) {
      this.currentDataList = dataList;
      this.calculateTrend(dataList);

      if (this.timelapse.state === 'stop') {
        this.render();
      }
    }
  }

  calculateTrend (dataList) {
    this.timeType = this.targetParser.parseTimeType(dataList[0].target);
    for (var i = 0; i < dataList.length; i++) {
      var oldDir = 'middle';
      if (this.currentTrend[i]) {
        oldDir = this.currentTrend[i].arrowDir;
      }
      var trend = this.trendCalculator.getSimpleTrend(dataList[i].datapoints, this.timeType);
      var arrowDir = '';
      if (trend < 0.5 && trend > -0.5 || isNaN(trend)) {
        arrowDir = 'middle';
      } else if (trend < 0 && trend > -25) {
        arrowDir = 'downsmall';
      } else if (trend <= -25) {
        arrowDir = 'downbig';
      } else if (trend > 0 && trend < 25) {
        arrowDir = 'upsmall';
      } else {
        arrowDir = 'upbig';
      }

      this.currentTrend[i] = {
        'trend': trend,
        'arrowDir': arrowDir,
        'oldDir': oldDir
      }
    }
  }

  onRender () {
    this.circles.drawCircles(this.currentDataList);
    this.timelapse.dataList = this.currentDataList.slice();
    this.timelapse.step = 100 / (this.timelapse.dataList[0].datapoints.length - 1);
  }

  handleCircleClick (data, index) {
    var serviceName = this.targetParser.parseName(data.target);
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

      for (var k = 0; k < this.selected.length; k++) {
        this.circles.setCircleColor(this.currentDataList, this.selectedMap[k], '.circle', this.panel.colors[k]);
      }
    }

    this.productSelector.buildSimple('products', this.selected);
  }

  handleMouseEnter (data, index, mEvent) { // Change this
    this.tooltip.updateTooltip(data, index, mEvent.clientX, mEvent.clientY);
  }

  handleMouseOver (mEvent) {
    this.tooltip.moveTooltip(mEvent.clientX, mEvent.clientY);
  }

  tiltArrow (index) {
    return this.currentTrend[index].oldDir + '-' + this.currentTrend[index].arrowDir;
  }

  handlePlayPress () {
    this.timelapse.onPlay();
  }

  handlePausePress () {
    this.timelapse.onPause();
  }

  stopTimelapse () {
    this.timelapse.onStop();
  }

  handleRangePress () {
    this.timelapse.cancelTimelapse();
  }

  setTimelapseRange () {
    this.timelapse.setTimelapseRange();
  }
}

TemplateCtrl.templateUrl = 'module.html';
