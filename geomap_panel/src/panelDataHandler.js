/** Default panel settings */
const panelDefaults = {
    showLegend: true,
    showBreadcrumbs: true,
    clickToZoomEnabled: true,
    animate: true,
    animationDuration: 2,
    colorAmount: 1,
    colors: ['#6699cc'],
    breadcrumbs: ['World'],
    zoomContinent: 'World',
    zoomSubContinent: 'None',
    zoomCountry: 'None',
    useFakeData: false
};

// This class is responsible for callbacks to subcribers for the panel data
export default class PanelDataHandler {
    constructor (ctrl) {
        this.ctrl = ctrl;
        this.panelDefaults = panelDefaults;
        this.subscriptions = [];

        this.resetToDefaults();
    }

    /**
    * Get all the panel defaults
    *
    * @return {array} - A list of all the panel defaults
    */
    getPanelDefaults () {
        return this.panelDefaults;
    }

    /**
    * Iterate the defaults and put data into the panel data if not present
    *
    * @param {boolean} overwrite - Put data even if data is already present
    * @param {boolean} executeCallbacks - Whetether or not the execute the callbacks
    *
    */
    resetToDefaults (overwrite, executeCallbacks) {
        // Insert the default values into the panel where the current setting is not found
        for (var key in panelDefaults) {
            if (overwrite || typeof this.ctrl.panel[key] === 'undefined') {
                if ($.isArray(panelDefaults[key])) {
                    this.ctrl.panel[key] = [];
                    for (var key2 in panelDefaults[key]) {
                        this.ctrl.panel[key][key2] = panelDefaults[key][key2];
                    }
                } else {
                    this.ctrl.panel[key] = panelDefaults[key];
                }

                if (executeCallbacks) {
                    this.panelDataUpdated(key);
                }
            }
        }
    }

    /**
    * Subscribe to a panel data, callback will ba called when value has changed
    *
    * @param {string} key The name of the variabel to be listened to
    * @param {function} callback The function to be called when the data has changed
    */
    subscribe (key, callback) {
        if ($.isArray(key)) {
            for (var i = 0; i < key.length; i++) {
                this.subscribe(key[i], callback);
            }
        } else {
            this.subscriptions[key] = callback;
        }
    }

    /**
    * This method should be called when a data panel variabel has been altered
    * It will check if the data has been changed and then if it did, call the callback for the subscriber
    *
    * @param {string} key - The variable name of the updated panel data
    * @param {object} param - (Optional) A param passable to the callback
    */
    panelDataUpdated (key, param) {
        if (typeof this.subscriptions[key] === 'undefined') return;
        this.subscriptions[key](param);
    }
}
