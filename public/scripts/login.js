function showLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-toggle").classList.add("active");
    document.getElementById("signup-toggle").classList.remove("active");
}

function showSignUp() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("login-toggle").classList.remove("active");
    document.getElementById("signup-toggle").classList.add("active");
}
