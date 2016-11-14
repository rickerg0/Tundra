angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,BLEService,Foo,$ionicModal) {
	$scope.devices = [];
	var isScanning = true;
	$scope.myText =  "Scan";
	$scope.myColor  ='danger';
	document.getElementById("bleStatus").style= "color:green;";
	$scope.startScanning = function () {
		$scope.devices =BLEService.connect();
		
		
		$scope.myText =  "startScanning";
		
		console.log($scope.myText);
		
		$scope.myText =  "Scan again";
		
		isScanning = true;		
		};
	$scope.getResult = function (deviceID) {
		$scope.deviceID = deviceID;
		$ionicModal.fromTemplateUrl('templates/searchResults.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			 }).then(function(modal) {
			     $scope.modal = modal;
			     $scope.modal.show();
			 });
	};
	$scope.getOrganization = function (deviceID) {
		console.log("getOrganization");
		Foo.getList(function(data,status){ 
			$scope.list=data.data
			//console.log(data);
			//console.log($scope.list[0].name);
			} );
		
	};
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
