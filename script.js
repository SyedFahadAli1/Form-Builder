const formElementsContainer = document.getElementById("form-elements");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const submitFormButton = document.getElementById("submit-form");
const clearFormButton = document.getElementById("clear-form");

let formData = JSON.parse(localStorage.getItem("formData")) || [];

//Dark Mode
darkModeToggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "" : "dark";
  localStorage.setItem("theme", document.body.dataset.theme);
});

document.body.dataset.theme = localStorage.getItem("theme") || "";

// Render form elements
function renderForm() {
  formElementsContainer.innerHTML = "";
  formData.forEach((element, index) => {
    const elementDiv = document.createElement("div");
    elementDiv.className = "form-element";
    elementDiv.draggable = true;
    elementDiv.dataset.index = index;

    let inputElement = "";
    if (element.type === "input") {
      inputElement = `<input type="text" placeholder="${
        element.placeholder || ""
      }" />`;
    } else if (element.type === "select") {
      inputElement = `
                <select>
                    ${element.options
                      .map((opt, optIndex) => `<option>${opt}</option>`)
                      .join("")}
                </select>
                <button class="add-option-btn" onclick="addOption(${index})">+ Add Option</button>
                <button class="remove-option-btn" onclick="removeOption(${index})">- Remove Last Option</button>
            `;
    } else if (element.type === "textarea") {
      inputElement = `<textarea placeholder="${
        element.placeholder || ""
      }"></textarea>`;
    } else if (element.type === "checkbox") {
      inputElement = `<input type="checkbox" />`;
    }

    elementDiv.innerHTML = `
            <label>${element.label}</label>
            ${inputElement}
            <button class="delete-btn" onclick="deleteElement(${index})">Delete</button>
        `;

    elementDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    formElementsContainer.appendChild(elementDiv);
  });

  localStorage.setItem("formData", JSON.stringify(formData));
}

// Add and Delete element
function addElement(type) {
  const newElement = {
    id: crypto.randomUUID(),
    type,
    label: `New ${type}`,
    placeholder:
      type === "input" || type === "textarea" ? "Enter text" : undefined,
    options: type === "select" ? ["Option 1", "Option 2"] : undefined,
  };
  formData.push(newElement);
  renderForm();
}

function deleteElement(index) {
  formData.splice(index, 1);
  renderForm();
}

// Add and Remove new option to select element
function addOption(index) {
  if (formData[index].type === "select") {
    formData[index].options.push(
      `Option ${formData[index].options.length + 1}`
    );
    renderForm();
  }
}

function removeOption(index) {
  if (formData[index].type === "select" && formData[index].options.length > 1) {
    formData[index].options.pop();
    renderForm();
  }
}

// Save form
function saveForm() {
  localStorage.setItem("formData", JSON.stringify(formData));
  alert("Form saved!");
}

// Clear Form
clearFormButton.addEventListener("click", () => {
  formData = [];
  renderForm();
  localStorage.removeItem("formData");
});

// Form Submission Handling
submitFormButton.addEventListener("click", () => {
  alert("Form submitted successfully!");
  console.log("Submitted Data:", JSON.stringify(formData, null, 2));
});

// Drag and Drop
formElementsContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

formElementsContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedIndex = e.dataTransfer.getData("text/plain");
  const droppedIndex = [...formElementsContainer.children].indexOf(
    e.target.closest(".form-element")
  );

  if (draggedIndex !== -1 && droppedIndex !== -1) {
    const movedItem = formData.splice(draggedIndex, 1)[0];
    formData.splice(droppedIndex, 0, movedItem);
    renderForm();
  }
});

document
  .getElementById("add-input")
  .addEventListener("click", () => addElement("input"));
document
  .getElementById("add-select")
  .addEventListener("click", () => addElement("select"));
document
  .getElementById("add-textarea")
  .addEventListener("click", () => addElement("textarea"));
document
  .getElementById("add-checkbox")
  .addEventListener("click", () => addElement("checkbox"));
document.getElementById("save-form").addEventListener("click", saveForm);

renderForm();
