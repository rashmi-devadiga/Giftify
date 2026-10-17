document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* CSRF TOKEN */
        const csrfTokenElement =
            document.getElementById(
                "csrfToken"
            );


        const csrfToken =
            csrfTokenElement
                ? csrfTokenElement.value
                : "";


        /* CHECK CSRF TOKEN */
        if (!csrfToken) {

            console.error(
                "CSRF token not found."
            );

            return;

        }


        /* REMOVE CART ITEM */
        const removeButtons =
            document.querySelectorAll(
                ".cart-remove-button"
            );


        removeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {


                        /*  CART ID */
                        const cartId =
                            button.dataset.cartId;


                        if (!cartId) {

                            console.error(
                                "Cart ID not found."
                            );

                            return;

                        }


                        /* CART ITEM */
                        const cartItem =
                            button.closest(
                                ".cart-item"
                            );


                        /* DISABLE ONLY REMOVE BUTTON
                           
                           This does NOT depend on stock.
                           Therefore Out of Stock items
                           can still be removed */
                        button.disabled =
                            true;


                        try {


                            /* SEND REMOVE REQUEST */
                            const response =
                                await fetch(
                                    "/cart/remove/",
                                    {

                                        method:
                                            "POST",

                                        headers: {

                                            "Content-Type":
                                                "application/json",

                                            "X-CSRFToken":
                                                csrfToken

                                        },

                                        body:
                                            JSON.stringify({

                                                cart_id:
                                                    cartId

                                            })

                                    }
                                );


                            /* RESPONSE */
                            const data =
                                await response.json();


                            /* SUCCESS */
                            if (
                                data.success
                            ) {


                                /* 
                                   Remove the cart item
                                   from the page.
                                */
                                if (cartItem) {

                                    cartItem.remove();

                                }


                                /*
                                   Reload page so:
                                   1. Cart becomes empty if needed
                                   2. Price details update
                                   3. Stock is checked again
                                */
                                window.location.reload();

                                return;

                            }


                            /* ERROR */
                            console.error(
                                data.message ||
                                "Unable to remove cart item."
                            );


                            button.disabled =
                                false;

                        }


                        catch (error) {

                            console.error(
                                "Remove cart error:",
                                error
                            );


                            button.disabled =
                                false;

                        }

                    }
                );

            }
        );


        /* 
           PREVENT DISABLED CHECKOUT ACTION
           
           The button is disabled in HTML already.
           This is an additional safety check.
         */
        const checkoutButton =
            document.querySelector(
                ".cart-checkout-disabled"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                }
            );

        }

    }
);