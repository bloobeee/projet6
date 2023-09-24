
let alldata = {};

function createElement(element) {
  let gallery = document.querySelector('.gallery')
  let figure = document.createElement('figure');/*Déclare la variable figure qui crée un élément figure */
  let img = document.createElement('img');/*Déclare la variable img qui crée un élément img*/
  let figcaption = document.createElement('figcaption');/*Déclare la variable figcaption qui crée un élément figcaption*/
  img.src = element.imageUrl;/*On dit que img.src = a l'url fournie par l'api*/
  img.alt = element.title;/*on dit que img.alt = le titre fourni par l'api*/
  figcaption.textContent = element.title;/*on dit que figcaption.textContent = le titre fourni par l'api*/
  figure.dataset.id = element.id;


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
  let boutonModifier = document.querySelector('.boutonModifier');
  let modal = document.querySelector('.modal');
  let modalBody = document.querySelector('.modalContent');
  let imgModal = document.querySelector('.imgModal');
  let croix = document.querySelector('.croix');
  let buttonModal = document.querySelector('.buttonModal');
  


  boutonModifier.addEventListener('click', () => {
    modal.style.display = "flex";
    alldata.forEach(element => {
      let figure = document.createElement('figure');
      let img = document.createElement('img');
      img.src = element.imageUrl;
      let deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash-can');
      figure.classList.add('modalFig');
      img.classList.add('modalImg');
      figure.dataset.modalId = element.id;
      modalBody.appendChild(figure);
      imgModal.appendChild(figure);
      figure.appendChild(img);
      figure.appendChild(deleteIcon);

      deleteIcon.addEventListener('click', trashWork);

    });
    croix.addEventListener('click', () => {
      modal.style.display = "none";
    })
  })

  buttonModal.addEventListener('click', () => {
    modalBody.innerHTML = ""; 
    
    let croixIcon = document.createElement('i');
    let retourIcon = document.createElement('i');
    let divIcon = document.createElement('div');


    croixIcon.classList.add('fa-solid', 'fa-x');
    retourIcon.classList.add('fa-solid', 'fa-arrow-left');
    divIcon.classList.add('divIcon');

    modalBody.appendChild(divIcon);
    modalBody.appendChild(croixIcon);
    modalBody.appendChild(retourIcon);

  });
}

function trashWork(event) {
  let id = event.target.parentElement.dataset.modalId
  let gallery = document.querySelector('.gallery')

  console.log(sessionStorage.getItem("token"));
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
    .then(response => {
      if (response.ok) {/*Permet de vérifier si al réponse et pas null*/
        event.target.parentElement.remove();
        document.querySelector(`[data-id="${id}"]`).remove();
      } else {
        throw new Error(response.statusText);/*si la reponse est incorrect alors il renvoie l'erreur*/
      }
    })
  console.log(id);
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
  let boutonModifier = document.querySelector('.boutonModifier');
  /*Vérifier si un token est présent dans le sessionStorage*/
  if (sessionStorage.getItem("token")) {
    loginButton.textContent = "logout";
    boutonModifier.style.display = "flex";
  } else {
    loginButton.textContent = "login";
    boutonModifier.style.display = "none";
  }
  openmodal();

  loginButton.addEventListener("click", function () {
    /*Vérifier si un token est présent dans le sessionStorage*/
    if (sessionStorage.getItem("token")) {
      /*Effacer le token du sessionStorage*/
      sessionStorage.removeItem("token");
      loginButton.textContent = "login";
      modifier.style.display = "none";
      logomodifier.style.display = "none";


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