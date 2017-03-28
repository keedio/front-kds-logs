
'use strict';

var app = angular.module('loglevelComponent', [
	'ngRoute',
	'services.service'
]);

app.component('loglevelComponent', {
	templateUrl : 'dashboard/loglevel-component/loglevel.template.html',
	controller : [ 'ServicesService', '$rootScope',
		function LogLevelController(ServicesService, $rootScope) {
			var self = this;
			self.total = 0;
			self.warning = 0;
			self.error = 0;
			self.info = 0;
			initController();

			function initController() {
				ServicesService.GetLogLevelCounts(new Date(), 'YARN')
					.then(function(data) {						
						parseData (data);
					});
			}
			function insertMissingData (data){
				var keys = ['error', 'info', 'warning'];
				var contains = false;
				for (var k in keys){
					contains = false;
					jQuery.each(data, function(i, loglevel) {
						if(keys[k] == loglevel.key){
							contains = true;
							return;
						}
							
					});
					if (!contains) data.push({ 'key': keys[k], 'doc_count': 0});
				}

				return data;
			}
			
			function parseData(data){
				var buckets = data.aggregations.loglevel.buckets.length != 3 ? insertMissingData (data.aggregations.loglevel.buckets) : data.aggregations.loglevel.buckets;
				var total = data.hits.total;
				self.total = total;
				jQuery.each(buckets, function(i, loglevel) {
					generateDonutChart(loglevel.key, loglevel.doc_count, total)
					loglevel.key == 'error' ? self.error = Math.round((loglevel.doc_count/total)*100)  : loglevel.key == 'info' ? self.info = Math.round((loglevel.doc_count/total)*100)  : self.warning = Math.round((loglevel.doc_count/total)*100) 
				});
			}
		} ]
});