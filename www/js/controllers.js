angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,BLEService,Foo,$ionicModal) {
	$scope.devices = [];
	var isScanning = true;
	$scope.myText =  "Scan";
	$scope.myColor  ='danger';
	document.getElementById("bleStatus").style= "color:green;";
	$scope.startScanning = function () {
		BLEService.connect(function(devices) {
			$scope.devices = devices;	
		});
		
		
		$scope.myText =  "startScanning";
		
		console.log($scope.myText);
		
		$scope.myText =  "Scan again";
		
		isScanning = true;		
		};
	$scope.getResult = function (device) {
		//$scope.device = device;
		Foo.getExhibitTag(function(data,status){
			console.log(data.data);
			if (data.data && data.data.length > 0) {
				$scope.media=data.data
			} else {
				console.log("getResult: no data returned");
				$scope.message = "no data returned"
			}
			},device );
		
		$ionicModal.fromTemplateUrl('templates/getResults.html', {
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
});
