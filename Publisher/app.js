const http = require("http");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

const publisherId = "publisher_01_west";

// start 
getInput();

function getInput() {
    // ask user the necessary questions
    readline.question("What is the message you want to publish?\n", function(message) {
        readline.question("And who is this message for?\n", function(subscriberId) {
            //publish the message
            publish(message, subscriberId);
        });
    });
}

// publishes the message to the message queue server
function publish(message, subscriberId) {

    const data = new TextEncoder().encode(
        JSON.stringify({ 
            publisherId: publisherId, 
            subscriberId: subscriberId, 
            message: message 
        }));

    const options = {
        hostname: "localhost",
        port: 8080,
        path: "/publish",
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Content-length": data.length
        }
    };

    const request = http.request(options, function(res) {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
            readline.question("Do you want to publish a new message? [y] for yes\n", function(answer) {

                if (answer.toLowerCase() === "y") {
                    getInput();
                }
                else {
                    console.log("bye!");
                    readline.close();
                }
            });
        }
    }).on("error", function(e) {
        console.log("Error: Could not publish message, check that MQ server is running!");
        readline.close();
    });

    request.write(data);
}
