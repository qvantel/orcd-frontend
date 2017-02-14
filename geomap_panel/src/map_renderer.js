import './css/map.css!';
import Map from './map';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];
    const dataUpdateInterval = 5000;
    const animationUpdateInterval = 10;
    const animationUpdateLength = 1000;
    var animationTimer = -1;

    (function DEBUG_UpdateData() {
        setData();
        setTimeout(DEBUG_UpdateData, dataUpdateInterval);
    })();

    ctrl.events.on('render', function () {
        render();
        ctrl.renderingCompleted();
    });

    function initializeMap () {
        ctrl.map = new Map(ctrl, mapContainer, onMapReady);
    }

    function render () {
        if (!ctrl.map) {
            initializeMap();
        } else {
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
        if (!ctrl.map) {
            initializeMap();
        }

        ctrl.map.setData();
        startAnimationSequence();
    }

    function startAnimationSequence () {
        animationTimer = getTime();
        ctrl.render();
    }

    function stopAnimationSequence () {
        animationTimer = -1;
        ctrl.map.lerpDataValues(1);
        ctrl.render();
    }

    function getTime () {
        return (new Date().getTime());
    }

    function isAnimating () {
        return (getTime() - animationTimer) < animationUpdateLength;
    }

    function getAnimationRatio () {
        return clamp01((getTime() - animationTimer) / animationUpdateLength);
    }

    function clamp01 (val) {
        if (val < 0) return 0;
        if (val > 1) return 1;
        return val;
    }
}
