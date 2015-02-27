
var experimentBackendControllers = angular.module('experimentBackendControllers', []);


experimentBackendControllers.controller('ExperimentListCtrl', ['$scope', '$location', 'Experiment',
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


experimentBackendControllers.controller('ExperimentDetailCtrl', ['$scope', '$location', '$routeParams', 'Experiment',
    function ($scope, $location, $routeParams, Experiment) {
        Experiment.get(
            { id: $routeParams.experimentId }, 
            function (experiment) { 
                $scope.experiment = experiment;
            }
        );
        
        $scope.delete_experiment = function (experiment) {
            experiment.$delete(function () {
                $location.path('/experiments');
            });
        };

        $scope.update_experiment = function (experiment) {
            experiment.$save();
        };
    }
])


experimentBackendControllers.controller('ParticipantInviteCtrl', ['$scope', '$location', '$routeParams', 'Experiment', 'Participant',
    function ($scope, $location, $routeParams, Experiment, Participant) {
        Experiment.get(
            { id: $routeParams.experimentId },
            function (experiment) {
                $scope.experiment = experiment;
            });
    }
])