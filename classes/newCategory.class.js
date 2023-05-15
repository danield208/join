class newCategory {
  Task;
  constructor(Task) {
    this.Task = Task;
    this.openNewCategory();
    this.closeNewCategoryBtn();
    this.addNewCategoryBtn();
    this.rendercolorpicker();
    this.setColors();
    document.querySelector('.searchAndAdd-container input').focus();
  }

  openNewCategory() {
    document.querySelector('.cat').classList.toggle('d-none');
    document.querySelector('.searchAndAdd-container').classList.toggle('d-none');
  }

  rendercolorpicker() {
    let target = document.querySelector('.colorpicker');
    target.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      target.innerHTML += `<span id="${i}"></span>`;
    }
  }

  setColors() {
    let elements = document.querySelectorAll('.colorpicker span');
    elements.forEach((elementColor) => {
      elementColor.setAttribute('style', `background:${this.createRandomBgColor()}`);
      this.setColorBtn(elementColor);
    })
  }
  createRandomBgColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var alpha = 0.95;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  setColorBtn(element) {
    element.addEventListener('click', () => {
      let rawColor = element.getAttribute('style').split(':');
      this.newCategoryColor = rawColor[1];
      this.activateNewColor(element);
    });
  }

  activateNewColor(element) {
    element.classList.toggle('select');
  }

  closeNewCategoryBtn() {
    document.getElementById('closeSearchAndAddBtn').addEventListener('click', this.openNewCategory);
  }

  addNewCategoryBtn() {
    document.getElementById('SearchAndAddBtn').addEventListener('click', () => {
      let activeColor = document.querySelector('colorpicker .select');
      let categoryInput = document.querySelector('.searchAndAdd-container-input input');
      if (!activeColor > 0 && !categoryInput.value == "") {
        this.newCategory = categoryInput.value;
        this.createNewCategory();
        categoryInput.value = "";
        this.openNewCategory();
      }
    });
  }

  createNewCategory() {
    Categories.push({
      name: this.newCategory,
      id: Categories.length,
      Color: this.newCategoryColor
    });
    saveData();
    loadData();
    this.Task.setCategories();
    this.Task.setCategoryBtn();
  }

}