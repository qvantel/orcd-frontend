import {TemplateCtrl} from './template_ctrl';
import {loadPluginCss} from 'app/plugins/sdk';

/**
* Set which stylesheets to be used depending on the Grafana theme used
*/
loadPluginCss({
    dark: 'plugins/heatmap-panel/css/heatmap.dark.css',
    light: 'plugins/heatmap-panel/css/heatmap.light.css'
});

export {
  TemplateCtrl as PanelCtrl
};
