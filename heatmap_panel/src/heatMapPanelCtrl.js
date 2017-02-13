import {PanelCtrl} from 'app/features/panel/panel_ctrl';

export default class HeatMapPanelCtrl extends PanelCtrl {
    constructor ($scope, $injector, $log) {
        super($scope, $injector, $log);

        $scope.log = function (msg) {
            $log.log(msg);
        };
    }
}

HeatMapPanelCtrl.templateUrl = 'module.html';
