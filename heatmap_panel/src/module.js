<<<<<<< HEAD
import {HeatMapPanelCtrl} from './heatMapPanelCtrl';
import './directive.js';
import './css/vis.min.css!';
=======
import {PanelCtrl} from 'app/features/panel/panel_ctrl';

var object = {};
class TestPanelCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.object = {
      msg: "Hello, this is a heatmap panelsssssd"
    };
  }
}

TestPanelCtrl.templateUrl ='module.html';
>>>>>>> master

export {
    HeatMapPanelCtrl as PanelCtrl
};
