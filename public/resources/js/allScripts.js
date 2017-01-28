function editMe() {


    var user = {
        name: editName.value,
        // surname: editSurname.value,
        phone: editPhone.value,
        email: editEmail.value,
        password: editPassword.value

    }
    
    // alert(JSON.stringify(user))
    $.ajax({
        url: '/editUser',
        dataType: 'text',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(user),
        success: function (data, textStatus, jQxhr) {
            location.href = '/logout';
//                                    inputLogin3.value = "";
//                                    inputEmail3.value = "";
            textareaClass.value = "";
        },
        error: function (jqXhr, textStatus, errorThrown) {
//                                    alert(jqXhr + "   " + textStatus + "   " + errorThrown)
        }
    });

}



//
//
//
//
//
// var phn = true;
// var na = false;
// var eme = false;
// var pas = false;
// var namefield;
// var surnamefield;
// var phonefield;
// var emailfield;
// var passwordfield;
// var confirmPasswordfield;
// var canAdd = false;
//
// editPhone.onblur = function (i) {
//     alert(i.value)
//     if (!isNaN(editPhone.value)) {
//
//
//     }
//     else if (isNaN(editPhone.value)) {
//         editPhone.style.borderColor = "red";
//         erPhone.innerHTML = 'not a number';
//         phn = false;
//     }
//     else {
//         editPhone.style.borderColor = "red";
//         erPhone.innerHTML = '';
//         phn = false;
//
//     }
// }
//
// editName.onblur = function () {
//     if (!this.value) {
//         namefield = null;
//         this.className = "error";
//         errorname.innerHTML = 'please enter your name.';
//         na = false;
//     }
//
//     else {
//         names.style.backgroundColor = "green";
//         ername.innerHTML = "";
//         namefield = this.value;
//         na = true;
//         if (isKyr(this.value)) {
//             alert("kyrillic");
//         }
//     }
// }
// email.onblur = function () {
//     this.css = this.className;
//     var em = this.value;
//     if (!this.value) {
//         emailfield = null;
//         email.style.borderColor = "red";
//         errormail.innerHTML = 'please enter your email.';
//         eme = false;
//     }
//
//     else if (this.value) {
//
//         if (isKyr(this.value)) {
//             emailfield = null;
//             email.style.borderColor = "red";
//             errormail.innerHTML = 'please  email in latin letters';
//             eme = false;
//         }
//
//         else {
//             var r = /^\w+@\w+\.\w{2,4}$/i;
//             if (!r.test(document.getElementById("email").value)) {
//                 emailfield = null;
//                 email.style.borderColor = "red";
//                 errormail.innerHTML = 'please enter correct  email ';
//                 eme = false;
//             }
//
//             else {
//                 fetch("ckeckMail", {
//                     method: 'post',
//                     body: this.value
//                 })
//                     .then(function (response) {
//                         return response.text();
//                     })
//                     .then(function (data) {
//                         if (data !== "empty") {
//                             emailfield = null;
//                             email.style.borderColor = "red";
//                             errormail.innerHTML = 'this email is already registered';
//                             eme = false;
//                         }
//                         else {
//                             email.style.borderColor = "green";
//                             errormail.innerHTML = '';
//                             emailfield = em;
//                             eme = true;
//                         }
//                     })
//                     .catch(error);
//
//             }
//
//
//         }
//     }
// }
// var isKyr = function (str) {
//     return /[а-я]/i.test(str);
// }
// password.onblur = function () {
//     var passwordval = this.value;
//     if (!this.value) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "please enter password";
//         passwordfield = null;
//         pas = false;
//     }
//     else if (isKyr(this.value)) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "please enter password in latin symbols";
//         passwordfield = null;
//         pas = false;
//     }
//     else if (this.value.length < 4 && this.value && !isKyr(this.value)) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "password is too short (min 4 symbols)";
//         passwordfield = null;
//         pas = false;
//     }
//     else {
//         password.style.borderColor = "green";
//         errorpassword.innerHTML = "";
//         passwordfield = passwordval;
//         pas = true;
//     }
// }
// confirmPassword.onblur = function () {
//     var passwordConfirm = this.value;
//     if (!passwordConfirm
//         & passwordfield) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "please enter password  from confirm";
//         confirmPasswordfield = null;
//         pas = false;
//     }
//     else if (this.value != passwordfield) {
//         confirmPassword.style.borderColor = "red";
//         errorpasswordConfirm.innerHTML = "password does not match";
//         confirmPasswordfield = null;
//         pas = false;
//     }
//     else {
//         confirmPassword.style.borderColor = "green";
//         errorpasswordConfirm.innerHTML = "password match";
//         confirmPasswordfield = passwordConfirm;
//         pas = true;
//     }
// }
//
// function checkFields() {
//     if (document.getElementById("confirmPassword").value != document.getElementById("password").value) {
//         pas = false
//     }
//     if (!document.getElementById("phone").value) {
//         phn = true;
//     }
//     if (!document.getElementById("email").value) {
//         email.style.borderColor = "red";
//         errormail.innerHTML = 'please enter your email.';
//     }
//     if (isKyr(document.getElementById("email").value)) {
//         emailfield = null;
//         email.style.borderColor = "red";
//         errormail.innerHTML = 'please  email latin symbols';
//         eme = false;
//     }
//     var r = /^\w+@\w+\.\w{2,4}$/i;
//
//     if (!r.test(document.getElementById("email").value)) {
//         emailfield = null;
//         email.style.borderColor = "red";
//         errormail.innerHTML = 'please enter correct  email ';
//         eme = false;
//     }
//     if (!document.getElementById("names").value) {
//         names.style.borderColor = "red"
//         errorname.innerHTML = 'please enter your name.';
//     }
//
//     if (!document.getElementById("password").value) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "please enter correct password";
//     }
// //
//     if (isKyr(document.getElementById("password").value)) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "please enter  password in latin symbols";
//     }
//     if (document.getElementById("password").value & document.getElementById("password").value.length < 4) {
//         password.style.borderColor = "red";
//         errorpassword.innerHTML = "password is too short (min 4 symbols)";
//     }
//     if (document.getElementById("password").value.length >= 4 & !document.getElementById("confirmPassword").value) {
//         confirmPassword.style.borderColor = "red";
//         errorpasswordConfirm.innerHTML = "please enter password  from confirm";
//     }
//     if (document.getElementById("password").value.length >= 4 &
//         document.getElementById("confirmPassword").value != undefined & document.getElementById("confirmPassword").value !== document.getElementById("password").value) {
//         confirmPassword.style.borderColor = "red";
//         errorpasswordConfirm.innerHTML = "password does not match";
//     }
//     if (document.getElementById("password").value.length >= 4 &
//         document.getElementById("confirmPassword").value == document.getElementById("password").value) {
//         confirmPassword.style.borderColor = "green";
//         errorpasswordConfirm.innerHTML = "";
//         password.style.borderColor = "green";
//         errorpassword.innerHTML = "";
//         pas = true;
//     }
//
//     if (eme == true & na == true & pas == true & phn == true) {
//
//         valid();
//         function valid() {
//
//
//         }
//     }
// }