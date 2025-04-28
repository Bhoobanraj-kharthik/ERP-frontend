// login.js

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    if (!username || !password || !role) {
      alert('Please fill in all fields!');
      return;
    }

    switch (role) {
      case 'student':
        handleStudentLogin(username, password);
        break;
      case 'professor':
        handleProfessorLogin(username, password);
        break;
      case 'admin':
        handleAdminLogin(username, password);
        break;
      default:
        alert('Invalid role selected!');
    }
  });
});

function handleStudentLogin(email, password) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const studentFound = students.find(student => student.email === email && student.password === password);

  if (studentFound) {
    localStorage.setItem('loggedInStudent', JSON.stringify(studentFound));
    window.location.href = 'student-dashboard.html';
  } else {
    alert('Student login failed. Check your email and password.');
  }
}

function handleProfessorLogin(username, password) {
  const professors = [
    { department: 'Computer Science', username: 'csprof', password: 'cs123' },
    { department: 'Electronics', username: 'ecprof', password: 'ec123' },
    { department: 'Mechanical', username: 'mechprof', password: 'mech123' },
    { department: 'Civil', username: 'civilprof', password: 'civil123' },
    { department: 'Electrical', username: 'eeprof', password: 'ee123' },
    { department: 'Business', username: 'bprof', password: 'b123' }
  ];

  const professorFound = professors.find(prof => prof.username === username && prof.password === password);

  if (professorFound) {
    localStorage.setItem('loggedInProfessor', JSON.stringify(professorFound));
    window.location.href = 'professor.html';
  } else {
    alert('Professor login failed. Check your username and password.');
  }
}

function handleAdminLogin(username, password) {
  if (username === 'admin' && password === 'admin123') {
    window.location.href = 'admin.html';
  } else {
    alert('Admin login failed. Check your credentials.');
  }
}
