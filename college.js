document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('Form');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.glyphicon-eye-open');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Device detection and layout adjustment (your original code)
    function detectDevice() {
        const userAgent = navigator.userAgent;
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android|Tablet/i.test(userAgent) && !isMobile;
        
        if (isMobile) return 'mobile';
        if (isTablet) return 'tablet';
        return 'desktop';
    }

    function adjustLayout() {
        const device = detectDevice();
        const container = document.querySelector('.login-container');
        const body = document.body;

        // Device-specific adjustments (your original code)
        switch(device) {
            case 'mobile':
                body.style.fontSize = '14px';
                form.style.width = '90%';
                container.style.padding = '10px';
                break;
            case 'tablet':
                body.style.fontSize = '16px';
                form.style.width = '70%';
                container.style.padding = '20px';
                break;
            case 'desktop':
                body.style.fontSize = '18px';
                form.style.width = '50%';
                container.style.padding = '30px';
                break;
        }

        // Additional responsive elements (your original code)
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.textAlign = device === 'mobile' ? 'center' : 'left';
        });

        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.padding = device === 'mobile' ? '8px' : '10px';
            input.style.fontSize = device === 'mobile' ? '14px' : '16px';
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.padding = device === 'mobile' ? '8px 16px' : '10px 20px';
            button.style.fontSize = device === 'mobile' ? '14px' : '16px';
        });
    }

    // Initial adjustment
    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // Toggle password visibility (your original code)
    if (eyeIcon) {
        eyeIcon.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('glyphicon-eye-open');
                this.classList.add('glyphicon-eye-close');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('glyphicon-eye-close');
                this.classList.add('glyphicon-eye-open');
            }
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
                // Get form values (your original validation)
                const name = document.getElementById('name').value;
                const number = document.getElementById('number').value;
                const rollno = document.getElementById('rollno').value;
                const password = passwordInput.value;
                const branch = document.querySelector('input[name="branch"]:checked');
                
                // Your original validation checks
                if (number.length !== 10) {
                    throw new Error('Please enter a valid 10-digit phone number');
                }
                
                if (!/^[a-zA-Z0-9]+$/.test(rollno)) {
                    throw new Error('Roll number should be alphanumeric!');
                }
                // Create student object (your original structure)
                const student = {
                    name: name,
                    phone: number,
                    rollno: rollno,
                    branch: branch.value,
                    timestamp: new Date().toISOString()
                };

                // Send data to server (enhanced version)
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(student)
                });

                const result = await response.json();

                if (response.ok) {
                    // Enhanced success message
                    messageDiv.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            ✅ <strong>Registration successful!</strong><br>
                            Roll Number: ${rollno}
                        </div>
                    `;
                    form.reset();
                } else {
                    throw new Error(result.error || 'Submission failed');
                }
            } catch (error) {
                // Enhanced error handling
                messageDiv.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        ❌ <strong>Error:</strong> ${error.message}
                    </div>
                `;
                console.error('Submission error:', error);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
