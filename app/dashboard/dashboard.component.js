
'use strict';

var app = angular.module('dashboardComponent', [
	'ngRoute',
	'hostnameComponent',
	'logComponent',
	'loglevelComponent',
	'services.service'
]);

app.component('dashboardComponent', {
	templateUrl : 'dashboard/dashboard.template.html',
	controller : [ 'ServicesService', '$rootScope',
		function DashboardController(ServicesService, $rootScope) {
			var self = this;
			self.duringEntries = {
				availableOptions : [
					{
						id : '1h',
						name : 'Last hour'
					},
					{
						id : '6h',
						name : 'Last 6 hours'
					},
					{
						id : '12h',
						name : 'Last 12 hours'
					},
					{
						id : '24h',
						name : 'Last day'
					},
					{
						id : '1w',
						name : 'Last week'
					},
					{
						id : '1m',
						name : 'Last month'
					}
				],
				selectedOption : {
					id : '1h',
					name : 'Last hour'
				},
				link : function(scope, element, attrs, ctrl) {
					$timeout(function() {
						element.selectpicker();
					});
				}
			};
			self.servicesEntries = {
				availableOptions : [					
					{
						id : 'flume',
						name : 'Flume'
					},
					{
						id : 'yarn',
						name : 'Yarn'
					},
					{
						id : 'zookeeper',
						name : 'Zookeeper'
					}
				],
				selectedOption : {
					id : 'flume',
					name : 'Flume'
				}
			};

			self.refreshDashboard = function refresh(during, service) {
				
				ServicesService.GetLogLevelCounts(during, service)
					.then(function(data) {
						$rootScope.$emit('refreshLogLevel', data);
					});

				ServicesService.GetTopLogs(during, service)
					.then(function(data) {
						$rootScope.$emit('refreshTopLogs', data);
					});
				ServicesService.GetTopHostNames(during, service)
					.then(function(data) {
						$rootScope.$emit('refreshTopHostnames', data);
					});
			}


		} ]
});

app.directive('selectOptionsGroup', selectDirective);

function selectDirective($timeout) {
	return {
		restrict : 'E',
		templateUrl : 'dashboard/select.template.html',

		link : function(scope, element) {
			$timeout(function() {
				$('.selectpicker').selectpicker();
			});
		}
	}
}