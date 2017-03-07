angular.module('starter.services', [])


.service("OrganizationService", function($http){
	this.getList=function(callback){
		$http({ url:baseServerUrl + "/TundraService/org/list" ,method:"GET"} ).then(callback,function(){ console.log("failed")});
	};
	//CloudService.request(params).then(function(response){
		// Response from server
	//});
	
}).service("ExhibitService", function($http){
	
	this.getExhibitTag=function(callback,media){
		console.log(media);
		$http({ url:baseServerUrl + "/TundraService/tag/media/"+media.exhibitTagMediaId ,method:"GET"} ).then(callback,function(){ console.log("failed")});
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
					$http({ url:baseServerUrl + "/TundraService/tag/"+devices[i].id ,method:"GET"} ).then(function(data,status) {
						deviceSummaries.push(data.data);
					},function(){ console.log("failed")});
				}
				// now that we have the entire list, call the callback
				callback(data.data);
			} else {
				//no bluetooth
				document.getElementById("bleStatus").style= "color:red;";
				
				$http({ url:baseServerUrl + "/TundraService/tag/list" ,method:"GET"} ).then(function(data,status) {
					callback(data.data)					
				},function(){ console.log("failed")});

			}
		},
		disconnect:function(device) {}
	}
});


