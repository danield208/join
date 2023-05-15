setURL("https://join.danieldoerbaum.de/join_backend");
let userDates = [];

let LoginBtn, file, Username, Usersurname, Usermail, Userpassword, localUserDates;
let bodyTag = document.querySelector("body");
let animationEndEvent = true;

user = {
	Name: "",
	Surname: "",
	Mail: "",
	Password: "",
};

document.addEventListener("DOMContentLoaded", init);

addEventListener("animationend", () => {
	if (animationEndEvent) {
		document.getElementById("loading-page").style = "display: none;";
	}
});

async function init() {
	await downloadFromServer();
	await loadTemplate(0);
	setBtns();
	checkLocalUserDates();
}

function setBtns() {
	loginBtn();
	signUpBtn();
	forgotPwBtn();
}
function checkLocalUserDates() {
	localUserDates = JSON.parse(localStorage.getItem("localUserDates"));
	if (!localUserDates == [] && localUserDates.checked) {
		document.querySelector("#eMailInput").value = localUserDates.localuserMail;
		document.querySelector("#passwordInput").value = localUserDates.localUserPW;
		document.querySelector("#remember").checked = localUserDates.checked;
	}
}

function loginBtn() {
	document.querySelector("#loginButton").addEventListener("click", () => {
		let mailInput = document.querySelector("#eMailInput");
		let pwInput = document.querySelector("#passwordInput");
		checkLogin(mailInput, pwInput);
	});
}

function checkLogin(mail, pw) {
	userDates = JSON.parse(backend.getItem("UserDates")) || [];
	if (userDates.length == 0) {
		console.warn("No Userdata available!");
	}

	for (let i = 0; i < userDates.length; i++) {
		if (userDates[i].Mail.includes(mail.value) && !mail.value == "") {
			let user = userDates[i];
			checkPW(user, pw, mail);
		} else if (!user.Mail.includes(mail.value) && !mail.value == "") {
			document.querySelector(".LoginNote").innerHTML = "";
			document.querySelector(".LoginNote").innerHTML = "The email or password you entered is incorrect.";
		}
	}
}

function checkPW(user, pw, mail) {
	if (user.Password == pw.value && !pw.value == "") {
		let userName = user.Name;
		window.open((href = "./summary.html"), "_self");
		localStorage.removeItem("user");
		localStorage.setItem("user", JSON.stringify(userName));
		if (document.querySelector("#remember").checked) {
			localStorage.removeItem("localUserDates");
			localStorage.setItem("localUserDates", JSON.stringify(setLocalUserDates(mail, pw)));
		} else if (!document.querySelector("#remember").checked) {
			localStorage.removeItem("localUserDates");
		}

		userDates = [];
	} else if (user.Mail == mail.value && !pw.value == "" && !user.Password.includes(pw.value)) {
		document.querySelector(".LoginNote").innerHtml = "";
		document.querySelector(".LoginNote").innerHTML = "The email or password you entered is incorrect.";
	}
}

function setLocalUserDates(mail, pw) {
	return {
		localuserMail: mail.value,
		localUserPW: pw.value,
		checked: document.querySelector("#remember").checked,
	};
}
function signUpBtn() {
	document.querySelector("#signupButton").addEventListener("click", (event) => {
		event.preventDefault();
		loadTemplate(1);
	});
}

async function setAddNewUserBtn() {
	document.querySelector("#signUpForm").addEventListener(
		"submit",
		async (event) => {
			event.preventDefault();
			saveUserArr();
			await backend.setItem("UserDates", JSON.stringify(userDates));
			clearInputfields();
			location.reload();
		},
		{ once: true }
	);
}

function saveUserArr() {
	Username = document.querySelector(".signUp-inputName");
	Usersurname = document.querySelector(".signUp-inputSurname");
	Usermail = document.querySelector(".signUp-inputMail");
	Userpassword = document.querySelector(".signUp-inputPassword");
	userDates.push({
		Name: Username.value,
		Surname: Usersurname.value,
		Mail: Usermail.value,
		Password: Userpassword.value,
	});
}
function clearInputfields() {
	(Username.value = ""), (Usersurname.value = ""), (Usermail.value = ""), (Userpassword.value = "");
}

function forgotPwBtn() {
	document.querySelector("#forgotPasswordButton").addEventListener("click", (event) => {
		event.preventDefault();
		loadTemplate(2);
		setTimeout(() => {
			setForgotPwEvent();
		}, 200);
	});
}

function setForgotPwEvent() {
	document.getElementById("senResetPwMailButton").addEventListener("click", (event) => {
		event.preventDefault();
		loadTemplate(3);
	});
}

async function loadTemplate(version) {
	if (version == 0) {
		file = "Temp/login.html";
		await loadHTMLTemplate();
	}
	if (version == 1) {
		file = "Temp/signUp.html";
		await loadHTMLTemplate(true);
		setAddNewUserBtn(true);
	}
	if (version == 2) {
		file = "Temp/forgot_password.html";
		await loadHTMLTemplate(true);
	}
	if (version == 3) {
		file = "Temp/reset_password.html";
		await loadHTMLTemplate(true);
		loadChangePasswordEvent();
	}
}

async function loadHTMLTemplate(blueBackground) {
	let resp = await fetch(file);
	bodyTag.innerHTML = await resp.text();
	if (blueBackground) bodyTag.style = "background-color: var(--color-blue);";
}

function loadChangePasswordEvent() {
	document.querySelector("button").addEventListener("click", (event) => {
		animationEndEvent = false;
		event.preventDefault();
		document.querySelector(".alertChangePW").classList.add("alertChangePWloaded");
		setTimeout(() => {
			location.reload();
		}, 500);
	});
}
