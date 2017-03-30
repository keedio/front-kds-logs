
'use strict';

var app = angular.module("kdsLogsApp",
    ['ngResource', 'ngRoute', 'services.service',
    'dashboardLayout','dashboardComponent','rawLogs','realTimeComponent']) ;

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        $routeProvider.
        when('/', {
            template: '<dashboard-component></monitor-component>',

        }).
        when('/index', {
            template: '<dashboard-component></monitor-component>',

        }).

        when('/rawlogs', {
            template: '<raw-logs></raw-logs>',

        }).
        when('/realtime', {
            template: '<real-time-component></real-time-component>',

        }).
        otherwise('/');
    }
]);

