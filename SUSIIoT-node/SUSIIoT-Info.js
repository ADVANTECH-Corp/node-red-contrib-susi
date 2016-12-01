/**
 * Copyright 2015 Copyright 2014, 2015 ADVANTECH Corp.
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
var susiIoTLib = require("node-susiiot");


module.exports = function(RED) {
   "use strict";

   // The main node definition - most things happen in here
   function susiIoTInfo(config) {
        // Create a RED node
        RED.nodes.createNode(this, config);

        // Store local copies of the node configuration (as defined in the .html)
        var node = this;


        this.topic = config.topic;

        // Read the data & return a message object
        this.read = function(msgIn) {
            var msg = msgIn ? msgIn : {};

            var getValue = 0;

            var jsonSUSIIoT = JSON.parse(susiIoTLib.getCapability());

            if (config.feature == 'All')
            {
                getValue = jsonSUSIIoT;
            }
            else
            {
                if(config.featuretype == null || config.featuretype == "" || config.featuretype == "All")
                    getValue = jsonSUSIIoT[config.feature];
                else
                    getValue = jsonSUSIIoT[config.feature][config.featuretype];
            }

            msg.payload = JSON.stringify(getValue);

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
    RED.nodes.registerType("SUSIIoT-Info", susiIoTInfo);

    RED.httpAdmin.get("/SUSIIoT", function(req,res) {
        var keys = [];
        var items = {};
        var jsonSUSIIoT = JSON.parse(susiIoTLib.getData(0));
        var i = 0;

        for(var key in jsonSUSIIoT){
            if(!~keys.indexOf(key)) {  // a new key
                keys.push(key);
                items[key] = [];
            }

            for(var sub_key in jsonSUSIIoT[key]){
                if(sub_key != "e" && sub_key != "bn" && sub_key != "bt" &&
                   sub_key != "bu" && sub_key != "ver" && sub_key != "id") {
                    items[key].push(sub_key)
                }
            }

            items[key].sort();
        }
        
        res.send({
            "features": keys.sort()
            , "types": items
        });
    });
}
