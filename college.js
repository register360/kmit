document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new URLSearchParams(new FormData(e.target));
  
  try {
    const response = await fetch(e.target.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('Submission result:', result);
    
   if (response.ok) {
  // Replace alert with visible page message
  document.getElementById('message').innerHTML = `
    <div class="alert alert-success">
      ✅ Registration successful!<br>
      Roll Number: ${result.data.rollno}
    </div>
  `;
  form.reset();
} 
  else {
  document.getElementById('message').innerHTML = `
    <div class="alert alert-danger">
      ❌ Error: ${result.error || 'Submission failed'}<br>
      ${result.details || ''}
    </div>
  `;
}
  } catch (error) {
    console.error('Submission error:', error);
    alert('Network error - please try again');
  }
});
