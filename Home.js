const profileButton = document.querySelector(".profile-button");
const profileMenu = document.getElementById("profileMenu");

function cerrarMenuPerfil() {

profileMenu.hidden = true;
profileButton.setAttribute("aria-expanded", "false");

}

profileButton.addEventListener("click", function() {

const menuAbierto = profileButton.getAttribute("aria-expanded") === "true";

profileMenu.hidden = menuAbierto;
profileButton.setAttribute("aria-expanded", String(!menuAbierto));

});

document.addEventListener("click", function(event) {

if (!event.target.closest(".profile-menu-wrapper")) {
    cerrarMenuPerfil();
}

});

document.addEventListener("keydown", function(event) {

if (event.key === "Escape") {
    cerrarMenuPerfil();
    profileButton.focus();
}

});

function moverCarrusel(id, direccion) {

const carrusel = document.getElementById(id);

const distancia = 420;

carrusel.scrollBy({
    left: distancia * direccion,
    behavior: "smooth"
});

}

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchContainer = document.getElementById("searchContainer");
const courseFilters = document.getElementById("courseFilters");
const categoryFilter = document.getElementById("categoryFilter");
const authorFilter = document.getElementById("authorFilter");
const dateFromFilter = document.getElementById("dateFromFilter");
const dateToFilter = document.getElementById("dateToFilter");
const clearFilters = document.getElementById("clearFilters");
const noResults = document.getElementById("noResults");

function mostrarFiltros() {
    courseFilters.hidden = false;
    searchContainer.setAttribute("aria-expanded", "true");
}

function buscarCursos() {

const texto = searchInput.value.toLowerCase().trim();
const categoria = categoryFilter.value.toLowerCase();
const autor = authorFilter.value.toLowerCase().trim();
const fechaDesde = dateFromFilter.value;
const fechaHasta = dateToFilter.value;

const cursos = document.querySelectorAll(".course-card");
let cursosVisibles = 0;

cursos.forEach(function(curso) {

    const titulo = curso.querySelector("h3").textContent.toLowerCase();
    const datosCurso = {
        categoria: curso.dataset.category.toLowerCase(),
        autor: curso.dataset.author.toLowerCase(),
        fecha: curso.dataset.created,
        estado: curso.dataset.status
    };

    const coincideTexto = texto === "" || titulo.includes(texto) ||
        datosCurso.categoria.includes(texto) || datosCurso.autor.includes(texto);
    const coincideCategoria = categoria === "" || datosCurso.categoria === categoria;
    const coincideAutor = autor === "" || datosCurso.autor.includes(autor);
    const coincideFechaDesde = fechaDesde === "" || datosCurso.fecha >= fechaDesde;
    const coincideFechaHasta = fechaHasta === "" || datosCurso.fecha <= fechaHasta;
    const cursoActivo = datosCurso.estado === "activo";

    if (
        cursoActivo && coincideTexto && coincideCategoria && coincideAutor &&
        coincideFechaDesde && coincideFechaHasta
    ) {

        curso.style.display = "flex";
        cursosVisibles += 1;

    } else {

        curso.style.display = "none";
    }

});

document.querySelectorAll(".course-section").forEach(function(seccion) {
    const tieneCursosVisibles = [...seccion.querySelectorAll(".course-card")]
        .some(function(curso) {
            return curso.style.display !== "none";
        });

    seccion.hidden = !tieneCursosVisibles;
});

noResults.hidden = cursosVisibles !== 0;

}

searchButton.addEventListener("click", buscarCursos);
searchContainer.addEventListener("click", mostrarFiltros);
searchInput.addEventListener("focus", mostrarFiltros);

searchInput.addEventListener("input", buscarCursos);
authorFilter.addEventListener("input", buscarCursos);
categoryFilter.addEventListener("change", buscarCursos);
dateFromFilter.addEventListener("change", buscarCursos);
dateToFilter.addEventListener("change", buscarCursos);

searchInput.addEventListener("keyup", function(event) {

if (event.key === "Enter") {
    buscarCursos();
}

});

clearFilters.addEventListener("click", function() {
    searchInput.value = "";
    categoryFilter.value = "";
    authorFilter.value = "";
    dateFromFilter.value = "";
    dateToFilter.value = "";
    buscarCursos();
});

buscarCursos();