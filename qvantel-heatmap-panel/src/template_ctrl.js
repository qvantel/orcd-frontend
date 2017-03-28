import {MetricsPanelCtrl} from 'app/plugins/sdk';
import LinearScale from './LinearScale';
import Circles from './Circles';
import './css/template-panel.css!';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

    var panelDefaults = {
      circleWidth: 200,
      min: 0,
      max: 1000
    };

    for (var key in panelDefaults) {
      if (typeof this.panel[key] === 'undefined') {
        this.panel[key] = panelDefaults[key];
      }
    }

    this.circles = new Circles(this);
    this.linearScale = new LinearScale();

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
    this.linearScale.setRange([0, 1000]);
    this.linearScale.setDomain([0, 200]);

    this.currentDataList = dataList;

    this.circles.drawCircles(dataList);
  }

  onRender () {
    // When is this used?
  }

  styleCircle (size) {
    return {
        'transition': 'width 2s',
        'height': this.linearScale.scale(size) + 'px',
        'width': this.linearScale.scale(size) + 'px'
      }
  }

  parseName (target) {
    return target.replace(/.*[.]([\w])/i, '$1');
  }
}

TemplateCtrl.templateUrl = 'module.html';
