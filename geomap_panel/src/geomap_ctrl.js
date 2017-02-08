import {PanelCtrl} from 'app/features/panel/panel_ctrl';
import mapRenderer from './map_renderer';

export default class GeoMapPanelCtrl extends PanelCtrl {
    constructor ($scope, $injector, $log) {
        super($scope, $injector, $log);

        $scope.log = function (msg) {
            $log.log(msg);
        };
    }

    link (scope, elem, attrs, ctrl) {
        mapRenderer(scope, elem, attrs, ctrl);
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
