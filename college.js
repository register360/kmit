/**
 * KMIT Student Portal - Client Side JavaScript
 * Handles form submission, password visibility, and responsive design
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('studentForm');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.glyphicon-eye-open');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'form-messages';
    form.parentNode.insertBefore(messageDiv, form);

    // 1. Password Visibility Toggle
    if (eyeIcon && passwordInput) {
        eyeIcon.style.cursor = 'pointer';
        eyeIcon.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.classList.toggle('glyphicon-eye-open', !isPassword);
            this.classList.toggle('glyphicon-eye-close', isPassword);
        });
    }

    // 2. Responsive Design Adjustments
    function handleResponsiveDesign() {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const isTablet = screenWidth >= 768 && screenWidth < 992;

        // Adjust form width
        form.style.width = isMobile ? '90%' : isTablet ? '75%' : '50%';

        // Adjust font sizes
        document.querySelectorAll('input, select, button').forEach(el => {
            el.style.fontSize = isMobile ? '14px' : '16px';
            el.style.padding = isMobile ? '8px 12px' : '10px 15px';
        });

        // Center align headings on mobile
        document.querySelectorAll('h1, h2, h3').forEach(heading => {
            heading.style.textAlign = isMobile ? 'center' : 'left';
        });
    }

    // Initial call and resize listener
    handleResponsiveDesign();
    window.addEventListener('resize', handleResponsiveDesign);

    // 3. Enhanced Form Submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // UI Loading State
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner">Processing...</span>';

        try {
            // Form Data Collection
            const formData = {
                name: document.getElementById('name').value.trim(),
                number: document.getElementById('number').value.trim(),
                rollno: document.getElementById('rollno').value.trim().toUpperCase(),
                password: passwordInput.value,
                branch: document.querySelector('input[name="branch"]:checked')?.value
            };

            // Client-Side Validation
            if (!formData.name || !formData.number || !formData.rollno || !formData.password || !formData.branch) {
                throw new Error('All fields are required');
            }

            if (!/^\d{10}$/.test(formData.number)) {
                throw new Error('Phone number must be 10 digits');
            }

            if (!/^[A-Z0-9]+$/.test(formData.rollno)) {
                throw new Error('Roll number must be alphanumeric');
            }

            if (formData.password !== "Kmit123$") {
                throw new Error('Invalid password format');
            }

            // Server Submission
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Submission failed');
            }

            // Success Handling
            showMessage('success', `
                ${formData.name}, registration successful!<br>
                Roll Number: ${formData.rollno}<br>
                Branch: ${formData.branch}
            `);
            
            form.reset();

        } catch (error) {
            showMessage('error', error.message);
            console.error('Submission error:', error);
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Helper function to display messages
    function showMessage(type, text) {
        messageDiv.innerHTML = `
            <div class="message ${type}">
                ${text}
                <span class="close-btn">&times;</span>
            </div>
        `;
        
        // Add close button functionality
        messageDiv.querySelector('.close-btn').addEventListener('click', () => {
            messageDiv.innerHTML = '';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageDiv.innerHTML.includes(text)) {
                messageDiv.innerHTML = '';
            }
        }, 5000);
    }
});
