class Taskdetailview extends DynamixObjects {
  boardElem;
  prioBtns;
  editorModus = false;

  constructor(elemID, dAd) {
    super();
    this.boardElem = dAd;
    this.showTaskDetail(elemID)

  }

  showTaskDetail(elemID) {
    let Task = Tasks.find((task) => task.ID === elemID);
    this.openDetail();
    this.renderDetailHead(Task);
    this.renderDetailBody(Task);
    this.addDetailCloseBtn();
    this.addSubtasksBtn(Task);
    this.setEditBtn(Task);
  }

  openDetail() {
    document.querySelector('.board-task-detail').classList.remove('d-none');
  }

  renderDetailHead(element) {
    this.renderDetailCategory(element);
    document.querySelector(".board-task-detail-body input").value = "";
    document.querySelector(".board-task-detail-body input").value = element.Title;
  }

  renderDetailBody(element) {
    document.querySelector(".board-task-detail-body textarea").value = "";
    document.querySelector(".board-task-detail-body textarea").value = element.Description;
    document.querySelector(".board-task-detail-date input").value = "";
    document.querySelector(".board-task-detail-date input").value = element.Deadline;
    this.disablePastdates();
    this.renderPriority(element);
    this.renderSubtasks(element);

    this.renderDetailEditorList(element);
  }

  renderDetailCategory(element) {
    document.querySelector(".board-task-detail-head span").innerText = "";
    Categories.forEach((category) => {
      if (category.name.includes(element.Category)) {
        document.querySelector(".board-task-detail-head span").innerText = element.Category;
        document.querySelector(".board-task-detail-head span").style = `background:${category.Color}`;
      }
    });
  }

  renderPriority(element) {
    document.querySelector(".board-detail-prio span").innerHTML = "";
    document.querySelector(".board-detail-prio span").innerHTML = `${element.Priority} <img src="${this.boardElem.checkPriority(
      element
    )}">`;
    this.setPriorityBgColor(element);
  }

  setPriorityBgColor(element) {
    if (element.Priority == "Low") {
      document.querySelector(".board-detail-prio span").classList.add("low-light");
    }
    if (element.Priority == "Medium") {
      document.querySelector(".board-detail-prio span").classList.add("medium-light");
    }
    if (element.Priority == "Urgent") {
      document.querySelector(".board-detail-prio span").classList.add("urgent-light");
    }
  }

  renderSubtasks(Task) {
    let target = document.querySelector('.subtask-list');
    target.innerHTML = "";
    Task.Subtasks.forEach((subTask) => {
      let temp = document.querySelector('.detail-subtask-temp').content.cloneNode(true);
      temp.querySelector('div').setAttribute("id", `${subTask.Subtask}`);
      temp.querySelector('span').innerText = subTask.Subtask;
      temp.querySelector('input').checked = subTask.Checked;
      target.appendChild(temp);
    });
  }

  addSubtasksBtn(Task) {
    let subtasks = document.querySelectorAll('.subtask-list div');
    subtasks.forEach((elm) => {
      elm.addEventListener('click', (event) => {
        event.stopPropagation();
        this.checkSubtask(elm.id, Task);
      });
    })
  }
  checkSubtask(id, Task) {
    Task.Subtasks.forEach((elm) => {
      if (elm.Subtask.includes(id) && !elm.Checked) {
        elm.Checked = true;
        document.getElementById(`${id}`).lastElementChild.checked = elm.Checked;


      } else if (elm.Subtask.includes(id) && elm.Checked) {
        elm.Checked = false;
        document.getElementById(`${id}`).lastElementChild.checked = elm.Checked;

      }
    })
  }

  renderDetailEditorList(element) {
    document.querySelector(".board-task-detail-person-list");
    document.querySelector(".board-task-detail-person-list").innerHTML = "";
    element.Editors.forEach((editor) => {
      let temp = document.querySelector(".detail-editor-temp").content.cloneNode(true);
      let tempElements = temp.querySelectorAll("span");
      tempElements[0].innerText = editor.Initials;
      tempElements[0].style = `background:${editor.Color}`;
      tempElements[1].innerText = editor.Name;
      document.querySelector(".board-task-detail-person-list").appendChild(temp);
    });
    if (this.editorModus) {
      this.editEditors();
      this.addDeleteEditorBtn(element);
    }
  }

  addDetailCloseBtn() {
    document.querySelector(".board-task-detail-head img").addEventListener("click", () => {
      // document.querySelector(".board-task-detail").classList.add("d-none");
      saveData();
      let changes = true;
      this.showNote(changes);

    }, { once: true });
  }

  setEditBtn(Task) {
    document.querySelector('.bord-task-edit-button').addEventListener('click', (event) => {
      event.stopPropagation();
      this.editorModus = true;
      this.editTask(Task);
    }, { once: true });

  }

  editTask(Task) {
    this.showEdit();
    this.setactivPriortyBtn(Task);
    this.setPriorityBtn();
    this.seteditSubtaskBtn(Task);
    this.editEditors();
    this.addDeleteEditorBtn(Task);
    this.SearchContactsBtn(Task);
    this.setEditSaveAbortBtn(Task);
    this.cancelReadOnly();
    document.querySelector(".board-task-detail-body input").focus();
  }

  cancelReadOnly() {
    document.querySelector(".board-task-detail-body input").readOnly = false;
    document.querySelector(".board-task-detail-body textarea").readOnly = false;
    document.querySelector(".board-task-detail-date input").readOnly = false;
    document.querySelector(".board-task-detail-date input").setAttribute('type', 'date');
  }

