'use strict';

System.register(['./HeatmapCtrl', 'app/plugins/sdk'], function (_export, _context) {
    "use strict";

    var HeatmapCtrl, loadPluginCss;
    return {
        setters: [function (_HeatmapCtrl) {
            HeatmapCtrl = _HeatmapCtrl.HeatmapCtrl;
        }, function (_appPluginsSdk) {
            loadPluginCss = _appPluginsSdk.loadPluginCss;
        }],
        execute: function () {

            /**
            * Set which stylesheets to be used depending on the Grafana theme used
            */
            loadPluginCss({
                dark: 'plugins/heatmap-panel/css/heatmap.dark.css',
                light: 'plugins/heatmap-panel/css/heatmap.light.css'
            });

            _export('PanelCtrl', HeatmapCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
