
'use strict';

var app = angular.module('hostnameComponent', [
	'ngRoute',
	'services.service'
]);

app.component('hostnameComponent', {
	templateUrl : 'dashboard/hostname-component/hostname.template.html',
	controller : [ 'ServicesService', '$rootScope',
		function HostnameController(ServicesService, $rootScope) {
			var self = this;

			initController();

			function initController() {
				ServicesService.GetTopHostNames(new Date(), 'YARN')
					.then(function(data) {
						parseData(data);
					});
			}
			function insertMissingData(data) {
				var keys = [ 'error', 'info', 'warning' ];
				var contains = false;
				for (var k in keys) {
					contains = false;
					jQuery.each(data, function(i, loglevel) {
						if (keys[k] == loglevel.key) {
							contains = true;
							return;
						}

					});
					if (!contains) data.push({
							'key' : keys[k],
							'hostname' : {
								'buckets' : []
							}
						});
				}

				return data;
			}

			function parseData(data) {
				var buckets = data.aggregations.loglevel.buckets.length != 3 ? insertMissingData(data.aggregations.loglevel.buckets) : data.aggregations.loglevel.buckets;
				var total = data.hits.total;
				var values = ['data1'];
				var hostnames = [];
				jQuery.each(buckets, function(i, loglevel) {
					jQuery.each(loglevel.hostname.buckets, function(j,hostname){
						values.push(hostname.doc_count);
						hostnames.push(hostname.key);
					});
					generateBarChart(values, hostnames, loglevel.key)
					values = ['data1'];
					hostnames = [];
				});
			}
		} ]
});