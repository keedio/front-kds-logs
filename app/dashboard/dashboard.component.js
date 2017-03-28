
'use strict';

var app = angular.module('dashboardComponent', [
    'ngRoute',
    'hostnameComponent',
    'logComponent',
    'loglevelComponent'
]);

app.component('dashboardComponent',{
    templateUrl: 'dashboard/dashboard.template.html'
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