// Client-side form handling for KMIT Student Portal
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('Form');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.glyphicon-eye-open');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'form-message';
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // 1. Password Visibility Toggle (your original functionality)
    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.classList.toggle('glyphicon-eye-open', !isPassword);
            this.classList.toggle('glyphicon-eye-close', isPassword);
        });
    }

    // 2. Responsive Layout Adjustments (your original functionality)
    function adjustLayout() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
        
        // Form sizing
        form.style.width = isMobile ? '90%' : isTablet ? '70%' : '50%';
        
        // Text sizing
        document.body.style.fontSize = isMobile ? '14px' : '16px';
        
        // Input/Button adjustments
        document.querySelectorAll('input, button').forEach(el => {
            el.style.padding = isMobile ? '8px' : '10px';
            el.style.fontSize = isMobile ? '14px' : '16px';
        });
    }

    // Initial adjustment + resize listener
    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // 3. Enhanced Form Submission (improved version of your code)
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Processing...';
        submitBtn.disabled = true;

        try {
            // Form data collection
            const formData = {
                name: document.getElementById('name').value.trim(),
                number: document.getElementById('number').value.trim(),
                rollno: document.getElementById('rollno').value.trim().toUpperCase(),
                password: passwordInput.value,
                branch: document.querySelector('input[name="branch"]:checked')?.value
            };

            // Validation (your original rules)
            if (!/^\d{10}$/.test(formData.number)) {
                throw new Error('Please enter a valid 10-digit phone number');
            }
            if (!/^[a-zA-Z0-9]+$/.test(formData.rollno)) {
                throw new Error('Roll number should be alphanumeric');
            }
            if (formData.password !== "Kmit123$") {
                throw new Error('Invalid Password');
            }

            // Send to server
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Submission failed');
            }

            // Success message (your original format)
            messageDiv.innerHTML = `
                <div class="alert alert-success">
                    ${formData.name}, your registration is successful!<br>
                    Roll Number: ${formData.rollno}
                </div>
            `;
            form.reset();
            
        } catch (error) {
            messageDiv.innerHTML = `
                <div class="alert alert-danger">
                    Error: ${error.message}
                </div>
            `;
            console.error('Submission error:', error);
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Auto-hide messages after 5s
            setTimeout(() => messageDiv.innerHTML = '', 5000);
        }
    });
});
