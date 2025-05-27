document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('studentForm');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.glyphicon-eye-open');
    const messageDiv = document.createElement('div');
    messageDiv.id = 'form-message';
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // 1. Password Visibility Toggle
    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.classList.toggle('glyphicon-eye-open', !isPassword);
            this.classList.toggle('glyphicon-eye-close', isPassword);
        });
    }

    // 2. Form Submission Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner">Processing...</span>';
        submitBtn.disabled = true;

        try {
            // Get form values with null checks
            const nameInput = document.getElementById('name');
            const numberInput = document.getElementById('number');
            const rollnoInput = document.getElementById('rollno');
            const branchInput = document.querySelector('input[name="branch"]:checked');

            if (!nameInput || !numberInput || !rollnoInput || !passwordInput || !branchInput) {
                throw new Error('Form elements missing');
            }

            const formData = {
                name: nameInput.value.trim(),
                number: numberInput.value.trim(),
                rollno: rollnoInput.value.trim(),
                password: passwordInput.value,
                branch: branchInput.value
            };

            // Client-side validation
            if (!formData.name) throw new Error('Name is required');
            if (!formData.number) throw new Error('Phone number is required');
            if (!formData.rollno) throw new Error('Roll number is required');
            if (!formData.password) throw new Error('Password is required');
            if (!formData.branch) throw new Error('Branch selection is required');

            if (!/^\d{10}$/.test(formData.number)) {
                throw new Error('Phone number must be 10 digits');
            }

            if (!/^[a-zA-Z0-9]+$/.test(formData.rollno)) {
                throw new Error('Roll number must be alphanumeric');
            }

            // Send to server
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Server error');
            }

            const result = await response.json();
            
            // Show success message
            showSuccessMessage(result.data || {
                name: formData.name,
                rollno: formData.rollno,
                branch: formData.branch
            });

        } catch (error) {
            showErrorMessage(error.message);
            console.error('Submission error:', error);
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Helper functions
    function showSuccessMessage(data) {
        messageDiv.innerHTML = `
            <div class="alert alert-success">
                ✅ Registration Successful!<br>
                Name: ${data.name}<br>
                Roll No: ${data.rollno}<br>
                Branch: ${data.branch}
            </div>
        `;
        form.reset();
    }

    function showErrorMessage(message) {
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                ❌ Error: ${message}
            </div>
        `;
    }

    // Initial form validation check
    function validateForm() {
        const branchSelected = document.querySelector('input[name="branch"]:checked');
        if (!branchSelected) {
            document.querySelector('input[name="branch"]').setAttribute('required', '');
        }
    }
    validateForm();
});
