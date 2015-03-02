            var experimentFrontendApp = angular.module('experiment', [
                'ngRoute',
                'ngResource',
                'experimentFrontendControllers'
            ]);


            experimentFrontendApp.factory('Experiment', ['$resource', function ($resource) {
                return $resource('http://localhost:1337/experiment/:id', { id: "@_id" })
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