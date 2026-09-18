document.addEventListener("DOMContentLoaded", () => {

    const tipoUsuario =
        document.getElementById("tipoUsuario");

    const instructorReport =
        document.getElementById("instructorReport");

    const studentReport =
        document.getElementById("studentReport");

    const instructorBody =
        document.getElementById("instructorBody");

    const studentBody =
        document.getElementById("studentBody");

    const totalUsers =
        document.getElementById("totalUsers");

    const noResults =
        document.getElementById("noResults");

    const clearFilters =
        document.getElementById("clearFilters");

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");

    function updateReport() {

        const type =
            tipoUsuario.value;


        if (type === "instructor") {

            instructorReport.style.display =
                "block";

            studentReport.style.display =
                "none";

        } else {

            instructorReport.style.display =
                "none";

            studentReport.style.display =
                "block";

        }


        updateUsers();

    }

    function updateUsers() {

        const type =
            tipoUsuario.value;

        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        let rows;


        if (type === "instructor") {

            rows =
                [...instructorBody.querySelectorAll("tr")];

        } else {

            rows =
                [...studentBody.querySelectorAll("tr")];

        }


        let visibleUsers = 0;


        rows.forEach(row => {

            const searchData =
                row.dataset.search
                    .toLowerCase();


            const matchesSearch =
                search === "" ||
                searchData.includes(search);


            if (matchesSearch) {

                row.style.display =
                    "table-row";

                visibleUsers++;

            } else {

                row.style.display =
                    "none";

            }

        });


        totalUsers.textContent =
            visibleUsers;


        if (visibleUsers === 0) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }

    }

    tipoUsuario.addEventListener(
        "change",
        () => {

            searchInput.value = "";

            updateReport();

        }
    );

    searchInput.addEventListener(
        "input",
        updateUsers
    );


    searchButton.addEventListener(
        "click",
        updateUsers
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                updateUsers();

            }

        }
    );

    clearFilters.addEventListener(
        "click",
        () => {

            tipoUsuario.value =
                "instructor";

            searchInput.value =
                "";

            updateReport();

        }
    );

    updateReport();

});