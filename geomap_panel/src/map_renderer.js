import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];
    const dataUpdateInterval = 5000;
    const animationUpdateInterval = 10;
    const animationUpdateLength = 1000;
    var animationTimer = -1;

    ctrl.events.on('render', function () {
        render();
        ctrl.renderingCompleted();
    });

    setData();
    setInterval(function () {
        setData();
    }, dataUpdateInterval);

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
                ctrl.map.lerpDataValues(getAnimationRatio());
                ctrl.render();
            }, animationUpdateInterval);
        } else if (animationTimer > 0) {
            stopAnimationSequence();
        }
    }

    function setData () {
        ctrl.render();

        if (ctrl.map) {
            ctrl.map.setData();
        }

        startAnimationSequence();
    }

    function startAnimationSequence () {
        animationTimer = getMS();
    }

    function stopAnimationSequence () {
        animationTimer = -1;
        ctrl.map.lerpDataValues(1);
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
