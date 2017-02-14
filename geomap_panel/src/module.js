import {loadPluginCss} from 'app/plugins/sdk';
import GeoMapPanelCtrl from './geomap_ctrl'

loadPluginCss({
  dark: 'plugins/qvantel-geomap-panel/css/map.dark.css',
  light: 'plugins/qvantel-geomap-panel/css/map.light.css'
});

export {
    GeoMapPanelCtrl as PanelCtrl
};
