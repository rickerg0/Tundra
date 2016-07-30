angular.module('starter.services', [])

.service("BLEService", function(){
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
		connect:function() {
			//ble.scan([], 30, onConnect, onError);
			   device.name='none';
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
		


)
.factory('Chats', function() {
  
});


