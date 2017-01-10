angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,BLEService,Foo,$ionicModal,$http) {
	$scope.devices = [];
	var isScanning = true;
	$scope.myText =  "Scan";
	$scope.myColor  ='danger';
	document.getElementById("bleStatus").style= "color:green;";
	$scope.startScanning = function () {
		BLEService.connect(function(exibitTags) {
			$scope.exibitTags = exibitTags;
			console.log(exibitTags);
		});
		
		$scope.myText =  "startScanning";
		console.log($scope.myText);
		isScanning = true;		
	};
	
	$scope.getMedia = function (tag) {
		Foo.getExhibitTag(function(data,status){
			if (data.data) {
				$scope.media=data.data
			} else {
				console.log("getResult: no data returned");
				$scope.message = "no data returned"
			}
			},tag 
		);
		
		$ionicModal.fromTemplateUrl('templates/getResults.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			 }).then(function(modal) {
			     $scope.modal = modal;
			     $scope.modal.show();
			 }
		 );
	};
	
	
	$scope.getOrganization = function (deviceID) {
		console.log("getOrganization");
		Foo.getList(function(data,status){ 
			$scope.list=data.data
			} );
		
	};
});
