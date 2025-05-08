async function logowanie() {
    let logiin = document.getElementById("loginl").value
    let hasloo = document.getElementById("haslol").value

    let url = `http://localhost:3000/logowanie/${logiin}/${hasloo}`;

    let ok = await fetch(url)
    let data = await ok.json()
    console.log(data);

    if(data.length > 0){
    localStorage.setItem("user", JSON.stringify(data[0]))
    window.location.href = "./dashboard.html"
    }else{
        document.getElementById("oke").innerHTML = "Złe dane logowania"
    }
    
}


async function rejestracja() {
    let logiin = document.getElementById("login").value
    let hasloo = document.getElementById("haslo").value
    let hasloo2 = document.getElementById("haslo2").value

    if(hasloo == hasloo2){
        let url = `http://localhost:3000/rejestracja/${logiin}/${hasloo}`;
        let ok = await fetch(url)
        let data = await ok.json()
        console.log(data);
        if(data.length>0){
            localStorage.setItem("user", JSON.stringify(data[0]))
            window.location.href = "./dashboard.html"
        }
        else {
            document.getElementById("oke").innerHTML = "podany login jest zajety"
        }
    }
    else {
        document.getElementById("oke").innerHTML = "podane hasla nie sa identyczne"
    }

}

function czesc(){
    let xd = JSON.parse(localStorage.getItem("user"))
    let bdy = document.querySelector("body")
    let h1 = document.createElement("h1")
    h1.innerHTML = `Cześć ${xd.login}!`
    bdy.appendChild(h1)
}