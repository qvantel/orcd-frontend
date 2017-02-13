import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];
    const updaterInterval = 5000;

    ctrl.events.on('render', function () {
        render();
        ctrl.renderingCompleted();
    });

    ctrl.render();

    function render () {
        if (!ctrl.map) {
            ctrl.map = new Map(ctrl, mapContainer, function () {
                setTimeout(function () {
                    ctrl.render();
                }, updaterInterval);
            });
        } else if (ctrl.map.ready) {
            ctrl.map.draw();
        }
    }
}
