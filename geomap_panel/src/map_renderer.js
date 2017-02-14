import './css/map.css!';
import Map from './map';
import DataGenerator from './dataGenerator';

export default function link (scope, elem, attrs, ctrl) {
    const mapContainer = elem.find('#map')[0];
    const dataUpdateInterval = 5000;
    const animationUpdateInterval = 10;
    const animationUpdateLength = 1000;
    var animationTimer = -1;
    var dataGenerator = new DataGenerator();

    (function DebugUpdateData () {
        setData(dataGenerator.generate());
        setTimeout(DebugUpdateData, dataUpdateInterval);
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

    function setData (data) {
        if (!ctrl.map) {
            initializeMap();
        }

        ctrl.map.setData(data);
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
