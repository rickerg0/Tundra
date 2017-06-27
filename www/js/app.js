var baseServerUrl='http://127.0.0.1:8080';
var creds = {
	token:'',
	platform: '',
	firstName:'',
	lastName:'',
	email:''
}

var main = angular.module('tundra', ['ionic', 'tundra.controllers', 'tundra.services']);

main.run(function($ionicPlatform) {
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
    
    creds.platform = ionic.Platform.platform();
    //window.localStorage.clear();
    
    creds.firstName = window.localStorage.getItem("firstName");
    creds.lastName = window.localStorage.getItem("lastName");
    creds.email = window.localStorage.getItem("email");
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
    	creds.uuid = device.uuid;
    }
    
    console.log(creds);
    //console.log(window.device);
  });
});

main.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, $provide) {
	$sceDelegateProvider.resourceUrlWhitelist(['**']);
	
    $httpProvider.interceptors.push(function ($q, $injector) {
    	
    	var canRetry = true;
    	
	    function retry(httpConfig, deferred) {
	    	if (canRetry === true) {
		        canRetry = false;
		        var $http = $injector.get('$http');
		        
				$http({ 
					url:baseServerUrl + "/TundraService/login?email=" + creds.email,
					method:"GET"} 
				).then(
					function(data,status) {
						canRetry = true;
						// get the new token
						creds.token=data.data.token;
						// make sure to set it on the header
						httpConfig.headers['X-Token'] = creds.token;
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

	    return {
    		request: function(config) {
	    		$injector.get("$ionicLoading").show({content: "Loading...", showBackdrop: true, showDelay: 100});
	    		config.headers['X-Token'] = creds.token;
		    	return config || $q.when(config);
	      	},
	      	response: function(response) {
	      		$injector.get("$ionicLoading").hide();
		        return response || $q.when(response);
	      	},
	        responseError: function (response) {
	            if (response.status === 403) {
	            	var deferred = $q.defer();
	                retry(response.config, deferred);
	                return deferred.promise;
	            }
	            return $q.reject(response);
	        }
	        
	    };
	});  	
	
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
