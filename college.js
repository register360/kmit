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
      alert('Registration successful!');
      e.target.reset();
    } else {
      alert(`Error: ${result.error || 'Submission failed'}`);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Network error - please try again');
  }
});
