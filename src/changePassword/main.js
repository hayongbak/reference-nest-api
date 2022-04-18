let checkNewPasswort = () => {
    const newPassword = document.getElementById('newPassword');
    let newPasswordError = document.getElementById('newPasswordError');
    if (newPassword.value.length < 8) {
        newPasswordError.innerText = "Password min 8.";
    } else if(newPassword.value.length >= 8) {
        newPasswordError.innerText = "";
    }
};

let checkConfirmNewPasswort = () => {
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    let confirmNewPasswordError = document.getElementById('confirmNewPasswordError');
    if (confirmNewPassword.value.length < 8) {
        confirmNewPasswordError.innerText = "Password min 8.";
    } else if(confirmNewPassword.value.length >= 8 ) {
        confirmNewPasswordError.innerText = "";
        if(newPassword.value === confirmNewPassword.value) {
            confirmNewPasswordError.innerText = "";
        } else {
            confirmNewPasswordError.innerText = "Passwords do not match";
        }
    } 
};

let sendNewPasswords = () =>{
    const newPassword = document.getElementById('newPassword');
    let newPasswordError = document.getElementById('newPasswordError');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    let confirmNewPasswordError = document.getElementById('confirmNewPasswordError');
    const formWrapper = document.getElementById('formWrapper');
    const successWrapper = document.getElementById('successWrapper');

    if (newPassword.value.length >= 8 && confirmNewPassword.value.length >= 8 && newPassword.value === confirmNewPassword.value) {
        console.log('Start Api Call');
        formWrapper.style.display = "none";
        successWrapper.style.display = "unset";
    } else if(newPassword.value.length === 0 && confirmNewPassword.value.length === 0) {
        newPasswordError.innerText = "New Password is required.";
        confirmNewPasswordError.innerText = "Confirm New Password is required.";

    }

};