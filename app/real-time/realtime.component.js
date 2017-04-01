

'use strict';

var app = angular.module('realTimeComponent', [
	'ngRoute',
	'services.service'
]);

app.component('realTimeComponent', {
	templateUrl : 'real-time/realtime.template.html',
	controller : [ 'ServicesService', '$interval', '$scope',
		function RealTimeController(ServicesService, $interval, $scope) {
			var self = this;
			
			var promise;
			initController();
			
			function initController() {

				function getAllServices(){				
					var flume,
					zookeeper,
					yarn = [];
				ServicesService.GetRealTimeLogLevel('flume')
					.then(function(data) {
						flume = parseData('flume', data);

						ServicesService.GetRealTimeLogLevel('zookeeper')
							.then(function(data) {
								zookeeper = parseData('zookeeper', data);

								ServicesService.GetRealTimeLogLevel('yarn')
									.then(function(data) {
										yarn = parseData('yarn', data);
										
										generateLineChart('linechart-services-error', [ [ 'flume' ].concat(flume[0]), [ 'zookeeper' ].concat(zookeeper[0]), [ 'yarn' ].concat(yarn[0]) ]);
										generateLineChart('linechart-services-info', [ [ 'flume' ].concat(flume[1]), [ 'zookeeper' ].concat(zookeeper[1]), [ 'yarn' ].concat(yarn[1]) ]);
										generateLineChart('linechart-services-warn', [ [ 'flume' ].concat(flume[2]), [ 'zookeeper' ].concat(zookeeper[2]), [ 'yarn' ].concat(yarn[2]) ]);
										
										generateLineChart('linechart-flume', [ [ 'error' ].concat(flume[0]), [ 'info' ].concat(flume[1]), [ 'warn' ].concat(flume[2]) ]);
										generateLineChart('linechart-zookeeper', [ [ 'error' ].concat(zookeeper[0]), [ 'info' ].concat(zookeeper[1]), [ 'warn' ].concat(zookeeper[2])]);
										generateLineChart('linechart-yarn', [ [ 'error' ].concat(yarn[0]), [ 'info' ].concat(yarn[1]), [ 'warn' ].concat(yarn[2])]);
										
										generateSparkLineChart('sparkline-error-flume', [ [ 'messages' ].concat(flume[0]) ]);
										generateSparkLineChart('sparkline-info-flume', [ [ 'messages' ].concat(flume[1])]);
										generateSparkLineChart('sparkline-warn-flume', [ [ 'messages' ].concat(flume[2])]);
										
										generateSparkLineChart('sparkline-error-zookeeper', [ [ 'messages' ].concat(zookeeper[0]) ]);
										generateSparkLineChart('sparkline-info-zookeeper', [ [ 'messages' ].concat(zookeeper[1])]);
										generateSparkLineChart('sparkline-warn-zookeeper', [ [ 'messages' ].concat(zookeeper[2])]);
										
										generateSparkLineChart('sparkline-error-yarn', [ [ 'messages' ].concat(yarn[0]) ]);
										generateSparkLineChart('sparkline-info-yarn', [ [ 'messages' ].concat(yarn[1])]);
										generateSparkLineChart('sparkline-warn-yarn', [ [ 'messages' ].concat(yarn[2])]);
										
									});
							});
					});

				}
				getAllServices();
				
			}

			$scope.start = function() {
				$scope.stop();

				promise = $interval(initController, 10000);
			};

			$scope.stop = function() {
				$interval.cancel(promise);
			};
			$scope.$on('$destroy', function() {
				$scope.stop();
			});
			
			$scope.start();
			
			function parseData(service, data) {
				var buckets = data.aggregations.loglevel.buckets.length != 3 ? insertMissingLogData(data.aggregations.loglevel.buckets) : data.aggregations.loglevel.buckets;
				var values = [ [ 0 ], [ 0 ], [ 0 ] ];
				
				
				jQuery.each(buckets, function(i, loglevel) {
					if (loglevel.service_level_interval != undefined && loglevel.service_level_interval.buckets != undefined) {
						jQuery.each(loglevel.service_level_interval.buckets, function(j, service_level_interval) {
							var k = loglevel.key == 'info' ? 1 : loglevel.key == 'error' ? 0 : 2
							if (j == 0)
								values[k][0] = service_level_interval.doc_count;
							else values[k].push(service_level_interval.doc_count);
							
						});

					}
				});

				return values;
			}

		} ]
});