document.addEventListener(
    "DOMContentLoaded",
    function () {


        const cancelButton =
            document.getElementById(
                "cancelLogoutButton"
            );


        /* CANCEL LOGOUT */
        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                function () {

                    window.history.back();

                }
            );

        }


        /* CONFIRM LOGOUT */
        const logoutButton =
            document.getElementById(
                "confirmLogoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    logoutButton.disabled = true;

                    logoutButton.querySelector(
                        "span"
                    ).textContent = "Logging out...";

                }
            );

        }

    }
);