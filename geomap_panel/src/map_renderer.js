import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    ctrl.events.on('render', function () {
        render();
        ctrl.renderingCompleted();
    });

    ctrl.render();

    function render () {
        if (!ctrl.map) {
            ctrl.map = new Map(ctrl, elem.find('#map')[0], function () {
                setTimeout(function () {
                    ctrl.render();
                }, 5000);
            });
        } else if (ctrl.map.ready) {
            ctrl.map.draw();
        }
    }
}
