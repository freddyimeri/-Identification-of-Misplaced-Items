document.addEventListener('DOMContentLoaded', function () {
    const username = document.querySelector('#id_username');
    const email = document.querySelector('#id_email');
    const password1 = document.querySelector('#id_password1');
    const password2 = document.querySelector('#id_password2');
    const togglePassword1 = document.querySelector('#togglePassword1');
    const togglePassword2 = document.querySelector('#togglePassword2');
    const passwordMatchMessage = document.querySelector('#passwordMatchMessage');
    const registerButton = document.querySelector('#registerButton');

    togglePassword1.addEventListener('click', function () {
        const type = password1.type === 'password' ? 'text' : 'password';
        password1.type = type;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    togglePassword2.addEventListener('click', function () {
        const type = password2.type === 'password' ? 'text' : 'password';
        password2.type = type;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Password requirements validation
    const requirements = {
        length: { regex: /.{8,}/, element: document.querySelector('#passwordHelpBlock li:nth-child(1)') },
        uppercase: { regex: /[A-Z]/, element: document.querySelector('#passwordHelpBlock li:nth-child(2)') },
        lowercase: { regex: /[a-z]/, element: document.querySelector('#passwordHelpBlock li:nth-child(3)') },
        number: { regex: /[0-9]/, element: document.querySelector('#passwordHelpBlock li:nth-child(4)') }
    };

    function validatePassword() {
        const value = password1.value;
        let allValid = true;
        for (const requirement in requirements) {
            if (requirements[requirement].regex.test(value)) {
                requirements[requirement].element.classList.add('text-success');
                requirements[requirement].element.classList.remove('text-muted');
            } else {
                requirements[requirement].element.classList.remove('text-success');
                requirements[requirement].element.classList.add('text-muted');
                allValid = false;
            }
        }
        return allValid;
    }

    function checkPasswordMatch() {
        if (validatePassword()) {
            if (password2.value === '') {
                passwordMatchMessage.textContent = '';
                return false;
            }
            if (password1.value === password2.value) {
                passwordMatchMessage.textContent = 'Passwords match';
                passwordMatchMessage.classList.remove('text-muted', 'text-danger');
                passwordMatchMessage.classList.add('text-success');
                return true;
            } else {
                passwordMatchMessage.textContent = 'Passwords do not match';
                passwordMatchMessage.classList.remove('text-muted', 'text-success');
                passwordMatchMessage.classList.add('text-danger');
                return false;
            }
        } else {
            passwordMatchMessage.textContent = '';
            return false;
        }
    }

    function validateForm() {
        const isUsernameFilled = username.value.trim() !== '';
        const isEmailFilled = email.value.trim() !== '';
        const isPassword1Valid = validatePassword();
        const isPasswordMatch = checkPasswordMatch();

        if (isUsernameFilled && isEmailFilled && isPassword1Valid && isPasswordMatch) {
            registerButton.disabled = false;
        } else {
            registerButton.disabled = true;
        }
    }

    username.addEventListener('input', validateForm);
    email.addEventListener('input', validateForm);
    password1.addEventListener('input', () => {
        validatePassword();
        validateForm();
    });
    password2.addEventListener('input', () => {
        checkPasswordMatch();
        validateForm();
    });
});
