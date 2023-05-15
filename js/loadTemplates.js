let logOut = false;
document.addEventListener("DOMContentLoaded", async () => {
	await includeHtml();
	navItems = checkNavItem();
	page = checkItems();
	setActivelink();
	setLogoutEvent();
});

async function includeHtml() {
	let includeElem = document.querySelectorAll("[include-html]");
	for (let i = 0; i < includeElem.length; i++) {
		const element = includeElem[i];
		file = element.getAttribute("include-html");
		let resp = await fetch(file);
		if (resp.ok) {
			element.innerHTML = await resp.text();
		} else {
			element.innerHTML = "Element not Found";
		}
	}
}

function checkNavItem() {
	return document.querySelectorAll("nav ul li");
}

function checkItems() {
	let item = document.querySelector("[item]");
	let element = item.getAttribute("item");
	return element;
}

function setActivelink() {
	navItems.forEach((item) => {
		if (item.innerText == page) {
			item.classList.add("activeNavItem");
		}
	});
}

function setLogoutEvent() {
	document.querySelector(".user-icon").addEventListener("click", (event) => {
		event.stopPropagation();
		localStorage.removeItem("user");
		addLogoutStyle();
	});
}

function addLogoutStyle() {
	document.querySelector(".user-icon").classList.add("logout");
	document.querySelector(".logout-button").classList.add("active");

}
