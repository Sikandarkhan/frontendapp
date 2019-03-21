$(document).ready(function () {

    $("#submit").click(function (e) {
        e.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        // console.log(email)

        $.ajax({
            type: 'POST',
            url: 'https://developer.rudralabs.com/loginDevice',
            data: {
                email: email,
                password: password
            },

            success: function (res) {
                // console.log("Login response \n", res);

                if (res.status == "success") {
                    window.localStorage.setItem('token', res.token);

                    var token = window.localStorage.getItem('token')
                    // console.log("token", token)

                    swal("Successfully loggedin", "", "success");
                    const url = '/patient';
                    setTimeout(function () {
                        window.location = url;
                    }, 2000);

                } else {
                    swal(res.status, "", "error");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                swal(res.status, "", "error");
                // console.log(errorThrown);
            }
        });

    });

});