
var experimentBackendControllers = angular.module('experimentBackendControllers', []);


experimentBackendControllers.controller('ExperimentListController', ['$scope', '$location', 'Experiment',
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
]);


experimentBackendControllers.controller('ExperimentDetailController', ['$scope', '$location', '$routeParams', 'Experiment',
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
]);


/**
 * Displays a list of participants
 */
experimentBackendControllers.controller('ParticipantListController', ['$scope', '$location', '$routeParams', 'Experiment', 'Participant',
    function ($scope, $location, $routeParams, Experiment, Participant) {
        
        /**
         * Update list of participants, and find participant ID in responses
         */
        $scope.updateParticipantList = function()
        {        
            Participant.query({ 'experiment': $routeParams.experimentId }, function (participants) {
                for(var i = 0; i < participants.length; i++) {
                    
                    for(var j = 0; j < participants[i].responses.length; j++) {
                        var response = participants[i].responses[j];
                        
                        if(response.field == "ParticipantID")
                            participants[i].participantID = response.value;
                    }
                }
                
                $scope.participants = participants;
            });
        }

        /**
         * Create a record for a new participant
         */
        $scope.add_participant = function (experiment) {
            var participant = new Participant({ 'experiment': experiment._id });
            
            participant.$save(function () {
                $scope.participants.push(participant);
            });
        };


        /**
         * Remove a participant from the list, if data is associated it will only be hidden 
         */
        $scope.delete_participant = function (participant) {
            participant.$delete(function () {
                $scope.updateParticipantList();
            });
        };   
        
        
        /**
         * Populate list at when controller starts
         */
        $scope.updateParticipantList();    
    }
]);


experimentBackendControllers.controller('ParticipantDetailController', ['$scope', '$location', '$routeParams', 'Participant',
    function($scope, $location, $routeParams, Participant) {
		Participant.get({
			id : $routeParams.participantId,
            experiment: $routeParams.experimentId,
		}, function(participant) {
			$scope.participant = participant;
			
			var responses = {};
			
			for(var i = 0; i < participant.responses.length; i++) {
				var response = participant.responses[i];

				if(!(response.field in responses))
					responses[response.field] = [];
				
				responses[ response.field ].push(response);				
			}
			
			$scope.responses = responses;
		});

	} 
]);


experimentBackendControllers.controller('ParticipantInviteController', ['$scope', '$location', '$routeParams', 'Experiment', 'Participant',
    function ($scope, $location, $routeParams, Experiment, Participant) {
        Experiment.get(
            { id: $routeParams.experimentId },
            function (experiment) {
                $scope.experiment = experiment;
            });
    }
]);
