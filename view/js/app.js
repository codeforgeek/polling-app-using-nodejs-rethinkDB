var app = angular.module('starterApp', ['ngMaterial','ngRoute','ngMessages']);

app.factory('socket',function(){
  var socket = io.connect('http://localhost:3000');
  return socket;
});

app.config(function($routeProvider){
      $routeProvider
          .when('/',{
                templateUrl: 'home.html'
          })
          .when('/create',{
                templateUrl: 'create.html'
          })
          .when('/view',{
                templateUrl: 'view.html'
          });
});

app.controller('pollingController',function($scope,$http,socket) {

  $scope.pollData = [];
  $scope.formData = {};
  $scope.voteData = {};
  $scope.hiddenrows = [];
  getPollData();
  function getPollData() {
    $http.get("/polls").success(function(response){
      $scope.pollData = response.data;
    });
  }
  $scope.submitPoll = function() {
    var data = {
      "question" : $scope.formData.pollQuestion,
      "polls" : [{
        "option" : $scope.formData.pollOption1, "vote" : 0
      },{
        "option" : $scope.formData.pollOption2, "vote" : 0
      },{
        "option" : $scope.formData.pollOption3, "vote" : 0
      }]
    };
    $http.post('/polls',data).success(function(response) {
      if(response.responseCode === 0) {
        $scope.formData.message = "Poll is successfully created";
        data["id"] = response.data.generated_keys[0];
        $scope.pollData.push(data);
      } else {
        $scope.formData.message = "There is some error happened creating poll";
      }
    });
  }

  $scope.updateVote = function(index) {
    var data = {
      "id" : $scope.pollData[index].id,
      "option" : $scope.pollData[index].selected
    };
    $http.put("/polls",data).success(function(response) {
      if(response.responseCode === 0) {
        console.log("Success");
        $scope.hiddenrows.push(index);
      } else {
        console.log("error");
      }
    });
  }

  socket.on('changeFeed',function(data) {
    for(var pollCounter = 0 ;pollCounter < $scope.pollData.length; pollCounter++) {
      if($scope.pollData[pollCounter].id === data.id) {
        $scope.pollData[pollCounter].polls = data.polls;
        $scope.$apply();
      }
    }
  });
});
