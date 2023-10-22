
let alldata = {};

function createGalleryElement(element) {
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


function addWorksModal() {

  let modalBody = document.querySelector('.modalContentGallery');
  let imgModal = document.querySelector('.imgModal');

  getWorks().then(data => {
    data.forEach(element => {
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
    })
  })
}


function addClicsModal() {
  let boutonModifier = document.querySelector('.boutonModifier');
  let modal = document.querySelector('.modal');
  let modalContentAddWork = document.querySelector('.modalContentAddWork');
  let modalContentGallery = document.querySelector('.modalContentGallery');
  let imgModal = document.querySelector('.imgModal');
  let croix = document.querySelector('.croix');
  let buttonModal = document.querySelector('.buttonModal');
  let flecheModifier = document.querySelector('.flecheModifier');



  boutonModifier.addEventListener('click', () => {
    modal.style.display = "flex";
    modalContentAddWork.style.display = "none";

    croix.addEventListener('click', () => {
      modal.style.display = "none";
    })
  })

  buttonModal.addEventListener('click', () => {
    modalContentGallery.style.display = "none";
    modalContentAddWork.style.display = "flex";
  })

  flecheModifier.addEventListener('click', () => {
    modalContentGallery.style.display = "flex";
    modalContentAddWork.style.display = "none";

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
  getWorks().then(data => {
    data.forEach(element => {
      createGalleryElement(element);
    });
  })
}


function deleteworks() {
  let gallery = document.querySelector('.gallery')
  let figure = gallery.querySelectorAll('figure')
  figure.forEach(element => {
    gallery.removeChild(element);
  })
}

function addworks(name) {
  getWorks().then(data => {
    data.forEach(element => {
      if (element.category.name == name) {
        createGalleryElement(element);
      }
    })
  })
}

function getWorks() {

  return fetch('http://localhost:5678/api/works')
    .then(response => {/*renvoie toute la réponse de l'API*/
      return response.json() /*renvoie le body de la réponse de l'API en format JSON et le renvoie au then*/
    })

}


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
  addAllWorks();
  addWorksModal();
  addClicsModal();


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

  let boutonAjoutPhoto = document.querySelector(".boutonAjoutPhoto");
  let imagePreview = document.querySelector(".imagePreview");

  boutonAjoutPhoto.addEventListener("change", function () {
    let file = document.querySelector(".boutonAjoutPhoto").files[0];
    let image=URL.createObjectURL(file);
    imagePreview.src = image;
  })



  fetch('http://localhost:5678/api/categories')
  .then(response => {
    return response.json();
  })
  .then(data => {
    let category = document.querySelector(".category");
    data.forEach(element => {
      let option = document.createElement("option");
      option.value = element.id;
      option.textContent = element.name;
      category.appendChild(option);
    })

  });

  let buttonPhoto = document.querySelector(".buttonPhoto");

  buttonPhoto.addEventListener("click", function () {
    const boutonAjoutPhoto = document.getElementById("boutonAjoutPhoto");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    console.log(boutonAjoutPhoto.files[0]);
    console.log(title.value);
    console.log(category.value);
    const formData = new FormData();
    formData.append("image", boutonAjoutPhoto.files[0]);
    formData.append("title", title.value);
    formData.append("category", category.value);
    
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      console.log(response);
    })
    })
  })


  



let isPageRefreshed = false