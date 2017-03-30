/**
 * Created by davidsantamaria on 16/2/17.
 */

    'use strict';
var app = angular.module('services.service', ['ngResource']);
    app.factory('ServicesService', [  '$http','$q', Service]);

    function Service($http, $q) {
        var service = {};

        service.GetTopHostNames = GetTopHostNames;
        service.GetTopLogs = GetTopLogs;
        service.GetLogLevelCounts = GetLogLevelCounts;
        service.GetRealTimeLogLevel = GetRealTimeLogLevel;
        
        return service;

        function GetLogLevelCounts(during,service) {
            return  $http({
                url: '/services/getLogLevelCounts',
                method: "GET",
                params: {during: during, service: service}
            }).then(handleSuccess, handleError);
        }

        function GetTopHostNames(during,service) {
            return  $http({
                url: '/services/getTopHostNames',
                method: "GET",
                params: {during: during, service: service}
            }).then(handleSuccess, handleError);
        }

        function GetTopLogs(during,service) {
            return  $http({
                url: '/services/getTopLogs',
                method: "GET",
                params: {during: during, service: service}
            }).then(handleSuccess, handleError);
        }
        
        function GetRealTimeLogLevel(service) {
            return  $http({
                url: '/services/getRealTimeLogLevelService',
                method: "GET",
                params: {service: service}
            }).then(handleSuccess, handleError);
        }
        
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }


