// Hospital Admin Module - HTML, CSS and simple JavaScript

// Sample information is used for the first time the page opens.
const defaultUsers = [
  { id: 1, name: "Dr. Ahsan Rahman", email: "ahsan@carepoint.com", role: "Doctor", department: "Cardiology", fee: 1200, active: true },
  { id: 2, name: "Dr. Nusrat Jahan", email: "nusrat@carepoint.com", role: "Doctor", department: "Neurology", fee: 1000, active: true },
  { id: 3, name: "Rahima Akter", email: "rahima@carepoint.com", role: "Receptionist", department: "N/A", fee: 0, active: true },
  { id: 4, name: "Sadia Islam", email: "sadia@gmail.com", role: "Patient", department: "N/A", fee: 0, active: true },
  { id: 5, name: "Mahmud Hasan", email: "mahmud@gmail.com", role: "Patient", department: "N/A", fee: 0, active: true },
  { id: 6, name: "Nabila Sultana", email: "nabila@gmail.com", role: "Patient", department: "N/A", fee: 0, active: true }
];

const defaultDepartments = [
  { id: 1, name: "Cardiology", fee: 1200 },
  { id: 2, name: "Neurology", fee: 1000 },
  { id: 3, name: "Orthopedics", fee: 900 }
];

// Read saved browser data. If there is no saved data, use the sample information.
let users = JSON.parse(localStorage.getItem("hospitalUsers")) || defaultUsers;
let departments = JSON.parse(localStorage.getItem("hospitalDepartments")) || defaultDepartments;
let editingStaffId = null;
let editingDepartmentId = null;

// Save changes in the browser.
function saveData() {
  localStorage.setItem("hospitalUsers", JSON.stringify(users));
  localStorage.setItem("hospitalDepartments", JSON.stringify(departments));
}

// Change the visible page when a menu item is clicked.
let navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    openPage(link.getAttribute("data-page"));
  });
});

function openPage(pageName) {
  let sections = document.querySelectorAll(".page-section");
  sections.forEach(function (section) {
    section.classList.remove("active");
  });

  document.getElementById(pageName).classList.add("active");

  navLinks.forEach(function (link) {
    link.classList.remove("active");
  });

  document.querySelector('[data-page="' + pageName + '"]').classList.add("active");
}

document.getElementById("goToStaff").addEventListener("click", function () {
  openPage("staff");
});

// Show error and success borders. This follows the teacher's form-validation pattern.
function showError(input, errorId, message) {
  input.classList.add("errorBorder");
  input.classList.remove("successBorder");
  document.getElementById(errorId).innerHTML = message;
}

function showSuccess(input) {
  input.classList.remove("errorBorder");
  input.classList.add("successBorder");
}

function clearFormErrors(formId) {
  let form = document.getElementById(formId);
  let errors = form.querySelectorAll(".error");
  errors.forEach(function (item) {
    item.innerHTML = "";
  });

  let fields = form.querySelectorAll("input, select");
  fields.forEach(function (field) {
    field.classList.remove("errorBorder");
    field.classList.remove("successBorder");
  });
}

// Fill Department dropdowns from the department list.
function updateDepartmentOptions() {
  let staffDepartment = document.getElementById("staffDepartment");
  let currentValue = staffDepartment.value;
  staffDepartment.innerHTML = '<option value="">Select Department</option>';

  departments.forEach(function (department) {
    let option = document.createElement("option");
    option.value = department.name;
    option.textContent = department.name;
    staffDepartment.appendChild(option);
  });

  if (departments.some(function (department) { return department.name === currentValue; })) {
    staffDepartment.value = currentValue;
  }
}

// Fill the doctor dropdown for assigning doctors to a department.
function updateDoctorOptions(selectedId) {
  let doctorSelect = document.getElementById("assignDoctor");
  doctorSelect.innerHTML = '<option value="">No doctor selected</option>';

  users.forEach(function (user) {
    if (user.role === "Doctor" && user.active) {
      let option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      doctorSelect.appendChild(option);
    }
  });

  if (selectedId) {
    doctorSelect.value = selectedId;
  }
}

// Show or hide department and fee fields according to selected role.
document.getElementById("staffRole").addEventListener("change", function () {
  let doctorFields = document.querySelectorAll(".doctor-only");
  doctorFields.forEach(function (field) {
    field.style.display = this.value === "Doctor" ? "block" : "none";
  }, this);
});

// Add or edit a Doctor or Receptionist.
document.getElementById("staffForm").addEventListener("submit", function (event) {
  event.preventDefault();
  clearFormErrors("staffForm");
  document.getElementById("staffMessage").innerHTML = "";

  let name = document.getElementById("staffName");
  let email = document.getElementById("staffEmail");
  let role = document.getElementById("staffRole");
  let department = document.getElementById("staffDepartment");
  let fee = document.getElementById("staffFee");
  let password = document.getElementById("staffPassword");
  let valid = true;

  // Name validation
  if (name.value.trim() === "") {
    showError(name, "staffNameError", "Name is required.");
    valid = false;
  } else if (!/^[A-Za-z .]+$/.test(name.value.trim())) {
    showError(name, "staffNameError", "Use letters, spaces and dot only.");
    valid = false;
  } else {
    showSuccess(name);
  }

  // Email validation
  if (email.value.trim() === "") {
    showError(email, "staffEmailError", "Email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, "staffEmailError", "Enter a valid email address.");
    valid = false;
  } else {
    showSuccess(email);
  }

  // Role validation
  if (role.value === "") {
    showError(role, "staffRoleError", "Please select a role.");
    valid = false;
  } else {
    showSuccess(role);
  }

  // Doctor-specific fields
  if (role.value === "Doctor") {
    if (department.value === "") {
      showError(department, "staffDepartmentError", "Please select a department.");
      valid = false;
    } else {
      showSuccess(department);
    }

    if (fee.value.trim() === "" || Number(fee.value) < 0) {
      showError(fee, "staffFeeError", "Enter a valid consultation fee.");
      valid = false;
    } else {
      showSuccess(fee);
    }
  }

  // Password is required when adding. During edit, leave it blank to keep existing login password.
  if (editingStaffId === null && password.value.length < 6) {
    showError(password, "staffPasswordError", "Password must be at least 6 characters.");
    valid = false;
  } else if (password.value !== "" && password.value.length < 6) {
    showError(password, "staffPasswordError", "Password must be at least 6 characters.");
    valid = false;
  } else if (password.value !== "") {
    showSuccess(password);
  }

  if (valid) {
    let staffData = {
      name: name.value.trim(),
      email: email.value.trim(),
      role: role.value,
      department: role.value === "Doctor" ? department.value : "N/A",
      fee: role.value === "Doctor" ? Number(fee.value) : 0,
      active: true
    };

    if (editingStaffId === null) {
      staffData.id = new Date().getTime();
      users.push(staffData);
      document.getElementById("staffMessage").innerHTML = "Staff account added successfully.";
    } else {
      let userIndex = users.findIndex(function (user) {
        return user.id === editingStaffId;
      });
      if (userIndex !== -1) {
        staffData.id = editingStaffId;
        staffData.active = users[userIndex].active;
        users[userIndex] = staffData;
      }
      document.getElementById("staffMessage").innerHTML = "Staff information updated successfully.";
    }

    saveData();
    this.reset();
    resetStaffForm();
    renderAll();
  }
});

function resetStaffForm() {
  editingStaffId = null;
  document.getElementById("staffFormHeading").innerHTML = "Add New Staff";
  document.getElementById("staffSubmitButton").innerHTML = "Add Staff";
  document.getElementById("staffRole").value = "";
  document.querySelectorAll(".doctor-only").forEach(function (field) {
    field.style.display = "block";
  });
  clearFormErrors("staffForm");
}

document.getElementById("cancelEditButton").addEventListener("click", function () {
  document.getElementById("staffForm").reset();
  document.getElementById("staffMessage").innerHTML = "";
  resetStaffForm();
});

// Edit a staff member: put old information back into the form.
function editStaff(id) {
  let user = users.find(function (item) {
    return item.id === id;
  });

  if (user) {
    editingStaffId = id;
    openPage("staff");
    document.getElementById("staffFormHeading").innerHTML = "Edit Staff Information";
    document.getElementById("staffSubmitButton").innerHTML = "Save Changes";
    document.getElementById("staffName").value = user.name;
    document.getElementById("staffEmail").value = user.email;
    document.getElementById("staffRole").value = user.role;
    document.getElementById("staffRole").dispatchEvent(new Event("change"));
    document.getElementById("staffDepartment").value = user.department;
    document.getElementById("staffFee").value = user.fee;
    document.getElementById("staffPassword").value = "";
    document.getElementById("staffMessage").innerHTML = "Leave password blank to keep the existing password.";
  }
}

// Change a user account between Active and Inactive.
function toggleUser(id) {
  users = users.map(function (user) {
    if (user.id === id) {
      user.active = !user.active;
    }
    return user;
  });
  saveData();
  renderAll();
}

// Department form: add or edit department.
document.getElementById("departmentForm").addEventListener("submit", function (event) {
  event.preventDefault();
  clearFormErrors("departmentForm");
  document.getElementById("departmentMessage").innerHTML = "";

  let name = document.getElementById("departmentName");
  let fee = document.getElementById("departmentFee");
  let doctorId = document.getElementById("assignDoctor").value;
  let valid = true;

  if (name.value.trim() === "") {
    showError(name, "departmentNameError", "Department name is required.");
    valid = false;
  } else {
    showSuccess(name);
  }

  if (fee.value.trim() === "" || Number(fee.value) < 0) {
    showError(fee, "departmentFeeError", "Enter a valid fee.");
    valid = false;
  } else {
    showSuccess(fee);
  }

  let duplicate = departments.some(function (department) {
    return department.name.toLowerCase() === name.value.trim().toLowerCase() && department.id !== editingDepartmentId;
  });

  if (duplicate) {
    showError(name, "departmentNameError", "This department already exists.");
    valid = false;
  }

  if (valid) {
    let departmentData = {
      id: editingDepartmentId === null ? new Date().getTime() : editingDepartmentId,
      name: name.value.trim(),
      fee: Number(fee.value)
    };

    if (editingDepartmentId === null) {
      departments.push(departmentData);
      document.getElementById("departmentMessage").innerHTML = "Department added successfully.";
    } else {
      let oldDepartment = departments.find(function (item) { return item.id === editingDepartmentId; });
      let oldName = oldDepartment ? oldDepartment.name : "";
      departments = departments.map(function (item) {
        if (item.id === editingDepartmentId) {
          return departmentData;
        }
        return item;
      });
      users.forEach(function (user) {
        if (user.role === "Doctor" && user.department === oldName) {
          user.department = departmentData.name;
          user.fee = departmentData.fee;
        }
      });
      document.getElementById("departmentMessage").innerHTML = "Department updated successfully.";
    }

    // If a doctor is selected, assign this doctor to the department and copy the consultation fee.
    if (doctorId !== "") {
      users.forEach(function (user) {
        if (user.id === Number(doctorId) && user.role === "Doctor") {
          user.department = departmentData.name;
          user.fee = departmentData.fee;
        }
      });
    }

    saveData();
    this.reset();
    resetDepartmentForm();
    renderAll();
  }
});

function editDepartment(id) {
  let department = departments.find(function (item) { return item.id === id; });
  if (department) {
    editingDepartmentId = id;
    document.getElementById("departmentFormHeading").innerHTML = "Edit Department";
    document.getElementById("departmentSubmitButton").innerHTML = "Save Changes";
    document.getElementById("departmentName").value = department.name;
    document.getElementById("departmentFee").value = department.fee;
    let assignedDoctor = users.find(function (user) {
      return user.role === "Doctor" && user.department === department.name && user.active;
    });
    updateDoctorOptions(assignedDoctor ? assignedDoctor.id : "");
    document.getElementById("departmentMessage").innerHTML = "You can also choose a doctor to assign.";
    openPage("departments");
  }
}

function deleteDepartment(id) {
  let department = departments.find(function (item) { return item.id === id; });
  if (!department) return;

  let confirmed = confirm("Delete " + department.name + " department?");
  if (confirmed) {
    users.forEach(function (user) {
      if (user.role === "Doctor" && user.department === department.name) {
        user.department = "N/A";
        user.fee = 0;
      }
    });
    departments = departments.filter(function (item) { return item.id !== id; });
    saveData();
    renderAll();
  }
}

function resetDepartmentForm() {
  editingDepartmentId = null;
  document.getElementById("departmentFormHeading").innerHTML = "Add Department";
  document.getElementById("departmentSubmitButton").innerHTML = "Add Department";
}

document.getElementById("clearDepartmentButton").addEventListener("click", function () {
  document.getElementById("departmentForm").reset();
  clearFormErrors("departmentForm");
  document.getElementById("departmentMessage").innerHTML = "";
  resetDepartmentForm();
});

// Keep user-entered text safe when it is placed inside table HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"\']/g, function (character) {
    let replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "\'": "&#39;"
    };
    return replacements[character];
  });
}

