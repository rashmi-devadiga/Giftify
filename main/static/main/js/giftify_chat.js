document.addEventListener("DOMContentLoaded", function () {


    /* ELEMENTS */
    const chatPage =
        document.getElementById("giftifyChatPage");

    const chatBody =
        document.getElementById("giftifyChatBody");

    const menuButton =
        document.getElementById("chatMenuButton");

    const menu =
        document.getElementById("chatMenu");

    const restartButton =
        document.getElementById("restartChatButton");

    const dataElement =
        document.getElementById("giftify-hampers-data");


    /* SAFETY CHECK */
    if (!chatPage || !chatBody || !dataElement) {

        console.error(
            "Giftify Chat elements not found."
        );

        return;
    }


    /* LOAD HAMPER DATA */
    let hampers = [];

    try {

        hampers = JSON.parse(
            dataElement.textContent
        );

    } catch (error) {

        console.error(
            "Unable to load Giftify hampers:",
            error
        );

        hampers = [];
    }


    /* HOME URL */
    const homeButton =
        document.querySelector(
            ".chat-home-button"
        );

    const homeUrl =
        homeButton
            ? homeButton.href
            : "/";


    /* HAMPER URL */
    const hamperUrlTemplate =
        chatPage.dataset.hamperUrlTemplate || "";


    /* USER SELECTIONS */
    let selectedCustomization = null;

    let selectedCategory = null;

    let selectedPriceRange = null;


    /* CATEGORY DATA */
    const categories = [

        {
            value: "Birthday",
            label: "Birthday"
        },

        {
            value: "Anniversary & Wedding",
            label: "Anniversary & Wedding"
        },

        {
            value: "Love & Valentine's",
            label: "Love & Valentine’s"
        },

        {
            value: "Flowers & Chocolate",

            label:
                "Flowers & Chocolate",

            matches: [
                "Flower",
                "Chocolate"
            ]
        },

        {
            value: "Chocolate",
            label: "Chocolate"
        },

        {
            value: "Flower",
            label: "Flower"
        },

        {
            value: "Gourmet & Sweet",
            label: "Gourmet & Sweet"
        },

        {
            value: "Beauty & Wellness",
            label: "Beauty & Wellness"
        },

        {
            value: "Friendship",
            label: "Friendship"
        },

        {
            value: "Congratulations",
            label: "Congratulations"
        },

        {
            value: "Thank You",
            label: "Thank You"
        },

        {
            value: "Memory & Photo",
            label: "Memory & Photo"
        },

        {
            value: "Plants & Green",
            label: "Plants & Green"
        },

        {
            value: "Accessories & Fashion",
            label: "Accessories & Fashion"
        },

        {
            value: "Mini Gift",
            label: "Mini Gift"
        }

    ];


    /* PRICE RANGE DATA */
    const priceRanges = [

        {
            id: "below-1500",

            label:
                "Below ₹1,500",

            min: 0,

            max: 1500
        },

        {
            id: "1500-3000",

            label:
                "₹1,500 – ₹3,000",

            min: 1500,

            max: 3000
        },

        {
            id: "3000-4500",

            label:
                "₹3,000 – ₹4,500",

            min: 3000,

            max: 4500
        },

        {
            id: "above-4500",

            label:
                "Above ₹4,500",

            min: 4500,

            max: Infinity
        }

    ];


    /* SCROLL TO BOTTOM */

    function scrollToBottom() {

        setTimeout(function () {

            chatBody.scrollTo({

                top:
                    chatBody.scrollHeight,

                behavior:
                    "smooth"

            });

        }, 60);

    }


    /* FORMAT PRICE */
    function formatPrice(value) {

        const number =
            Number(value) || 0;

        return "₹" +
            number.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 0
                }
            );

    }


    /* ESCAPE HTML */
    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    }


    /* FORMAT BOT TEXT */
    function formatBotText(text) {

        const safeText =
            escapeHtml(text);

        return safeText.replace(
            /\n/g,
            "<br>"
        );

    }


    /* BOT MESSAGE */
    function addBotMessage(
        text,
        options = {}
    ) {

        const row =
            document.createElement("div");

        row.className =
            "chat-message-row bot";


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "bot-message-wrapper";


        /* BOT AVATAR */
        const avatar =
            document.createElement("div");

        avatar.className =
            "bot-avatar";

        avatar.textContent =
            "G";


        /* BOT BUBBLE */
        const bubble =
            document.createElement("div");

        bubble.className =
            "bot-message";


        /* WELCOME MESSAGE */
        if (options.welcome) {

            bubble.classList.add(
                "welcome-message"
            );

            bubble.innerHTML = `

                <span class="bot-name">
                    Giftify
                </span>

                <div class="welcome-title">
                    Welcome to Giftify!
                </div>

                <div class="welcome-text">
                    How can I help you find the perfect gift today?
                </div>

            `;

        }


        /* NORMAL MESSAGE */
        else {

            bubble.innerHTML = `

                <span class="bot-name">
                    Giftify
                </span>

                <div class="main-text">
                    ${formatBotText(text)}
                </div>

            `;
        }


        wrapper.appendChild(
            avatar
        );

        wrapper.appendChild(
            bubble
        );

        row.appendChild(
            wrapper
        );

        chatBody.appendChild(
            row
        );


        scrollToBottom();


        return row;
    }


    /* USER MESSAGE */
    function addUserMessage(text) {

        const row =
            document.createElement("div");

        row.className =
            "chat-message-row user";


        const bubble =
            document.createElement("div");

        bubble.className =
            "user-message";

        bubble.textContent =
            text;


        row.appendChild(
            bubble
        );

        chatBody.appendChild(
            row
        );


        scrollToBottom();


        return row;
    }


    /* ADD OPTIONS */
    function addOptions(
        options,
        callback,
        categoryOptions = false
    ) {

        const row =
            document.createElement("div");

        row.className =
            "chat-options-row";


        if (categoryOptions) {

            row.classList.add(
                "category-options"
            );
        }


        options.forEach(
            function (option) {

                const button =
                    document.createElement("button");

                button.type =
                    "button";

                button.className =
                    "chat-option-button";

                button.textContent =
                    option.label;


                button.addEventListener(
                    "click",
                    function () {

                        callback(
                            option,
                            row
                        );

                    }
                );


                row.appendChild(
                    button
                );

            }
        );


        chatBody.appendChild(
            row
        );


        scrollToBottom();


        return row;
    }


    /* FIND A GIFT BUTTON */
    function addFindGiftButton() {

        const row =
            document.createElement("div");

        row.className =
            "chat-options-row";


        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "chat-option-button find-gift-option";

        button.textContent =
            "Find a Gift ";


        button.addEventListener(
            "click",
            function () {

                row.remove();


                addUserMessage(
                    "Find a Gift "
                );


                startCustomizationStep();

            }
        );


        row.appendChild(
            button
        );

        chatBody.appendChild(
            row
        );


        scrollToBottom();
    }


    /* CUSTOMIZATION STEP */
    function startCustomizationStep() {

        addBotMessage(
            "What type of gift would you like to explore?"
        );


        const options = [

            {
                value: "yes",

                label:
                    "Customized Gifts"
            },

            {
                value: "no",

                label:
                    "Ready-Made Gifts"
            }

        ];


        addOptions(

            options,

            function (
                option,
                row
            ) {

                row.remove();


                selectedCustomization =
                    option.value;


                addUserMessage(

                    option.value === "yes"

                        ? "Customized Gift"

                        : "Ready-Made Gift"

                );


                startCategoryStep();

            }

        );
    }


    /* CATEGORY STEP */
    function startCategoryStep() {

        addBotMessage(
            "What type of gift are you looking for?"
        );


        addOptions(

            categories,

            function (
                option,
                row
            ) {

                row.remove();


                selectedCategory =
                    option;


                addUserMessage(
                    option.label
                );


                startPriceStep();

            },

            true

        );
    }


    /* PRICE STEP */
    function startPriceStep() {

        addBotMessage(
            "Great choice! \nWhat's your preferred price range?"
        );


        addOptions(

            priceRanges,

            function (
                option,
                row
            ) {

                row.remove();


                selectedPriceRange =
                    option;


                addUserMessage(
                    option.label
                );


                showMatchingProducts();

            }

        );
    }


    /* CATEGORY MATCH */
    function categoryMatches(
        hamperCategory,
        selectedCategory
    ) {

        if (!hamperCategory) {

            return false;
        }


        /*
           SUPPORT BOTH:
           "Birthday"
           AND
           ["Birthday", "Chocolate", "Friendship"]
        */
        let actualCategories = [];


        if (Array.isArray(hamperCategory)) {

            actualCategories =
                hamperCategory;

        }

        else {

            actualCategories = [
                hamperCategory
            ];
        }


        actualCategories =
            actualCategories
                .map(function (category) {

                    return String(category)
                        .trim()
                        .toLowerCase();

                })
                .filter(function (category) {

                    return category !== "";

                });


        /*
           Flowers & Chocolate
           Matches:
           Flower
           Chocolate
        */
        if (
            selectedCategory.matches &&
            Array.isArray(
                selectedCategory.matches
            )
        ) {

            return selectedCategory.matches.some(
                function (category) {

                    const wantedCategory =
                        String(category)
                            .trim()
                            .toLowerCase();

                    return actualCategories.includes(
                        wantedCategory
                    );

                }
            );
        }


        const selectedValue =
            String(
                selectedCategory.value
            )
                .trim()
                .toLowerCase();


        return actualCategories.includes(
            selectedValue
        );
    }


    /* PRICE MATCH
       NEW LOGIC:
       Below ₹1,500
       ₹1,500 – ₹3,000
       ₹3,000 – ₹4,500
       Above ₹4,500 */
    function priceMatches(
        price,
        range
    ) {

        const value =
            Number(price);


        if (isNaN(value)) {

            return false;
        }


        /* BELOW ₹1,500
           ₹0 - ₹1,499.99 */
        if (
            range.id ===
            "below-1500"
        ) {

            return (
                value < 1500
            );
        }


        /* ₹1,500 – ₹3,000

           ₹1,500 included
           ₹3,000 included */
        if (
            range.id ===
            "1500-3000"
        ) {

            return (
                value >= 1500 &&
                value <= 3000
            );
        }


        /* ₹3,000 – ₹4,500

           ₹3,000 excluded
           ₹4,500 included

           This prevents ₹3,000 appearing
           in both ranges */
        if (
            range.id ===
            "3000-4500"
        ) {

            return (
                value > 3000 &&
                value <= 4500
            );
        }


        /* ABOVE ₹4,500 */
        if (
            range.id ===
            "above-4500"
        ) {

            return (
                value > 4500
            );
        }


        return false;
    }


    /* FILTER HAMPERS */
    function getMatchingHampers() {

        return hampers.filter(
            function (hamper) {


                /* AVAILABILITY */
                const availability =
                    String(
                        hamper.availability || ""
                    )
                        .trim()
                        .toLowerCase();


                const stock =
                    Number(
                        hamper.stock_quantity || 0
                    );


                if (
                    availability !==
                    "available"
                    ||
                    stock <= 0
                ) {

                    return false;
                }


                /* CUSTOMIZATION */
                const customization =
                    String(
                        hamper.customization || ""
                    )
                        .trim()
                        .toLowerCase();


                if (
                    customization !==
                    selectedCustomization
                ) {

                    return false;
                }


                /* CATEGORY */
                if (
                    !categoryMatches(
                        hamper.category,
                        selectedCategory
                    )
                ) {

                    return false;
                }


                /* PRICE */
                if (
                    !priceMatches(
                        hamper.selling_price,
                        selectedPriceRange
                    )
                ) {

                    return false;
                }


                return true;

            }
        );
    }


    /* GET HAMPER URL */
    function getHamperUrl(id) {

        if (!hamperUrlTemplate) {

            return "#";
        }


        return hamperUrlTemplate.replace(
            "HAMPerIdPlaceholder",
            encodeURIComponent(id)
        );
    }


    /* CREATE PRODUCT CARD */
    function createProductCard(
        hamper
    ) {

        const card =
            document.createElement("article");

        card.className =
            "chat-product-card";


        /* IMAGE */
        const imageWrapper =
            document.createElement("div");

        imageWrapper.className =
            "chat-product-image";


        if (hamper.image) {

            const image =
                document.createElement("img");

            image.src =
                hamper.image;

            image.alt =
                hamper.name ||
                "Gift Hamper";

            image.loading =
                "lazy";


            image.onerror =
                function () {

                    image.remove();


                    const fallback =
                        document.createElement("span");

                    fallback.className =
                        "no-product-image";

                    fallback.textContent =
                        "🎁";


                    imageWrapper.appendChild(
                        fallback
                    );

                };


            imageWrapper.appendChild(
                image
            );

        }

        else {

            const fallback =
                document.createElement("span");

            fallback.className =
                "no-product-image";

            fallback.textContent =
                "🎁";


            imageWrapper.appendChild(
                fallback
            );
        }


        /* PRODUCT INFORMATION */
        const info =
            document.createElement("div");

        info.className =
            "chat-product-info";


        /* PRODUCT NAME */
        const name =
            document.createElement("h3");

        name.className =
            "chat-product-name";

        name.textContent =
            hamper.name ||
            "Gift Hamper";


        /* PRICE SECTION */
        const prices =
            document.createElement("div");

        prices.className =
            "chat-product-prices";


        /* SELLING PRICE */
        if (hamper.selling_price) {

            const sellingPriceElement =
                document.createElement("span");

            sellingPriceElement.className =
                "chat-offer-price";

            sellingPriceElement.textContent =
                "₹" + hamper.selling_price;

            prices.appendChild(
                sellingPriceElement
            );
        }


        /* DISCOUNT / OFFER */
        const discountPercent =
            Number(hamper.discount || 0);

        if (discountPercent > 0) {

            const discountElement =
                document.createElement("span");

            discountElement.className =
                "chat-discount";

            discountElement.textContent =
                discountPercent + "% OFF";

            prices.appendChild(
                discountElement
            );
        }



        /* VIEW GIFT BUTTON */
        const viewLink =
            document.createElement("a");

        viewLink.className =
            "chat-view-product";

        viewLink.href =
            getHamperUrl(
                hamper.id
            );

        viewLink.textContent =
            "View Gift";


        /* APPEND INFORMATION */
        info.appendChild(
            name
        );

        info.appendChild(
            prices
        );

        info.appendChild(
            viewLink
        );


        card.appendChild(
            imageWrapper
        );

        card.appendChild(
            info
        );


        return card;
    }


    /* CREATE ACTION BUTTON */
    function createActionButton(
        text,
        className,
        callback
    ) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "chat-action-button " +
            className;

        button.textContent =
            text;


        button.addEventListener(
            "click",
            callback
        );


        return button;
    }


    /* EXIT GIFTIFY CHAT */
    function exitGiftifyChat() {

        window.location.href =
            homeUrl;
    }


    /* FIND ANOTHER GIFT */
    function findAnotherGift() {

        selectedCustomization =
            null;

        selectedCategory =
            null;

        selectedPriceRange =
            null;


        addBotMessage(
            "Of course! Let's find another gift for you."
        );


        startCustomizationStep();
    }


    /* TRY DIFFERENT PRICE RANGE */
    function tryDifferentPriceRange() {

        selectedPriceRange =
            null;


        addBotMessage(
            "Sure! Please choose a different price range."
        );


        addOptions(

            priceRanges,

            function (
                option,
                row
            ) {

                row.remove();


                selectedPriceRange =
                    option;


                addUserMessage(
                    option.label
                );


                showMatchingProducts();

            }

        );
    }


    /* ADD RESULT ACTIONS

       WITH RESULTS:

       Find Another Gift
       Exit Giftify Chat

       WITHOUT RESULTS:

       Try Different Price Range
       Find Another Gift
       Exit Giftify Chat */
    function addResultActions(
        hasResults = true
    ) {

        const actionContainer =
            document.createElement("div");

        actionContainer.className =
            "chat-result-actions";


        /* TRY DIFFERENT PRICE */
        if (!hasResults) {

            const tryPriceButton =
                createActionButton(

                    "Try Different Price Range",

                    "try-price-button",

                    function () {

                        actionContainer.remove();

                        tryDifferentPriceRange();

                    }

                );


            actionContainer.appendChild(
                tryPriceButton
            );
        }


        /* FIND ANOTHER GIFT */
        const findAnotherButton =
            createActionButton(

                "Find Another Gift",

                "find-another-gift-button",

                function () {

                    actionContainer.remove();

                    findAnotherGift();

                }

            );


        actionContainer.appendChild(
            findAnotherButton
        );


        /* EXIT CHAT */
        const exitButton =
            createActionButton(

                "Exit Giftify Chat",

                "exit-chat-button",

                function () {

                    exitGiftifyChat();

                }

            );


        actionContainer.appendChild(
            exitButton
        );


        /* ADD TO CHAT */
        chatBody.appendChild(
            actionContainer
        );


        scrollToBottom();
    }


    /* SHOW MATCHING PRODUCTS */
    function showMatchingProducts() {

        const matches =
            getMatchingHampers();


        /* RESULT MESSAGE */
        addBotMessage(
            "Here are some Giftify hampers that match your choices"
        );


        /* NO MATCH */
        if (
            matches.length === 0
        ) {

            const noResults =
                document.createElement("div");

            noResults.className =
                "chat-no-results";


            noResults.innerHTML = `

                <div class="no-results-icon">
                    <img src="/static/main/images/account/gcs.png" alt="No results" >

                </div>

                <strong>
                    We couldn't find an exact match.
                </strong>

                <p>
                    We couldn't find a gift in this price range.
                </p>

            `;


            chatBody.appendChild(
                noResults
            );


            scrollToBottom();


            /* ACTIONS */
            addResultActions(
                false
            );


            return;
        }


        /* PRODUCT GRID */
        const grid =
            document.createElement("div");

        grid.className =
            "chat-product-grid";


        matches.forEach(
            function (hamper) {

                grid.appendChild(
                    createProductCard(
                        hamper
                    )
                );

            }
        );


        chatBody.appendChild(
            grid
        );


        scrollToBottom();


        /* RESULT ACTIONS

           Find Another Gift
           Exit Giftify Chat */
        addResultActions(
            true
        );
    }


    /* INITIAL CHAT */
    function initializeChat() {

        chatBody.innerHTML =
            "";


        selectedCustomization =
            null;

        selectedCategory =
            null;

        selectedPriceRange =
            null;


        addBotMessage(
            "",
            {
                welcome: true
            }
        );


        addFindGiftButton();
    }


    /* THREE DOT MENU */
    if (
        menuButton &&
        menu
    ) {

        menuButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                menu.classList.toggle(
                    "show"
                );

            }
        );
    }


    /* CLOSE MENU OUTSIDE */
    document.addEventListener(
        "click",
        function (event) {

            if (
                menu &&
                menuButton &&
                !menu.contains(
                    event.target
                )
                &&
                !menuButton.contains(
                    event.target
                )
            ) {

                menu.classList.remove(
                    "show"
                );
            }

        }
    );


    /* RESTART CHAT */
    if (restartButton) {

        restartButton.addEventListener(
            "click",
            function () {

                if (menu) {

                    menu.classList.remove(
                        "show"
                    );
                }


                initializeChat();

            }
        );
    }


    /* START CHAT */
    initializeChat();

});