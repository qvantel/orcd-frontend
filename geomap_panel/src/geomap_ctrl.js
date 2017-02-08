import {PanelCtrl} from 'app/features/panel/panel_ctrl';

export default class GeoMapPanelCtrl extends PanelCtrl {
    constructor ($scope, $injector, $log) {
        super($scope, $injector, $log);

        $scope.log = function (msg) {
            $log.log(msg);
        };
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
