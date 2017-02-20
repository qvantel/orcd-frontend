import {MetricsPanelCtrl} from 'app/plugins/sdk';
import mapRenderer from './map_renderer';
import DataGenerator from './dataGenerator';

const panelDefaults = {
    mapRegion: 'World',
    showLegend: true,
    animate: true,
    animationDuration: 2,
    colorAmount: 1,
    colors: ['#6699cc']
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

        this.updateDynamicSheet();
        this.updateColors();
    }

    onInitEditMode () {
        this.addEditorTab('Options', 'public/plugins/qvantel-geomap-panel/editor.html', 2);
    }

    onDataReceived (dataList) {
        this.data = this.dataGenerator.generate();
        this.render();
    }

    link (scope, elem, attrs, ctrl) {
        this.elem = elem;
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

    colorAmountUpdated () {
        if (this.panel.colorAmount > 5) {
            this.panel.colorAmount = 5;
        } else if (this.panel.colorAmount <= 0) {
            this.panel.colorAmount = 1;
        }

        var diff = this.abs(this.panel.colorAmount - this.panel.colors.length);

        for (var i = 0; i < diff; i++) {
            if (this.panel.colorAmount > this.panel.colors.length) {
                this.panel.colors.push('#fff');
            } else {
                this.panel.colors.pop();
            }
        }

        this.updateColors();
        this.updateDynamicSheet();
        this.render();
    }

    updateAnimation () {
        this.updateDynamicSheet ();
        this.render();
    }

    changeColors () {
        this.updateColors();
        this.updateDynamicSheet();
        this.render();
    }

    updateColors () {
        if (this.map) {
            this.map.setColors(this.panel.colors);
        }
    }

    updateDynamicSheet () {
        if (!this.dynamicSheet) {
            this.dynamicSheet = window.document.createElement('style');
            window.document.body.appendChild(this.dynamicSheet);
        }

        var sheet = '';
        sheet += '.map path {';
        sheet += 'stroke: ' + this.panel.colors[this.panel.colors.length - 1] + ';';
        if (this.panel.animate) {
            sheet += 'transition: fill ' + this.panel.animationDuration + 's ease;';
        }
        sheet += '}';
        this.dynamicSheet.innerHTML = sheet;
    }

    abs (val) {
        if (val > 0) {
            return val;
        } else {
            return val * -1;
        }
    }
}

GeoMapPanelCtrl.templateUrl = 'module.html';
