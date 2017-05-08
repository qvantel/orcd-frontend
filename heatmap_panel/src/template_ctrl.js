import {MetricsPanelCtrl} from 'app/plugins/sdk';
import Circles from './Circles';
import TrendCalculator from './TrendCalculator';
import TemplateHandler from './templateHandler';
import TargetParser from './TargetParser';
import Timelapse from './Timelapse';
import Tooltip from './Tooltip';
import './css/heatmap.css!';
import './css/general.css!';
import './css/arrows.css!';
import angular from 'angular';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope, contextSrv, templateSrv, variableSrv, $interval) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

    // These can be changed using grafana's options. Not yet implemented.
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

    this.lightTheme = contextSrv.user.lightTheme;
    this.productSelector = new TemplateHandler(this, templateSrv, variableSrv);
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

    if (this.dashboard.snapshot) {
      this.selected = this.productSelector.variableExists('products') ? this.productSelector.getOptionsValuesByName('products').value : [];
    } else {
      this.selected = this.productSelector.variableExists('products') ? this.productSelector.getOptionsValuesByName('products').map(function (option) {
        return option.value;
      }) : [];
    }
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    // this.events.on('init-edit-mode', this.onInitEditMode.bind(this)); //For options. Currently no options are implemented.
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

  // Calculates trend and gets information about arrow-directions.
  calculateTrend (dataList) {
    this.timeType = this.targetParser.parseTimeType(dataList[0].target);
    for (var i = 0; i < dataList.length; i++) {
      var oldDir = 'middle';
      if (this.currentTrend[i]) {
        oldDir = this.currentTrend[i].arrowDir;
      }
      var trend = this.trendCalculator.getTrend(dataList[i].datapoints, this.timeType);
      var arrowDir = '';
      if (trend < 0.5 && trend > -0.5 || isNaN(trend)) {
        arrowDir = 'middle';
      } else if (trend < -0.5 && trend > -50) {
        arrowDir = 'downsmall';
      } else if (trend <= -50) {
        arrowDir = 'downbig';
      } else if (trend > 0.5 && trend < 50) {
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

  onDataSnapshotLoad (snapshotData) {
    this.onDataReceived(snapshotData);
  }

  // Renders circles and copies timelapse data.
  onRender () {
    this.circles.drawCircles(this.currentDataList);
    this.timelapse.dataList = this.currentDataList.slice();
    this.timelapse.step = 100 / (this.timelapse.dataList[0].datapoints.length - 1);

    let rearragned = [];
    for (let i = 0; i < this.currentDataList.length; i++) {
      let productName = this.targetParser.parseName(this.currentDataList[i].target)

      if (this.selected.includes(productName)) {
        rearragned.push(productName);
      } else {
        this.circles.setCircleColor(this.currentDataList, i, '.circle', this.lightTheme ? 'lightgrey' : 'white');
      }
    }

    for (let i = 0; i < rearragned.length; i++) {
      let k = 0;

      while (rearragned[i] !== this.targetParser.parseName(this.currentDataList[k].target) && this.currentDataList[k + 1] !== undefined) {
        k++;
      }

      if (rearragned[i] === this.targetParser.parseName(this.currentDataList[k].target)) {
        this.circles.setCircleColor(this.currentDataList, k, '.circle', this.panel.colors[i]);
      }
    }
  }

  // Handles when a circle is clicked. Sets clicked circle as selected and changes it's color based on grafanas graph panel.
  handleCircleClick (data, index) {
    if (!this.dashboard.snapshot) {
      var serviceName = this.targetParser.parseName(data.target);

      if (this.selected.includes(serviceName)) { // If service is in selected
        this.selected = this.selected.filter(function (name) {
          return name !== serviceName;
        })

        this.circles.setCircleColor(this.currentDataList, index, '.circle', this.lightTheme ? 'lightgrey' : 'white');
      } else {
        this.selected.push(serviceName);
      }

      this.productSelector.buildSimple('products', this.selected); // Add product to grafana template variable.
    }
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
