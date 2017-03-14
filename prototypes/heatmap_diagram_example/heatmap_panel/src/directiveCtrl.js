import angular from 'angular';
import * as d3 from './node_modules/d3/build/d3';
import * as vis from './node_modules/vis/dist/vis.min';
import './node_modules/vis/dist/vis.css!';
import './node_modules/angular-tooltips/dist/angular-tooltips';
import './node_modules/angular-tooltips/dist/angular-tooltips.css!';


angular.module('720kb', [
    '720kb.tooltips'
])

angular.module('grafana.controllers').controller('heatMapCtrl', function($log, $scope, $sanitize, $sce){
    var vm = this;

    vm.message = "My D3 Directive";
    vm.dataSet = [];
    vm.selProducts = [];
    vm.testData = [];
    vm.showTl = false;
    vm.tlMenuItemClicked = '';
    vm.toggleBoxOptions = '';
    vm.selBoxSize = 2;

    vm.testDataPoint = 0;

    for(var i = 0; i < 18; i++){
        vm.testData.push({name: 'Undefined', value: 0});
    }

    vm.convertTStoString = function(time){
        var date = new Date(time);

        var str = date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate() +
                ' (' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ')';

        return str;
    };

    vm.setBoxOptions = function(){
        if(vm.selBoxSize === 2){
            vm.selBoxSize = 1;
        }
        else{
            vm.selBoxSize = 2;
        }
    };

    vm.transformColors = function(value){
        var procent = value / 1000;

        var color1 = '50b2ff'; //cold color
        var color2 = 'c76eff'; //warm color
        var ratio = procent;

        ratio = ratio;
        var hex = function(x) {
            x = x.toString(16);
            return (x.length == 1) ? '0' + x : x;
        };
        var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
        var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
        var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

        var middle = hex(r) + hex(g) + hex(b);
        return middle;
    };


    vm.alarms = [];
    vm.alarmProcent = 0;
    vm.setAlarms = function(){
        $log.info('product alarm:');
        $log.info(vm.selalarmProd);
        $log.info(vm.selalarmProd.name);

        var now = vis.moment();
        vm.alarms.push({
            'procent' : vm.alarmProcent,
            'name' : vm.selalarmProd,
            'alert' : false,
            'firstAlert' : now,
            'lastAlert' : now,
            'HTML' : ''
        });
        $log.info(vm.alarms);
    };
    
    vm.deleteAlarm = function(item){
        var temp = vm.alarms.indexOf(item);
        if(temp != -1) {
            vm.alarms.splice(temp, 1);
        }
    };

    vm.setSelectedMenuItem = function(item){
        if(vm.tlMenuItemClicked === item){
            vm.tlMenuItemClicked = '';
        }
        else{vm.tlMenuItemClicked = item;
            vm.showAlarmNotis = false;
            vm.nrOfAlarmsNotify = 0;
        }
    };

    /* START VISJS */
    var DELAY = 1000; // delay in ms to add new data points

    var insertSelToTl = function(){
        addDataPoint(vm.selProducts[0]);
    };

    // create a graph2d with an (currently empty) dataset
    var container = document.getElementById('tl');
    var groups = new vis.DataSet();

    var addGroup = function(productName, index){
        $log.info('INSERTED ONE');
        groups.add({
            id: index - 1,
            content: productName,
            options: {
                shaded: {
                    orientation: 'bottom'
                }
            }});
        graph2d.setGroups(groups);
    };

    vm.search = '';
    vm.filterGroups = function() {
        return function(product) {
            if(angular.isDefined(vm.search)){
                if(vm.search.length === 0){
                    return product;
                }
                else{
                    for (var i = 0; i < vm.search.length; i++) {
                        if (product.name.toLowerCase().indexOf(vm.search[i].toLowerCase()) !== -1) {
                            return product;
                        }
                    }
                }
            }
        };

        /*var filteredGroups = groups.get({
            filter: function (group) {
                $log.info('group: ' + group);
                var matches = 0;
                for (var i = 0; i < vm.search.length; i++) {
                    if (group.content.toLowerCase().indexOf(vm.search[i].toLowerCase()) !== -1) {
                        matches++;
                    }
                }
                $log.info('hittat: ' + vm.search.length);
                return matches === vm.search.length;
            }
        });
        $log.info('setting up new group');
        $log.info('filtered group: ' + filteredGroups);
        return filteredGroups;*/
        //graph2d.setGroups(filteredGroups);
    };

    var items = [/*
        {x: '2017-02-21', y: 20, group: 0},
        {x: '2017-02-22', y: 100, group: 0},
        {x: '2017-02-23', y: 1000, group: 0},
        {x: '2017-02-21', y: 400, group: 1},
        {x: '2017-02-22', y: 100, group: 1},
        {x: '2017-02-23', y: 200, group: 1},
        {x: '2017-02-22', y: 660, group: 2},
        {x: '2017-02-23', y: 555, group: 2}*/
    ];

    var item5 = document.createElement('div');
    item5.appendChild(document.createTextNode('item 5'));
    item5.appendChild(document.createElement('br'));
    var img5 = document.createElement('img');
    img5.src = 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Information_icon.svg/1024px-Information_icon.svg.png';
    img5.style.width = '48px';
    img5.style.height = '48px';
    item5.appendChild(img5);

    var dataset = new vis.DataSet(items);
    var label2 = {
        content: 'Point',
        className: "red",
        xOffset: 20,
        yOffset: 20
    };

    vm.trustHTML = function(html){
        return $sce.trustAsHtml(html);
    };

    vm.showAlarmNotis = false;
    vm.nrOfAlarmsNotify = 0;
    var showAlarmNotifications = function(){
        if(vm.alarms.length > 0 && vm.tlMenuItemClicked === ''){
            vm.nrOfAlarmsNotify++;
            vm.showAlarmNotis = true;
        }
        else{vm.showAlarmNotis = false; vm.nrOfAlarmsNotify = 0;}
    };

    var addItem = function(time, value, groupId){
        //items.push({x: '2017-02-21', y: 20, group: 0});
        //dataset.setItems(items);
        //graph2d.setItems(items);
        var now = vis.moment();
        var tempObj = {};
        tempObj.x = now;
        tempObj.y = value;
        tempObj.group = groupId;
        tempObj.content = 'Hej!';

        //$log.info('object:::');
        //$log.info(tempObj);

        var groupName = '';
        var groupItems = groups.get();
        groupItems.forEach(function(group){

            if(group.id === groupId){
                $log.info('FOUND GROUP: ' + group.content);
                groupName = group.content;
            }
        });

        vm.alarms.forEach(function(item){
            var name = item.name;
            $log.info('name: ' + name);

            if(groupName === 'SMS'){
                $log.info('groupName: ' + groupName);
            };

            var calcPercent = (value/1000)*100;
            if(name === groupName){
                $log.info('group found!!!');
                if(calcPercent >= item.procent){
                    showAlarmNotifications();
                    if(!item.alert){
                        var num = 0;
                        var diff = value / 1000;
                        var res = 170 - (diff*200);
                        num = parseInt(res);
                        item.HTML = "<div style='color: #89a000; background: white; z-index: 1000; animation: pulse 2s linear 1; animation-fill-mode: forwards; border-radius: 50%; right: 10px; top: " + num + "px; width: 30px; height: 30px; position: absolute;'>"+
                            "<div style='margin: 5px; height: 20px; width: 20px; background-image: url(" + 'http://downloadfreesvgicons.com/icons/shape-icons/svg-heart-icon-3/svg-heart-icon-3.svg' +");'></div>" +"</div>";
                        //'+ "'top'" +' : ' + num + 'px'+ '
                        //item.HTML = '<div class="alert" ng-style="{"top" : 200}">S</div>';
                        item.lastAlert = now;
                        $log.info('NEW LAST ALERT: ' + now);
                        item.alert = true;
                    }
                    else{item.lastAlert = now; $log.info('NEW LAST ALERT: ' + now);}
                }
                else{
                    item.HTML = '';
                }
            }
            $log.info('ITEM:');
            $log.info(item);
        });


        /**if(value > 500){
            tempObj.label = label2;
            vm.alertDataPoint = tempObj.y;
            var diff = tempObj.y / 1000;
            var res = 170 - (diff*200);
            vm.alertDataPoint = res;
            $log.info('Object: ');
            $log.info(tempObj);
        }
        else{
            vm.alertDataPoint = 0;
        }*/
        vm.alertHTML = '<div class="alert" ng-style="{' + "'top'" + ': 200}">S2</div>';

        vm.test = $sce.trustAsHtml(vm.alertHTML);
        vm.test2 = $sce.trustAsHtml("<span style='color: #89a000'>123</span>!");
        vm.test3 = $sce.trustAsHtml("<div style='color: #89a000; background: blue; right: 10px; top: 200px; width: 20px; height: 20px; position: absolute;'>S3</div>");

        dataset.add(tempObj);



        /*dataset.add({
            x: now,
            y: value,
            group: groupId
        });*/
    };

    vm.myHTML = 'I am an <code>HTML</code>string with ' +
        '<a href="#">links!</a> and other <em>stuff</em>';





    var options = {
        start: vis.moment().add(-30, 'seconds'), // changed so its faster
        end: vis.moment(),
        legend: true,
        height: 200,
        dataAxis: {
            left: {
                range: {
                    min:0, max: 1000
                }
            }
        },
        drawPoints: {
            style: 'circle', // square, circle
            size: 12
        },
        shaded: {
            orientation: 'bottom' // top, bottom
        }
    };
    var graph2d = new vis.Graph2d(container, dataset, groups, options);

    /**
     * Add a new datapoint to the graph
     */
    function addDataPoint(dataPoint) {
        // add a new data point to the dataset
        var now = vis.moment();
        dataset.add({
            x: now,
            y: dataPoint,
        });

        // remove all data points which are no longer visible
        var range = graph2d.getWindow();
        var interval = range.end - range.start;
        var oldIds = dataset.getIds({
            filter: function (item) {
                return item.x < range.start - interval;
            }
        });
        dataset.remove(oldIds);

        //setTimeout(addDataPoint, DELAY);
    }

    function renderStep() {
        // move the window (you can think of different strategies).
        var now = vis.moment();
        var range = graph2d.getWindow();
        var interval = range.end - range.start;
        graph2d.setWindow(now - interval, now, {animation: false});
        requestAnimationFrame(renderStep);
    }
    renderStep();


    var getNrOfSelected = function(){
        return vm.selProducts.length;
    };

    vm.colorMatch = function(value) {
        if(value <= 199){
            return 'lightblue';
        }
        else if(value <= 599){
            return 'orange';
        }
        else{
            return 'red';
        };
    };

    //angular.element('#header').height();

    vm.selectProduct = function(product){
        $log.info(product.name);
        var proExists = false;

        vm.selProducts.forEach(function(prod, index){
            if(prod.name === product.name){
                if (index > -1) {
                    vm.selProducts.splice(index, 1);
                    proExists = true;
                }
            }
        });

        if(!proExists){
            vm.selProducts.push(product);
            addGroup(product.name, getNrOfSelected());
        }

        if(vm.selProducts.length === 0){
            $log.info()
            vm.showTl = false;
        }
        else{
            vm.showTl = true;
        }
    };

    vm.isBoxSelected = function(product){
        var isSelected = false;
        vm.selProducts.forEach(function(item){
            if(product.name === item.name){
                isSelected = true;
            }
        });
        return isSelected;
    };

    /*
    var myData = [100, 15, 20, 5, 8];

    var BAR_HEIGHT=20;
    var chart = d3.select("#chart")
        .append("svg")
        .attr("width", 400)
        .attr("height", 400);


    function update(myData) {

        var ps = chart.selectAll("rect")
            .data(myData);

        //Enter
        var psEnter = ps.enter()
            .append("rect")
            .merge(ps)
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i*(BAR_HEIGHT+1);
            })
            .attr("width", function (d) {
                return d;
            })
            .attr("height", BAR_HEIGHT);


        //Update
        ps
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i*BAR_HEIGHT;
            })
            .attr("width", function (d) {
                return d;
            })
            .attr("height", BAR_HEIGHT);

        //Remove
        ps.exit()
            .remove();

    }
    update(myData);
    */

    // watching for new incoming data
    $scope.$watch('vm.data', function(newValue, oldValue) {
        if(angular.isDefined(vm.data)){
            vm.data.forEach(function(dataItem, index) {
                vm.dataSet.push(dataItem);
                vm.testData[index].value = dataItem[0];
                vm.testData[index].name = dataItem[2];
            });
        }

        //var now = vis.moment();
        vm.selProducts.forEach(function(prod, index){
            addItem('2017-02-26', prod.value, index);
        });

        /*if(vm.selProducts.length > 0){
            vm.selProducts.forEach(function(prod, index){
                addDataPoint(prod.value);
            });
        }*/
    });
});