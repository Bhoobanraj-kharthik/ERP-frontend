document.addEventListener('DOMContentLoaded', function() {
  const student = JSON.parse(localStorage.getItem('loggedInStudent'));
  if (!student) {
    alert('Unauthorized access!');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('studentName').textContent = student.name;
  document.getElementById('studentEmail').textContent = student.email;
  document.getElementById('studentDepartment').textContent = student.department;

  let statusMessage = document.getElementById('statusMessage');
  
  if (!student.subjects || student.subjects.length === 0) {
    statusMessage.textContent = "We are currently working on updating your academic information. Please check back soon.";
    document.getElementById('studentAttendance').textContent = "-";
    document.getElementById('studentMarks').textContent = "-";
    document.getElementById('studentGPA').textContent = "-";
  } else {
    statusMessage.textContent = "";

    const avgMarks = calculateAverage(student.subjects);
    const gpa = calculateGPA(avgMarks);

    document.getElementById('studentAttendance').textContent = (student.attendance || "0") + "%";
    document.getElementById('studentMarks').textContent = avgMarks.toFixed(2);
    document.getElementById('studentGPA').textContent = gpa.toFixed(2);

    renderChart(student.subjects);
  }
});

function calculateAverage(subjects) {
  if (!subjects.length) return 0;
  const total = subjects.reduce((sum, subj) => sum + (subj.marks || 0), 0);
  return total / subjects.length;
}

function calculateGPA(avgMarks) {
  if (avgMarks >= 90) return 4.0;
  if (avgMarks >= 80) return 3.5;
  if (avgMarks >= 70) return 3.0;
  if (avgMarks >= 60) return 2.5;
  return 2.0;
}

function renderChart(subjects) {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  const labels = subjects.map(subj => subj.name);
  const marks = subjects.map(subj => subj.marks);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Marks',
        data: marks,
        backgroundColor: '#00ff00',
        borderColor: '#00cc00',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// Logout
function logout() {
  localStorage.removeItem('loggedInStudent');
  localStorage.removeItem('loggedInProfessor');
  window.location.href = 'login.html';
}

// Modal Controls
function openChangePasswordModal() {
  document.getElementById('passwordModal').style.display = 'block';
}
function closePasswordModal() {
  document.getElementById('passwordModal').style.display = 'none';
}

// Change Password
function changePassword() {
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  let student = JSON.parse(localStorage.getItem('loggedInStudent'));
  let students = JSON.parse(localStorage.getItem('students')) || [];

  if (oldPassword !== student.password) {
    alert('Old password incorrect!');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }

  student.password = newPassword;
  localStorage.setItem('loggedInStudent', JSON.stringify(student));

  const index = students.findIndex(s => s.email === student.email);
  if (index !== -1) {
    students[index].password = newPassword;
    localStorage.setItem('students', JSON.stringify(students));
  }

  alert('Password changed successfully!');
  closePasswordModal();
}

// Download Report as PDF
function downloadReport() {
  const dashboard = document.getElementById('dashboardContent');

  html2canvas(dashboard).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('report-card.pdf');
  });
}