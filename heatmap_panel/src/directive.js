import angular from 'angular';
import * as heatMapCtrl from './directiveCtrl';

angular.module('grafana.directives').directive('d3', function($log){
    return {
        templateUrl: 'public/plugins/Heatmap-panel/dir.html',
        restrict: 'E',
        scope: {
            data: '=data'
        },
        controller: 'heatMapCtrl',
        controllerAs: 'vm',
        bindToController: true
    };
});