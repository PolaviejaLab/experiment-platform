
var experimentFrontendApp = angular.module('experiment', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'experimentFrontendControllers'
]);


experimentFrontendApp.factory('Experiment', ['$resource', function ($resource) {
    return $resource(API + '/experiment/:id', { id: "@_id" })
}]);

var experimentFrontendControllers = angular.module('experimentFrontendControllers', []);


experimentFrontendControllers.controller('ExperimentListCtrl', ['$scope', '$location', 'Experiment',
    function ($scope, $location, Experiment) {
        $scope.experiment = {};
        $scope.experiments = Experiment.query();

        $scope.add_experiment = function (exp) {
            var experiment = new Experiment($scope.experiment);

            experiment.$save(function () {
                $scope.experiments.push(experiment);
                $location.path('/experiments/' + experiment._id);
            });
        }
    }
])


experimentFrontendControllers.controller('Participant', ['$scope', '$http', '$cookies',

    function ($scope, $http, $cookies) {

        // Initialize structures
        $scope.experiment = {};
        $scope.participant = {};
        $scope.responses = {};

        // List of updates to push to server
        $scope.transmission_in_progress = false;
        $scope.update_id = 0;
        $scope.updates = {};

        $scope.$watch("responses", function (newValues, oldValues) {
            var newKeys = Object.keys(newValues);
            
            for (var i = 0; i < newKeys.length; i++) {
                if (!(newKeys[i] in oldValues) || newValues[newKeys[i]] != oldValues[newKeys[i]]) {
                    $scope.updates[$scope.update_id] = {
                        'timestamp': Date.now(),
                        'field': newKeys[i],
                        'value': newValues[newKeys[i]]
                    };
                }
            }

            // Transmit to sink            
            if ($scope.transmission_in_progress || $scope.participant._id === undefined)
                return;            

            $scope.transmission_in_progress = true;

            $http.post(API + '/participant/' + $scope.participant._id + '/sink', $scope.updates).
                success(function (data, status) {
                    for (var i in data) {
                        if (data[i] in $scope.updates)
                            delete ($scope.updates[data[i]]);
                    }

                    $scope.transmission_in_progress = false;
                }).
                error(function (data, status) {                    
                    $scope.errorCode = 'PAR_SINK';
                    $scope.transmission_in_progress = false;
                });
        }, true);


        $scope.sync_responses = function () {
            for (var i = 0; i < $scope.participant.responses.length; i++) {
                var response = $scope.participant.responses[i];
                $scope.responses[response.field] = response.value;
            }
        }

        $scope.update_experiment_details = function () {
            // <summary>Request details about the experiment from the server.</summary>

            return $http.get(API + '/experiment/' + experimentId).
                success(function (data, success) {
                    $scope.experiment = data;
                }).
                error(function (data, success) {
                    $scope.errorCode = 'EXP_DETAILS_UPDATE';
                });
        }


        $scope.update_participant_details = function () {
            // <summary>Request details about the participant from the server.</summary>

            if (!('_id' in $scope.participant)) {
                //$scope.errorCode = 'PAR_DETAILS_UPDATE';
                return;
            }

            return $http.get(API + '/participant/' + $scope.participant._id).
                success(function (data, status) {
                    console.log("---- Update Response", data);
                    $scope.participant = data;

                    for (var i in data.responses) {
                        var field = data.responses[i].field;
                        var value = data.responses[i].value;

                        $scope.responses[field] = value;
                    }
                }).
                error(function (data, status) {
                    console.log("---- Update Respose ERROR", data);
                    $scope.errorCode = 'PAR_DETAILS_UPDATE';
                });
        };


        $scope.dump = function () {
            console.log($scope.participant);
        };

        $scope.register = function () {
            // <summary>Request a new participant identifier from the server.</summary>

            return $http.post(API + '/participant', { experiment: $scope.experiment._id }).
                success(function (data, status) {
                    $scope.participant = data;
                    $cookies['participant_id'] = $scope.participant._id;
                }).
                error(function (data, status) {
                    $scope.errorCode = 'PAR_REGISTER';
                });
        }


        $scope.start = function () {
            // <summary>Inform the server that the experiment has been started.</summary>

            return $http.post(API + '/participant/' + $scope.participant._id + '/start').
                success(function (data, status) {
                    console.log("---- Start Ok", data);
                    console.log("Participant", $scope.participant);
                    $scope.update_participant_details();
                }).
                error(function (data, status) {
                    $scope.errorCode = 'PAR_START';
                });
        }


        $scope.stop = function () {
            // <summary>Inform the server that the experiment has terminated.</summary>

            return $http.post(API + '/participant/' + $scope.participant._id + '/stop').
                success(function (data, status) {
                    $scope.update_participant_details();
                }).
                error(function (data, status) {
                    $scope.errorCode = 'PAR_STOP';
                });
        }

        // Update experiment details
        $scope.update_experiment_details().then(function () {
            // Get participant ID
            var id = $cookies['participant_id'];

            if (id === undefined) {
                $scope.register();
            } else {
                // Update details
                $scope.participant._id = id;
                $scope.update_participant_details().error(function (err) {
                    $scope.register().then(function() { $scope.errorCode = "" });
                });
            }
        });
    }

])