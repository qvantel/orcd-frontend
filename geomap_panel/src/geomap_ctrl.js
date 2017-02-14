import {PanelCtrl} from 'app/features/panel/panel_ctrl';
import mapRenderer from './map_renderer';

export default class GeoMapPanelCtrl extends PanelCtrl {
    constructor ($scope, $injector, $log, contextSrv) {
        super($scope, $injector, $log);

        this.log = function (msg) {
            $log.log(msg);
        };

        this.lightTheme = contextSrv.user.lightTheme
    }

    link (scope, elem, attrs, ctrl) {
        mapRenderer(scope, elem, attrs, ctrl);
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
