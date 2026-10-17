document.addEventListener("DOMContentLoaded", function () {

    /* CSRF TOKEN */
    function getCookie(name) {

        let cookieValue = null;

        if (document.cookie && document.cookie !== "") {

            const cookies = document.cookie.split(";");

            for (let cookie of cookies) {

                cookie = cookie.trim();

                if (
                    cookie.substring(
                        0,
                        name.length + 1
                    ) === name + "="
                ) {

                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );

                    break;
                }
            }
        }

        return cookieValue;
    }


    const csrftoken = getCookie("csrftoken");


    /* LOGIN REDIRECT */
    function redirectToLogin() {

        const wishlistPage =
            document.querySelector(".wishlist-page");


        if (!wishlistPage) {

            console.error(
                "Wishlist page not found."
            );

            return;
        }


        const loginUrl =
            wishlistPage.dataset.loginUrl;


        if (!loginUrl) {

            console.error(
                "Login URL not found."
            );

            return;
        }


        const currentPage =
            window.location.pathname +
            window.location.search;


        const separator =
            loginUrl.includes("?")
                ? "&"
                : "?";


        window.location.href =
            loginUrl +
            separator +
            "next=" +
            encodeURIComponent(currentPage);
    }


    /* ADD / REMOVE WISHLIST
       HOME
       GIFT HAMPER
       VIEW GIFT HAMPER */
    const wishlistButtons =
        document.querySelectorAll(
            ".popular-wishlist, .like-button, .wishlist-button"
        );


    wishlistButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                const hamperId =
                    button.dataset.id;


                if (!hamperId) {

                    console.error(
                        "Wishlist ID missing"
                    );

                    return;
                }


                const formData =
                    new FormData();


                formData.append(
                    "id",
                    hamperId
                );


                formData.append(
                    "name",
                    button.dataset.name || ""
                );


                formData.append(
                    "price",
                    button.dataset.price || ""
                );


                formData.append(
                    "image",
                    button.dataset.image || ""
                );


                fetch(
                    "/wishlist/toggle/",
                    {
                        method: "POST",

                        headers: {
                            "X-CSRFToken":
                                csrftoken
                        },

                        body: formData
                    }
                )

                .then(function (response) {

                    return response.json()
                        .then(function (data) {

                            return {
                                status: response.status,
                                data: data
                            };

                        });

                })

                .then(function (result) {

                    const responseStatus =
                        result.status;

                    const data =
                        result.data;


                    /* LOGIN REQUIRED */
                    if (
                        responseStatus === 401 &&
                        data.login_required
                    ) {

                        redirectToLogin();

                        return;
                    }


                    console.log(
                        "Wishlist:",
                        data
                    );


                    if (!data.success) {

                        console.error(
                            data.message ||
                            "Wishlist error"
                        );

                        return;
                    }


                    /* ADDED */
                    if (
                        data.action === "added"
                    ) {

                        button.innerHTML = "♥";

                        button.classList.add(
                            "active"
                        );

                        button.setAttribute(
                            "aria-label",
                            "Remove from wishlist"
                        );
                    }


                    /* REMOVED */
                    if (
                        data.action === "removed"
                    ) {

                        button.innerHTML = "♡";

                        button.classList.remove(
                            "active"
                        );

                        button.setAttribute(
                            "aria-label",
                            "Add to wishlist"
                        );
                    }

                })

                .catch(function (error) {

                    console.error(
                        "Wishlist error:",
                        error
                    );

                });

            }
        );

    });


    /* CHECK EXISTING WISHLIST ITEMS */
    wishlistButtons.forEach(function (button) {

        const hamperId =
            button.dataset.id;


        if (!hamperId) {
            return;
        }


        fetch(
            `/wishlist/check/?id=${encodeURIComponent(hamperId)}`
        )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            /* Guest users can browse normally.
               A 401 response only means that the
               user is not logged in.
            */
            if (
                data.login_required
            ) {

                return;
            }


            if (!data.success) {
                return;
            }


            if (data.in_wishlist) {

                button.innerHTML = "♥";

                button.classList.add(
                    "active"
                );

                button.setAttribute(
                    "aria-label",
                    "Remove from wishlist"
                );

            } else {

                button.innerHTML = "♡";

                button.classList.remove(
                    "active"
                );

                button.setAttribute(
                    "aria-label",
                    "Add to wishlist"
                );

            }

        })

        .catch(function (error) {

            console.error(
                "Wishlist check error:",
                error
            );

        });

    });


    /* REMOVE FROM WISHLIST PAGE */
    const removeButtons =
        document.querySelectorAll(
            ".remove-wishlist"
        );


    removeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const hamperId =
                    button.dataset.id;


                if (!hamperId) {

                    console.error(
                        "Wishlist ID missing"
                    );

                    return;
                }


                const formData =
                    new FormData();


                formData.append(
                    "id",
                    hamperId
                );


                fetch(
                    "/wishlist/remove/",
                    {
                        method: "POST",

                        headers: {
                            "X-CSRFToken":
                                csrftoken
                        },

                        body: formData
                    }
                )

                .then(function (response) {

                    return response.json()
                        .then(function (data) {

                            return {
                                status: response.status,
                                data: data
                            };

                        });

                })

                .then(function (result) {

                    const responseStatus =
                        result.status;

                    const data =
                        result.data;


                    /* LOGIN REQUIRED */
                    if (
                        responseStatus === 401 &&
                        data.login_required
                    ) {

                        redirectToLogin();

                        return;
                    }


                    console.log(
                        "Wishlist remove:",
                        data
                    );


                    if (!data.success) {

                        console.error(
                            data.message ||
                            "Unable to remove item"
                        );

                        return;
                    }


                    /* REMOVE CARD FROM PAGE */
                    const card =
                        document.querySelector(
                            `.wishlist-card[data-id="${hamperId}"]`
                        );


                    if (card) {

                        card.remove();

                    }


                    /* CHECK IF WISHLIST IS EMPTY */
                    const remainingCards =
                        document.querySelectorAll(
                            ".wishlist-card"
                        );


                    if (
                        remainingCards.length === 0
                    ) {

                        location.reload();

                    }

                })

                .catch(function (error) {

                    console.error(
                        "Wishlist remove error:",
                        error
                    );

                });

            }
        );

    });

});