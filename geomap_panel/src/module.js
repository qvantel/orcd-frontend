import {PanelCtrl} from 'app/features/panel/panel_ctrl';

class GeoMapPanelCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
  }
}

GeoMapPanelCtrl.templateUrl ='module.html';

export {
  GeoMapPanelCtrl as PanelCtrl
};
