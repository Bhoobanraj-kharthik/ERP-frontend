document.addEventListener('DOMContentLoaded', function() {

  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const password = document.getElementById('studentPassword').value.trim();
    const department = document.getElementById('department').value;

    if (!name || !email || !password || !department) {
      alert('Please fill in all fields!');
      return;
    }

    let students = JSON.parse(localStorage.getItem('students')) || [];

    const existingStudent = students.find(student => student.email === email);
    if (existingStudent) {
      alert('An account with this email already exists!');
      return;
    }

    const newStudent = {
      name,
      email,
      password,
      department,
      marks: 0,
      attendance: 0
    };

    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    alert('Registration successful! Redirecting to login...');
    window.location.href = 'login.html';
  });

});
