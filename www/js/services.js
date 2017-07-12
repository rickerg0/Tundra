angular.module('tundra.services', [])


.service("InitialLoginService", function($http){
	
	var _login=function() {
		// return the promise as we'll need that to delay the initial scan 
		return $http({ url:baseServerUrl + "/TundraService/login?email=" + creds.email ,method:"GET"} ).then(function(data,status) {
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

				// we have bluetooth, flip the button 
	    		document.getElementById("bleStatus").style= "color:green;";
	    		
				ble.scan([], 30, function(device) {
					alert(JSON.stringify(device));
					// we found a device, now lets see if it's ours
					$http({
						method:"GET",
						url:baseServerUrl + "/TundraService/tag/"+device.id ,
						}).then(function(data,status) {
							// call callback with single record
							callback(data.data);
						},function(data,status){ console.log(data)});
				}, function() {
					alert("FAILURE");
					console.log("FAILURE")
				});
				
			} else {
				//no bluetooth
				document.getElementById("bleStatus").style= "color:red;";
				
				$http({ 
					url:baseServerUrl + "/TundraService/tag/list" ,
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


