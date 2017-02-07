import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import './css/template-panel.css!';

export class TemplateCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector, $rootScope) {
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
    //this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onDataError() {
    this.series = [];
    this.render();
  }

  onDataReceived(dataList) {
    //Might contain multiple targets in array.
    this.header = dataList[0].target;
    this.datapoints = dataList[0].datapoints;
  }

  onRender() {
    this.data = "Render";
  }
}

TemplateCtrl.templateUrl ='module.html';