  placeReadOnly() {
    document.querySelector(".board-task-detail-body input").readOnly = true;
    document.querySelector(".board-task-detail-body textarea").readOnly = true;
    document.querySelector(".board-task-detail-date input").readOnly = true;
    document.querySelector(".board-task-detail-date input").removeAttribute('type');
  }

  showEdit() {
    document.querySelector(".board-task-detail-body input").classList.add('border-bottom');
    document.querySelector(".board-task-detail-body textarea").classList.add('border');
    document.querySelector(".board-task-detail-date input").classList.add('border-bottom');
    document.querySelector(".board-detail-prio span").classList.add('d-none');
    document.querySelector(".priority-container").classList.remove('d-none');
    document.querySelector(".subtask-container").classList.remove('d-none');
    document.querySelector(".searchContact-Container").classList.remove('d-none');
    document.querySelector(".edit-Buttons").classList.remove('d-none');
    document.querySelector(".bord-task-edit-button").classList.add('d-none');
  }
  closeEdit() {
    document.querySelector(".board-task-detail-body input").classList.remove('border-bottom');
    document.querySelector(".board-task-detail-body textarea").classList.remove('border');
    document.querySelector(".board-task-detail-date input").classList.remove('border-bottom');
    document.querySelector(".board-detail-prio span").classList.add('d-none');
    document.querySelector(".priority-container").classList.add('d-none');
    document.querySelector(".subtask-container").classList.add('d-none');
    document.querySelector(".searchContact-Container").classList.add('d-none');
    document.querySelector(".edit-Buttons").classList.add('d-none');
    document.querySelector(".bord-task-edit-button").classList.remove('d-none');
  }


  setactivPriortyBtn(Task) {
    if (Task.Priority == "Low") {
      document.getElementById('Btn2').classList.add("low", "active");
    }
    if (Task.Priority == "Medium") {
      document.getElementById('Btn1').classList.add("medium", "active");
    }
    if (Task.Priority == "Urgent") {
      document.getElementById('Btn0').classList.add("urgent", "active");
    }
  }

  seteditSubtaskBtn(Task) {
    this.setSubtaskClearBtn();
    this.setSubTaskAddBtn(Task);
  }
  setSubtaskClearBtn() {
    document.querySelector('#subtaskClearBtn').addEventListener('click', () => {
      document.querySelector('#subtask-input').value = "";

    });
  }

  setSubTaskAddBtn(Task) {
    document.querySelector('#subtaskAddBtn').addEventListener('click', (event) => {
      event.stopPropagation();
      if (!document.querySelector('#subtask-input').value == "") {
        Task.Subtasks.push({
          Checked: false,
          Subtask: document.querySelector('#subtask-input').value
        });
        document.querySelector('#subtask-input').value = "";
        this.renderSubtasks(Task);

      } else {
        document.querySelector('#subtask-input').focus();
      }

    });
  }


  editEditors() {
    let arr = document.querySelectorAll('.board-task-detail-person-list div');
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      element.lastElementChild.src = 'img/trashcan_icon.png';
      element.lastElementChild.setAttribute('id', `${i}`);
      element.lastElementChild.classList.add('deleteEditor');
    }
  }

  removeEditeditors() {
    let arr = document.querySelectorAll('.board-task-detail-person-list div img');
    arr.forEach((e) => {
      e.removeAttribute('id');
      e.removeAttribute('class');
      e.src = "";
    });
  }

  addDeleteEditorBtn(Task) {
    let deleteBtnArr = document.querySelectorAll('.deleteEditor');
    deleteBtnArr.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        let id = event.target.id;
        this.deleteEditor(Task, id);
      }, { one: true });
    });
  }

  deleteEditor(Task, id) {
    Task.Editors.splice(id - 1, 1);
    this.renderDetailEditorList(Task);
  }
  SearchContactsBtn(Task) {
    this.searchContactClearBtn();
    this.setkeyupSearchContact(Task);
  }
  setEditSaveAbortBtn(Task) {
    this.setAbortBtn(Task);
    this.SaveEditBtn(Task);
  }

  setAbortBtn(Task) {
    document.getElementById('abortBtn').addEventListener('click', e => {
      this.placeReadOnly();
      this.removeEditeditors();
      this.clearPriortiyBtnClass();
      this.closeEdit();
      document.querySelector('#searchContacts').value = "";
      document.querySelector(".board-detail-prio span").classList.remove('d-none');
      this.setEditBtn(Task);
      this.editorModus = false;
    }, { once: true });
  }

  SaveEditBtn(Task) {
    document.getElementById('saveEditBtn').addEventListener('click', e => {
      this.editorModus = false;
      this.saveChanges(Task);
      saveData();
      document.querySelector('#searchContacts').value = "";
      this.showNote(Task);
    }, { once: true });

  }
  saveChanges(Task) {
    Task.Title = document.querySelector(".board-task-detail-body-firstRow input").value;
    Task.Description = document.querySelector(".board-task-detail-body textarea").value;
    Task.Deadline = document.querySelector(".board-task-detail-date input").value;
    Task.Priority = this.setChangePriority();
  }
  setChangePriority() {
    return document.querySelector('.priority-container .active').innerText;
  }

  showNote(change) {

    if (change == true) {
      setTimeout(() => {
        location.reload();
      }, 200)
    } else {
      document.querySelector('.confirm-textbox').classList.remove('d-none');
      setTimeout(() => {
        document.querySelector('.confirm-textbox').classList.add('d-none');
        location.reload();
      }, 2000);
    }


  }

  clearPriortiyBtnClass() {
    let prioBtns = document.querySelectorAll('.priority-container div');
    prioBtns.forEach((btn) => {
      btn.setAttribute('class', "priority dflex-center");
    })
  }

}