class Contact {
	ID;
	Fullname;
	name;
	surname;
	initials;
	bgcolor;
	addedTasks;
	email;
	phone;
	contactIDs = [];
	letters = [];
	newTask;
	firstLoad = true;

	constructor() {
		this.loadContactList();
		this.setButtons();
	}

	// ANCHOR loading contacts
	loadContactList() {
		let target = document.getElementById("contact-list");
		target.innerHTML = "";
		this.initLettersArr();
		this.generateLetterList(target);
	}

	initLettersArr() {
		contactList.forEach((element) => {
			let letter = element.Surname.charAt(0).toLowerCase();
			if (!this.includesLetter(letter)) {
				this.letters.push(letter);
			}
		});
		this.letters.sort();
	}

	includesLetter(letter) {
		return this.letters.includes(letter);
	}

	generateLetterList(target) {
		this.letters.forEach((letter) => {
			const letterTemp = document.getElementById("letter_list_template").content.cloneNode(true);
			letterTemp.getElementById("letterListLetter").innerHTML = letter.toUpperCase();
			letterTemp.querySelector(".letterListID").id = letter + "-list";
			target.appendChild(letterTemp);
			this.loadContacts(letter);
		});
	}

	loadContacts(letter) {
		contactList.forEach((contact) => {
			const contactListTemp = document.getElementById("contact_inList_template").content.cloneNode(true);
			this.setID_listedContact(contactListTemp, contact);
			this.setInnerHTML_listedContact(contactListTemp, contact);
			this.setIconStyle_listedContact(contactListTemp, contact);
			if (this.getSurChar(contact).toLowerCase() == letter) {
				document.getElementById(letter + "-list").appendChild(contactListTemp);
			}
		});
	}

	setID_listedContact(contactListTemp, contact) {
		contactListTemp.querySelector(".listed-contact").id = contact.ID;
	}

	setInnerHTML_listedContact(contactListTemp, contact) {
		contactListTemp.getElementById("listContactName").innerHTML = this.setNameHtml(contact);
		contactListTemp.getElementById("listContactMail").innerHTML = contact.Mail;
		contactListTemp.getElementById("contactIcon").innerHTML = contact.Initials;
	}

	setIconStyle_listedContact(contactListTemp, contact) {
		contactListTemp.getElementById("contactIcon").style.background = contact.BgColor;
	}

	// ANCHOR set name first char to upper case
	setNameHtml(contact) {
		return this.setFirstName(contact) + " " + this.setSurname(contact);
	}

	setFirstName(contact) {
		return contact.Name.charAt().toUpperCase() + contact.Name.slice(1);
	}

	setSurname(contact) {
		return contact.Surname.charAt(0).toUpperCase() + contact.Surname.slice(1);
	}

	getSurChar(contact) {
		return contact.Surname.charAt(0).toLowerCase();
	}

	// ANCHOR add page event listener
	setButtons() {
		this.openContactInfo();
		this.mobileCloseContactInfoBtn();
		if (this.firstLoad) this.addNewContact();
	}

	// ANCHOR open contact info
	openContactInfo() {
		this.loadContactIds();
		this.ContactInfoEventListener();
	}

	loadContactIds() {
		contactList.forEach((contact) => {
			this.contactIDs.push(contact.ID);
		});
	}

	ContactInfoEventListener() {
		if (contactList.length > 0)
			this.contactIDs.forEach((id) => {
				document.getElementById(id).addEventListener("click", () => {
					this.setContactInfoStyle();
					const contactInfoTemp = document.getElementById("contact_info_template").content.cloneNode(true);
					const contact = contactList.find((contact) => contact.ID == id);
					this.setInnerHTML_contactInfo(contactInfoTemp, contact);
					this.setID_contactInfo(contactInfoTemp, contact);
					this.setIconStyle_contactInfo(contactInfoTemp, contact);
					document.getElementById("contact-informations").append(contactInfoTemp);
					this.edidContact(contact);
					if (document.querySelector("body").clientWidth > 650) {
						this.openNewTask();
					} else {
						this.linkToAddTask();
					}
				});
			});
	}

	setContactInfoStyle() {
		document.querySelector(".contact-right-container").classList.add("active");
		document.querySelector(".close_contact_info_tablet").classList.add("active");
		document.getElementById("contact-informations").classList.add("active");
		document.getElementById("contact-informations").innerHTML = "";
	}

	setInnerHTML_contactInfo(contactInfoTemp, contact) {
		contactInfoTemp.getElementById("infoName").innerHTML = this.setNameHtml(contact);
		contactInfoTemp.getElementById("infoMail").innerHTML = contact.Mail;
		contactInfoTemp.getElementById("infoPhone").innerHTML = contact.Phone;
		contactInfoTemp.getElementById("contact-info-icon").innerHTML = contact.Initials;
	}

	setID_contactInfo(contactInfoTemp, contact) {
		contactInfoTemp.querySelector(".edidContact").id = "edidContact_" + contact.ID;
	}

	setIconStyle_contactInfo(contactInfoTemp, contact) {
		contactInfoTemp.getElementById("contact-info-icon").style.background = contact.BgColor;
	}

	// only on mobile
	mobileCloseContactInfoBtn() {
		document.querySelector(".close_contact_info_tablet").addEventListener("click", () => {
			this.closeContactInfo();
		});
	}

	closeContactInfo() {
		document.getElementById("contact-informations").innerHTML = "";
		document.getElementById("contact-informations").classList.remove("active");
		document.querySelector(".close_contact_info_tablet").classList.remove("active");
		document.querySelector(".contact-right-container").classList.remove("active");
	}

	// ANCHOR new task in contact info
	openNewTask() {
		document.querySelector(".addtask-box").addEventListener("click", (event) => {
			event.stopPropagation();
			this.addNewTaskStyle();
			this.setCloseButton();
			this.newTask = new Task();
			newTask = this.newTask;
		});
	}

	addNewTaskStyle() {
		document.getElementById("overlay").classList.add("open");
		document.querySelector(".newTask-contact").classList.add("open");
		document.querySelector(".AddButton").classList.add("open");
	}

	removeNewTaskStyle() {
		document.getElementById("overlay").classList.remove("open");
		document.querySelector(".newTask-contact").classList.remove("open");
		document.querySelector(".AddButton").classList.remove("open");
	}

	setCloseButton() {
		document.querySelector(".close-icon-contact").addEventListener("click", (event) => {
			event.stopPropagation();
			this.removeNewTaskStyle();
		});
	}

	linkToAddTask() {
		document.querySelector(".addtask-box").addEventListener("click", (event) => {
			event.stopPropagation();
			window.location = "task.html";
		});
	}

	// ANCHOR new contact
	addNewContact() {
		document.querySelector(".add-contact").addEventListener("click", () => {
			this.appendSaveEdidTemplate();
			document.querySelector(".new-contact-buttons").innerHTML = "";
			document.querySelector(".new-contact-buttons").appendChild(this.getButtonTemplate(1));
			this.closeContactEdidCreateWindow(1);
			this.setNewContactStyle();
		});
	}

	setNewContactStyle() {
		document.getElementById("overlay").classList.add("open");
		document.getElementById("new-contact").classList.add("open");
		document.getElementById("new-contact-content").classList.add("open");
		this.setCreateEdidContactEvent("newContact");
	}

	createContact() {
		this.ID = new Date().getTime();
		this.readInputs();
		if (this.checkForInputPattern()) {
			this.continueCreateNewContact();
		} else {
			this.alertForReEnterValue();
		}
	}

	readInputs() {
		this.Fullname = document.querySelector("#input-name").value;
		this.phone = document.querySelector("#input-phone").value;
		this.email = document.querySelector("#input-email").value;
	}

	checkForInputPattern() {
		let input = document.getElementById("input-name");
		let regex = /^([A-Za-zÄäÖöÜü]){1,15}\s([A-Za-zÄäÖöÜü]){1,15}$/g;
		return regex.test(input.value);
	}

	continueCreateNewContact() {
		this.splitname();
		this.successCreateContact();
		this.createInitials();
		this.createRandomBgColor();
		this.newContact();
		setTimeout(() => {
			this.successCreateContact();
		}, 1000);
	}

	alertForReEnterValue() {
		let inputField = document.getElementById("checkInputPattern");
		inputField.classList.add("active");
		inputField.focus();
		setTimeout(() => {
			inputField.classList.remove("active");
		}, 3450);
		document.getElementById("input-name").focus();
	}

	splitname() {
		let splitname = this.Fullname.split(" ");
		this.name = splitname[0].charAt(0).toLowerCase() + splitname[0].slice(1);
		this.surname = splitname[1].charAt(0).toLowerCase() + splitname[1].slice(1);
	}

	successCreateContact() {
		document.getElementById("successCreateContact").classList.toggle("active");
	}

	createInitials() {
		let firstletter = this.name.charAt(0).toUpperCase();
		let secondletter = this.surname.charAt(0).toUpperCase();
		this.initials = firstletter + secondletter;
	}

	createRandomBgColor() {
		var r = Math.floor(Math.random() * 256);
		var g = Math.floor(Math.random() * 256);
		var b = Math.floor(Math.random() * 256);
		var alpha = 0.75;
		this.bgcolor = `rgba(${r},${g},${b},${alpha})`;
	}

	newContact() {
		contactList.push({
			ID: this.ID,
			Name: this.name,
			Surname: this.surname,
			Initials: this.initials,
			Mail: this.email,
			Phone: this.phone,
			BgColor: this.bgcolor,
		});
		this.saveLoadReload();
	}

