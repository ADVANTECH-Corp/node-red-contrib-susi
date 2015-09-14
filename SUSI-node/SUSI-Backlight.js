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
var susiLib = require("node-susi");


module.exports = function(RED) {
   "use strict";

    // The main node definition - most things happen in here
    function susiBKL(config) {
		// Create a RED node
		RED.nodes.createNode(this, config);

		// Store local copies of the node configuration (as defined in the .html)
		var node = this;
      
		var getValue = 0;

		this.topic = config.topic;
 

		// Read the data & return a message object
		this.read = function(msgIn) {
			var msg = msgIn ? msgIn : {};

			if (typeof msg.functiontype !== 'undefined' && msg.functiontype !== '')
				config.functiontype = msg.functiontype;
			if (typeof msg.index !== 'undefined' && msg.index !== '')
				config.index = msg.index;
			
			msg.payload = susiLib.getVgaBacklight(config.functiontype, config.index);
		
			msg.topic    = node.topic || node.name;

			return msg;
		};

		// respond to inputs....
		this.on('input', function (msg) {
			msg = this.read(msg);
         
			if (msg)
				node.send(msg);
		});

	//   var msg = this.read();

	//   // send out the message to the rest of the workspace.
	//   if (msg)
	//      this.send(msg);
	}

	// Register the node by name.
	RED.nodes.registerType("SUSI-Backlight", susiBKL);
	
	// The main node definition - most things happen in here
    function susiBKLControl(config) {
		// Create a RED node
		RED.nodes.createNode(this, config);

		// Store local copies of the node configuration (as defined in the .html)
		var node = this;
      
		var getValue = 0;

		this.topic = config.topic;
 

		// Read the data & return a message object
		this.read = function(msgIn) {
			var msg = msgIn ? msgIn : {};

			if (typeof msg.functiontype !== 'undefined' && msg.functiontype !== '')
				config.functiontype = msg.functiontype;
			if (typeof msg.index !== 'undefined' && msg.index !== '')
				config.index = msg.index;
			if (typeof msg.setvalue !== 'undefined' && msg.setvalue !== '')
				config.setvalue = msg.setvalue;
			
			msg.payload = susiLib.setVgaBacklight(config.functiontype, config.index, config.setvalue);
		
			msg.topic    = node.topic || node.name;

			return msg;
		};

		// respond to inputs....
		this.on('input', function (msg) {
			msg = this.read(msg);
         
			if (msg)
				node.send(msg);
		});

    //   var msg = this.read();

    //   // send out the message to the rest of the workspace.
    //   if (msg)
    //      this.send(msg);
    }

    // Register the node by name.
    RED.nodes.registerType("SUSI-Backlight-Control", susiBKLControl);
	
	RED.httpAdmin.get("/SUSI-Backlight", function(req,res) {
		var Items = [3];
		for (var i=0; i<3; i++) {
			Items[i] = [];
		}
		for (var i=0; i<3; i++) {
			for (var j=0; j<4; j++) {
			Items[i].push(susiLib.getVgaBacklight(i, j));
			}
		}
		res.send(Items);
    });
}
