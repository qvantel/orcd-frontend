"use strict";

System.register(["lodash"], function (_export, _context) {
  "use strict";

  var _, _createClass, GenericDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
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

      _export("GenericDatasource", GenericDatasource = function () {
        function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, GenericDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(GenericDatasource, [{
          key: "query",
          value: function query(options) {
            //Build options sent from Grafana.
            var query = this.buildQueryParameters(options);

            //Try to return example from grafana page. Modify example data to whatever needed!
            return { data: [{ "target": "upper_50",
                "datapoints": [[_.random(0, 1000), Date.parse(new Date("2017-02-07T12:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T13:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T14:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T15:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T16:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T17:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T18:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T19:00:00")), "Spotify"], [_.random(0, 1000), Date.parse(new Date("2017-02-07T20:00:00")), "Spotify"]] }] };
          }
        }, {
          key: "testDatasource",
          value: function testDatasource() {
            //Fake working back end.
            return { status: "success", message: "Fake back end is working", title: "Success" };
          }
        }, {
          key: "annotationQuery",
          value: function annotationQuery(options) {
            //Defined as needed by Grafana. Annotations are disabled in plugin.json.
          }
        }, {
          key: "buildQueryParameters",
          value: function buildQueryParameters(options) {
            var _this = this;

            //remove placeholder targets
            options.targets = _.filter(options.targets, function (target) {
              return target.target !== 'select metric';
            });

            var targets = _.map(options.targets, function (target) {
              return {
                target: _this.templateSrv.replace(target.target),
                refId: target.refId,
                hide: target.hide,
                type: target.type || 'timeserie'
              };
            });

            options.targets = targets;

            return options;
          }
        }]);

        return GenericDatasource;
      }());

      _export("GenericDatasource", GenericDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
