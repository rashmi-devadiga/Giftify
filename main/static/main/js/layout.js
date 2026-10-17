document.addEventListener("DOMContentLoaded", function () {


    /* MOBILE MENU*/
    const menuButton =
        document.getElementById(
            "mobileMenuBtn"
        );


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    if (menuButton && mobileMenu) {

        menuButton.addEventListener(
            "click",
            function () {

                mobileMenu.classList.toggle(
                    "show"
                );

            }
        );

    }



    /* NAVIGATION ACTIVE STATE */
    const navLinks =
        document.querySelectorAll(
            ".navbar-links .nav-link"
        );


    const mobileLinks =
        document.querySelectorAll(
            ".mobile-nav-link"
        );


    function activateLink(
        clickedLink,
        links
    ) {

        links.forEach(function (link) {

            link.classList.remove(
                "active"
            );

        });


        clickedLink.classList.add(
            "active"
        );

    }


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    link.getAttribute("href") ===
                    "#"
                ) {

                    activateLink(
                        link,
                        navLinks
                    );

                }

            }
        );

    });


    mobileLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                activateLink(
                    link,
                    mobileLinks
                );


                if (mobileMenu) {

                    mobileMenu.classList.remove(
                        "show"
                    );

                }

            }
        );

    });



    /* NAVBAR SCROLL EFFECT */
    const navbar =
        document.querySelector(
            ".main-navbar"
        );


    function updateNavbar() {

        if (!navbar) return;


        if (window.scrollY > 10) {

            navbar.style.boxShadow =
                "0 10px 30px rgba(55, 42, 38, 0.07)";


            navbar.style.background =
                "rgba(255, 250, 248, 0.97)";

        }

        else {

            navbar.style.boxShadow =
                "none";


            navbar.style.background =
                "rgba(255, 250, 248, 0.94)";

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );


    updateNavbar();



    /* CART COUNT */
    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    window.updateGiftifyCartCount =
        function (count) {

            if (!cartCount) {

                return;

            }


            const newCount =
                Number(count) || 0;


            cartCount.textContent =
                newCount;

        };


    if (cartCount) {

        const observer =
            new MutationObserver(
                function () {

                    cartCount.classList.add(
                        "cart-updated"
                    );


                    setTimeout(
                        function () {

                            cartCount.classList.remove(
                                "cart-updated"
                            );

                        },
                        350
                    );

                }
            );


        observer.observe(
            cartCount,
            {
                childList: true,
                characterData: true,
                subtree: true
            }
        );

    }



    /* CLOSE MOBILE MENU
       WHEN CLICKING OUTSIDE */
    document.addEventListener(
        "click",
        function (event) {

            if (
                !mobileMenu ||
                !menuButton
            ) {

                return;

            }


            if (
                mobileMenu.classList.contains(
                    "show"
                ) &&
                !mobileMenu.contains(
                    event.target
                ) &&
                !menuButton.contains(
                    event.target
                )
            ) {

                mobileMenu.classList.remove(
                    "show"
                );

            }

        }
    );



    /* CART ANIMATION */
    const style =
        document.createElement("style");


    style.textContent = `

        .cart-updated {

            animation:
                cartPop 0.35s ease;

        }


        @keyframes cartPop {

            0% {
                transform: scale(1);
            }

            45% {
                transform: scale(1.25);
            }

            100% {
                transform: scale(1);
            }

        }

    `;


    document.head.appendChild(style);



    /* ACCOUNT SIDE PANEL */
    const accountButton =
        document.getElementById(
            "accountPanelButton"
        );


    const accountPanel =
        document.getElementById(
            "accountSidePanel"
        );


    const accountOverlay =
        document.getElementById(
            "accountPanelOverlay"
        );


    const accountClose =
        document.getElementById(
            "accountPanelClose"
        );


    const accountFrame =
        document.getElementById(
            "accountPanelFrame"
        );



    /* OPEN ACCOUNT PANEL */
    function openAccountPanel() {

        if (
            !accountPanel ||
            !accountOverlay
        ) {

            return;

        }


        accountPanel.classList.add(
            "active"
        );


        accountOverlay.classList.add(
            "active"
        );


        document.body.classList.add(
            "account-panel-open"
        );


        accountPanel.setAttribute(
            "aria-hidden",
            "false"
        );


        if (accountButton) {

            accountButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        if (
            accountFrame &&
            accountFrame.dataset.url
        ) {

            accountFrame.src =
                accountFrame.dataset.url;

        }

    }



    /* CLOSE ACCOUNT PANEL */
    function closeAccountPanel() {

        if (
            !accountPanel ||
            !accountOverlay
        ) {

            return;

        }


        accountPanel.classList.remove(
            "active"
        );


        accountOverlay.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "account-panel-open"
        );


        accountPanel.setAttribute(
            "aria-hidden",
            "true"
        );


        if (accountButton) {

            accountButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }



    /* ACCOUNT BUTTON */
    if (accountButton) {

        accountButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    accountPanel &&
                    accountPanel.classList.contains(
                        "active"
                    )
                ) {

                    closeAccountPanel();

                }

                else {

                    openAccountPanel();

                }

            }
        );

    }



    /* ACCOUNT CLOSE BUTTON */
    if (accountClose) {

        accountClose.addEventListener(
            "click",
            function () {

                closeAccountPanel();

            }
        );

    }



    /* ACCOUNT OVERLAY */
    if (accountOverlay) {

        accountOverlay.addEventListener(
            "click",
            function () {

                closeAccountPanel();

            }
        );

    }



    /* LOGIN BOTTOM PANEL */
    const loginPanel =
        document.getElementById(
            "loginBottomPanel"
        );


    const loginOverlay =
        document.getElementById(
            "loginPanelOverlay"
        );


    const loginClose =
        document.getElementById(
            "loginPanelClose"
        );


    const loginContent =
        document.getElementById(
            "loginPanelContent"
        );



    /* OPEN LOGIN PANEL */
    function openLoginPanel() {

        if (
            !loginPanel ||
            !loginOverlay
        ) {

            return;

        }


        loginPanel.classList.add(
            "active"
        );


        loginOverlay.classList.add(
            "active"
        );


        loginPanel.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "login-panel-open"
        );

    }



    /* CLOSE LOGIN PANEL */
    function closeLoginPanel() {

        if (
            !loginPanel ||
            !loginOverlay
        ) {

            return;

        }


        loginPanel.classList.remove(
            "active"
        );


        loginOverlay.classList.remove(
            "active"
        );


        loginPanel.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "login-panel-open"
        );

    }



    /* INITIALIZE LOGIN FORM */
    function initializeLoginForm() {

        if (!loginContent) {

            return;

        }



        /* PASSWORD TOGGLE */
        const passwordInput =
            loginContent.querySelector(
                "#loginPassword"
            );


        const passwordToggle =
            loginContent.querySelector(
                "#loginPasswordToggle"
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


                        passwordToggle.setAttribute(
                            "aria-label",
                            "Hide password"
                        );

                    }

                    else {

                        passwordInput.type =
                            "password";


                        passwordToggle.textContent =
                            "Show";


                        passwordToggle.setAttribute(
                            "aria-label",
                            "Show password"
                        );

                    }

                }
            );

        }



        /* LOGIN FORM */
        const loginForm =
            loginContent.querySelector(
                "#loginForm"
            );


        if (!loginForm) {

            return;

        }


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


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


                const formData =
                    new FormData(
                        loginForm
                    );


                fetch(
                    loginForm.action,
                    {
                        method: "POST",
                        body: formData,
                        credentials: "same-origin",
                        headers: {
                            "X-Requested-With":
                                "XMLHttpRequest"
                        }
                    }
                )
                .then(function (response) {

                    if (
                        response.redirected
                    ) {

                        window.location.href =
                            response.url;

                        return null;

                    }


                    return response.text();

                })
                .then(function (html) {

                    if (!html) {

                        return;

                    }


                    const parser =
                        new DOMParser();


                    const page =
                        parser.parseFromString(
                            html,
                            "text/html"
                        );


                    const newLoginPage =
                        page.querySelector(
                            ".login-page"
                        );


                    if (newLoginPage) {

                        loginContent.innerHTML =
                            newLoginPage.outerHTML;


                        initializeLoginForm();

                    }

                })
                .catch(function () {

                    const button =
                        loginContent.querySelector(
                            ".auth-button"
                        );


                    if (button) {

                        button.textContent =
                            "Login";

                        button.disabled =
                            false;

                    }

                });

            }
        );

    }



    /* INITIALIZE REGISTER FORM */
    function initializeRegisterForm() {

        if (!loginContent) {

            return;

        }



        /* PASSWORD TOGGLE */
        function setupPasswordToggle(
            inputId,
            buttonId
        ) {

            const input =
                loginContent.querySelector(
                    "#" + inputId
                );


            const button =
                loginContent.querySelector(
                    "#" + buttonId
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

                    }

                    else {

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
            loginContent.querySelector(
                "#registerForm"
            );


        if (!registerForm) {

            return;

        }


        registerForm.addEventListener(
            "submit",
            function (event) {

                const password =
                    loginContent.querySelector(
                        "#registerPassword"
                    );


                const confirmPassword =
                    loginContent.querySelector(
                        "#confirmPassword"
                    );


                if (
                    password &&
                    confirmPassword &&
                    password.value !==
                    confirmPassword.value
                ) {

                    event.preventDefault();

                    alert(
                        "Passwords do not match."
                    );

                    return;

                }


                if (
                    password &&
                    password.value.length < 6
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



    /* LOAD LOGIN PAGE */
    function loadLoginPanel(loginUrl) {

        if (!loginContent) {

            return;

        }


        openLoginPanel();


        loginContent.innerHTML = `

            <div class="login-loading">

                <div class="login-loading-text">
                    Loading...
                </div>

            </div>

        `;


        fetch(
            loginUrl,
            {
                method: "GET",
                credentials: "same-origin"
            }
        )
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load login"
                );

            }


            return response.text();

        })
        .then(function (html) {

            const parser =
                new DOMParser();


            const page =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const loginPage =
                page.querySelector(
                    ".login-page"
                );


            if (!loginPage) {

                throw new Error(
                    "Login form not found"
                );

            }


            loginContent.innerHTML =
                loginPage.outerHTML;


            initializeLoginForm();



            /* CREATE ACCOUNT LINK INSIDE LOGIN */
            const registerLinks =
                loginContent.querySelectorAll(
                    'a[href*="/register/"]'
                );


            registerLinks.forEach(
                function (registerLink) {

                    registerLink.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            loadRegisterPanel(
                                registerLink.href
                            );

                        }
                    );

                }
            );

        })
        .catch(function () {

            loginContent.innerHTML = `

                <div class="login-loading">

                    <div class="login-loading-text">
                        Unable to load login.
                    </div>

                    <button
                        type="button"
                        class="login-retry-button"
                    >
                        Try Again
                    </button>

                </div>

            `;


            const retryButton =
                loginContent.querySelector(
                    ".login-retry-button"
                );


            if (retryButton) {

                retryButton.addEventListener(
                    "click",
                    function () {

                        loadLoginPanel(
                            loginUrl
                        );

                    }
                );

            }

        });

    }



    /* LOAD REGISTER PAGE */
    function loadRegisterPanel(
        registerUrl
    ) {

        if (!loginContent) {

            return;

        }


        openLoginPanel();


        loginContent.innerHTML = `

            <div class="login-loading">

                <div class="login-loading-text">
                    Loading...
                </div>

            </div>

        `;


        fetch(
            registerUrl,
            {
                method: "GET",
                credentials: "same-origin"
            }
        )
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load register"
                );

            }


            return response.text();

        })
        .then(function (html) {

            const parser =
                new DOMParser();


            const page =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const registerPage =
                page.querySelector(
                    ".auth-page"
                );


            if (!registerPage) {

                throw new Error(
                    "Register form not found"
                );

            }


            loginContent.innerHTML =
                registerPage.outerHTML;


            initializeRegisterForm();



            /* LOGIN LINK INSIDE REGISTER */
            const loginLinks =
                loginContent.querySelectorAll(
                    'a[href*="/login/"]'
                );


            loginLinks.forEach(
                function (loginLink) {

                    loginLink.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            loadLoginPanel(
                                loginLink.href
                            );

                        }
                    );

                }
            );

        })
        .catch(function () {

            loginContent.innerHTML = `

                <div class="login-loading">

                    <div class="login-loading-text">
                        Unable to load register.
                    </div>

                    <button
                        type="button"
                        class="login-retry-button"
                    >
                        Try Again
                    </button>

                </div>

            `;


            const retryButton =
                loginContent.querySelector(
                    ".login-retry-button"
                );


            if (retryButton) {

                retryButton.addEventListener(
                    "click",
                    function () {

                        loadRegisterPanel(
                            registerUrl
                        );

                    }
                );

            }

        });

    }



    /* MAKE LOGIN PANEL AVAILABLE GLOBALLY */
    window.openLoginPanel =
        loadLoginPanel;



    /* FIND LOGIN / REGISTER LINKS
       IN MAIN PAGE*/
    document.addEventListener(
        "click",
        function (event) {

            const authLink =
                event.target.closest(
                    'a[href*="/login/"], a[href*="/register/"]'
                );


            if (!authLink) {

                return;

            }


            /*
                Do not intercept links that are
                already inside the login panel.
            */
            if (
                loginPanel &&
                loginPanel.contains(
                    authLink
                )
            ) {

                return;

            }


            event.preventDefault();

            event.stopPropagation();


            const href =
                authLink.href;


            if (
                href.includes(
                    "/register/"
                )
            ) {

                loadRegisterPanel(
                    href
                );

            }

            else {

                loadLoginPanel(
                    href
                );

            }

        }
    );



    /* LOGIN LINK INSIDE ACCOUNT IFRAME */
    if (accountFrame) {

        accountFrame.addEventListener(
            "load",
            function () {

                try {

                    const frameDocument =
                        accountFrame.contentDocument ||
                        accountFrame.contentWindow.document;


                    if (!frameDocument) {

                        return;

                    }


                    frameDocument.addEventListener(
                        "click",
                        function (event) {

                            const authLink =
                                event.target.closest(
                                    'a[href*="/login/"], a[href*="/register/"]'
                                );


                            if (!authLink) {

                                return;

                            }


                            event.preventDefault();

                            event.stopPropagation();


                            const href =
                                authLink.href;


                            if (
                                href.includes(
                                    "/register/"
                                )
                            ) {

                                loadRegisterPanel(
                                    href
                                );

                            }

                            else {

                                loadLoginPanel(
                                    href
                                );

                            }

                        }
                    );

                }

                catch (error) {

                    console.log(
                        "Unable to access account iframe:",
                        error
                    );

                }

            }
        );

    }



    /* LOGIN PANEL CLOSE */
    if (loginClose) {

        loginClose.addEventListener(
            "click",
            function () {

                closeLoginPanel();

            }
        );

    }



    /* LOGIN OVERLAY CLICK */
    if (loginOverlay) {

        loginOverlay.addEventListener(
            "click",
            function () {

                closeLoginPanel();

            }
        );

    }



    /* ESCAPE KEY */
    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            /* LOGIN PANEL */
            if (
                loginPanel &&
                loginPanel.classList.contains(
                    "active"
                )
            ) {

                closeLoginPanel();

                return;

            }


            /* ACCOUNT PANEL */
            if (
                accountPanel &&
                accountPanel.classList.contains(
                    "active"
                )
            ) {

                closeAccountPanel();

                return;

            }


            /* MOBILE MENU */
            if (
                mobileMenu &&
                mobileMenu.classList.contains(
                    "show"
                )
            ) {

                mobileMenu.classList.remove(
                    "show"
                );

            }

        }
    );

});