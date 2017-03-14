import angular from 'angular';
import * as d3 from './node_modules/d3/build/d3';
import * as vis from './node_modules/vis/dist/vis.min';
import './node_modules/vis/dist/vis.css!';

'use strict'

angular.module('grafana.filters').filter('safe', function($sce){
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});