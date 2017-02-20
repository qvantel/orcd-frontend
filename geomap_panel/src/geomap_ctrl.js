import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataGenerator from './dataGenerator';

const panelDefaults = {};

export default class GeoMapPanelCtrl extends MetricsPanelCtrl {
    constructor ($scope, $injector, $log, contextSrv) {
        super($scope, $injector, $log);

        this.log = function (msg) {
            $log.log(msg);
        };

        this.lightTheme = contextSrv.user.lightTheme
        this.dataGenerator = new DataGenerator();

        for (var key in panelDefaults) {
            if (typeof this.panel[key] === 'undefined') {
                this.panel[key] = panelDefaults[key];
            }
        }

        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('data-received', this.onDataReceived.bind(this));
    }

    onInitEditMode () {
        this.addEditorTab('Options', 'public/plugins/qvantel-geomap-panel/editor.html', 2);
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
