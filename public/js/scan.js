$(function () {
    const token = window.localStorage.getItem('token')
    // console.log("token", token)

    function ScanDevice(deviceid, patientData) {
        // console.log("data", deviceid)
        $.ajax({
            type: 'POST',
            url: 'https://developer.rudralabs.com/scanDevice',
            data: {
                token: token,
                deviceid: deviceid,
                patientData: patientData
            },

            success: function (res) {
                // console.log("response", res)
                if (res.status == "success") {

                    swal("Patient added", "", "success");
                    const url = '/patient';
                    setTimeout(function () {
                        window.location = url;
                    }, 3000);

                } else {
                    swal(res.status, res.errorDescription, "error");
                    setTimeout(function () {
                        // window.location = "/scan"
                    }, 3000);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                swal(res.status, "", "error");
                // console.log(errorThrown);
            }
        });


    }
    let scanner = new Instascan.Scanner({
        video: document.getElementById('preview'),
        mirror: false
    });
    scanner.addListener('scan', function (content) {
        // console.log(typeof content);
        if (content != undefined) {
            const data = JSON.parse(content);
            // console.log("deviceid", data.deviceid)
            // console.log("pdata", data.patientData)
            ScanDevice(data.deviceid, data.patientData);

        }
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            // console.error('No cameras found.');
        }
    }).catch(function (e) {
        // console.error(e);
    });
})