
export type EmployeeID = number;

export type EmployeeStatus = "Active" | "Inactive";

export type DepartmentName =
    | "IT"
    | "HR"
    | "Finance"
    | "Marketing"
    | "Sales";

export interface Department {
    id: number;
    name: DepartmentName;
}

export interface Employee {
    id: EmployeeID;
    name: string;
    department: DepartmentName;
    salary: number;
    status: EmployeeStatus;
    email?: string;
    address?: {
        city?: string;
    };
}

export const departments: Department[] = [
    { id: 1, name: "IT" },
    { id: 2, name: "HR" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Marketing" },
    { id: 5, name: "Sales" }
];

export const initialEmployees: Employee[] = [
    { id: 1, name: "Bilal Majid", department: "IT", salary: 85000, status: "Active", address: { city: "Karachi" } },
    { id: 2, name: "Ahmed Khan", department: "HR", salary: 60000, status: "Active", address: { city: "Lahore" } },
    { id: 3, name: "Ali Raza", department: "IT", salary: 95000, status: "Active", address: { city: "Karachi" } },
    { id: 4, name: "Usman Tariq", department: "Finance", salary: 75000, status: "Inactive", address: { city: "Islamabad" } },
    { id: 5, name: "Hassan Ahmed", department: "Marketing", salary: 65000, status: "Active", address: { city: "Karachi" } },
    { id: 6, name: "Saad Malik", department: "Sales", salary: 55000, status: "Active", address: { city: "Lahore" } },
    { id: 7, name: "Hamza Ali", department: "IT", salary: 90000, status: "Inactive", address: { city: "Karachi" } },
    { id: 8, name: "Zain Abbas", department: "HR", salary: 62000, status: "Active", address: { city: "Multan" } },
    { id: 9, name: "Danish Iqbal", department: "Finance", salary: 80000, status: "Active", address: { city: "Karachi" } },
    { id: 10, name: "Ahsan Javed", department: "Sales", salary: 58000, status: "Inactive", address: { city: "Lahore" } },
    { id: 11, name: "Farhan Sheikh", department: "Marketing", salary: 70000, status: "Active", address: { city: "Islamabad" } },
    { id: 12, name: "Saif Ahmed", department: "IT", salary: 105000, status: "Active", address: { city: "Karachi" } },
    { id: 13, name: "Umar Farooq", department: "HR", salary: 68000, status: "Inactive", address: { city: "Lahore" } },
    { id: 14, name: "Waleed Khan", department: "Finance", salary: 72000, status: "Active", address: { city: "Karachi" } },
    { id: 15, name: "Shahzaib Ali", department: "Sales", salary: 61000, status: "Active", address: { city: "Multan" } }
];

// Closure-based ID generator.
export function createIdGenerator(start: number = 16): () => number {
    let nextId: number = start;

    return function (): number {
        return nextId++;
    };
}

export const generateEmployeeId = createIdGenerator();

// Add employee immutably.
export function addEmployee(
    employees: Employee[],
    employee: Employee
): Employee[] {
    return [...employees, employee];
}

// Remove employee immutably.
export function removeEmployee(
    employees: Employee[],
    id: EmployeeID
): Employee[] {
    return employees.filter(employee => employee.id !== id);
}

// Update employee immutably.
export function updateEmployee(
    employees: Employee[],
    id: EmployeeID,
    updates: Partial<Omit<Employee, "id">>
): Employee[] {
    return employees.map(employee =>
        employee.id === id
            ? { ...employee, ...updates }
            : employee
    );
}

// Find employee by ID.
export function findEmployee(
    employees: Employee[],
    id: EmployeeID
): Employee | undefined {
    return employees.find(employee => employee.id === id);
}

// Filter employees by department and status.
export function filterEmployees(
    employees: Employee[],
    department: DepartmentName | "All" = "All",
    status: EmployeeStatus | "All" = "All"
): Employee[] {
    return employees.filter(employee =>
        (department === "All" || employee.department === department) &&
        (status === "All" || employee.status === status)
    );
}
