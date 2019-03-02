window.onload = () => {
    let navbarElement = document.querySelector(".navbar-collapse");
    let navBarToggler = document.querySelector(".navbar-toggler");
    navBarToggler.addEventListener("click", () => {
        if(navbarElement.classList.contains("collapse")) {
            navbarElement.classList.remove("collapse");
        } else {
            navbarElement.classList.add("collapse");
        }
    });
};