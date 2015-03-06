
var experimentFrontendApp = angular.module('experiment', [
    'ngRoute',
    'ngResource',
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


experimentFrontendControllers.controller('Participant', ['$scope', '$http',

    function ($scope, $http) {

        // Initialize structures
        $scope.experiment = {};
        $scope.participant = {};


        $scope.update_experiment_details = function () {
            // <summary>Request details about the experiment from the server.</summary>

            $http.get(API + '/experiment/' + experimentId).
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

            $http.get(API + '/participant/' + $scope.participant._id).
                success(function (data, status) {
                    console.log("---- Update Response");
                    console.log(data);
                    $scope.participant = data;
                }).
                error(function (data, status) {
                    console.log("---- Update Respose ERROR");
                    console.log(data);
                    $scope.errorCode = 'PAR_DETAILS_UPDATE';
                });
        }


        $scope.register = function () {
            // <summary>Request a new participant identifier from the server.</summary>

            $http.post(API + '/participant', { experiment: $scope.experiment._id }).
                success(function (data, status) {
                    $scope.participant = data;
                }).
                error(function (data, status) {
                    $scope.errorCode = 'PAR_REGISTER';
                });
        }


        $scope.start = function () {
            // <summary>Inform the server that the experiment has been started.</summary>

            $http.post(API + '/participant/' + $scope.participant._id + '/start').
                success(function (data, status) {
                    console.log("---- Start Ok");
                    console.log(data);
                    console.log($scope.participant);
                    $scope.update_participant_details();
                }).
                error(function (data, status) {
                    $scope.errorCode = 'PAR_START';
                });
        }


        $scope.stop = function () {
            // <summary>Inform the server that the experiment has terminated.</summary>


            $http.post(API + '/participant/' + $scope.participant._id + '/stop').
                success(function (data, status) {
                    $scope.update_participant_details();
                }).
                error(function (data, status) {
                    $scope.errorCode = 'PAR_STOP';
                });
        }


        // Update details
        $scope.update_experiment_details();
        $scope.update_participant_details();
    }

])