import {loadPluginCss} from 'app/plugins/sdk';
import GeoMapPanelCtrl from './geomap_ctrl'

/**
* Set which stylesheets to be used depending on the Grafana theme used
*/
loadPluginCss({
    dark: 'plugins/qvantel-geomap-panel/css/map.dark.css',
    light: 'plugins/qvantel-geomap-panel/css/map.light.css'
});

export {
    GeoMapPanelCtrl as PanelCtrl
};
