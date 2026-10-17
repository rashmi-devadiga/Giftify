document.addEventListener("DOMContentLoaded", function () {

    const page = document.querySelector(".order-details-page");

    if (!page) {
        return;
    }

    // Small entrance animation
    const cards = document.querySelectorAll(".details-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.35s ease, transform 0.35s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, index * 80);

    });

});