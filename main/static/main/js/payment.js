document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ELEMENTS */
        const paymentOptions =
            document.querySelectorAll(
                ".payment-option"
            );

        const paymentInputs =
            document.querySelectorAll(
                'input[name="paymentMethod"]'
            );

        const upiPayButton =
            document.getElementById(
                "upiPayButton"
            );

        const codPlaceOrderButton =
            document.getElementById(
                "codPlaceOrderButton"
            );

        const addressIdElement =
            document.getElementById(
                "addressId"
            );


        /* SELECTED ADDRESS */
        const addressId =
            addressIdElement
                ? addressIdElement.value
                : "";


        /* SELECT PAYMENT METHOD */
        paymentInputs.forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        paymentOptions.forEach(
                            function (option) {

                                option.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        const selectedOption =
                            input.closest(
                                ".payment-option"
                            );


                        if (selectedOption) {

                            selectedOption.classList.add(
                                "selected"
                            );

                        }

                    }
                );

            }
        );


        /* CLICK ENTIRE PAYMENT CARD */
        paymentOptions.forEach(
            function (option) {

                option.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target.tagName ===
                            "BUTTON"
                        ) {

                            return;

                        }


                        const input =
                            option.querySelector(
                                'input[name="paymentMethod"]'
                            );


                        if (input) {

                            input.checked = true;

                            input.dispatchEvent(
                                new Event(
                                    "change"
                                )
                            );

                        }

                    }
                );

            }
        );


        /* GET CHECKOUT SOURCE */
        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const source =
            urlParams.get(
                "source"
            ) || "buy_now";


        /* COMPLETE PAYMENT */
        function completePayment(
            paymentMethod
        ) {

            const selected =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                );


            /* MAKE SURE PAYMENT METHOD IS SELECTED */
            if (
                !selected ||
                selected.value !== paymentMethod
            ) {

                return;

            }


            /* CREATE POST FORM */
            const form =
                document.createElement(
                    "form"
                );

            form.method = "POST";

            form.action =
                "/payment/complete/?source="
                + encodeURIComponent(
                    source
                );


            /* CSRF TOKEN */
            const csrfToken =
                document.querySelector(
                    '[name="csrfmiddlewaretoken"]'
                );


            if (csrfToken) {

                const csrfInput =
                    document.createElement(
                        "input"
                    );

                csrfInput.type = "hidden";

                csrfInput.name =
                    "csrfmiddlewaretoken";

                csrfInput.value =
                    csrfToken.value;

                form.appendChild(
                    csrfInput
                );

            }


            /* PAYMENT METHOD */
            const paymentInput =
                document.createElement(
                    "input"
                );

            paymentInput.type = "hidden";

            paymentInput.name =
                "payment_method";

            paymentInput.value =
                paymentMethod;

            form.appendChild(
                paymentInput
            );


            /* ADDRESS ID */
            if (addressId) {

                const addressInput =
                    document.createElement(
                        "input"
                    );

                addressInput.type = "hidden";

                addressInput.name =
                    "address_id";

                addressInput.value =
                    addressId;

                form.appendChild(
                    addressInput
                );

            }


            /* SUBMIT FORM */
            document.body.appendChild(
                form
            );

            form.submit();

        }


        /* UPI */
        if (upiPayButton) {

            upiPayButton.addEventListener(
                "click",
                function () {

                    completePayment(
                        "upi"
                    );

                }
            );

        }


        /* CASH ON DELIVERY */
        if (codPlaceOrderButton) {

            codPlaceOrderButton.addEventListener(
                "click",
                function () {

                    completePayment(
                        "cod"
                    );

                }
            );

        }

    }
);