import angular from 'angular';
import * as d3 from './node_modules/d3/build/d3.min';

'use strict'

angular.module('grafana.controllers').controller('heatMapCtrl', function($log, $scope){
    var vm = this;
    vm.message = "My D3 Directive";
    vm.dataSet = [];

    // watching for new incoming data
    $scope.$watch('vm.data', function(newValue, oldValue) {
        if(angular.isDefined(vm.data)){
            vm.data.forEach(function(dataItem) {
                vm.dataSet.push(dataItem);
            });
        }
    });
});