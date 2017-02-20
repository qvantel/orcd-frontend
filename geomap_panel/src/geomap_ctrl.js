import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataGenerator from './dataGenerator';

const panelDefaults = {
    mapRegion: 'World',
    showLegend: true
};

const regionMapping = {
    World: 'world',
    Africa: '002',
    Europe: '150',
    America: '019',
    Asia: '142',
    Oceania: '009'
};

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

    setMapRegion () {
        this.map.setRegion(this.getRegion());
        this.render();
    }

    getRegion () {
        return regionMapping[this.panel.mapRegion];
    }

    toggleLegend () {
        this.map.toggleLegend();
        this.render();
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
