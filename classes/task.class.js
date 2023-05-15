class Task extends DynamixObjects {
	ID;
	Title;
	editors = [];
	selectedContacts;
	Deadline;
	Category;
	Description;
	Priority;
	Subtaks = [];
	Status;
	prioBtns;
	dropDownBtns;
	contactbtns;
	catagoryBtns;
	newCategory;
	selfTask;
	setSubtask;

	constructor() {
		super();
		this.selfTask = this;
		this.setDropdownBtn();
		this.setPriorityBtn();
		this.disablePastdates();
		this.setContactBtn();
		this.loadCatListsetBtns();
		this.setClearBtn();
		this.setSubtask = new Subtask(this.selfTask);

	}

	//ANCHOR - Dropdown Buttons
	setDropdownBtn() {
		this.dropDownBtns = document.querySelectorAll(".dropdown");
		this.dropDownBtns.forEach((btn) => {
			btn.firstElementChild.addEventListener("click", (event) => {
				let id = event.target.id;
				this.openList(id);
			});
		});
	}


	openList(i) {
		let dropdowns = document.querySelectorAll(".dropdown > .list");
		dropdowns[i].classList.toggle("active");
		this.toogleList();
	}

	toogleList() {
		if (!document.querySelector(".dropdown .active") && this.editors.length > 0) {
			this.renderIcons();
			this.selectedContacts.classList.toggle("active");
		} else {
			this.selectedContacts.classList.remove("active");
			this.selectedContacts.innerHTML = "";
		}
	}

	deactivtedContactDropdown() {
		document.querySelectorAll(".contacts div input").forEach((element) => {
			element.checked = false;
		});
		this.editors = [];
	}

	//ANCHOR - Contact Buttons
	setContactBtn() {
		this.selectedContacts = document.querySelector(".selectedContacts");
		this.contactbtns = document.querySelectorAll(".contacts div");
		this.contactbtns.forEach((btn) => {
			btn.addEventListener("click", (event) => {
				event.stopPropagation();
				let id = btn.id;
				if (id == 3) {
					this.openSearchContact();
					this.setnewContactBtns();
				} else {
					this.addContact(id);
				}
			});
		});
	}

	setnewContactBtns() {
		this.setSearchCloseBtn();
		this.setkeyupSearchContact();
	}

	setSearchCloseBtn() {
		document.querySelector("#closeSearchContact").addEventListener("click", this.openSearchContact);
	}

	openSearchContact() {
		document.querySelector(".contactInput").classList.toggle("d-none");
		document.querySelector(".searchContact-Container").classList.toggle("d-none");
		document.querySelector(".searchContact-input input").focus();
		document.querySelector(".contacts ").classList.toggle("d-none");
	}

	addContact(id) {
		let checkedChild = this.contactbtns[id];
		let editor = this.contactbtns[id].innerText;
		this.fillEditorsArr(editor, checkedChild);
	}

	checkArr(editor) {
		return this.editors.includes(editor);
	}

	fillEditorsArr(editor, checkedChild) {
		if (!checkedChild.querySelector("input").checked && !this.checkArr(editor)) {
			checkedChild.querySelector("input").checked = true;

			this.editors.push({
				Name: editor,
				Color: "rgb(255, 168, 0)",
				Initials: this.renderInitials(editor),
			});
		} else {
			this.editors.splice(this.editors.indexOf(editor), 1);
			checkedChild.querySelector("input").checked = false;
		}
	}

	renderIcons() {
		this.editors.forEach((element) => {
			let firstletter = element.Initials;
			if (firstletter == undefined) {
				firstletter = this.renderInitials(element);
				this.selectedContacts.innerHTML += `<span>${firstletter}</span>`;
			} else {
				this.selectedContacts.innerHTML += `<span style="background:${element.Color}">${firstletter}</span>`;
			}
		});
	}

	renderInitials(element) {
		let firstletters = element.split(" ");
		let first = firstletters[0].charAt(0);
		let second = firstletters[1].charAt(0);
		let letters = first + second;
		return letters;
	}

	//ANCHOR - Category Buttons
	loadCatListsetBtns() {
		this.setCategories();
		this.setCategoryBtn();
	}
	setCategories() {
		let target = document.querySelector(".category");
		target.innerHTML = "";
		Categories.forEach((element) => {
			let temp = document.getElementById("category-temp").content.cloneNode(true);
			this.loadCategoryTemplate(temp, target, element);
		});
		this.setNewCategoryTemplate(target);
	}

	setNewCategoryTemplate(target) {
		let temp = document.getElementById("category-temp").content.cloneNode(true);
		temp.querySelector("div").setAttribute("id", Categories.length);
		temp.querySelector("div").innerText = "add new Category";
		target.appendChild(temp);
	}

	loadCategoryTemplate(temp, target, element) {
		temp.querySelector("div").setAttribute("id", element.id);
		temp.querySelector("div").innerText = element.name;
		target.appendChild(temp);
	}

	setCategoryBtn() {
		this.catagoryBtns = document.querySelectorAll(".category div");
		this.catagoryBtns.forEach((btn) => {
			btn.addEventListener("click", (event) => {
				let id = event.target.id;
				let length = this.catagoryBtns.length - 1;
				this.addCategory(id, length);
			});
		});
	}

	addCategory(id, length) {
		const input = document.querySelector(".cagetorgy-input");
		input.value = this.catagoryBtns[id].textContent;
		this.openList(1);
		if (id == length) {
			this.newCategory = new newCategory(this.selfTask);
		}
		if (!input.value == "") {
			this.Category = this.catagoryBtns[id].textContent;
		}
	}

	setClearBtn() {
		document.querySelector("#clear-btn").addEventListener("click", (event) => {
			event.preventDefault();
			this.clearForm();
		});
	}

	//ANCHOR - Create new Task
	init() {
		this.ID = Tasks.length;
		this.Title = document.querySelector(".input-title").value;
		this.Deadline = document.getElementById("date-input").value;
		this.Priority = this.checkpriority();
		this.Description = document.getElementById("description-input").value;
		this.Status = "toDo";
	}

	checkpriority() {
		if (document.querySelector(".priority-container .active")) {
			return document.querySelector(".priority-container .priority .active").innerHTML;
		}
		return false;
	}

	finalTask() {
		return {
			ID: new Date().getTime(),
			Title: this.Title,
			Editors: this.editors,
			Category: this.Category,
			Deadline: this.Deadline,
			Status: this.Status,
			Priority: this.Priority,
			Description: this.Description,
			Subtasks: this.Subtaks,
		};
	}

	clearForm() {
		this.prioBtns[0].className = "priority dflex-center";
		this.prioBtns[1].className = "priority dflex-center";
		this.prioBtns[2].className = "priority dflex-center";
		this.selectedContacts.innerHTML = "";
		document.querySelector(".subtasks").innerHTML = "";
		document.querySelector("#TaskForm").reset();
		this.editors = [];
		this.Subtaks = [];
		this.deactivtedContactDropdown();
	}

	showNote() {
		document.querySelector(".task-note").classList.remove("d-none");
		setTimeout(() => {
			document.querySelector(".task-note").classList.add("d-none");
			openboard();
		}, 2000);
	}
}
