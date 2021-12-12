const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");
const uuid = require("uuid");

let db = new JsonDB(new Config("db.json", true, true, "/"));

// Publish new message to queue.
function publish(publisherId, subscriberId, message) {
    const id = uuid.v4();
    db.push("/messages[]", 
    {id: id, publisherId: publisherId, createdAt: new Date().toISOString(), subscriberId: subscriberId, message: message}, 
    true);
}

// Find and return all available messages from queue.
function subscribe(subscriberId) {
    const messages = db.getData("/messages").filter(m => m.subscriberId == subscriberId);
    
    messages.forEach(message => {
        db.delete("/messages[" + db.getIndex("/messages", message.id) + "]");
    });

    return messages;
}

module.exports = {
    publish: publish,
    subscribe: subscribe
}