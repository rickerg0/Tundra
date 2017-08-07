angular.module('tundra.controllers', ['base64'])

.controller('SignUpCtrl', function($scope, $rootScope, $state, $http, Logger) {
    // one time registration screen
	// is this a registered device?
	if (!$rootScope.creds.email || 0 === $rootScope.creds.email.length) {
		$scope.signUp = function(user) {

			//Logger.log($cordovaDevice.getUUID());
			
			$rootScope.creds.firstName = user.firstName;
			$rootScope.creds.lastName = user.lastName;
			$rootScope.creds.email = user.email;
			
			Logger.log( window.device );
			
			$http({ url:$scope.baseServerUrl + "/TundraService/register?email=" + user.email + 
													"&firstName=" + user.firstName+ "&lastName=" + user.lastName + 
													"&platform=" + $rootScope.creds.platform + "&deviceId=",method:"GET"} )
					.then(function(data,status) {
						Logger.log("registered");
						window.localStorage.setItem("firstName", user.firstName);
						window.localStorage.setItem("lastName", user.lastName);
						window.localStorage.setItem("email", user.email);

						$state.go('tab.dash');
						},
					    function(data,status){ Logger.log(data)});
		};
	} else {
		$state.go('tab.dash');
	}
})

.controller('DashCtrl', function($base64,$scope,BLEService,OrganizationService,ItemService,InitialLoginService,$ionicModal,$http,$timeout,Logger) {
	
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
	
 	$scope.doRefresh = function () {
 		$scope.startScanning();
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$apply();		
	};
	
 	$scope.refreshControl = {
 		selected: $scope.shouldRefresh,
 	    change: function ($event) {
 	    	Logger.debug("Event state: " + $event);
 	 		$scope.setRefreshState($event);
 	    }
 	};

 	Logger.debug("Refresh state: " + $scope.refreshControl.selected);
 	
	$scope.getMedia = function (media) {
		ItemService.getItemTag(function(data,status){
			
			if (data.data) {
				$scope.media=data.data;
				$scope.media.url = "data:"+$scope.media.mimeType + ";base64,"+$scope.media.content;
			} else {
				Logger.log("getResult: no data returned");
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
		Logger.log("getOrganization");
		OrganizationService.getList(function(data, status) {
			$scope.list = data.data
		});
	};

	InitialLoginService.initialLoginPromise.then(function() {
		
	    var poll = function() {
	    	console.log($scope.shouldRefresh);
	    	if ($scope.shouldRefresh) {
				$scope.startScanning();
	    	}
	        $timeout(poll, $scope.refreshInterval);
	    }
	    $scope.startScanning();
        $timeout(poll, $scope.refreshInterval);
	});

});
