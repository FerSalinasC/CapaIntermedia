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
