
import type {
    Employee,
    DepartmentName
} from "../data/employees";

import { departments } from "../data/employees";

// Generic interface.
export interface Statistics<T> {
    count: number;
    total: T;
}

// Generic function: works with different array types.
export function getFirstItem<T>(items: T[]): T | undefined {
    return items[0];
}

// Generic reusable filter function.
export function filterItems<T>(
    items: T[],
    condition: (item: T) => boolean
): T[] {
    return items.filter(condition);
}

// Pure function: formats employee name.
export function formatEmployeeName(
    { name = "Unknown" }: Employee
): string {
    return name.trim().toUpperCase();
}

// Pure function: calculates total salary.
export function calculateTotalSalary(
    employees: Employee[]
): number {
    return employees.reduce(
        (total, { salary }) => total + salary,
        0
    );
}

// Transform employee information using map().
export function getEmployeeSummaries(employees: Employee[]) {
    return employees.map(({ id, name, department, salary }) => ({
        id,
        name,
        department,
        monthlySalary: salary,
        annualSalary: salary * 12
    }));
}

// Department-wise employee statistics using reduce().
export function getDepartmentStatistics(
    employees: Employee[]
): Record<DepartmentName, Statistics<number>> | Partial<Record<DepartmentName, Statistics<number>>> {
    return employees.reduce<
        Partial<Record<DepartmentName, Statistics<number>>>
    >((statistics, employee) => {
        const { department, salary } = employee;

        if (!statistics[department]) {
            statistics[department] = {
                count: 0,
                total: 0
            };
        }

        statistics[department].count++;
        statistics[department].total += salary;

        return statistics;
    }, {});
}

// Check whether at least one employee has a high salary.
export function hasHighSalaryEmployee(
    employees: Employee[],
    minimumSalary: number
): boolean {
    return employees.some(
        employee => employee.salary > minimumSalary
    );
}

// Check whether all employees have valid information.
export function allEmployeesAreValid(
    employees: Employee[]
): boolean {
    return employees.every(employee =>
        employee.name.trim().length > 0 &&
        employee.department.length > 0 &&
        employee.salary > 0
    );
}

// Higher-order function.
export function createEmployeeFilter(
    condition: (employee: Employee) => boolean
): (employees: Employee[]) => Employee[] {
    return function (employees: Employee[]): Employee[] {
        return employees.filter(condition);
    };
}

// Rest parameters.
export function getEmployeesByDepartments(
    employees: Employee[],
    ...selectedDepartments: DepartmentName[]
): Employee[] {
    return employees.filter(employee =>
        selectedDepartments.includes(employee.department)
    );
}

// Optional chaining and nullish coalescing.
export function getEmployeeCity(employee: Employee): string {
    return employee.address?.city ?? "City not provided";
}

// Department list.
export function getDepartments() {
    return departments;
}

// Type narrowing.
export function displayEmployeeId(
    id: number | string
): string {
    if (typeof id === "number") {
        return id.toFixed(0);
    }

    return id.toUpperCase();
}
