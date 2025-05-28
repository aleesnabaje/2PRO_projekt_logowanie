async function logowanie() {
    let logiin = document.getElementById("loginl").value
    let hasloo = document.getElementById("haslol").value

    let url = `http://localhost:3000/logowanie/${logiin}/${hasloo}`;

    let ok = await fetch(url)
    let data = await ok.json()
    console.log(data);

    if(data.length > 0){
        if(data[0].role == "admin"){
            localStorage.setItem("user", JSON.stringify(data[0]))
            window.location.href = "./admin.html"
        }else if(data[0].role == "user"){
            localStorage.setItem("user", JSON.stringify(data[0]))
            window.location.href = "./dashboard.html"
        }
    }
    else{
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
    let bdy = document.getElementById("czesc")
    let h1 = document.createElement("h1")
    h1.innerHTML = `Cześć ${xd.username}!`
    bdy.appendChild(h1)
}

function onDashboardLoad() {
    czesc(); 
    loadPosts();
}


async function loadPosts() {
    const postsContainer = document.getElementById("posts-container");

    postsContainer.innerHTML = '<h2>Wpisy na blogu:</h2><p>Ładowanie postów...</p>';

    try {

        const response = await fetch(`http://localhost:3000/posts`);
        const posts = await response.json();

        if (posts.length === 0) {
            postsContainer.innerHTML = '<h2>Wpisy na blogu:</h2><p>Brak postów do wyświetlenia.</p>';
        }

        let postsHTML = '<h2>Wpisy na blogu:</h2>';
        posts.forEach(post => {
            const postDate = post.created_at; 
            const postTitle = post.title;
            const postAuthor = post.author;
            const postContent = post.content;
            const postEdited = post.edited;
            if (postEdited==1) {
                postsHTML += `
                <div class="post">
                    <h2>${postTitle}</h2>
                    <p class="post-meta">Autor: ${postAuthor} | Opublikowano: ${postDate} | Edytowany</p>
                    <p>${postContent}</p>
                </div>
            `;
            }
            else{
            postsHTML += `
                <div class="post">
                    <h2>${postTitle}</h2>
                    <p class="post-meta">Autor: ${postAuthor} | Opublikowano: ${postDate}</p>
                    <p>${postContent}</p>
                </div>
            `;
            }
        });
        postsContainer.innerHTML = postsHTML;

    } catch (error) {
        console.error("Błąd podczas ładowania postów:", error);
        postsContainer.innerHTML = `<h2>Wpisy na blogu:</h2><p style="color: red;">Nie udało się załadować postów. ${escapeHTML(error.message)}</p>`;
    }
}

async function addPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    if (!title.trim() || !content.trim()) {
        alert('Tytuł i treść posta nie mogą być puste.');
        return;
    }
    else {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;

        try {
            const fecz = await fetch(`http://localhost:3000/posts/add/${title}/${content}/${userId}`)
            const result = await fecz.json();

            window.location.href = "./dashboard.html";

        } catch (error) {
            console.error("Błąd podczas dodawania posta:", error);
            alert(`Błąd: ${error.message}`);
        }
    }



}

async function myPosts(){
    let user = JSON.parse(localStorage.getItem("user"));
    let userId = user.id;
    let postsContainer = document.getElementById("my-posts-container");
    let postsHTML = '<h2>Twoje posty:</h2>';

    try {

        const response = await fetch(`http://localhost:3000/myposts/${userId}`);
        const posts = await response.json();

        if (posts.length === 0) {
            document.getElementById("mesage").innerHTML = '<h2>Brak postów do wyświetlenia</h2>';
        }

        posts.forEach(post => {
            const postId = post.id;
            const postDate = post.created_at; 
            const postTitle = post.title;
            const postAuthor = post.author;
            const postContent = post.content;
            const postEdited = post.edited;

            if (postEdited==1) {
            postsHTML += `
                <div class="post">
                    <h2>${postTitle}</h2>
                    <p class="post-meta">Opublikowano: ${postDate} | Edytowany</p>
                    <p>${postContent}</p>
                    <button class="delete-post" onclick="DeletePost(${postId})">Usuń</button>
                    <button class="edit-post" onclick="EditPost(${postId})">Edytuj</button>
                </div>
            `;
            }
            else{
            postsHTML += `
                <div class="post">
                    <h2>${postTitle}</h2>
                    <p class="post-meta">Opublikowano: ${postDate}</p>
                    <p>${postContent}</p>
                    <button class="delete-post" onclick="deletePost(${postId})">Usuń</button>
                    <button class="edit-post" onclick="editPost(${postId})">Edytuj</button>
                </div>
            `;
            }
        });
        postsContainer.innerHTML = postsHTML;

    } catch (error) {
        console.error("Błąd podczas ładowania postów:", error);
        postsContainer.innerHTML = `<h2 style="color: red;">Nie udało się załadować postów.</h2>`;
        
    }
}

