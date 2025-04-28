document.addEventListener('DOMContentLoaded', function() {
    const studentsBody = document.getElementById('studentsBody');
    const loggedInProfessor = JSON.parse(localStorage.getItem('loggedInProfessor'));
  
    if (!loggedInProfessor) {
      alert('Unauthorized access!');
      window.location.href = 'login.html';
      return;
    }
  
    const students = JSON.parse(localStorage.getItem('students')) || [];
  
    // Filter students based on professor's department
    const myStudents = students.filter(student => student.department === loggedInProfessor.department);
  
    studentsBody.innerHTML = '';
  
    myStudents.forEach((student) => {
      const avgMarks = student.subjects ? calculateAverage(student.subjects) : (student.marks || 0);
      const gpa = calculateGPA(avgMarks);
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.department}</td>
        <td>${avgMarks.toFixed(2)}</td>
        <td>${gpa.toFixed(2)}</td>
        <td>${student.attendance || 0}%</td>
      `;
  
      row.style.cursor = 'pointer';
      row.addEventListener('click', function() {
        localStorage.setItem('selectedStudent', JSON.stringify(student));
        window.location.href = 'student-details.html';
      });
  
      studentsBody.appendChild(row);
    });
  });
  
  // Calculate average marks across subjects
  function calculateAverage(subjects) {
    if (!subjects.length) return 0;
    const total = subjects.reduce((sum, subj) => sum + (subj.marks || 0), 0);
    return total / subjects.length;
  }
  
  // Calculate GPA based on average marks
  function calculateGPA(avgMarks) {
    if (avgMarks >= 90) return 4.0;
    if (avgMarks >= 80) return 3.5;
    if (avgMarks >= 70) return 3.0;
    if (avgMarks >= 60) return 2.5;
    return 2.0;
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem('loggedInProfessor');
    localStorage.removeItem('loggedInStudent');
    window.location.href = 'login.html';
  }
  