// Render all tables and dashboard numbers.
function renderAll() {
  updateDepartmentOptions();
  updateDoctorOptions();
  renderDashboard();
  renderStaff();
  renderDepartments();
  renderUsers();
}

function renderDashboard() {
  let activeDoctors = users.filter(function (user) { return user.role === "Doctor" && user.active; });
  let activePatients = users.filter(function (user) { return user.role === "Patient" && user.active; });
  let activeReceptionists = users.filter(function (user) { return user.role === "Receptionist" && user.active; });

  document.getElementById("totalDoctors").innerHTML = activeDoctors.length;
  document.getElementById("totalPatients").innerHTML = activePatients.length;
  document.getElementById("totalReceptionists").innerHTML = activeReceptionists.length;

  let recentStaff = users.filter(function (user) {
    return user.role === "Doctor" || user.role === "Receptionist";
  }).slice(-5).reverse();

  let rows = "";
  recentStaff.forEach(function (user) {
    rows += "<tr>";
    rows += "<td>" + escapeHTML(user.name) + "</td>";
    rows += "<td>" + escapeHTML(user.email) + "</td>";
    rows += "<td>" + escapeHTML(user.role) + "</td>";
    rows += "<td>" + escapeHTML(user.department) + "</td>";
    rows += '<td><span class="status ' + (user.active ? "active" : "inactive") + '">' + (user.active ? "Active" : "Inactive") + "</span></td>";
    rows += "</tr>";
  });
  document.getElementById("recentStaffTable").innerHTML = rows || '<tr><td colspan="5">No staff found.</td></tr>';
}

