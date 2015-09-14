/**
 * Copyright 2015 Brendan Murray
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// Dependency - dht sensor package
var zmq = require('zmq');
var socketpub = zmq.socket('pub');
var socketrep = zmq.socket('rep');

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

module.exports = function(RED) {
   "use strict";
   
	process.setMaxListeners(0);
	
	socketpub.bind('tcp://127.0.0.1:22220', function(err) {
	if (err) throw err;
	console.log('socketpub bound!');
	});
	
	socketrep.bind('tcp://127.0.0.1:22222', function(err) {
	if (err) throw err;
	console.log('socketrep bound!');
	});
	
	
	// The main node definition - most things happen in here
	function ZMQ(config) {
		// Create a RED node
		RED.nodes.createNode(this, config);

		// Store local copies of the node configuration (as defined in the .html)
		var node = this;
		
		this.topic = config.topic;
		
		socketrep.on('message', function(data, msg) {
			//console.log('ZMQ server received: ' + data.toString());
			socketrep.send('Success.');
			var msg = {};
			msg.payload = data.toString();
			if(msg)
				node.send(msg);
			sleep(10)
			});

		// Read the data & return a message object
		this.read = function(msgIn) {
			var msg = msgIn ? msgIn : {};
			
			//console.log('ZMQ server send: ' + msg.payload);
			socketpub.send(msg.payload);
			
		};

		// respond to inputs....
		this.on('input', function (msg) {
			this.read(msg);
		});

	}

	// Register the node by name.
	RED.nodes.registerType("ZMQ", ZMQ);
}
