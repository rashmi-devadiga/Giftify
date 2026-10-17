document.addEventListener("DOMContentLoaded", function () {


    /* PRICE ELEMENT */
    const totalPriceElement =
        document.querySelector("#hamper-total-price");


    if (!totalPriceElement) {
        return;
    }


    /* ORIGINAL HAMPER SELLING PRICE */
    const originalHamperPrice =
        parseFloat(
            totalPriceElement.dataset.originalPrice
        ) || 0;


    /* CALCULATE INITIAL ITEMS TOTAL */
    let initialItemsTotal = 0;


    document
        .querySelectorAll(".included-item")
        .forEach(function (item) {

            const price =
                parseFloat(
                    item.dataset.price
                ) || 0;


            const quantity =
                parseInt(
                    item.dataset.quantity
                ) || 0;


            initialItemsTotal +=
                price * quantity;

        });


    /* FIXED HAMPER AMOUNT */
    let fixedAmount =
        originalHamperPrice -
        initialItemsTotal;


    if (fixedAmount < 0) {
        fixedAmount = 0;
    }


    /* GET CURRENT PRODUCTS VALUE
       USED FOR ₹400 MINIMUM VALIDATION */
    function getCurrentItemsTotal() {

        let currentItemsTotal = 0;


        document
            .querySelectorAll(
                "#includedItems .included-item"
            )
            .forEach(function (item) {

                const price =
                    parseFloat(
                        item.dataset.price
                    ) || 0;


                const quantityElement =
                    item.querySelector(
                        ".item-quantity"
                    );


                const quantity =
                    parseInt(
                        quantityElement
                            ? quantityElement.textContent
                            : item.dataset.quantity,
                        10
                    ) || 0;


                currentItemsTotal +=
                    price * quantity;

            });


        return currentItemsTotal;

    }


    /* UPDATE TOTAL PRICE */
    function updateTotalPrice() {

        const currentItemsTotal =
            getCurrentItemsTotal();


        const newTotal =
            fixedAmount +
            currentItemsTotal;


        totalPriceElement.textContent =
            "₹" + newTotal.toFixed(0);

    }


    /* MAKE UPDATE FUNCTION AVAILABLE
       TO OTHER JAVASCRIPT FILES */
    window.updateHamperTotalPrice =
        updateTotalPrice;


    /* SHOW CART VALIDATION MESSAGE */
    function showCartValidationMessage(message) {

        const cartValidationMessage =
            document.getElementById(
                "cartValidationMessage"
            );


        if (!cartValidationMessage) {
            return;
        }


        cartValidationMessage.textContent =
            message;


        cartValidationMessage.classList.add(
            "show"
        );


        setTimeout(
            function () {

                cartValidationMessage.classList.remove(
                    "show"
                );

            },
            3000
        );

    }


    /* VALIDATE CUSTOMIZABLE HAMPER
       
       ₹0       - Empty message
       ₹1–₹399  - Minimum value message
       ₹400+    - Allow */
    function validateCustomizableHamper(
        isCustomized
    ) {

        /* NON-CUSTOMIZABLE HAMPERS
           DO NOT NEED THIS VALIDATION */
        if (!isCustomized) {
            return true;
        }


        const currentItemsTotal =
            getCurrentItemsTotal();


        /* ₹0 */
        if (currentItemsTotal <= 0) {

            showCartValidationMessage(
                "Gift hamper is empty. Please add at least one product."
            );

            return false;

        }


        /* ₹1 - ₹399 */
        if (currentItemsTotal < 400) {

            showCartValidationMessage(
                "Minimum hamper value is ₹400. Please add more products."
            );

            return false;

        }


        /* ₹400 OR MORE */
        return true;

    }


    /* QUANTITY + REMOVE */
    document.addEventListener(
        "click",
        function (event) {


            /* PLUS */
            if (
                event.target.classList.contains(
                    "plus"
                )
            ) {

                const item =
                    event.target.closest(
                        ".included-item"
                    );


                if (!item) {
                    return;
                }


                if (
                    item.dataset.addedProduct === "true"
                ) {
                    return;
                }


                const quantityElement =
                    item.querySelector(
                        ".item-quantity"
                    );


                if (!quantityElement) {
                    return;
                }


                let quantity =
                    parseInt(
                        quantityElement.textContent
                    ) || 0;


                quantity++;


                quantityElement.textContent =
                    quantity;


                item.dataset.quantity =
                    quantity;


                updateTotalPrice();

            }


            /* MINUS */
            if (
                event.target.classList.contains(
                    "minus"
                )
            ) {

                const item =
                    event.target.closest(
                        ".included-item"
                    );


                if (!item) {
                    return;
                }


                if (
                    item.dataset.addedProduct === "true"
                ) {
                    return;
                }


                const quantityElement =
                    item.querySelector(
                        ".item-quantity"
                    );


                if (!quantityElement) {
                    return;
                }


                let quantity =
                    parseInt(
                        quantityElement.textContent
                    ) || 0;


                if (quantity > 1) {

                    quantity--;


                    quantityElement.textContent =
                        quantity;


                    item.dataset.quantity =
                        quantity;


                    updateTotalPrice();

                }

            }


            /* REMOVE ITEM */
            if (
                event.target.classList.contains(
                    "remove-item"
                )
            ) {

                const item =
                    event.target.closest(
                        ".included-item"
                    );


                if (!item) {
                    return;
                }


                item.remove();


                updateTotalPrice();

            }

        }
    );


    /* WATCH FOR PRODUCTS ADDED DYNAMICALLY */
    const includedItemsContainer =
        document.querySelector(
            "#includedItems"
        );


    if (includedItemsContainer) {

        const observer =
            new MutationObserver(
                function () {

                    updateTotalPrice();

                }
            );


        observer.observe(
            includedItemsContainer,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );

    }


    /* GET CURRENT SELECTED ITEMS */
    function getCurrentItems() {

        const currentItems = [];


        document
            .querySelectorAll(
                "#includedItems .included-item"
            )
            .forEach(function (item) {

                const productId =
                    item.dataset.productId || "";


                const nameElement =
                    item.querySelector(
                        ".item-name"
                    );


                const quantityElement =
                    item.querySelector(
                        ".item-quantity"
                    );


                const name =
                    nameElement
                        ? nameElement.textContent.trim()
                        : "";


                const price =
                    parseFloat(
                        item.dataset.price
                    ) || 0;


                const quantity =
                    parseInt(
                        quantityElement
                            ? quantityElement.textContent
                            : item.dataset.quantity,
                        10
                    ) || 1;


                if (!name) {
                    return;
                }


                const originalItem =
                    item.dataset.originalItem === "true";


                currentItems.push({

                    product_id:
                        productId,

                    name:
                        name,

                    price:
                        price,

                    quantity:
                        quantity,

                    original_item:
                        originalItem

                });

            });


        return currentItems;

    }


    /* LOGIN PANEL */
    function redirectToLogin(button) {

        const loginUrl =
            button.dataset.loginUrl;


        if (!loginUrl) {

            console.error(
                "Login URL not found."
            );

            return;

        }


        /* OPEN THE SAME LOGIN BOTTOM PANEL
           USED BY THE ACCOUNT LOGIN */
        if (
            typeof window.openLoginPanel ===
            "function"
        ) {

            window.openLoginPanel(
                loginUrl
            );

            return;

        }


        /* FALLBACK
           IF LOGIN PANEL FUNCTION IS NOT AVAILABLE */
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
            encodeURIComponent(
                currentPage
            );

    }


    /* ADD TO CART */
    const addCartButton =
        document.querySelector(
            ".add-cart-button"
        );


    if (addCartButton) {

        addCartButton.addEventListener(
            "click",
            async function (event) {

                /* PREVENT ANY OTHER CLICK ACTION */
                event.preventDefault();
                event.stopPropagation();


                /* CHECK BUTTON */
                if (
                    addCartButton.disabled
                ) {
                    return;
                }


                /* HAMPER ID */
                const hamperId =
                    addCartButton.dataset.hamperId;


                if (!hamperId) {

                    console.error(
                        "Hamper ID not found"
                    );

                    return;

                }


                /* GET CUSTOMIZATION TYPE */
                const customization =
                    addCartButton.dataset.customization;


                const isCustomized =
                    customization === "yes";


                /* ₹400 MINIMUM VALIDATION */
                if (
                    !validateCustomizableHamper(
                        isCustomized
                    )
                ) {
                    return;
                }


                /* GET CURRENT ITEMS */
                const currentItems =
                    getCurrentItems();


                /* BUTTON LOADING */
                const originalText =
                    addCartButton.textContent;


                addCartButton.disabled =
                    true;


                addCartButton.textContent =
                    "Adding...";


                try {


                    /* SEND CURRENT ITEMS TO DJANGO */
                    const response =
                        await fetch(
                            "/cart/add/",
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "X-CSRFToken":
                                        getCookie(
                                            "csrftoken"
                                        )

                                },

                                body:
                                    JSON.stringify({

                                        hamper_id:
                                            hamperId,

                                        customized:
                                            isCustomized,

                                        items:
                                            currentItems

                                    })

                            }
                        );


                    const data =
                        await response.json();


                    /* LOGIN REQUIRED */
                    if (
                        response.status === 401 &&
                        data.login_required
                    ) {

                        addCartButton.disabled =
                            false;

                        addCartButton.textContent =
                            originalText;


                        redirectToLogin(
                            addCartButton
                        );

                        return;

                    }


                    /* SUCCESS */
                    if (data.success) {

                        /* CLEAR OLD VALIDATION MESSAGE */
                        const cartValidationMessage =
                            document.getElementById(
                                "cartValidationMessage"
                            );


                        if (cartValidationMessage) {

                            cartValidationMessage.textContent =
                                "";


                            cartValidationMessage.classList.remove(
                                "show"
                            );

                        }


                        /* SHOW SUCCESS MESSAGE */
                        const cartSuccessMessage =
                            document.getElementById(
                                "cartSuccessMessage"
                            );


                        if (cartSuccessMessage) {

                            cartSuccessMessage.textContent =
                                "Gift Hamper is added to cart.";


                            cartSuccessMessage.classList.add(
                                "show"
                            );


                            setTimeout(
                                function () {

                                    cartSuccessMessage.classList.remove(
                                        "show"
                                    );

                                },
                                3000
                            );

                        }


                        addCartButton.disabled =
                            false;


                        addCartButton.textContent =
                            originalText;


                        return;

                    }


                    /* ERROR / STOCK LIMIT MESSAGE */
                    const cartValidationMessage =
                        document.getElementById(
                            "cartValidationMessage"
                        );


                    if (cartValidationMessage) {

                        cartValidationMessage.textContent =
                            data.message ||
                            "Unable to add hamper to cart.";


                        cartValidationMessage.classList.add(
                            "show"
                        );


                        setTimeout(
                            function () {

                                cartValidationMessage.classList.remove(
                                    "show"
                                );

                            },
                            3000
                        );

                    }


                    console.error(
                        data.message ||
                        "Unable to add hamper to cart."
                    );


                    addCartButton.disabled =
                        false;


                    addCartButton.textContent =
                        originalText;

                }


                catch (error) {

                    console.error(
                        "Add to cart error:",
                        error
                    );


                    const cartValidationMessage =
                        document.getElementById(
                            "cartValidationMessage"
                        );


                    if (cartValidationMessage) {

                        cartValidationMessage.textContent =
                            "Unable to add hamper to cart. Please try again.";


                        cartValidationMessage.classList.add(
                            "show"
                        );


                        setTimeout(
                            function () {

                                cartValidationMessage.classList.remove(
                                    "show"
                                );

                            },
                            3000
                        );

                    }


                    addCartButton.disabled =
                        false;


                    addCartButton.textContent =
                        originalText;

                }

            }
        );

    }


    /* GET CSRF TOKEN */
    function getCookie(name) {

        let cookieValue =
            null;


        if (
            document.cookie &&
            document.cookie !== ""
        ) {

            const cookies =
                document.cookie.split(";");


            for (
                let i = 0;
                i < cookies.length;
                i++
            ) {

                const cookie =
                    cookies[i].trim();


                if (
                    cookie.substring(
                        0,
                        name.length + 1
                    ) ===
                    (
                        name + "="
                    )
                ) {

                    cookieValue =
                        decodeURIComponent(
                            cookie.substring(
                                name.length + 1
                            )
                        );


                    break;

                }

            }

        }


        return cookieValue;

    }


    /* BUY NOW */
    const buyNowButton =
        document.querySelector(
            ".buy-now-button"
        );


    if (buyNowButton) {

        buyNowButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();
                event.stopPropagation();


                if (
                    buyNowButton.disabled
                ) {
                    return;
                }


                const hamperId =
                    document.querySelector(
                        ".add-cart-button"
                    )?.dataset.hamperId;


                if (!hamperId) {

                    console.error(
                        "Hamper ID not found"
                    );

                    return;

                }


                const customization =
                    document.querySelector(
                        ".add-cart-button"
                    )?.dataset.customization;


                const isCustomized =
                    customization === "yes";


                /* ₹400 MINIMUM VALIDATION */
                if (
                    !validateCustomizableHamper(
                        isCustomized
                    )
                ) {
                    return;
                }


                const currentItems =
                    getCurrentItems();


                const originalText =
                    buyNowButton.textContent;


                buyNowButton.disabled =
                    true;


                buyNowButton.textContent =
                    "Processing...";


                try {

                    const response =
                        await fetch(
                            "/buy-now/",
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "X-CSRFToken":
                                        getCookie(
                                            "csrftoken"
                                        )

                                },

                                body:
                                    JSON.stringify({

                                        hamper_id:
                                            hamperId,

                                        customized:
                                            isCustomized,

                                        items:
                                            currentItems

                                    })

                            }
                        );


                    const data =
                        await response.json();


                    /* LOGIN REQUIRED */
                    if (
                        response.status === 401 &&
                        data.login_required
                    ) {

                        buyNowButton.disabled =
                            false;

                        buyNowButton.textContent =
                            originalText;


                        redirectToLogin(
                            buyNowButton
                        );

                        return;

                    }


                    /* SUCCESS */
                    if (data.success) {

                        window.location.href =
                            data.redirect_url;

                        return;

                    }


                    console.error(
                        data.message ||
                        "Unable to continue."
                    );


                    buyNowButton.disabled =
                        false;


                    buyNowButton.textContent =
                        originalText;

                }


                catch (error) {

                    console.error(
                        "Buy Now error:",
                        error
                    );


                    buyNowButton.disabled =
                        false;


                    buyNowButton.textContent =
                        originalText;

                }

            }
        );

    }


    /* INITIAL PRICE */
    updateTotalPrice();

});