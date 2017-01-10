angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,BLEService,OrganizationService,ExhibitService,$ionicModal,$http) {
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
		ExhibitService.getExhibitTag(function(data,status){
			
			if (data.data) {
				$scope.media=data.data
			} else {
				console.log("getResult: no data returned");
				$scope.message = "no data returned"
			}
			
			// get the right template based on mimetype
			var templateUtl = '';
			if (ExhibitService.isText($scope.media.mimeType)) {
				templateUtl = 'templates/textExhibit.html'
			} else if (ExhibitService.isAudio($scope.media.mimeType)) {
				templateUtl = 'templates/audioExhibit.html'
			} else if (ExhibitService.isVideo($scope.media.mimeType)) {
				templateUtl = 'templates/videoExhibit.html'
			}
			
			$ionicModal.fromTemplateUrl(templateUtl, {
				  scope: $scope,
				  animation: 'slide-in-up'
				 }).then(function(modal) {
				     $scope.modal = modal;
				     $scope.modal.show();
				 }
			 );
		},tag);
	};
	
	
	$scope.getOrganization = function (deviceID) {
		console.log("getOrganization");
		OrganizationService.getList(function(data,status){ 
			$scope.list=data.data
			} );
		
	};
});
