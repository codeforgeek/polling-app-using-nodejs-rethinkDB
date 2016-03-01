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

app.controller('pollingController',function($scope,$mdDialog,$http,socket) {

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
  $scope.submitPoll = function(ev) {
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
    var message = {"title" : "", "message" : ""};
    $http.post('/polls',data).success(function(response) {
      if(response.responseCode === 0) {
        message.title = "Success !";
        message.message = "Poll is successfully created";
        data["id"] = response.data.generated_keys[0];
        $scope.pollData.push(data);
      } else {
        message.title = "Error !";
        message.message = "There is some error happened creating poll";
      }
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(message.title)
          .textContent(message.message)
          .ok('Got it!')
          .targetEvent(ev)
      );
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
