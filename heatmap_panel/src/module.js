import {PanelCtrl} from 'app/features/panel/panel_ctrl';
import './directive.js';

var object = {};
class TestPanelCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.object = {
      msg: "Hello, this is a heatmap panel"
    };
  }
}

TestPanelCtrl.templateUrl ='module.html';

export {
  TestPanelCtrl as PanelCtrl
};
