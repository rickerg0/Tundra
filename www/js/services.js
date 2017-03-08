angular.module('tundra.services', [])


.service("InitialLoginService", function($http){
	
	var _login=function() {
		// return the promise as we'll need that to delay the initial scan 
		return $http({ url:baseServerUrl + "/TundraService/login?firstName=&lastName=&email=" ,method:"GET"} ).then(function(data,status) {
			creds.token=data.data.token;
		},function(data,status){ console.log(data)});
	};
	
	// catch the promise from the initial login
	var promise = _login();
	
	// return the initial promise along with the functions so 
	// the controller creation can key off of that
	return {
		initialLoginPromise: promise
	}
	
})
.service("OrganizationService", function($http){
	this.getList=function(callback){
		$http({ 
			url:baseServerUrl + "/TundraService/org/list" ,
			method:"GET"}).then(callback,function(){ console.log(data)});
	};
	 
}).service("ExhibitService", function($http){
	
	this.getExhibitTag=function(callback,media){
		console.log(media);
		$http({ 
			url:baseServerUrl + "/TundraService/tag/media/"+media.exhibitTagMediaId ,
			method:"GET"} ).then(callback,function(data,status){ console.log(data)});
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
	
}).service("BLEService", function($http){

	return {
		connect:function(callback) {
			if (typeof(ble) != "undefined") {
				var devices=[];
				// we have bluetooth, flip the button 
	    		document.getElementById("bleStatus").style= "color:green;";
	    		
				ble.scan([], 30, function(device) {
					devices.push(device);
					return devices;
				}, function() {
					return devices;	 
				});
				
				var deviceSummaries = [];
				for (var i = 0; i < devices.length; i++) {
					console.log(devices[i]);
					
					$http({
						method:"GET",
						url:baseServerUrl + "/TundraService/tag/"+devices[i].id ,
						}).then(function(data,status) {
						deviceSummaries.push(data.data);
					},function(data,status){ console.log(data)});
				}
				// now that we have the entire list, call the callback
				callback(data.data);
			} else {
				//no bluetooth
				document.getElementById("bleStatus").style= "color:red;";
				
				$http({ 
					url:baseServerUrl + "/TundraService/tag/list" ,
					method:"GET"} ).then(function(data,status) {
					callback(data.data)					
				},function(data,status){ console.log(data)});

			}
		},
		disconnect:function(device) {}
	}
});


