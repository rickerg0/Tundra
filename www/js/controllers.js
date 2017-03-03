angular.module('starter.controllers', ['base64'])

.controller('DashCtrl', function($base64,$scope,BLEService,OrganizationService,ExhibitService,$ionicModal,$http) {
	$scope.devices = [];
	$scope.exhibitService = ExhibitService;
	
 	$scope.startScanning = function () {
		BLEService.connect(function(exibitTags) {
			$scope.exibitTags = exibitTags;
		});
	};
	
	$scope.startScanning();
	
	$scope.getMedia = function (media) {
		ExhibitService.getExhibitTag(function(data,status){
			
			if (data.data) {
				$scope.media=data.data;
				$scope.media.url = "data:"+$scope.media.mimeType + ";base64,"+$scope.media.content;
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
			} else if (ExhibitService.isImage($scope.media.mimeType)) {
				templateUtl = 'templates/imageExhibit.html'
			}else if (ExhibitService.isVideo($scope.media.mimeType)) {
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
		},media);
	};
	

	$scope.toggleTag = function(tag) {
		if ($scope.isTagShown(tag)) {
			$scope.shownTag = null;
		} else {
			$scope.shownTag = tag;
		}
	};
		
	$scope.isTagShown = function(tag) {
		return (typeof tag !== "undefined" && $scope.shownTag === tag);
	};
		
	$scope.getOrganization = function(deviceID) {
		console.log("getOrganization");
		OrganizationService.getList(function(data, status) {
			$scope.list = data.data
		});
	};
});
