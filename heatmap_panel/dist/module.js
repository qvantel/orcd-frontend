'use strict';

System.register(['./template_ctrl', 'app/plugins/sdk'], function (_export, _context) {
    "use strict";

    var TemplateCtrl, loadPluginCss;
    return {
        setters: [function (_template_ctrl) {
            TemplateCtrl = _template_ctrl.TemplateCtrl;
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

            _export('PanelCtrl', TemplateCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
