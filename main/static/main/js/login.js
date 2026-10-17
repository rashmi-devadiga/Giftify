document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* PASSWORD TOGGLE */
        const passwordInput =
            document.getElementById(
                "loginPassword"
            );

        const passwordToggle =
            document.getElementById(
                "loginPasswordToggle"
            );


        if (
            passwordInput &&
            passwordToggle
        ) {

            passwordToggle.addEventListener(
                "click",
                function () {

                    if (
                        passwordInput.type ===
                        "password"
                    ) {

                        passwordInput.type =
                            "text";

                        passwordToggle.textContent =
                            "Hide";

                    } else {

                        passwordInput.type =
                            "password";

                        passwordToggle.textContent =
                            "Show";

                    }

                }
            );

        }



        /* LOGIN FORM */
        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function () {

                    const button =
                        loginForm.querySelector(
                            ".auth-button"
                        );

                    if (button) {

                        button.textContent =
                            "Logging in...";

                        button.disabled =
                            true;

                    }

                }
            );

        }

    }
);