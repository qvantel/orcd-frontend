'use strict';

System.register(['app/plugins/sdk', 'lodash', './css/template-panel.css!'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, _createClass, TemplateCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_cssTemplatePanelCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('TemplateCtrl', TemplateCtrl = function (_MetricsPanelCtrl) {
        _inherits(TemplateCtrl, _MetricsPanelCtrl);

        function TemplateCtrl($scope, $injector, $rootScope) {
          _classCallCheck(this, TemplateCtrl);

          var _this = _possibleConstructorReturn(this, (TemplateCtrl.__proto__ || Object.getPrototypeOf(TemplateCtrl)).call(this, $scope, $injector));

          _this.$rootScope = $rootScope;

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

          _.defaults(_this.panel, panelDefaults);
          _.defaults(_this.panel.legend, panelDefaults.legend);

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          //this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
          return _this;
        }

        _createClass(TemplateCtrl, [{
          key: 'onDataError',
          value: function onDataError() {
            this.series = [];
            this.render();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            //Might contain multiple targets in array.
            this.header = dataList[0].target;
            this.datapoints = dataList[0].datapoints;
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            this.data = "Render";
          }
        }]);

        return TemplateCtrl;
      }(MetricsPanelCtrl));

      _export('TemplateCtrl', TemplateCtrl);

      TemplateCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=template_ctrl.js.map
