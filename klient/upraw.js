let localxd = JSON.parse(localStorage.getItem("user"))
console.log(localxd);

if(localxd == null){
    window.location.href = "./logowanie.html"
}

