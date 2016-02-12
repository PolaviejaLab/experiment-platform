(function() {
    
    var module = angular.module('experimentFrameworkApp', [
        'ngRoute',
        'ngResource',
        'experimentFrameworkControllers',
        'menuControllers'
    ]);


    module.factory('Experiment', ['$resource', function ($resource) {
        return $resource('experiment/:id', { id: "@_id" })
    }]);


    module.factory('Participant', ['$resource', function ($resource) {    
        return $resource('experiment/:experiment/participant/:id', { id: "@_id", experiment: "@experiment" });
    }]);


    module.config(['$routeProvider',
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

}());