async function deletePost(postId) {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/posts/delete/${postId}`);
        const result = await response.json();
        alert("Post został pomyślnie usunięty!");
        myPosts();
    } catch (error) {
        console.error("Błąd podczas usuwania posta:", error);
        alert(`Błąd: ${error.message}`);
    }
}

async function editPost(postId) {
    const newTitle = prompt("Wprowadź nowy tytuł:");
    const newContent = prompt("Wprowadź nową treść:");

    if (!newTitle || !newContent) {
        alert("Tytuł i treść nie mogą być puste.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/posts/edit/${postId}/${newTitle}/${newContent}`);
        const result = await response.json();
        alert("Post został pomyślnie zaktualizowany!");
        myPosts();
    } catch (error) {
        console.error("Błąd podczas edycji posta:", error);
        alert(`Błąd: ${error.message}`);
    }
}

async function admin() {
    const postsContainer = document.getElementById("admin-posts-container");

    postsContainer.innerHTML = '<h2>Wpisy na blogu:</h2><p>Ładowanie postów...</p>';

    try {

        const response = await fetch(`http://localhost:3000/posts`);
        const posts = await response.json();

        if (posts.length === 0) {
            postsContainer.innerHTML = '<h2>Wpisy na blogu:</h2><p>Brak postów do wyświetlenia.</p>';
        }

        let postsHTML = '';
        posts.forEach(post => {
            const postId = post.id;
            const postDate = post.created_at; 
            const postTitle = post.title;
            const postAuthor = post.author;
            const postContent = post.content;
            const postEdited = post.edited;

            if (postEdited==1) {
            postsHTML += `
                <div class="post">
                    <h2>${postTitle}</h2>
                    <p class="post-meta">Autor: ${postAuthor} | Opublikowano: ${postDate} | Edytowany</p>
                    <p>${postContent}</p>
                    <button class="delete-post" onclick="adminDeletePost(${postId})">Usuń</button>
                    <button class="edit-post" onclick="adminEditPost(${postId})">Edytuj</button>
                </div>
            `;
            }
            else{
            postsHTML += `
                <div class="post">
                    <h2>${postTitle}</h2>
                    <p class="post-meta">Autor: ${postAuthor} | Opublikowano: ${postDate}</p>
                    <p>${postContent}</p>
                    <button class="delete-post" onclick="adminDeletePost(${postId})">Usuń</button>
                    <button class="edit-post" onclick="adminEditPost(${postId})">Edytuj</button>
                </div>
            `;
            }
        });
        postsContainer.innerHTML = postsHTML;

    } catch (error) {
        console.error("Błąd podczas ładowania postów:", error);
        postsContainer.innerHTML = `<h2>Wpisy na blogu:</h2><p style="color: red;">Nie udało się załadować postów. ${escapeHTML(error.message)}</p>`;
    }
}

async function adminDeletePost(postId) {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/posts/delete/${postId}`);
        const result = await response.json();
        alert("Post został pomyślnie usunięty!");
        admin();
    } catch (error) {
        console.error("Błąd podczas usuwania posta:", error);
        alert(`Błąd: ${error.message}`);
    }
}

async function adminEditPost(postId) {
    const newTitle = prompt("Wprowadź nowy tytuł:");
    const newContent = prompt("Wprowadź nową treść:");

    if (!newTitle || !newContent) {
        alert("Tytuł i treść nie mogą być puste.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/posts/edit/${postId}/${newTitle}/${newContent}`);
        const result = await response.json();
        alert("Post został pomyślnie zaktualizowany!");
        admin();
    } catch (error) {
        console.error("Błąd podczas edycji posta:", error);
        alert(`Błąd: ${error.message}`);
    }
}