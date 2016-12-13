angular.module('starter.services', [])


.service("Foo", function($http){
	this.getList=function(callback){
		$http({ url:"http://127.0.0.1:8080/TundraService/org/list" ,method:"GET"} ).then(callback,function(){ console.log("failed")});
	}
	this.getExhibitTag=function(callback,device){
		console.log(device);
		$http({ url:"http://127.0.0.1:8080/TundraService/tag/"+device.name ,method:"GET"} ).then(callback,function(){ console.log("failed")});
	}

	console.log("FOO created");
	//CloudService.request(params).then(function(response){
		// Response from server
	//});
	
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
			if (typeof(ble) != "undefined") {
				ble.scan([], 30, onConnect, onError);
				   //device.name='none';
					//device.id='0';
					//device.rssi='0';
					
					//devices.push(device);
					//devices.push({name:'foo',id:'4',rssi:'4'});
						
					callback(devices);
			} else {
				$http({ url:"http://127.0.0.1:8080/TundraService/tag/list" ,method:"GET"} ).then(function(data,status) {
					
					for (var i = 0; i< data.data.length; i++) {
						devices.push({name:data.data[i].name,id:data.data[i].tag,rssi:i});
					}
					callback(devices);
				},function(){ console.log("failed")});

			} 
		},
		disconnect:function(device) {
			
		}
	}
}
		


)
.factory('Chats', function() {
  
});


