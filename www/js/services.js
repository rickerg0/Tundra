angular.module('tundra.services', [])


.service("InitialLoginService", function($http, $rootScope, Logger){
	this.Logger = Logger;
	var _login=function() {
		// return the promise as we'll need that to delay the initial scan 
		return $http({ url:$rootScope.baseServerUrl + "/TundraService/login?email=" + $rootScope.creds.email ,method:"GET"} ).then(function(data,status) {
			$rootScope.creds.token=data.data.token;
		},function(data,status){ Logger.log(data)});
	};
	
	// catch the promise from the initial login
	var promise = _login();
	
	// return the initial promise along with the functions so 
	// the controller creation can key off of that
	return {
		initialLoginPromise: promise
	}
	
})
.service("OrganizationService", function($http, $rootScope){
	this.getList=function(callback){
		$http({ 
			url:$rootScope.baseServerUrl + "/TundraService/org/list" ,
			method:"GET"}).then(callback,function(){ Logger.log(data)});
	};
	 
}).service("ItemService", function($http, $rootScope){
	
	this.getItemTag=function(callback,media){
		Logger.log(media);
		$http({ 
			url:$rootScope.baseServerUrl + "/TundraService/tag/media/"+media.itemTagMediaId ,
			method:"GET"} ).then(callback,function(data,status){ Logger.log(data)});
	};

	this.isText=function(mimetype) {
		return mimetype === 'text/plain';
	};
	
	this.isAudio=function(mimetype) {
		return mimetype === 'audio/mp3';
	};
	this.isImage=function(mimetype) {
		return mimetype === 'image/jpg';
	};
	this.isVideo=function(mimetype) {
		return mimetype === 'video/mp4';
	};
	
}).service("BLEService", function($http, $rootScope){

	return {
		connect:function(callback) {
			if (typeof(ble) != "undefined") {

				// we have bluetooth, flip the button 
	    		document.getElementById("bleStatus").style= "color:green;";
	    		
				ble.scan([], 30, function(device) {
					alert(JSON.stringify(device));
					// we found a device, now lets see if it's ours
					$http({
						method:"GET",
						url:$rootScope.baseServerUrl + "/TundraService/tag/"+device.id ,
						}).then(function(data,status) {
							// call callback with single record
							callback(data.data);
						},function(data,status){ Logger.log(data)});
				}, function() {
					alert("FAILURE");
					Logger.log("FAILURE")
				});
				
			} else {
				//no bluetooth
				document.getElementById("bleStatus").style= "color:red;";
				
				$http({ 
					url:$rootScope.baseServerUrl + "/TundraService/tag/list" ,
					method:"GET"} ).then(function(data,status) {
						if (data.data) {
							// loop thru array and call callback with single record
							for (var i = 0; i < data.data.length; i++) {
								callback(data.data[i])					
							}							
						}
				},function(data,status){ console.log(data)});

			}
		},
		disconnect:function(device) {}
	}
});


