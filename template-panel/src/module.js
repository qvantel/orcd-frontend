import {PanelCtrl} from 'app/features/panel/panel_ctrl';

class TestPanelCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
  }
}

TestPanelCtrl.templateUrl ='module.html';

export {
  TestPanelCtrl as PanelCtrl
};
