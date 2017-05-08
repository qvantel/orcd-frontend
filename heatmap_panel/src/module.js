import {HeatmapCtrl} from './HeatmapCtrl';
import {loadPluginCss} from 'app/plugins/sdk';

/**
* Set which stylesheets to be used depending on the Grafana theme used
*/
loadPluginCss({
    dark: 'plugins/heatmap-panel/css/heatmap.dark.css',
    light: 'plugins/heatmap-panel/css/heatmap.light.css'
});

export {
   HeatmapCtrl as PanelCtrl
};
