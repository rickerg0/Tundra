var main = angular.module('tundra', ['ionic', 'tundra.controllers', 'tundra.services']);

main.run(function($ionicPlatform,$rootScope,Logger) {
  // base server URLs
  $rootScope.baseServerUrl='http://127.0.0.1:8080';
  //$rootScope.baseServerUrl='http://ec2-54-85-236-85.compute-1.amazonaws.com:8080';

  // captions, these are the labels that will change
  // from implementation to implementation
  $rootScope.itemCaption = "Exhibit";
  $rootScope.itemCaptionPlural = "Exhibits";
  $rootScope.appName = "App That Knows Where Stuff Is!";
  $rootScope.refreshInterval = 10000;
  
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
		  Logger.log(device.cordova);
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
    
    $rootScope.setRefreshState = function(state) {
    	Logger.log(state);
    	// remember that the db value is a string so convert to a boolean
    	state = (state === undefined ? true : state == 'true');
    	Logger.log(state);
    	window.localStorage.setItem("shouldRefresh", state);
    	$rootScope.shouldRefresh = state;
    	Logger.log("shouldRefresh: " + $rootScope.shouldRefresh);
    };
    
    // get the state of the refresh flag
    $rootScope.setRefreshState(window.localStorage.getItem("shouldRefresh"));
    
  });
});

main.service('Logger', function() {
	
	// log levels
	this.ERROR = 1;
	this.INFO = 2;
	this.DEBUG = 3;
	this.level = this.DEBUG;
	
	this.log = function(message) {
		// same as debug
		if (this.level >= this.DEBUG) {
			console.log(message);
		}
	};
	
	this.error = function(message) {
		if (this.level >= this.ERROR) {
			console.log(message);
		}
	};
	
	this.info = function(message) {
		if (this.level >= this.INFO) {
			console.log(message);
		}
	}

	this.debug = function(message) {
		if (this.level >= this.DEBUG) {
			console.log(message);
		}
	}
	
});


main.service('httpInterceptor', function($rootScope, $q, $injector, Logger) {  

	var interceptor = this;
	
	interceptor.retry = function(httpConfig, deferred) {
    	Logger.log("Retry request...");
        var $http = $injector.get('$http');
        
		$http({ 
			url:$rootScope.baseServerUrl + "/TundraService/login?email=" + $rootScope.creds.email,
			method:"GET"} 
		).then(
			function(data,status) {
				Logger.log("Processing retry...");
				// get the new token
				$rootScope.creds.token=data.data.token;
				// make sure to set it on the header
				httpConfig.headers['X-Token'] = $rootScope.creds.token;
				// retry the original request
				$http(httpConfig).then(function (response) {
					deferred.resolve(response);
					canRetry = true;
				}, function (response) {
					deferred.reject(response);
					canRetry = true;
				});
			},
    		function(data,status){ 
				Logger.log(data)
			}
		);
    }

    interceptor.request = function(config) {
    	Logger.log("Loading...");
		$injector.get("$ionicLoading").show({content: "Loading...", showBackdrop: true, showDelay: 100});
		config.headers['X-Token'] = $rootScope.creds.token;
    	return config || $q.when(config);
  	};
  	
  	interceptor.response = function(response) {
  		Logger.log("Processing response...");
  		$injector.get("$ionicLoading").hide();
        return response || $q.when(response);
  	};
  	
  	interceptor.responseError = function (response) {
  		Logger.log("Response error..." + response.config.url);
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
    controller: 'DashCtrl',
    templateUrl: 'templates/menu.html'
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
  
  if (window.localStorage.getItem("email") && 0 < window.localStorage.getItem("email").length) {
	  console.log("have email");
	  $urlRouterProvider.otherwise('/tab/dash');
  } else {
	  console.log("don't have email");
	  $urlRouterProvider.otherwise('/signup');
  }

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/signup');

});
