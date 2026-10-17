document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* PASSWORD TOGGLE */
        function setupPasswordToggle(
            inputId,
            buttonId
        ) {

            const input =
                document.getElementById(
                    inputId
                );

            const button =
                document.getElementById(
                    buttonId
                );


            if (
                !input ||
                !button
            ) {

                return;

            }


            button.addEventListener(
                "click",
                function () {

                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.textContent =
                            "Hide";

                    } else {

                        input.type =
                            "password";

                        button.textContent =
                            "Show";

                    }

                }
            );

        }


        setupPasswordToggle(
            "registerPassword",
            "registerPasswordToggle"
        );


        setupPasswordToggle(
            "confirmPassword",
            "confirmPasswordToggle"
        );


        /* REGISTER FORM */
        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                function (event) {

                    const password =
                        document.getElementById(
                            "registerPassword"
                        ).value;

                    const confirmPassword =
                        document.getElementById(
                            "confirmPassword"
                        ).value;


                    if (
                        password !==
                        confirmPassword
                    ) {

                        event.preventDefault();

                        alert(
                            "Passwords do not match."
                        );

                        return;

                    }


                    if (
                        password.length < 6
                    ) {

                        event.preventDefault();

                        alert(
                            "Password must be at least 6 characters."
                        );

                        return;

                    }


                    const button =
                        registerForm.querySelector(
                            ".auth-button"
                        );


                    if (button) {

                        button.textContent =
                            "Creating Account...";

                        button.disabled =
                            true;

                    }

                }
            );

        }

    }
);