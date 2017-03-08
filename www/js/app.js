var baseServerUrl='http://127.0.0.1:8080';
var creds = {
	token:''
}

var main = angular.module('tundra', ['ionic', 'tundra.controllers', 'tundra.services']);

main.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
  });
});

main.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $httpProvider, $provide) {
	$sceDelegateProvider.resourceUrlWhitelist(['**']);
	
    $httpProvider.interceptors.push(function ($q, $injector/*, $ionicLoading*/) {
    	var canRetry = true;
	    function retry(httpConfig) {
	    	if (canRetry === true) {
		        canRetry = false;
		        var $http = $injector.get('$http');
		        
				$http({ 
					url:baseServerUrl + "/TundraService/login?firstName=&lastName=&email=",
					method:"GET"} 
				).then(
					function(data,status) {
						canRetry = true;
						creds.token=data.data.token;
						return $http(httpConfig);
					},
	        		function(data,status){ 
						console.log(data)
					}
				);
		        
	    	}
	    }

	    return {
    		request: function(request) {
	    		$injector.get("$ionicLoading").show({content: "Loading...", showBackdrop: true, maxWidth: 200, showDelay: 100});
	    		request.headers['X-Token'] = creds.token;
		    	return request || $q.when(request);
	      	},
	      	response: function(response) {
	      		$injector.get("$ionicLoading").hide();
		        return response || $q.when(response);
	      	},
	        responseError: function (response) {
	            if (response.status === 403) {
	                return retry(response.config);
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
