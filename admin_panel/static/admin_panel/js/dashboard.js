document.addEventListener("DOMContentLoaded", function () {

    /* CURRENT DATE */
    const dateElement =
        document.getElementById("currentDate");


    if (dateElement) {

        const today = new Date();

        const options = {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        };


        dateElement.textContent =
            today.toLocaleDateString(
                "en-IN",
                options
            );

    }


    /* STAT CARD NUMBER ANIMATION */
    const statNumbers =
        document.querySelectorAll(".stat-info h2");


    statNumbers.forEach(function (element) {

        const text = element.textContent.trim();

        const numberMatch =
            text.match(/[\d,]+/);


        if (!numberMatch) {
            return;
        }


        const number =
            parseInt(
                numberMatch[0].replace(/,/g, "")
            );


        if (number === 0) {
            return;
        }


        const prefix =
            text.startsWith("₹") ? "₹" : "";


        let current = 0;

        const duration = 600;

        const steps = 30;

        const increment =
            number / steps;


        const timer =
            setInterval(function () {

                current += increment;


                if (current >= number) {

                    current = number;

                    clearInterval(timer);

                }


                element.textContent =
                    prefix +
                    Math.floor(current)
                        .toLocaleString("en-IN");

            }, duration / steps);

    });

});