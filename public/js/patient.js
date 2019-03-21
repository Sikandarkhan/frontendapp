$(document).ready(function () {
    function onMessage(message) {
        var pub = message.payloadString.toString().replace(/\u0000/g, '');
        // console.log("pub", pub)
        /*
        We get the following string
        {"status":"success","data":{"patientid":"gXEYzqkqvXwXxENXUdKsoglf","flag":1,"lastseen":"2019-03-20 05:34 pm","count":2}}
        */
        let response = JSON.parse(pub);
        let patientData = response.data;
        let patientId = patientData.patientid;
        let patientLastSeen = new Date(patientData.lastseen);

        let flag = patientData.flag;
        // console.log("flag & id", flag, patientId, patientLastSeen);

        if (flag) {
            updateStateOfThePatient(patientId, 'lightseagreen', '#000', flag)
            setPatientTimer(patientId, patientLastSeen, flag);
        }

    }
    /*
    When we get the notification FLAG - 0/1 (PubSub), then we can

        1. reset the timer on the particular patient that matches the device-id, => Done.
        2. increase the move count => Done.
        3. Update the last seen status => Done.

        All this can be done on the frontend without making another request to the backend
    */

    $.when($.get("css/patient.css"))
    const token = window.localStorage.getItem('token')
    // console.log("token", token)

    $.post({
        url: 'https://developer.rudralabs.com/getDevices',
        data: {
            token
        },
        success: addPatientDataOnSuccess,
        error: (jqXHR, textStatus, errorThrown) => {
            swal(res.status, "", "error")
        }
    });

    /*
    Also need to clear the interval when the counter reaches zero => Completed.
    */

    function setPatientTimer(patientId, patientLastSeenDate, PubSubFlag = 0) {

        let timeInMinsToMovePatient = 45;
        let warningTime = 5;
        let days, hours, minutes, seconds, timer;

        let endDate = new Date(patientLastSeenDate);
        timer = window.localStorage.getItem(`timer-${patientId}`)

        if (isNaN(endDate)) {
            return;
        }

        if (PubSubFlag) { //the flag is true set increment the count and update the last seen, and also switch color code to green
            let patientCounter = $(`#${patientId}-counter`);
            patientCounter.text(parseInt(patientCounter.text()) + 1);

            let newEndDate = (endDate.toLocaleDateString() == new Date().toLocaleDateString()) ?
                endDate.toLocaleTimeString() :
                endDate.toLocaleString()
            $(`#${patientId}-last-seen`).text(newEndDate)
            clearInterval(timer)
            $(`.patient-${patientId}.timer`).html(`Move patient within 
            <label class="minutes">00</label>:
            <label class="seconds">00</label>`);
        }
        timer = setInterval(calculate, 1000); //interval of 1s 
        window.localStorage.setItem(`timer-${patientId}`, timer);


        function calculate() {
            let currentDateTime = new Date().getTime();
            let timeRemaining = parseInt((currentDateTime - endDate) / 1000); //in seconds

            if (timeRemaining >= 0) {
                minutes = timeInMinsToMovePatient - parseInt(timeRemaining / 60);
                timeRemaining = (timeRemaining % 60);
                seconds = 60 - parseInt(timeRemaining);


                if (minutes < 0) {
                    updateStateOfThePatient(patientId, 'red', '#000');
                    $(`.patient-${patientId}.timer`).text('Move patient Immediately!');
                    clearInterval(window.localStorage.getItem(`timer-${patientId}`));
                } else {
                    if (minutes < warningTime) {
                        updateStateOfThePatient(patientId, 'orange', '#000')
                    }
                    $(`.patient-${patientId}.timer .minutes`).text(pad(minutes));
                    $(`.patient-${patientId}.timer .seconds`).text(pad(seconds));

                }
            } else {
                return;
            }

            function pad(val) {
                let valString = val + "";
                if (valString.length < 2) {
                    return "0" + valString;
                } else {
                    return valString;
                }
            }
        }
    }

    /*
        Whenever we get a push notification, we have to reset the patient status, and also change the patient status when timer falls below critical value
    */
    function updateStateOfThePatient(patientId, backgroundColor, textColor, PubSubFlag) {

        $(`.patient-${patientId}.timer`).css({
            color: textColor,
            fontWeight: 'bold'
        })

        $(`a[href="#${patientId}"]`).css({
            background: backgroundColor
        });
        $(`#${patientId} .content`).css({
            color: textColor,
            background: backgroundColor,
            fontWeight: 'bold'
        })
    }

    function addPatientDataOnSuccess(res) {
        // console.log("response", res)
        if (res.status == "success") {
            let patientData = res.patients;
            patientData.forEach((patient) => {
                client.onMessageArrived = onMessage;
                let patientLastSeen = new Date(patient.lastseen);
                let patientJoinDate = new Date(patient.joinedAt).toLocaleDateString()

                let patientId = patient.patientid;

                let element = `<li class="panel panel-default">
                    <div class="panel-heading">
                        <a class="list" class="patient-info" data-parent="#accordion" data-toggle="collapse" href="#${patientId}">
                            <div>
                                <p>${patient.name}</p>
                            </div>
                            <div class="patient-position">
                                <p class="timer patient-${patientId}"> Move patient within 
                                    <label class="minutes">00</label>:
                                    <label class="seconds">00</label>
                                </p>
                            </div>
                        </a>
                    </div>
                    <div id="${patientId}" class="panel-collapse collapse patient-${patientId}">
                        <div class="panel-body content">
                            <p>Patient Age : ${patient.age}</p>
                            <p>Bed# : ${patient.bednumber}</p>
                            <p>Move count : <span id="${patientId}-counter">${patient.count}</span></p>
                            <p>Last seen : <span id="${patientId}-last-seen"> ${ 
                                (patientLastSeen.toLocaleDateString() == new Date().toLocaleDateString()) 
                                    ? patientLastSeen.toLocaleTimeString()
                                    : patientLastSeen.toLocaleString()
                            }</span>
                            </p>
                            <p>Joined on : ${patientJoinDate}</p>
                        </div>
                    </div>
                </li>`

                $(element).appendTo('ol.rounded-list');

                setPatientTimer(patientId, patientLastSeen);

            })
            $(`#accordion .panel-collapse`).eq(0).addClass('in'); //show 1st element by default
        }
    }

});