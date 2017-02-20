import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];

    ctrl.events.on('render', function () {
        render();
    });

    function initializeMap () {
        ctrl.map = new Map(ctrl, mapContainer);
    }

    function render () {
        if (!ctrl.map) {
            initializeMap();
        } else if (ctrl.map.ready) {
            ctrl.map.draw();
        }
    }
}
