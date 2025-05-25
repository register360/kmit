document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('studentForm');
  const messageDiv = document.getElementById('message');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    submitBtn.disabled = true;
    
    try {
      const formData = new URLSearchParams(new FormData(form));
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
      
      const result = await response.json();
      console.log('Submission result:', result);
      
      if (response.ok) {
        // Success message with animation
        messageDiv.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            ✅ <strong>Registration successful!</strong><br>
            Roll Number: ${result.data.rollno}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        
        // Add slight delay before reset for better UX
        setTimeout(() => {
          form.reset();
        }, 500);
      } else {
        // Error message
        messageDiv.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ❌ <strong>Error:</strong> ${result.error || 'Submission failed'}<br>
            ${result.details || ''}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      }
    } catch (error) {
      console.error('Submission error:', error);
      messageDiv.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ❌ <strong>Network Error:</strong> Please check your connection and try again
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      
      // Auto-dismiss alerts after 5 seconds
      const alerts = document.querySelectorAll('.alert');
      alerts.forEach(alert => {
        setTimeout(() => {
          alert.classList.remove('show');
          alert.classList.add('fade');
        }, 5000);
      });
    }
  });
  
  // Add responsive behavior for mobile
  function handleMobileView() {
    if (window.innerWidth < 768) {
      form.classList.add('mobile-form');
    } else {
      form.classList.remove('mobile-form');
    }
  }
  
  // Initial check and event listener
  handleMobileView();
  window.addEventListener('resize', handleMobileView);
});
