var main = angular.module('tundra', ['ionic', 'tundra.controllers', 'tundra.services']);

main.run(function($ionicPlatform,$rootScope) {
  // base server URLs
  $rootScope.baseServerUrl='http://127.0.0.1:8080';
  //$rootScope.baseServerUrl='http://ec2-54-85-236-85.compute-1.amazonaws.com:8080';

  // captions, these are the labels that will change
  // from implementation to implementation
  $rootScope.itemCaption = "Exhibit";
  $rootScope.itemCaptionPlural = "Exhibits";
  $rootScope.appName = "My Tour Guide";
  
  // creds
  $rootScope.creds = {
    token:'',
    platform: '',
    firstName:'',
    lastName:'',
    email:''
  }

  $ionicPlatform.ready(function() {
	  // Use this to clear registered device..
	  //window.localStorage.clear();			

	  document.addEventListener("deviceready", onDeviceReady, false);
	  function onDeviceReady() {
	      console.log(device.cordova);
	  }
	  
	  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }
    
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }
    
    $rootScope.creds.platform = ionic.Platform.platform();
    //window.localStorage.clear();
    
    $rootScope.creds.firstName = window.localStorage.getItem("firstName");
    $rootScope.creds.lastName = window.localStorage.getItem("lastName");
    $rootScope.creds.email = window.localStorage.getItem("email");
    if ((typeof(window.device) != "undefined")) {
    	/*
    	 * device.cordova
    	 * device.model
    	 * device.platform
    	 * device.uuid
    	 * device.version
    	 * device.manufacturer
    	 * device.isVirtual
    	 * device.serial
    	 */
    	$rootScope.creds.uuid = device.uuid;
    }
    
    //console.log(window.device);
  });
});

main.service('httpInterceptor', function($rootScope, $q, $injector) {  

	var canRetry = true;
	var interceptor = this;
	
	interceptor.retry = function(httpConfig, deferred) {
    	if (canRetry === true) {
	        canRetry = false;
	        var $http = $injector.get('$http');
	        
			$http({ 
				url:$rootScope.baseServerUrl + "/TundraService/login?email=" + $rootScope.creds.email,
				method:"GET"} 
			).then(
				function(data,status) {
					canRetry = true;
					// get the new token
					$rootScope.creds.token=data.data.token;
					// make sure to set it on the header
					httpConfig.headers['X-Token'] = $rootScope.creds.token;
					// retry the original request
					$http(httpConfig).then(function (response) {
						deferred.resolve(response);
					}, function (response) {
						deferred.reject(response);
					});
				},
        		function(data,status){ 
					console.log(data)
				}
			);
    	}
    }

    interceptor.request = function(config) {
		$injector.get("$ionicLoading").show({content: "Loading...", showBackdrop: true, showDelay: 100});
		config.headers['X-Token'] = $rootScope.creds.token;
    	return config || $q.when(config);
  	};
  	
  	interceptor.response = function(response) {
  		$injector.get("$ionicLoading").hide();
        return response || $q.when(response);
  	};
  	
  	interceptor.responseError = function (response) {
        if (response.status === 403) {
        	var deferred = $q.defer();
        	interceptor.retry(response.config, deferred);
            return deferred.promise;
        }
        return $q.reject(response);
    };
            
});

main.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, $provide) {
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
  $httpProvider.interceptors.push("httpInterceptor");
	
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider.state('tab', {
    url: '/tab',
    abstract: true, // setup an abstract state for the tabs directive
    templateUrl: 'templates/tabs.html'
 })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signUp.html',
      controller: 'SignUpCtrl'
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signup');

});
