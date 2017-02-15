import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataGenerator from './dataGenerator';

export default class GeoMapPanelCtrl extends MetricsPanelCtrl {
    constructor ($scope, $injector, $log, contextSrv) {
        super($scope, $injector, $log);

        this.log = function (msg) {
            $log.log(msg);
        };

        this.lightTheme = contextSrv.user.lightTheme
        this.dataGenerator = new DataGenerator();

        this.events.on('data-received', this.onDataReceived.bind(this));
    }

    onDataReceived (dataList) {
        this.data = this.dataGenerator.generate();
        this.render();
    }

    link (scope, elem, attrs, ctrl) {
        mapRenderer(scope, elem, attrs, ctrl);
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
