window.addEventListener("load", function () {/*attand que  la page charge*/
    document.getElementById("submit").addEventListener("click", function () {/*permet de clicker sur submit*/
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let erreurMessage = document.querySelector(".erreurMessage");
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST', /*Qu'elle type de requêtes (post = envoyer)*/
            headers: { /*Les paramètres de la requête*/
                'accept': 'application/json',/* Le format qu'on accept en retour de la requête*/
                'Content-Type': 'application/json'/* Le type de la requête qu'on envoie*/
            },

            body: JSON.stringify({/*Le contenu de notre requête qu'ont envoie, mais en format json*/
                'email': email.value,/*permet d'envoie ce qui et noter dans email*/
                'password': password.value,
            })
        })
            .then(response => { /*Permet de récupérer la réponse de l'api*/
                if (response.ok) {/*Permet de vérifier si al réponse et pas null*/
                    return response.json(); /*Si la réponse et correct alors il est renvoyé en format. Json*/
                } else {
                    throw new Error(response.statusText);/*si la reponse est incorrect alors il renvoie l'erreur*/
                }
            })
            .then(data => {
                sessionStorage.setItem("token", data.token);
                window.location.href = "index.html";
            }) 
            .catch(error => {
                email.style.border = '1px solid red';
                password.style.border = '1px solid red';
                erreurMessage.style.display = 'block';
                console.error(error);
            }); 
    });
})


