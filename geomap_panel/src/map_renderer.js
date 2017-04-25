import './css/map.css!';
import D3map from './d3map';

/**
* This function will be responsible for building and rendering the maps
*/
export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];

    // Bind the render call
    ctrl.events.on('render', function () {
        render();
    });

    /**
    * Instantiate the map object
    */
    function initializeMap () {
        ctrl.map = new D3map(ctrl, mapContainer);
    }

    /**
    * Create the map if it's not instantiated
    * Call the maps draw method if it's ready to be drawn
    */
    function render () {
        if (!ctrl.map && typeof ctrl.data !== 'undefined') {
            initializeMap();
        } else if (typeof ctrl.data !== 'undefined') {
            ctrl.map.updateData();
        }
    }
}
