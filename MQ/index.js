const express = require("express");
const app = express();

const db = require("./queue");

// xml2js config
const xml2js = require("xml2js");
const xmlBuilder = new xml2js.Builder();

// express config
app.use(express.json());

app.get("/subscribe/:subscriberId", (req, res) => {
    const subscriberId = req.params.subscriberId;
    let messages = []; 
    
    // Check if format query parameter is set, else set it to json
    const format = req.query.format ?? "json";

    // Try to subscribe to the subscriber id
    try {
        messages = db.subscribe(subscriberId);
    } catch (error) {
        res.status(500).json({error: "something broke internally!"})
    }

    if (messages.length > 0) {
        switch (format.toLocaleLowerCase()) {
            case "json":
                res.json(messages);
                break;
            case "xml":
                res.set("Content-type", "text/xml");
                
                for (let i = 0; i < messages.length; i++) {
                    messages[i] = { messageObj: messages[i] };
                }
    
                res.send(xmlBuilder.buildObject({ messages }));
                break;
            default:
                res.status(404).json({error: "format type is not supported!"});
                break;
        }
    }
    else {
        res.status(204).json({message: "no new messages was found!"});
    }
});

app.post("/publish", (req, res) => {

    const { publisherId, subscriberId, message } = req.body;

    if (!publisherId || !subscriberId || !message) {
        res.status(400).json({error: "your json body was not correct!"});
    }
    else {
        try {
            db.publish(publisherId, subscriberId, message);
            res.json({message: "your message was successfully published!"});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "something broke internally!"});
        }
    }
});

// Start server
app.listen(8080, err => {
    if (err) {
        console.log("Server cannot listen...");
        return;
    }
    console.log("Server listening on port", 8080);
});