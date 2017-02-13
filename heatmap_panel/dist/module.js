'use strict';

System.register(['app/features/panel/panel_ctrl'], function (_export, _context) {
  "use strict";

  var PanelCtrl, object, TestPanelCtrl;

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
    setters: [function (_appFeaturesPanelPanel_ctrl) {
      PanelCtrl = _appFeaturesPanelPanel_ctrl.PanelCtrl;
    }],
    execute: function () {
      object = {};

      _export('PanelCtrl', TestPanelCtrl = function (_PanelCtrl) {
        _inherits(TestPanelCtrl, _PanelCtrl);

        function TestPanelCtrl($scope, $injector) {
          _classCallCheck(this, TestPanelCtrl);

          var _this = _possibleConstructorReturn(this, (TestPanelCtrl.__proto__ || Object.getPrototypeOf(TestPanelCtrl)).call(this, $scope, $injector));

          _this.object = {
            msg: "Hello, this is a heatmap panelsssssd"
          };
          return _this;
        }

        return TestPanelCtrl;
      }(PanelCtrl));

      TestPanelCtrl.templateUrl = 'module.html';

      _export('PanelCtrl', TestPanelCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
