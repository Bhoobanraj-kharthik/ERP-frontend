document.addEventListener('DOMContentLoaded', function () {
  loadStats();
  document.getElementById('showAddStudentForm').addEventListener('click', () => {
    document.getElementById('addStudentForm').style.display = 'block';
  });

  document.getElementById('cancelAddStudent').addEventListener('click', () => {
    document.getElementById('addStudentForm').style.display = 'none';
  });

  document.getElementById('addStudentButton').addEventListener('click', addStudent);
});

// Load statistics
function loadStats() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const loginStats = JSON.parse(localStorage.getItem('loginStats')) || {};

  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('totalUsers').textContent = students.length + 6; // 6 Professors

  // Storage calculation
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += ((localStorage.getItem(key).length * 2) / 1024);
    }
  }
  document.getElementById('storageUsed').textContent = total.toFixed(2) + ' KB';

  document.getElementById('loginStats').textContent = Object.keys(loginStats).length + ' logins recorded.';

  // Department wise
  const deptMap = {};
  students.forEach(s => {
    deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  });

  const departmentsContainer = document.getElementById('departmentsContainer');
  departmentsContainer.innerHTML = '';

  for (let dept in deptMap) {
    const card = document.createElement('div');
    card.className = 'department-card';
    card.innerHTML = `<h3>${dept}</h3><p>${deptMap[dept]} Students</p>`;
    departmentsContainer.appendChild(card);
  }
}

// Add student manually
function addStudent() {
  const name = document.getElementById('newStudentName').value.trim();
  const email = document.getElementById('newStudentEmail').value.trim();
  const password = document.getElementById('newStudentPassword').value;
  const department = document.getElementById('newStudentDepartment').value;

  if (!name || !email || !password || !department) {
    alert('Please fill all fields!');
    return;
  }

  const students = JSON.parse(localStorage.getItem('students')) || [];
  if (students.find(s => s.email === email)) {
    alert('Student already exists!');
    return;
  }

  students.push({
    name,
    email,
    password,
    department,
    attendance: 0,
    subjects: [
      { name: "Mathematics", marks: 0 },
      { name: "Physics", marks: 0 },
      { name: "Chemistry", marks: 0 },
      { name: "English", marks: 0 },
      { name: "Computer Science", marks: 0 }
    ]
  });

  localStorage.setItem('students', JSON.stringify(students));
  alert('Student added successfully!');
  document.getElementById('addStudentForm').style.display = 'none';
  loadStats(); // Refresh
}

// Master functions
function deleteAllStudents() {
  if (confirm('Are you sure you want to delete all students?')) {
    localStorage.removeItem('students');
    loadStats();
    alert('All students deleted.');
  }
}

function downloadUsersData() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const csv = students.map(s => `${s.name},${s.email},${s.department}`).join('\n');
  downloadFile('students.csv', csv);
}

function downloadReports() {
  const loginStats = localStorage.getItem('loginStats') || '{}';
  downloadFile('login-stats.json', loginStats);
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function logout() {
  window.location.href = 'login.html';
}
function autoPopulateStudents() {
  if (!confirm('This will generate 120 students (20 per department). Proceed?')) {
    return;
  }

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Business"
  ];

  const sampleNames = [
    "Alex", "Ben", "Cara", "Dana", "Eli", "Finn", "Gina", "Hugo", "Ivy", "Jake",
    "Kira", "Liam", "Maya", "Noah", "Omar", "Pia", "Quin", "Rhea", "Sean", "Tina",
    "Uma", "Vik", "Will", "Xena", "Yara", "Zane"
  ];

  const students = JSON.parse(localStorage.getItem('students')) || [];

  departments.forEach(dept => {
    for (let i = 0; i < 20; i++) {
      const name = sampleNames[Math.floor(Math.random() * sampleNames.length)] + " " + sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const email = generateShortEmail();
      const password = generateShortPassword();
      const subjects = generateSubjects();
      const attendance = Math.floor(Math.random() * (98 - 60 + 1)) + 60;

      students.push({
        name,
        email,
        password,
        department: dept,
        attendance,
        subjects
      });
    }
  });

  localStorage.setItem('students', JSON.stringify(students));
  alert('Successfully populated 120 students!');
  loadStats();
}

// Helper: Random email like a@s.c
function generateShortEmail() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return (
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    "@" +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    "." +
    letters.charAt(Math.floor(Math.random() * letters.length))
  );
}

// Helper: Random 2-letter password
function generateShortPassword() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return (
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length))
  );
}

// Helper: Generate random subjects + marks
function generateSubjects() {
  const sampleSubjects = ["Maths", "Physics", "Chemistry", "Programming", "Mechanics"];
  return sampleSubjects.map(sub => ({
    name: sub,
    marks: Math.floor(Math.random() * (97 - 60 + 1)) + 60
  }));
}

