const loginForm = document.getElementById("loginForm");
const nombre = document.getElementById("nombre");
const password = document.getElementById("password");
const nombreError = document.getElementById("nombreError");
const passwordError = document.getElementById("passwordError");
const formError = document.getElementById("loginFormError");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let formularioValido = true;
    nombreError.textContent = "";
    passwordError.textContent = "";
    formError.textContent = "";

    if (nombre.value.trim() === "") {
        nombreError.textContent = "El nombre es obligatorio.";
        formularioValido = false;
    }

    if (password.value === "") {
        passwordError.textContent = "La contraseña es obligatoria.";
        formularioValido = false;
    } else {
        const requisitosPassword = [
            [password.value.length >= 8, "8 caracteres mínimo"],
            [/[A-Z]/.test(password.value), "una mayúscula"],
            [/[0-9]/.test(password.value), "un número"],
            [/[^A-Za-z0-9]/.test(password.value), "un carácter especial"]
        ];
        const requisitosFaltantes = requisitosPassword
            .filter(function (requisito) { return !requisito[0]; })
            .map(function (requisito) { return requisito[1]; });

        if (requisitosFaltantes.length > 0) {
            passwordError.textContent = "Falta: " + requisitosFaltantes.join(", ") + ".";
            formularioValido = false;
        }
    }

    if (!formularioValido) {
        formError.textContent = "Completa los campos indicados para acceder.";
        return;
    }

    window.location.href = "Home.html";
});