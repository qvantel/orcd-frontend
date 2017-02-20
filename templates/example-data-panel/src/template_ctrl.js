import {MetricsPanelCtrl} from 'app/plugins/sdk';
import * as d3 from './node_modules/d3/build/d3';
import _ from 'lodash';
import './css/template-panel.css!';
import './css/d3.css!';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, $rootScope) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

    var panelDefaults = {
      legend: {
        show: true, // disable/enable legend
        values: true
      },
      links: [],
      datasource: null,
      maxDataPoints: 3,
      interval: null,
      targets: [{}],
      cacheTimeout: null,
      nullPointMode: 'connected',
      legendType: 'Under graph',
      aliasColors: {},
      format: 'short',
      valueName: 'current',
      strokeWidth: 1,
      fontSize: '80%',
      combine: {
        threshold: 0.0,
        label: 'Others'
      }
    };

    _.defaults(this.panel, panelDefaults);
    _.defaults(this.panel.legend, panelDefaults.legend);

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
    // Might contain multiple targets in array.
    this.header = dataList[0].target;
    this.datapoints = dataList[0].datapoints;

    d3.selectAll('svg').remove();

    var svg = d3.select('.dots')
      .selectAll('svg')
      .data(dataList[0].datapoints)
      .enter()
      .append('svg')
      .attr('width', function (d) {
        return d[0] / 10;
      })
      .attr('height', function (d) {
        return d[0] / 10;
      });

    svg.append('circle')
      .attr('cy', function (d) {
        return d[0] / 20;
      })
      .attr('cx', function (d) {
        return d[0] / 20;
      })
      .attr('r', function (d) {
        return d[0] / 20;
      });
  }

  onRender () {
    // When is this used?
    console.log('onRender()');
  }
}

TemplateCtrl.templateUrl = 'module.html';
