//  Initial data setup
let employees = JSON.parse(localStorage.getItem("employees")) || [
    { id: 1, name: "Sibongile Nkosi", department: "Development", position: "Software Engineer", email: "sibongile.nkosi@moderntech.com", salary: 70000 },
    { id: 2, name: "Lungile Moyo", department: "HR", position: "HR Manager", email: "lungile.moyo@moderntech.com", salary: 80000 },
    { id: 3, name: "Thabo Molefe", department: "QA", position: "Quality Analyst", email: "thabo.molefe@moderntech.com", salary: 55000 },
    { id: 4, name: "Keshav Naidoo", department: "Sales", position: "Sales Representative", email: "keshav.naidoo@moderntech.com", salary: 60000 },
    { id: 5, name: "Zanele Khumalo", department: "Marketing", position: "Marketing Specialist", email: "zanele.khumalo@moderntech.com", salary: 58000 },
];

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let leaveRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
let payrollHistory = JSON.parse(localStorage.getItem("payrollHistory")) || [];


//  Save data to localStorage
function saveData() {
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
    localStorage.setItem("payrollHistory", JSON.stringify(payrollHistory));
}


//  Employee search functionality
if (document.getElementById("search")) {
    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        let searchValue = document.getElementById("search").value.toLowerCase();

        let rows = document.querySelectorAll("tbody tr");
        rows.forEach(row => {
            let name = row.children[1].textContent.toLowerCase();
            row.style.display = name.includes(searchValue) ? "" : "none";
        });
    });
}


//  Add new employee
if (document.querySelector('form[action="addEmployee"]') || document.querySelector('#employees form')) {
    const forms = document.querySelectorAll("#employees form");
    if (forms.length > 1) {
        forms[1].addEventListener("submit", function(e) {
            e.preventDefault();

            let inputs = this.querySelectorAll("input, select");
            let newEmp = {
                id: employees.length + 1,
                name: `${inputs[0].value} ${inputs[1].value}`,
                email: inputs[2].value,
                department: inputs[3].value,
                position: inputs[4].value,
                salary: Number(inputs[5].value)
            };

            employees.push(newEmp);
            saveData();
            alert("Employee Added!");
            this.reset();
        });
    }
}


//  Save attendance records
if (document.querySelector("#attendance form")) {
    document.querySelector("#attendance form").addEventListener("submit", function(e) {
        e.preventDefault();

        let select = this.querySelector("select");
        let inputs = this.querySelectorAll("input");

        let record = {
            employee: select.value,
            date: inputs[0].value,
            status: this.querySelectorAll("select")[1].value,
            checkIn: inputs[1].value,
            checkOut: inputs[2].value
        };

        attendance.push(record);
        saveData();
        alert("Attendance Saved!");
        this.reset();
    });
}


//  Submit and manage leave requests

if (document.querySelector("#leave form")) {
    const forms = document.querySelectorAll("#leave form");

    // First form = submit request
    forms[0].addEventListener("submit", function(e) {
        e.preventDefault();
        
        let selects = this.querySelectorAll("select");
        let inputs = this.querySelectorAll("input");
        let reason = this.querySelector("textarea").value;

        let request = {
            id: "TO" + String(leaveRequests.length + 1).padStart(3, "0"),
            employee: selects[0].value,
            type: selects[1].value,
            start: inputs[0].value,
            end: inputs[1].value,
            reason: reason,
            status: "Pending"
        };

        leaveRequests.push(request);
        saveData();
        alert("Leave Request Submitted!");
        this.reset();
    });

    // Second form = approve/reject
    forms[1].addEventListener("submit", function(e) {
        e.preventDefault();

        let id = this.querySelector("input").value;
        let action = this.querySelector("select").value;

        let req = leaveRequests.find(r => r.id === id);
        if (!req) return alert("Request ID not found.");

        req.status = action;
        saveData();
        alert("Request Updated!");
        this.reset();
    });
}


//  Payroll calculator and payslip generator

if (document.querySelector("#payroll")) {
    const calcForm = document.querySelectorAll("#payroll form")[0]; 
    const payslipForm = document.querySelectorAll("#payroll form")[1];

    // Payroll calculator
    calcForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let employeeName = this.querySelector("select").value;
        let employee = employees.find(e => e.name === employeeName);

        let hoursWorked = Number(this.querySelectorAll("input")[0].value);
        let overtime = Number(this.querySelectorAll("input")[1].value);

        if (!employee) {
            alert("Employee not found!");
            return;
        }

        let hourlyRate = employee.salary / 160;
        let finalSalary = (hoursWorked * hourlyRate) + (overtime * hourlyRate * 1.5);

        alert(`Payroll Calculated:\n\nEmployee: ${employee.name}\nFinal Salary: R${finalSalary.toFixed(2)}`);
    });

    // Payslip generator
    payslipForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let emp = this.querySelector("select").value;
        let period = this.querySelector("input").value;

        alert(`Payslip generated for ${emp}\nPeriod: ${period}`);
    });
}

//  Auto report calculations
function calculateReports() {
    return {
        totalEmployees: employees.length,
        totalSalary: employees.reduce((sum, e) => sum + e.salary, 0),
        avgSalary: employees.reduce((sum, e) => sum + e.salary, 0) / employees.length,
        leaveCount: leaveRequests.length,
        attendanceCount: attendance.length
    };
}