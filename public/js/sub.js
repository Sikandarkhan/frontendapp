let client;
let topic;

$(document).ready(function () {

    $.get('https://developer.rudralabs.com/getEndPoint', (response, status) => {
            // console.log('response', response)
            let endpoint = response.endPoint;
            topic = response.topic

            let clientId = Math.random().toString(36).substring(7);

            client = new Paho.MQTT.Client(endpoint, clientId);

            let connectOptions = {
                useSSL: true,
                timeout: 20,
                mqttVersion: 4,
                onSuccess: subscribe
            };

            let clientResponse = client.connect(connectOptions);

            client.onConnectionLost = function (e) {
                console.log(e)
            };

            function subscribe() {
                client.subscribe(topic);
                console.log("subscribed");
            }

        })

    // var response = client.connect(connectOptions);
    //console.log("helloo",client);

});