import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];
    const dataUpdateInterval = 5000;
    const animationUpdateInterval = 10;
    const animationUpdateLength = 1000;
    var animationTimer = 0;

    setInterval(function () {
        setData();
    }, dataUpdateInterval);

    ctrl.events.on('render', function () {
        render();
        ctrl.renderingCompleted();
    });

    ctrl.render();

    function render () {
        if (!ctrl.map) {
            ctrl.map = new Map(ctrl, mapContainer, onMapReady);
        } else if (ctrl.map.ready) {
            ctrl.map.draw();
        }
    }

    function onMapReady () {
        if (isAnimating()) {
            setTimeout(function () {
                ctrl.log(getAnimationRatio());
                ctrl.map.lerpDataValues(getAnimationRatio());
                ctrl.render();
            }, animationUpdateInterval);
        }
    }

    function setData () {
        ctrl.map.setData();
        startAnimationSequence();
    }

    function startAnimationSequence () {
        animationTimer = getMS();
        ctrl.render();
    }

    function getMS () {
        return (new Date().getTime());
    }

    function isAnimating () {
        return (getMS() - animationTimer) < animationUpdateLength;
    }

    function getAnimationRatio () {
        return clamp((getMS() - animationTimer) / animationUpdateLength);
    }

    function clamp (val) {
        if (val < 0) {
            return 0;
        }
        if (val > 1) {
            return (1);
        }
        return val;
    }
}
