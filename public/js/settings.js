$(function () {
    $("#logout").click(function (e) {
        e.preventDefault();
        swal({
            title: "<i>Successfully LoggedOut</i>",

        });
        const url = '/';
        setTimeout(function () {
            window.location = url;
        }, 1000);
        window.localStorage.clear();

    });
})