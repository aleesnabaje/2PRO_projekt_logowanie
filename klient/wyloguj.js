let bdy = document.querySelector("body")
let buton = document.createElement("button")
buton.innerHTML = "Wyloguj"

buton.addEventListener("click", ()=>{
    localStorage.removeItem("user")
    window.location.href = "./logowanie.html"
})

bdy.appendChild(buton)