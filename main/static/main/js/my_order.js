document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* ORDER CARDS */
        const orderCards =
            document.querySelectorAll(
                ".order-card"
            );


        /*  Add a small animation when the
            order cards appear */
        orderCards.forEach(
            function (card, index) {

                card.style.opacity = "0";

                card.style.transform =
                    "translateY(8px)";


                setTimeout(
                    function () {

                        card.style.transition =
                            "opacity 0.35s ease, transform 0.35s ease";

                        card.style.opacity = "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    index * 80
                );

            }
        );

    }
);