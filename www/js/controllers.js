angular.module('tundra.controllers', ['base64'])

.controller('SignUpCtrl', function($scope, $state,$http) {
    // one time registration screen
	// is this a registered device?
	if (!creds.email || 0 === creds.email.length) {
		$scope.signUp = function(user) {

			//console.log($cordovaDevice.getUUID());
			
			creds.firstName = user.firstName;
			creds.lastName = user.lastName;
			creds.email = user.email;
		    
			window.localStorage.setItem("firstName", user.firstName);
			window.localStorage.setItem("lastName", user.lastName);
			window.localStorage.setItem("email", user.email);
			console.log( window.device );
			
			$http({ url:baseServerUrl + "/TundraService/register?email=" + user.email + 
													"&firstName=" + user.firstName+ "&lastName=" + user.lastName + 
													"&platform=" + creds.platform + "&deviceId=",method:"GET"} )
					.then(function(data,status) {
						console.log("registered");
						$state.go('tab.dash');
						},
					    function(data,status){ console.log(data)});
		};
	} else {
		$state.go('tab.dash');
	}
})

.controller('DashCtrl', function($base64,$scope,BLEService,OrganizationService,ExhibitService,InitialLoginService,$ionicModal,$http) {
	$scope.devices = [];
	$scope.exhibitService = ExhibitService;
	
 	$scope.startScanning = function () {
		BLEService.connect(function(exibitTags) {
			$scope.exibitTags = exibitTags;
		});
	};
	
	InitialLoginService.initialLoginPromise.then(function(){
		$scope.startScanning();
	});
	
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
