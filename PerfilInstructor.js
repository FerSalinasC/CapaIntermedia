document.addEventListener("DOMContentLoaded", () => {

    const cards = [...document.querySelectorAll(".course-card")];

    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    const categoria = document.getElementById("categoria");
    const estadoCurso = document.getElementById("estadoCurso");
    const clearFilters = document.getElementById("clearFilters");
    const noResults = document.getElementById("noResults");

    const totalIngresos = document.getElementById("totalIngresos");
    const totalTarjeta = document.getElementById("totalTarjeta");
    const totalPaypal = document.getElementById("totalPaypal");
    const totalTransferencia = document.getElementById("totalTransferencia");

    function formatMoney(value) {

        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    }

    function getCourseData(card) {

        let total = 0;

        const payments = {
            "Tarjeta": 0,
            "PayPal": 0,
            "Transferencia": 0
        };


        const rows = card.querySelectorAll(
            ".students-table tbody tr"
        );


        rows.forEach(row => {

            const priceText =
                row.children[3].textContent
                    .replace(/[$,]/g, "")
                    .trim();

            const price = parseFloat(priceText) || 0;

            const paymentMethod =
                row.children[4].textContent.trim();


            total += price;


            if (payments[paymentMethod] !== undefined) {

                payments[paymentMethod] += price;

            }

        });


        return {
            total: total,
            payments: payments
        };

    }

    function updateReport() {

        const startDate = fechaInicio.value;
        const endDate = fechaFin.value;

        const selectedCategory =
            categoria.value;

        const selectedStatus =
            estadoCurso.value;


        let grandTotal = 0;

        let paymentTotals = {

            "Tarjeta": 0,

            "PayPal": 0,

            "Transferencia": 0

        };


        let visibleCourses = 0;


        cards.forEach(card => {

            const courseDate =
                card.dataset.created;

            const courseCategory =
                card.dataset.category;

            const courseStatus =
                card.dataset.status;

            const matchesStart =
                !startDate ||
                courseDate >= startDate;


            const matchesEnd =
                !endDate ||
                courseDate <= endDate;

            const matchesCategory =
                selectedCategory === "todas" ||
                courseCategory === selectedCategory;

            const matchesStatus =
                selectedStatus === "todos" ||
                courseStatus === selectedStatus;

            const shouldShow =
                matchesStart &&
                matchesEnd &&
                matchesCategory &&
                matchesStatus;


            if (shouldShow) {

                card.style.display = "block";

                visibleCourses++;


                /* calculamos ingresos */

                const courseData =
                    getCourseData(card);


                grandTotal +=
                    courseData.total;


                paymentTotals["Tarjeta"] +=
                    courseData.payments["Tarjeta"];


                paymentTotals["PayPal"] +=
                    courseData.payments["PayPal"];


                paymentTotals["Transferencia"] +=
                    courseData.payments["Transferencia"];

            } else {

                card.style.display = "none";

            }

        });


        /* ingresos */

        totalIngresos.textContent =
            formatMoney(grandTotal);


        totalTarjeta.textContent =
            formatMoney(
                paymentTotals["Tarjeta"]
            );


        totalPaypal.textContent =
            formatMoney(
                paymentTotals["PayPal"]
            );


        totalTransferencia.textContent =
            formatMoney(
                paymentTotals["Transferencia"]
            );

        if (visibleCourses === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }

    fechaInicio.addEventListener(
        "change",
        updateReport
    );


    fechaFin.addEventListener(
        "change",
        updateReport
    );


    categoria.addEventListener(
        "change",
        updateReport
    );


    estadoCurso.addEventListener(
        "change",
        updateReport
    );

    clearFilters.addEventListener(
        "click",
        () => {

            fechaInicio.value = "";

            fechaFin.value = "";

            categoria.value = "todas";

            estadoCurso.value = "todos";


            updateReport();

        }
    );

    const searchInput =
        document.querySelector(
            ".search-container input"
        );


    const searchButton =
        document.querySelector(
            ".search-button"
        );


    function searchCourses() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        cards.forEach(card => {

            const courseName =
                card.querySelector("h3")
                    .textContent
                    .toLowerCase();


            const categoryName =
                card.dataset.category
                    .toLowerCase();


            if (
                courseName.includes(search) ||
                categoryName.includes(search)
            ) {

                card.dataset.searchMatch = "true";

            } else {

                card.dataset.searchMatch = "false";

            }

        });


        updateReport();

    }


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchCourses
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    searchCourses();

                }

            }
        );

    }

    updateReport();

});