	// ANCHOR edid contact
	edidContact(contact) {
		document.querySelector(`#edidContact_${contact.ID}`).addEventListener("click", () => {
			this.appendSaveEdidTemplate();
			document.getElementById("overlay").classList.add("open");
			document.getElementById("new-contact").classList.add("open");
			document.getElementById("new-contact-content").classList.add("open");
			this.setEdidButtons();
			this.SetValues(contact);
			this.setEdidButtonID(contact);
			this.setCreateEdidContactEvent("edidContact");
			this.setDeleteButton(contact);
			this.closeContactEdidCreateWindow(2);
		});
	}

	appendSaveEdidTemplate() {
		const template = document.getElementById("new_edid_contact_content_template");
		const clonedTemp = template.content.cloneNode(true);
		document.getElementById("new-contact").appendChild(clonedTemp);
	}

	setEdidButtons() {
		document.querySelector(".new-contact-buttons").innerHTML = "";
		document.querySelector(".new-contact-buttons").appendChild(this.getButtonTemplate(2));
	}

	SetValues(contact) {
		document.querySelector("#input-name").value =
			contact.Name.charAt(0).toUpperCase() +
			contact.Name.slice(1) +
			" " +
			contact.Surname.charAt(0).toUpperCase() +
			contact.Surname.slice(1);
		document.querySelector("#input-phone").value = contact.Phone;
		document.querySelector("#input-email").value = contact.Mail;
	}

	getButtonTemplate(version) {
		if (version == 1) {
			let temp = document.querySelector("#create-buttons-template");
			return temp.content.cloneNode(true);
		}

		if (version == 2) {
			let temp = document.querySelector("#save-button-template");
			return temp.content.cloneNode(true);
		}
	}

	setEdidButtonID(contact) {
		document.querySelector(".save-edided-contact").id = contact.ID;
	}

	saveEdid() {
		let index = this.contactListIndex();
		this.setNewValues(index);
	}

	contactListIndex() {
		let id = document.querySelector(".save-edided-contact").id;
		return contactList.findIndex((i) => i.ID == id);
	}

	setNewValues(i) {
		this.readInputs();
		if (this.checkForInputPattern()) {
			this.splitname();
			contactList[i].Name = this.name;
			contactList[i].Surname = this.surname;
			contactList[i].Mail = this.email;
			contactList[i].Phone = this.phone;
			this.saveLoadReload();
		} else {
			this.alertForReEnterValue();
		}
	}

	// ANCHOR delete contact
	setDeleteButton(contact) {
		let deleteButton = this.loadDeleteBtnTemp(contact);
		document.getElementById("delButton").appendChild(deleteButton);
		this.addDeleteEvent(contact.ID);
	}

	loadDeleteBtnTemp(contact) {
		let temp = document.querySelector("#delete-button-temp");
		let tempClone = temp.content.cloneNode(true);
		let button = tempClone.querySelector("button");
		button.classList.add("clonedDeleteBTN");
		button.id = "delete_" + contact.ID;
		return button;
	}

	addDeleteEvent(contactID) {
		document.querySelector("#delete_" + contactID).addEventListener("click", (event) => {
			event.stopPropagation();
			this.deleteContact(contactID);
			this.saveLoadReload();
		});
	}

	deleteContact(contactID) {
		let index = contactList.findIndex((i) => i.ID === contactID);
		contactList.splice(index, 1);
	}

	// ANCHOR set button event
	setCreateEdidContactEvent(action) {
		if (action == "newContact") {
			document.getElementById("submitFormNewContact").addEventListener("submit", (event) => {
				event.stopPropagation();
				this.createContact();
			});
		} else if (action == "edidContact") {
			document.getElementById("submitFormNewContact").addEventListener("submit", (event) => {
				event.stopPropagation();
				this.saveEdid();
			});
		}
	}

	// ANCHOR set buttons for edid and create window
	closeContactEdidCreateWindow(version) {
		let cancelAdd = document.querySelectorAll(".cancel_add");
		if (version == 1) this.setCancelButton(cancelAdd);
		else if (version == 2) this.setEdidButton(cancelAdd);
	}
	// Dopplungen entfernen und Auslagern

	setCancelButton(cancelAdd) {
		cancelAdd[0].addEventListener("click", () => {
			this.resetNewContactField();
		});
		cancelAdd[1].addEventListener("click", () => {
			this.resetNewContactField();
		});
	}

	setEdidButton(cancelAdd) {
		cancelAdd[0].addEventListener("click", () => {
			this.resetNewContactField();
		});
	}

	// ANCHOR save, load and reload page
	async saveLoadReload() {
		this.firstLoad = false;
		this.resetNewContactField();
		this.closeContactInfo();
		this.letters = [];
		this.contactIDs = [];
		await saveData();
		await loadData();
		this.loadContactList();
		this.setButtons();
	}

	// ANCHOR reset edid and create window
	resetNewContactField() {
		this.removeClassOpen();
		this.removeFormTemplate();
	}

	removeClassOpen() {
		document.getElementById("new-contact-content").classList.remove("open");
		document.getElementById("new-contact").classList.remove("open");
		document.getElementById("overlay").classList.remove("open");
	}

	removeFormTemplate() {
		document.getElementById("new-contact-content").remove();
	}
}
