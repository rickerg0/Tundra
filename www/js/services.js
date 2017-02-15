angular.module('starter.services', [])


.service("OrganizationService", function($http){
	this.getList=function(callback){
		$http({ url:"http://127.0.0.1:8080/TundraService/org/list" ,method:"GET"} ).then(callback,function(){ console.log("failed")});
	};
	//CloudService.request(params).then(function(response){
		// Response from server
	//});
	
}).service("ExhibitService", function($http){
	
	this.getExhibitTag=function(callback,tag){
		console.log(tag);
		$http({ url:"http://127.0.0.1:8080/TundraService/tag/media/"+tag.exhibitTagTag ,method:"GET"} ).then(callback,function(){ console.log("failed")});
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
	var device={};			
	var devices=[];
	var that = this;
	var onConnect = function(device) {
	    device.name=device.name;
		device.id=device.id;
		device.rssi=device.rssi;
		devices.push(device);

		return devices;
	 }
	var onError = function() {
	    device.name='none';
		device.id='0';
		device.rssi='0';
		
		return devices;	 
	 }
   
	return {
		connect:function(callback) {
			var devices=[];
			if (typeof(ble) != "undefined") {
				ble.scan([], 30, onConnect, onError);
				var exibitTags=[];
				for (var i = 0; i < devices.length; i++) {
					var d = devices[i];
					console.log(d);
					$http({ url:"http://127.0.0.1:8080/TundraService/tag/"+d.tag ,method:"GET"} ).then(function(data,status) {
						for (var i = 0; i< data.data.length; i++) {
							exibitTags.push({organizationName:data.data[i].organizationName,locationName:data.data[i].locationName,exhibitTagName:data.data[i].exhibitTagName,exhibitTagId:data.data[i].exhibitTagId,exhibitTagTag:data.data[i].exhibitTagTag,exhibitTagMimeType:data.data[i].exhibitTagMimeType});
						}
						callback(exibitTags);
					},function(){ console.log("failed")});
				}
			} else {
				$http({ url:"http://127.0.0.1:8080/TundraService/tag/list" ,method:"GET"} ).then(function(data,status) {
					
					for (var i = 0; i< data.data.length; i++) {
						devices.push({name:data.data[i].name,id:data.data[i].id,tag:data.data[i].tag,rssi:i});
					}

					var exibitTags=[];
					for (var i = 0; i < devices.length; i++) {
						var d = devices[i];
						$http({ url:"http://127.0.0.1:8080/TundraService/tag/"+d.tag ,method:"GET"} ).then(function(data,status) {
							exibitTags.push({organizationName:data.data.organizationName,locationName:data.data.locationName,exhibitTagName:data.data.exhibitTagName,exhibitTagId:data.data.exhibitTagId,exhibitTagTag:data.data.exhibitTagTag,exhibitTagMimeType:data.data.exhibitTagMimeType});
							callback(exibitTags);
						},function(){ console.log("failed")});
					}
				},function(){ console.log("failed")});

			}
			
			
		},
		disconnect:function(device) {
			
		}
	}
}
		


);


