const registerForm = document.getElementById("registerForm");
const nombre = document.getElementById("nombre");
const genero = document.getElementById("genero");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const email = document.getElementById("email");
const foto = document.getElementById("foto");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const formError = document.getElementById("registerFormError");

const errores = {
	nombre: document.getElementById("nombreError"),
	genero: document.getElementById("generoError"),
	fecha: document.getElementById("fechaError"),
	email: document.getElementById("emailError"),
	foto: document.getElementById("fotoError"),
	password: document.getElementById("passwordError"),
	confirmPassword: document.getElementById("confirmPasswordError")
};

registerForm.addEventListener("submit", function (event) {
	event.preventDefault();
	let formularioValido = true;

	Object.values(errores).forEach(function (error) {
		error.textContent = "";
	});
	formError.textContent = "";

	if (nombre.value.trim() === "") {
		errores.nombre.textContent = "El nombre y apellido son obligatorios.";
		formularioValido = false;
	}
	if (genero.value === "") {
		errores.genero.textContent = "Selecciona una opción.";
		formularioValido = false;
	}
	if (fechaNacimiento.value === "") {
		errores.fecha.textContent = "La fecha de nacimiento es obligatoria.";
		formularioValido = false;
	}
	if (email.value.trim() === "") {
		errores.email.textContent = "El email es obligatorio.";
		formularioValido = false;
	} else if (!email.validity.valid) {
		errores.email.textContent = "Ingresa un email válido.";
		formularioValido = false;
	}
	if (foto.files.length === 0) {
		errores.foto.textContent = "La foto es obligatoria.";
		formularioValido = false;
	}

	if (password.value === "") {
		errores.password.textContent = "La contraseña es obligatoria.";
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
			errores.password.textContent = "Falta: " + requisitosFaltantes.join(", ") + ".";
			formularioValido = false;
		}
	}

	if (confirmPassword.value === "") {
		errores.confirmPassword.textContent = "Confirma tu contraseña.";
		formularioValido = false;
	} else if (confirmPassword.value !== password.value) {
		errores.confirmPassword.textContent = "Las contraseñas no coinciden.";
		formularioValido = false;
	}

	if (!formularioValido) {
		formError.textContent = "Completa los campos indicados para crear tu cuenta.";
		return;
	}

	window.location.href = "Home.html";
});
