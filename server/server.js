document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('Form');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.glyphicon-eye-open');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    messageDiv.className = 'message-container';
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Remove duplicate DOMContentLoaded listener
    // Device detection and layout adjustment
    function detectDevice() {
        const userAgent = navigator.userAgent;
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android|Tablet/i.test(userAgent) && !isMobile;
        
        return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    }

    function adjustLayout() {
        const device = detectDevice();
        const container = document.querySelector('.login-container');

        // Device-specific adjustments
        const styles = {
            mobile: {
                fontSize: '14px',
                width: '90%',
                padding: '10px',
                inputPadding: '8px',
                buttonPadding: '8px 16px'
            },
            tablet: {
                fontSize: '16px',
                width: '70%',
                padding: '20px',
                inputPadding: '10px',
                buttonPadding: '10px 20px'
            },
            desktop: {
                fontSize: '18px',
                width: '50%',
                padding: '30px',
                inputPadding: '10px',
                buttonPadding: '10px 20px'
            }
        };

        const current = styles[device];
        
        document.body.style.fontSize = current.fontSize;
        form.style.width = current.width;
        container.style.padding = current.padding;

        // Adjust elements
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
            heading.style.textAlign = device === 'mobile' ? 'center' : 'left';
        });

        document.querySelectorAll('input').forEach(input => {
            input.style.padding = current.inputPadding;
            input.style.fontSize = current.fontSize;
        });

        document.querySelectorAll('button').forEach(button => {
            button.style.padding = current.buttonPadding;
            button.style.fontSize = current.fontSize;
        });
    }

    // Initial adjustment
    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // Toggle password visibility
    if (eyeIcon) {
        eyeIcon.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.classList.toggle('glyphicon-eye-open', !isPassword);
            this.classList.toggle('glyphicon-eye-close', isPassword);
        });
    }
    
    // Enhanced form submission handler
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
            submitBtn.disabled = true;

            try {
                // Get form values
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    number: document.getElementById('number').value.trim(),
                    rollno: document.getElementById('rollno').value.trim().toUpperCase(),
                    password: passwordInput.value,
                    branch: document.querySelector('input[name="branch"]:checked')?.value
                };

                // Validation
                if (!formData.name || !formData.number || !formData.rollno || !formData.password || !formData.branch) {
                    throw new Error('All fields are required');
                }

                if (!/^\d{10}$/.test(formData.number)) {
                    throw new Error('Please enter a valid 10-digit phone number');
                }
                
                if (!/^[a-zA-Z0-9]+$/.test(formData.rollno)) {
                    throw new Error('Roll number should be alphanumeric');
                }
                
                if (formData.password !== "Kmit123$") {
                    throw new Error('Invalid Password');
                }

                // Send data to server
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData)
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.message || 'Submission failed');
                }

                // Success message
                messageDiv.innerHTML = `
                    <div class="alert alert-success">
                        ✅ ${formData.name}, your registration is successful!<br>
                        Roll Number: ${formData.rollno}
                    </div>
                `;
                
                form.reset();
            } catch (error) {
                messageDiv.innerHTML = `
                    <div class="alert alert-danger">
                        ❌ Error: ${error.message}
                    </div>
                `;
                console.error('Submission error:', error);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Auto-hide messages after 5 seconds
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            }
        });
    }
});
