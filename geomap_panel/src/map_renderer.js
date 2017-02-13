import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    render();

    function render () {
        if (!ctrl.map) {
            var self = this;
            ctrl.map = new Map(ctrl, elem.find('#map')[0], function () {
                setTimeout(function () {
                    self.render();
                }, 5000);
            });
        }
    }
}
