const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");

const categoria = document.getElementById("categoria");
const estadoCurso = document.getElementById("estadoCurso");
const actividad = document.getElementById("actividad");

const clearFilters = document.getElementById("clearFilters");

const rows = document.querySelectorAll("#kardexBody tr");

const totalCourses = document.getElementById("totalCourses");
const noResults = document.getElementById("noResults");


function filterCourses() {

    let visibleCourses = 0;

    const startDate = fechaInicio.value;
    const endDate = fechaFin.value;

    const selectedCategory = categoria.value;
    const selectedStatus = estadoCurso.value;
    const selectedActivity = actividad.value;


    rows.forEach(row => {

        const registrationDate = row.dataset.registration;
        const rowCategory = row.dataset.category;
        const rowStatus = row.dataset.status;
        const complete = row.dataset.complete;


        let visible = true;


        // RANGO DE FECHAS

        if (startDate && registrationDate < startDate) {
            visible = false;
        }

        if (endDate && registrationDate > endDate) {
            visible = false;
        }


        // CATEGORÍA

        if (
            selectedCategory !== "todas" &&
            rowCategory !== selectedCategory
        ) {
            visible = false;
        }


        // CURSOS TERMINADOS

        if (
            selectedStatus === "terminados" &&
            complete !== "true"
        ) {
            visible = false;
        }


        // CURSOS ACTIVOS

        if (
            selectedActivity === "activos" &&
            rowStatus !== "activo"
        ) {
            visible = false;
        }


        if (visible) {

            row.style.display = "";

            visibleCourses++;

        } else {

            row.style.display = "none";

        }

    });


    totalCourses.textContent = visibleCourses;


    if (visibleCourses === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";

    }

}


// Actualizar filtros automáticamente

fechaInicio.addEventListener("change", filterCourses);
fechaFin.addEventListener("change", filterCourses);

categoria.addEventListener("change", filterCourses);
estadoCurso.addEventListener("change", filterCourses);
actividad.addEventListener("change", filterCourses);


// Limpiar filtos

clearFilters.addEventListener("click", function() {

    fechaInicio.value = "";
    fechaFin.value = "";

    categoria.value = "todas";
    estadoCurso.value = "todos";
    actividad.value = "todos";

    filterCourses();

});


// Estado inicial

filterCourses();