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
	
}).service("BLEService", function(){
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
		    device.name='sw372';
			device.id='0';
			device.rssi='0';
			
			
			
			return devices;	 
	 }
   
	return {
		connect:function() {
			//ble.scan([], 30, onConnect, onError);
			   device.name='sw372';
				device.id='0';
				device.rssi='0';
				
				devices.push(device);
				devices.push({name:'foo',id:'4',rssi:'4'});
					
				return devices;
		},
		disconnect:function(device) {
			
		}
	}
}
		


).factory('Chats', function() {
  
});