function renderStaff() {
  let staff = users.filter(function (user) {
    return user.role === "Doctor" || user.role === "Receptionist";
  });

  let rows = "";
  staff.forEach(function (user) {
    rows += "<tr>";
    rows += "<td>" + escapeHTML(user.name) + "</td>";
    rows += "<td>" + escapeHTML(user.email) + "</td>";
    rows += "<td>" + escapeHTML(user.role) + "</td>";
    rows += "<td>" + escapeHTML(user.department) + "</td>";
    rows += "<td>" + (user.role === "Doctor" ? user.fee : "-") + "</td>";
    rows += '<td><span class="status ' + (user.active ? "active" : "inactive") + '">' + (user.active ? "Active" : "Inactive") + "</span></td>";
    rows += '<td><button class="action-btn edit-btn" data-id="' + user.id + '">Edit</button>';
    rows += '<button class="action-btn ' + (user.active ? "toggle-btn" : "activate-btn") + '" data-id="' + user.id + '">' + (user.active ? "Deactivate" : "Activate") + "</button></td>";
    rows += "</tr>";
  });
  document.getElementById("staffTable").innerHTML = rows || '<tr><td colspan="7">No staff found.</td></tr>';

  document.querySelectorAll("#staffTable .edit-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      editStaff(Number(this.getAttribute("data-id")));
    });
  });
  document.querySelectorAll("#staffTable .toggle-btn, #staffTable .activate-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      toggleUser(Number(this.getAttribute("data-id")));
    });
  });
}

function renderDepartments() {
  let rows = "";
  departments.forEach(function (department) {
    let doctorNames = users.filter(function (user) {
      return user.role === "Doctor" && user.active && user.department === department.name;
    }).map(function (user) { return user.name; }).join(", ");

    rows += "<tr>";
    rows += "<td>" + escapeHTML(department.name) + "</td>";
    rows += "<td>" + department.fee + "</td>";
    rows += "<td>" + escapeHTML(doctorNames || "Not assigned") + "</td>";
    rows += '<td><button class="action-btn edit-btn" data-id="' + department.id + '">Edit</button>';
    rows += '<button class="action-btn toggle-btn delete-department-btn" data-id="' + department.id + '">Delete</button></td>';
    rows += "</tr>";
  });
  document.getElementById("departmentTable").innerHTML = rows || '<tr><td colspan="4">No department found.</td></tr>';

  document.querySelectorAll("#departmentTable .edit-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      editDepartment(Number(this.getAttribute("data-id")));
    });
  });
  document.querySelectorAll("#departmentTable .delete-department-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      deleteDepartment(Number(this.getAttribute("data-id")));
    });
  });
}

function renderUsers() {
  let searchText = document.getElementById("userSearch").value.toLowerCase();
  let filteredUsers = users.filter(function (user) {
    return user.name.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText);
  });

  let rows = "";
  filteredUsers.forEach(function (user) {
    rows += "<tr>";
    rows += "<td>" + escapeHTML(user.name) + "</td>";
    rows += "<td>" + escapeHTML(user.email) + "</td>";
    rows += "<td>" + escapeHTML(user.role) + "</td>";
    rows += "<td>" + escapeHTML(user.department) + "</td>";
    rows += '<td><span class="status ' + (user.active ? "active" : "inactive") + '">' + (user.active ? "Active" : "Inactive") + "</span></td>";
    rows += '<td><button class="action-btn ' + (user.active ? "toggle-btn" : "activate-btn") + '" data-id="' + user.id + '">' + (user.active ? "Deactivate" : "Activate") + "</button></td>";
    rows += "</tr>";
  });
  document.getElementById("usersTable").innerHTML = rows || '<tr><td colspan="6">No matching user found.</td></tr>';

  document.querySelectorAll("#usersTable .toggle-btn, #usersTable .activate-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      toggleUser(Number(this.getAttribute("data-id")));
    });
  });
}

document.getElementById("userSearch").addEventListener("input", renderUsers);

// Start the page with the saved or sample data.
renderAll();
