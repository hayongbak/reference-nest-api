
let newPasswordPristine = true;
let pristineFlip = () => {
    newPasswordPristine = false;
    checkNewPassword();
}

let newPasswordValid = false;
let checkNewPassword = () => {
    const newPassword = document.getElementById('newPassword');
    let newPasswordError = document.getElementById('newPasswordError');
    if (newPasswordPristine) { return; } // Don't start showing error messages from the start
    if (newPassword.value.length < 8) {
        newPasswordError.innerText = "Your password should have a minimum of 8 characters.";
        newPasswordError.classList.remove('no-d');
        newPasswordValid = false;
    } else if (newPassword.value.length >= 8) {
        newPasswordError.innerText = "";
        newPasswordError.classList.add('no-d');
        newPasswordValid = true;
    }

    checkButton();
};
let confirmNewPasswordValid = false;
let checkConfirmNewPassword = () => {
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    let confirmNewPasswordError = document.getElementById('confirmNewPasswordError');
    if (newPassword.value === confirmNewPassword.value) {
        confirmNewPasswordError.innerText = "";
        confirmNewPasswordError.classList.add('no-d');
        confirmNewPasswordValid = true;
    } else {
        confirmNewPasswordError.innerText = "Passwords do not match";
        confirmNewPasswordError.classList.remove('no-d');
        confirmNewPasswordValid = false;
    }

    checkButton();
};
let formValid = false;
let checkButton = () => {
    const button = document.querySelector('button');
    if(newPasswordValid && confirmNewPasswordValid){
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', 'disabled');
    }
};


