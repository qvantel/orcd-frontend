import {MetricsPanelCtrl} from 'app/plugins/sdk';
import Circles from './Circles';
import TrendCalculator from './TrendCalculator';
import TemplateHandler from './templateHandler';
import './css/template-panel.css!';
import angular from 'angular';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope, templateSrv, variableSrv) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

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
    this.showTooltip = false;
    this.tooltipName = '';
    this.tooltipValue = 0;
    this.tooltipTrend = 0;
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
    this.circles.drawCircles(dataList);
    this.calculateTrend(dataList);
  }

  calculateTrend (dataList) {
    for (var i = 0; i < dataList.length; i++) {
      var oldDir = 'middle';
      if (this.currentTrend[i]) {
        oldDir = this.currentTrend[i].arrowDir;
      }
      var trend = this.trendCalculator.getSimpleTrend(dataList[i].datapoints);
      console.log(trend);
      var arrowDir = '';
      if (trend < 0.5 && trend > -0.5) {
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
    return target.replace(/.*[.]([\w])/i, '$1');
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

  handleMouseEnter (data, index) { // Change this
    this.tooltipName = this.parseName(data.target);
    this.tooltipValue = data.datapoints[data.datapoints.length - this.circles.getOffset() - 1][0];
    this.tooltipTrend = this.currentTrend[index].trend;

    this.showTooltip = true;
  }

  handleMouseOver (mEvent) {
    var tooltip = document.getElementById('circle-tooltip');

    tooltip.style.top = mEvent.clientY + 'px';
    tooltip.style.left = mEvent.clientX - tooltip.offsetWidth / 2 - 10 + 'px';
  }

  tiltArrow (index) {
    return this.currentTrend[index].oldDir + '-' + this.currentTrend[index].arrowDir;
  }
}

TemplateCtrl.templateUrl = 'module.html';
