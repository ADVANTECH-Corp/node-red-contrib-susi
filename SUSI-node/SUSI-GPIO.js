/**
 * Copyright 2014, 2015 ADVANTECH Corp.
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
    function susiGPIO(config) {
		// Create a RED node
		RED.nodes.createNode(this, config);
		
        // Store local copies of the node configuration (as defined in the .html)
        var node = this;
      
        var getValue = 0;

        this.topic = config.topic;
	  
        // Read the data & return a message object
        this.read = function(msgIn) {
			var msg = msgIn ? msgIn : {};
         
			if (typeof msg.pintype !== 'undefined' && msg.pintype !== '')
				config.pintype = msg.pintype;
			if (typeof msg.pin !== 'undefined' && msg.pin !== '')
				config.pin = msg.pin;

			msg.payload  = susiLib.getGPIO(config.pintype, config.pin);
		 
			msg.topic    = node.topic || node.name;

			return msg;
        };

		// respond to inputs....
		this.on('input', function (msg) {
			msg = this.read(msg);
         
			if (msg)
				node.send(msg);
		});

    }

    // Register the node by name.
    RED.nodes.registerType("SUSI-GPIO", susiGPIO);
	
	function susiGPIOControl(config) {
		// Create a RED node
		RED.nodes.createNode(this, config);

		// Store local copies of the node configuration (as defined in the .html)
		var node = this;
		
		var getValue = 0;

		this.topic = config.topic;
		
		// Read the data & return a message object
		this.read = function(msgIn) {
			var msg = msgIn ? msgIn : {};
				
			if (typeof msg.pintype !== 'undefined' && msg.pintype !== '')
				config.pintype = msg.pintype;
			if (typeof msg.pin !== 'undefined' && msg.pin !== '')
				config.pin = msg.pin;
			if (typeof msg.setvalue !== 'undefined' && msg.setvalue !== '')
				config.setvalue = msg.setvalue;
			
			msg.payload  = susiLib.setGPIO(config.pintype, config.pin, config.setvalue);
				 
			msg.topic    = node.topic || node.name;

			return msg;
		};

		  // respond to inputs....
		this.on('input', function (msg) {
			msg = this.read(msg);
			 
			if (msg)
				node.send(msg);
		});

    }

    // Register the node by name.
    RED.nodes.registerType("SUSI-GPIO-Control", susiGPIOControl);
	
	RED.httpAdmin.get("/SUSI-GPIO", function(req,res) {
		var Items = [];
		for (var i=0; i<128; i++) {
			Items.push(susiLib.getGPIO(2, i));
		}
		res.send(Items);
    });
}
