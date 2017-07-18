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
			
			console.log( window.device );
			
			$http({ url:$scope.baseServerUrl + "/TundraService/register?email=" + user.email + 
													"&firstName=" + user.firstName+ "&lastName=" + user.lastName + 
													"&platform=" + creds.platform + "&deviceId=",method:"GET"} )
					.then(function(data,status) {
						console.log("registered");
						window.localStorage.setItem("firstName", user.firstName);
						window.localStorage.setItem("lastName", user.lastName);
						window.localStorage.setItem("email", user.email);

						$state.go('tab.dash');
						},
					    function(data,status){ console.log(data)});
		};
	} else {
		$state.go('tab.dash');
	}
})

.controller('DashCtrl', function($base64,$scope,BLEService,OrganizationService,ItemService,InitialLoginService,$ionicModal,$http) {
	
	// define functions and data elements to be placed in the scope
	$scope.devices = [];
	$scope.itemService = ItemService;
	
 	$scope.startScanning = function () {
 		// reset the array
 		$scope.exibitTags = [];
		BLEService.connect(function(tag) {
			// the callback gets called multiple times so add to the array
			$scope.exibitTags.push(tag);
		});
	};
	
	$scope.getMedia = function (media) {
		ItemService.getItemTag(function(data,status){
			
			if (data.data) {
				$scope.media=data.data;
				$scope.media.url = "data:"+$scope.media.mimeType + ";base64,"+$scope.media.content;
			} else {
				console.log("getResult: no data returned");
				$scope.message = "no data returned"
			}
			
			// get the right template based on mimetype
			var templateUtl = '';
			if (ItemService.isText($scope.media.mimeType)) {
				templateUtl = 'templates/textItem.html'
			} else if (ItemService.isAudio($scope.media.mimeType)) {
				templateUtl = 'templates/audioItem.html'
			} else if (ItemService.isImage($scope.media.mimeType)) {
				templateUtl = 'templates/imageItem.html'
			}else if (ItemService.isVideo($scope.media.mimeType)) {
				templateUtl = 'templates/videoItem.html'
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

	InitialLoginService.initialLoginPromise.then(function(){
		$scope.startScanning();
	});

});
