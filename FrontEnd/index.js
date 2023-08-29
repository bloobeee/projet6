
let alldata = {};

function createElement(element) {
  let gallery = document.querySelector('.gallery')
  let figure = document.createElement('figure');/*Déclare la variable figure qui crée un élément figure */
  let img = document.createElement('img');/*Déclare la variable img qui crée un élément img*/
  let figcaption = document.createElement('figcaption');/*Déclare la variable figcaption qui crée un élément figcaption*/
  img.src = element.imageUrl;/*On dit que img.src = a l'url fournie par l'api*/
  img.alt = element.title;/*on dit que img.alt = le titre fourni par l'api*/
  figcaption.textContent = element.title;/*on dit que figcaption.textContent = le titre fourni par l'api*/
  figure.appendChild(img);/*Permet d'ajouter le contenue img dans la balise figure*/
  figure.appendChild(figcaption);/*Permet d'ajouter le contenue figcaption dans la balise figure*/
  gallery.appendChild(figure);/*Permet d'ajouter le contenue figure dans la balise gallery*/

}

function createfiltres(data) {
  let gallery = document.querySelector('.gallery');
  let firstButton = gallery.firstElementChild;
  let allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add("filtre");
  gallery.insertBefore(allButton, firstButton);

  allButton.addEventListener('click', () => {
    deleteworks();
    addAllWorks();
  });


  data.forEach(element => {
    let name = document.createElement('button');
    name.textContent = element.name;
    name.classList.add("filtre");
    gallery.appendChild(name);
    name.addEventListener('click', () => {
      deleteworks();
      addworks(element.name);
    });
  });

}

function openmodal() {
  let modifier = document.querySelector('.modifier');
  let modal = document.querySelector('.modal');
  let modalBody = document.querySelector('.modalContent');
  modifier.addEventListener('click', () => {
    modal.style.display = "flex";
    alldata.forEach(element => {
      let figure = document.createElement('figure');
      let img = document.createElement('img');
      let figcaption = document.createElement('figcaption');
      img.src = element.imageUrl;
      let deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash');
      figure.classList.add('modalFig');
      img.classList.add('modalImg');
      figcaption.classList.add('modalFigCaption');
      modalBody.appendChild(figure);
      figure.appendChild(img);
      figure.appendChild(figcaption);
      figure.appendChild(deleteIcon);
      figcaption.appendChild(deleteIcon);
      
    });
  });
}






fetch('http://localhost:5678/api/categories')
  .then(response => {
    return response.json();
  })
  .then(data => {

    let gallery = document.querySelector('.gallery');
    let firstButton = gallery.firstElementChild;
    if (sessionStorage.getItem("token") == null) {
      createfiltres(data);
    }
  });


function addAllWorks() {
  alldata.forEach(element => {
    createElement(element);
  });
}


function deleteworks() {
  let gallery = document.querySelector('.gallery')
  let figure = gallery.querySelectorAll('figure')
  figure.forEach(element => {
    gallery.removeChild(element);
  })
}

function addworks(name) {
  alldata.forEach(element => { /*Parcours chaque élément de data (Les donnaient de l'api.)*/
    if (element.category.name == name) {
      createElement(element);
    }
  });

}


fetch('http://localhost:5678/api/works')
  .then(response => {/*renvoie toute la réponse de l'API*/
    return response.json() /*renvoie le body de la réponse de l'API en format JSON et le renvoie au then*/
  })
  .then(data => { /*récupère les données du body de la réponse en format JSON*/

    alldata = data;
    data.forEach(element => { /*Parcours chaque élément de data (Les donnaient de l'api.)*/
      createElement(element);
    });
  })


window.addEventListener("load", function () {
  let loginButton = document.getElementById("login");
  /*Vérifier si un token est présent dans le sessionStorage*/
  if (sessionStorage.getItem("token")) {
    loginButton.textContent = "logout";
  }
  openmodal();

  loginButton.addEventListener("click", function () {
    /*Vérifier si un token est présent dans le sessionStorage*/
    if (sessionStorage.getItem("token")) {
      /*Effacer le token du sessionStorage*/
      sessionStorage.removeItem("token");
      loginButton.textContent = "login";

      if (!isPageRefreshed) {
        isPageRefreshed = true;
        location.reload();
      }
    } else {
      window.location.href = "login.html";
    }
  });
});
let isPageRefreshed = false