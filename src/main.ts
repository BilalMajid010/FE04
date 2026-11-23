
import "./style.css";

import {
    departments,
    initialEmployees,
    generateEmployeeId,
    addEmployee,
    removeEmployee,
    updateEmployee,
    filterEmployees,
    findEmployee
} from "./data/employees";

import type {
    Employee,
    EmployeeStatus,
    DepartmentName
} from "./data/employees";

import {
    calculateTotalSalary,
    getDepartmentStatistics,
    getEmployeeSummaries,
    hasHighSalaryEmployee,
    allEmployeesAreValid,
    createEmployeeFilter,
    getEmployeesByDepartments,
    getEmployeeCity
} from "./utils/employeeUtils";

// Get HTML elements with type checking.
function getElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }

    return element;
}

let employees: Employee[] = [...initialEmployees];

const employeeForm = getElement<HTMLFormElement>("#employeeForm");
const employeeIdInput = getElement<HTMLInputElement>("#employeeId");
const nameInput = getElement<HTMLInputElement>("#name");
const departmentInput = getElement<HTMLSelectElement>("#department");
const salaryInput = getElement<HTMLInputElement>("#salary");
const statusInput = getElement<HTMLSelectElement>("#status");

const departmentFilter = getElement<HTMLSelectElement>("#departmentFilter");
const statusFilter = getElement<HTMLSelectElement>("#statusFilter");
const searchInput = getElement<HTMLInputElement>("#search");

const employeeTable = getElement<HTMLTableSectionElement>("#employeeTable");
const statistics = getElement<HTMLDivElement>("#statistics");

const submitButton = getElement<HTMLButtonElement>("#submitButton");
const cancelButton = getElement<HTMLButtonElement>("#cancelButton");

// Populate department dropdowns.
function populateDepartments(): void {
    departments.forEach(({ name }) => {
        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        departmentInput.append(option.cloneNode(true));
        departmentFilter.append(option);
    });
}

// Render employee information.
function renderEmployees(): void {
    const departmentValue = departmentFilter.value as DepartmentName | "All";
    const statusValue = statusFilter.value as EmployeeStatus | "All";

    const selectedEmployees = filterEmployees(
        employees,
        departmentValue,
        statusValue
    );

    const searchTerm = searchInput.value.toLowerCase();

    const searchedEmployees = selectedEmployees.filter(
        ({ name }) => name.toLowerCase().includes(searchTerm)
    );

    employeeTable.replaceChildren();

    searchedEmployees.forEach(employee => {
        const row = document.createElement("tr");

        const values: (string | number)[] = [
            employee.id,
            employee.name,
            employee.department,
            `PKR ${employee.salary.toLocaleString()}`,
            employee.status,
            getEmployeeCity(employee)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.append(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = String(employee.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = String(employee.id);

        actionCell.append(editButton, deleteButton);
        row.append(actionCell);

        employeeTable.append(row);
    });

    renderStatistics();
}

// Render department statistics.
function renderStatistics(): void {
    const departmentData = getDepartmentStatistics(employees);

    statistics.replaceChildren();

    Object.entries(departmentData).forEach(([department, data]) => {
        if (!data) return;

        const paragraph = document.createElement("p");

        paragraph.textContent =
            `${department}: ${data.count} employees | ` +
            `Total Salary: PKR ${data.total.toLocaleString()}`;

        statistics.append(paragraph);
    });

    getElement<HTMLParagraphElement>("#totalSalary").textContent =
        `Total Monthly Salary: PKR ${calculateTotalSalary(employees).toLocaleString()}`;

    getElement<HTMLParagraphElement>("#validationResult").textContent =
        `All employees valid: ${allEmployeesAreValid(employees)}`;

    getElement<HTMLParagraphElement>("#highSalaryResult").textContent =
        `Any employee earning above PKR 90,000: ${hasHighSalaryEmployee(employees, 90000)}`;
}

// Add or update employee.
employeeForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const department = departmentInput.value as DepartmentName;
    const salary = Number(salaryInput.value);
    const status = statusInput.value as EmployeeStatus;

    if (!name || !departments.some(item => item.name === department) || !Number.isFinite(salary) || salary <= 0) {
        alert("Please enter valid employee information.");
        return;
    }

    const employeeId = Number(employeeIdInput.value);

    if (employeeId) {
        employees = updateEmployee(employees, employeeId, {
            name,
            department,
            salary,
            status
        });
    } else {
        const newEmployee: Employee = {
            id: generateEmployeeId(),
            name,
            department,
            salary,
            status,
            address: {
                city: "Not provided"
            }
        };

        employees = addEmployee(employees, newEmployee);
    }

    resetForm();
    renderEmployees();
});

// Edit and delete using event delegation.
employeeTable.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "delete") {
        employees = removeEmployee(employees, id);
        renderEmployees();
    }

    if (button.dataset.action === "edit") {
        const employee = findEmployee(employees, id);

        if (!employee) return;

        const {
            name,
            department,
            salary,
            status
        } = employee;

        employeeIdInput.value = String(id);
        nameInput.value = name;
        departmentInput.value = department;
        salaryInput.value = String(salary);
        statusInput.value = status;

        submitButton.textContent = "Update Employee";
        cancelButton.hidden = false;

        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

// Reset the form.
function resetForm(): void {
    employeeForm.reset();
    employeeIdInput.value = "";
    submitButton.textContent = "Add Employee";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);

// Search and filters.
searchInput.addEventListener("input", renderEmployees);
departmentFilter.addEventListener("change", renderEmployees);
statusFilter.addEventListener("change", renderEmployees);

// Demonstrate a reusable higher-order function.
const activeEmployeeFilter = createEmployeeFilter(
    employee => employee.status === "Active"
);

console.log("Active Employees:", activeEmployeeFilter(employees));

// Demonstrate rest parameters.
const itAndHrEmployees = getEmployeesByDepartments(
    employees,
    "IT",
    "HR"
);

console.log("IT and HR Employees:", itAndHrEmployees);

// Demonstrate map().
console.log("Employee Summaries:", getEmployeeSummaries(employees));

// Start application.
populateDepartments();
renderEmployees();
