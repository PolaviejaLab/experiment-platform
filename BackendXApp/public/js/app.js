
var experimentBackendApp = angular.module('experimentBackendApp', [
    'ngRoute',
    'ngResource',
    'experimentBackendControllers',
    'menuControllers'
]);


experimentBackendApp.factory('Experiment', ['$resource', function ($resource) {
    return $resource('experiment/:id', { id: "@_id" })
}]);


experimentBackendApp.factory('Participant', ['$resource', function ($resource) {    
    return $resource('experiment/:experiment/participant/:id', { id: "@_id", experiment: "@experiment" });
}]);


experimentBackendApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                redirectTo: '/experiments'
        }).
            when('/experiments', {
                templateUrl: 'partials/experiment-list.html',
                controller: 'ExperimentListController'
        }).
            when('/experiments/:experimentId', {
                templateUrl: 'partials/experiment-details.html',
                controller: 'ExperimentDetailController'
        }).
            when('/experiments/:experimentId/participants/invite', {
                templateUrl: 'partials/participant-invite.html',
                controller: 'ParticipantInviteController'
        }).
        	when('/experiment/:experimentId/participants/:participantId', {
        		templateUrl: 'partials/participant-details.html',
        		controller: 'ParticipantDetailController'
        });
    }
]);
