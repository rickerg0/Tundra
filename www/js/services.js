angular.module('starter.services', [])


.service("LoginService", function($http){
	var token='';
	
	this.login=function() {
		$http({ url:baseServerUrl + "/TundraService/login?firstName=&lastName=&email=" ,method:"GET"} ).then(function(data,status) {
			token=data.data.token;
		},function(data,status){ console.log("failed")});
	};
	
	this.login();
	
	this.getToken=function() {
		return token;
	}
	
}).service("OrganizationService", function($http,LoginService){
	this.getList=function(callback){
		$http({ 
			url:baseServerUrl + "/TundraService/org/list" ,
			headers: {'X-Token':LoginService.getToken()},
			method:"GET"}).then(callback,function(){ console.log(data)});
	};
	 
}).service("ExhibitService", function($http,LoginService){
	
	this.getExhibitTag=function(callback,media){
		console.log(media);
		$http({ 
			url:baseServerUrl + "/TundraService/tag/media/"+media.exhibitTagMediaId ,
			headers: {'X-Token':LoginService.getToken()},
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
	
}).service("BLEService", function($http,LoginService){

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
						headers: {'X-Token':LoginService.getToken()},
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
					headers: {'X-Token':LoginService.getToken()},
					method:"GET"} ).then(function(data,status) {
					callback(data.data)					
				},function(data,status){ console.log(data)});

			}
		},
		disconnect:function(device) {}
	}
});


