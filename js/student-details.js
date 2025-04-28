let chartInstance;

document.addEventListener('DOMContentLoaded', function() {
  const loggedInStudent = JSON.parse(localStorage.getItem('selectedStudent'));

  if (!loggedInStudent) {
    alert('No student selected.');
    window.location.href = 'professor.html';
    return;
  }

  document.getElementById('studentName').textContent = loggedInStudent.name;
  document.getElementById('studentEmail').textContent = loggedInStudent.email;
  document.getElementById('studentDepartment').textContent = loggedInStudent.department;
  document.getElementById('studentAttendance').value = loggedInStudent.attendance || 0;

  const subjectsBody = document.getElementById('subjectsBody');

  let subjects = loggedInStudent.subjects || [
    { name: "Mathematics", marks: 0 },
    { name: "Physics", marks: 0 },
    { name: "Chemistry", marks: 0 },
    { name: "English", marks: 0 },
    { name: "Computer Science", marks: 0 }
  ];

  subjectsBody.innerHTML = '';

  subjects.forEach((subject, index) => {
    const row = document.createElement('tr');
    const color = getColor(subject.marks);
    row.innerHTML = `
      <td>${subject.name}</td>
      <td><input type="number" id="marks-${index}" value="${subject.marks}" min="0" max="100" style="color: ${color}; font-weight: bold;"></td>
    `;
    subjectsBody.appendChild(row);
  });

  drawPerformanceChart(subjects);
  updateGPA(subjects);
});

// Save updated student data
function saveStudentData() {
  const loggedInStudent = JSON.parse(localStorage.getItem('selectedStudent'));
  const students = JSON.parse(localStorage.getItem('students')) || [];

  if (!loggedInStudent) {
    alert('No student data!');
    return;
  }

  const subjects = loggedInStudent.subjects || [
    { name: "Mathematics", marks: 0 },
    { name: "Physics", marks: 0 },
    { name: "Chemistry", marks: 0 },
    { name: "English", marks: 0 },
    { name: "Computer Science", marks: 0 }
  ];

  subjects.forEach((subject, index) => {
    subject.marks = parseInt(document.getElementById(`marks-${index}`).value) || 0;
  });

  const updatedAttendance = parseInt(document.getElementById('studentAttendance').value) || 0;

  loggedInStudent.subjects = subjects;
  loggedInStudent.attendance = updatedAttendance;

  // Update average marks
  const avgMarks = subjects.reduce((acc, sub) => acc + sub.marks, 0) / subjects.length;
  loggedInStudent.marks = Math.round(avgMarks);

  const index = students.findIndex(student => student.email === loggedInStudent.email);
  if (index !== -1) {
    students[index] = loggedInStudent;
    localStorage.setItem('students', JSON.stringify(students));
  }

  localStorage.setItem('selectedStudent', JSON.stringify(loggedInStudent));

  alert('Student details updated!');
  refreshChart(subjects);
  updateGPA(subjects);
}

// Draw performance chart
function drawPerformanceChart(subjects) {
  const ctx = document.getElementById('performanceChart').getContext('2d');

  const subjectNames = subjects.map(sub => sub.name);
  const subjectMarks = subjects.map(sub => sub.marks);

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjectNames,
      datasets: [{
        label: 'Marks',
        data: subjectMarks,
        backgroundColor: subjectMarks.map(getBackgroundColor),
        borderColor: subjectMarks.map(getBorderColor),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Refresh chart after save
function refreshChart(subjects) {
  if (chartInstance) {
    chartInstance.destroy();
  }
  drawPerformanceChart(subjects);
}

// GPA calculation
function updateGPA(subjects) {
  const avgMarks = subjects.reduce((acc, sub) => acc + sub.marks, 0) / subjects.length;

  let gpa = 0;
  if (avgMarks >= 90) gpa = 4.0;
  else if (avgMarks >= 80) gpa = 3.5;
  else if (avgMarks >= 70) gpa = 3.0;
  else if (avgMarks >= 60) gpa = 2.5;
  else if (avgMarks >= 50) gpa = 2.0;
  else gpa = 1.0;

  let gpaBox = document.getElementById('gpaBox');
  if (!gpaBox) {
    gpaBox = document.createElement('div');
    gpaBox.id = 'gpaBox';
    gpaBox.style.marginTop = "20px";
    gpaBox.style.fontSize = "20px";
    document.querySelector('.container').appendChild(gpaBox);
  }

  gpaBox.innerHTML = `<strong>GPA:</strong> ${gpa.toFixed(2)}`;
}

// Back button
function goBack() {
  window.history.back();
}

// Color coding
function getColor(marks) {
  if (marks >= 75) return "lightgreen";
  if (marks >= 50) return "orange";
  return "red";
}
function getBackgroundColor(marks) {
  if (marks >= 75) return 'rgba(0, 255, 0, 0.6)'; // green
  if (marks >= 50) return 'rgba(255, 165, 0, 0.6)'; // orange
  return 'rgba(255, 0, 0, 0.6)'; // red
}
function getBorderColor(marks) {
  if (marks >= 75) return 'rgba(0, 255, 0, 1)';
  if (marks >= 50) return 'rgba(255, 165, 0, 1)';
  return 'rgba(255, 0, 0, 1)';
}