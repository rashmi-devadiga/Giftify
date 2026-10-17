document.addEventListener("DOMContentLoaded", function () {

    /* SIDEBAR MOBILE TOGGLE */
    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) {
        return;
    }


    /* PROFILE MENU */
    const profileButton = document.querySelector(".profile-more");
    const profile = document.querySelector(".admin-profile");


    if (profileButton && profile) {

        profileButton.addEventListener("click", function (event) {

            event.stopPropagation();

            profile.classList.toggle("profile-open");

        });


        /* Close when clicking outside */
        document.addEventListener("click", function (event) {

            if (!profile.contains(event.target)) {

                profile.classList.remove("profile-open");

            }

        });

    }


    /* NAVIGATION ACTIVE EFFECT */
    const navItems = document.querySelectorAll(".nav-item");


    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            navItems.forEach(function (nav) {

                nav.classList.remove("clicked");

            });

            item.classList.add("clicked");

        });

    });


    /* SMOOTH HOVER */
    navItems.forEach(function (item) {

        item.addEventListener("mouseenter", function () {

            item.style.transition =
                "all 0.25s ease";

        });

    });


    /* PREVENT EMPTY LINKS FROM JUMPING */
    const emptyLinks = document.querySelectorAll(
        '.nav-item[href="#"]'
    );


    emptyLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

        });

    });


});