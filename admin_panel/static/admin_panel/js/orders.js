document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ELEMENTS */
        const searchInput =
            document.getElementById(
                "orderSearch"
            );


        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        const dateFilter =
            document.getElementById(
                "dateFilter"
            );


        const clearFilters =
            document.getElementById(
                "clearFilters"
            );


        const tableBody =
            document.getElementById(
                "ordersTableBody"
            );


        const noResults =
            document.getElementById(
                "noResults"
            );


        const previousPage =
            document.getElementById(
                "previousPage"
            );


        const nextPage =
            document.getElementById(
                "nextPage"
            );


        const paginationNumbers =
            document.getElementById(
                "paginationNumbers"
            );


        /* ROWS */
        const allRows = Array.from(
            document.querySelectorAll(
                ".order-row"
            )
        );


        /* PAGINATION SETTINGS */
        const rowsPerPage = 10;

        let currentPage = 1;

        let filteredRows = [...allRows];


        /* FILTER ORDERS */
        function filterOrders() {


            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const selectedStatus =
                statusFilter.value;


            const selectedDate =
                dateFilter.value;


            filteredRows = allRows.filter(
                function (row) {


                    /* SEARCH */
                    const orderId =
                        (
                            row.dataset.orderId
                            || ""
                        ).toLowerCase();


                    const customer =
                        (
                            row.dataset.customer
                            || ""
                        ).toLowerCase();


                    const matchesSearch =
                        !searchValue
                        ||
                        orderId.includes(
                            searchValue
                        )
                        ||
                        customer.includes(
                            searchValue
                        );


                    /* STATUS */
                    const rowStatus =
                        row.dataset.status
                        || "";


                    const matchesStatus =
                        selectedStatus === "all"
                        ||
                        rowStatus === selectedStatus;


                    /* DATE */
                    let matchesDate = true;


                    if (selectedDate) {

                        const displayedDate =
                            row.dataset.date
                            || "";


                        /* Django currently stores dates
                           like 21 Sep 2026
                          
                           We convert the selected
                           browser date into the same
                           format */
                        const dateObject =
                            new Date(
                                selectedDate
                                + "T00:00:00"
                            );


                        if (
                            !isNaN(
                                dateObject.getTime()
                            )
                        ) {

                            const day =
                                String(
                                    dateObject.getDate()
                                ).padStart(
                                    2,
                                    "0"
                                );


                            const monthNames = [

                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec"

                            ];


                            const month =
                                monthNames[
                                    dateObject.getMonth()
                                ];


                            const year =
                                dateObject.getFullYear();


                            const formattedDate =
                                `${day} ${month} ${year}`;


                            matchesDate =
                                displayedDate
                                ===
                                formattedDate;

                        }

                    }


                    return (
                        matchesSearch
                        &&
                        matchesStatus
                        &&
                        matchesDate
                    );

                }
            );


            currentPage = 1;

            renderTable();

        }


        /* RENDER TABLE */
        function renderTable() {


            /* Hide every row first */
            allRows.forEach(
                function (row) {

                    row.style.display =
                        "none";

                }
            );


            /* NO RESULTS */ 
            if (
                filteredRows.length === 0
            ) {

                noResults.style.display =
                    "block";

                paginationNumbers.innerHTML =
                    "";

                previousPage.disabled =
                    true;

                nextPage.disabled =
                    true;

                return;

            }


            noResults.style.display =
                "none";


            /* PAGE CALCULATION */
            const totalPages =
                Math.ceil(
                    filteredRows.length
                    /
                    rowsPerPage
                );


            if (
                currentPage > totalPages
            ) {

                currentPage =
                    totalPages;

            }


            const startIndex =
                (
                    currentPage - 1
                )
                *
                rowsPerPage;


            const endIndex =
                startIndex
                +
                rowsPerPage;


            const pageRows =
                filteredRows.slice(
                    startIndex,
                    endIndex
                );


            /* SHOW CURRENT PAGE ROWS */
            pageRows.forEach(
                function (row) {

                    row.style.display =
                        "";

                }
            );


            /* PAGINATION */
            renderPagination(
                totalPages
            );

        }


        /* PAGINATION */
        function renderPagination(
            totalPages
        ) {


            paginationNumbers.innerHTML =
                "";


            previousPage.disabled =
                currentPage === 1;


            nextPage.disabled =
                currentPage === totalPages;


            /* Always show page numbers */
            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {


                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "page-number";


                button.textContent =
                    page;


                if (
                    page === currentPage
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                button.addEventListener(
                    "click",
                    function () {

                        currentPage =
                            page;

                        renderTable();

                    }
                );


                paginationNumbers.appendChild(
                    button
                );

            }

        }


        /* PREVIOUS PAGE */
        previousPage.addEventListener(
            "click",
            function () {

                if (
                    currentPage > 1
                ) {

                    currentPage--;

                    renderTable();

                }

            }
        );


        /* NEXT PAGE */
        nextPage.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.ceil(
                        filteredRows.length
                        /
                        rowsPerPage
                    );


                if (
                    currentPage < totalPages
                ) {

                    currentPage++;

                    renderTable();

                }

            }
        );


        /* SEARCH */
        searchInput.addEventListener(
            "input",
            filterOrders
        );


        /* STATUS */
        statusFilter.addEventListener(
            "change",
            filterOrders
        );


        /* DATE */
        dateFilter.addEventListener(
            "change",
            filterOrders
        );


        /* CLEAR FILTERS */
        clearFilters.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                statusFilter.value =
                    "all";

                dateFilter.value =
                    "";

                currentPage =
                    1;

                filterOrders();

            }
        );


        /* INITIAL LOAD */
        renderTable();

    }
);