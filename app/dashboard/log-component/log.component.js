
'use strict';

var app = angular.module('logComponent', [
	'ngRoute',
	'services.service'
]);

app.component('logComponent', {
	templateUrl : 'dashboard/log-component/log.template.html',
	controller : [ 'ServicesService', '$rootScope',
		function LogController(ServicesService, $rootScope) {
			var self = this;

			initController();

			function initController() {
				ServicesService.GetTopLogs(new Date(), 'YARN')
					.then(function(data) {
						parseData(data.aggregations.fqcn.fqcn.buckets, 'fqcn');
						parseData(data.aggregations.thread.thread.buckets, 'thread');
					});
			}


			function parseData(data, log) {
				var values = [];
				jQuery.each(data, function(i, val) {
					values.push([ val.key, val.doc_count ]);
				});
				generatePieChart(log, values)
			}
		} ]
});