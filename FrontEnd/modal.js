function createElement (element) {
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
        console.log(element);
  }

  fetch('http://localhost:5678/api/works')
  .then(response => {/*renvoie toute la réponse de l'API*/
    return response.json() /*renvoie le body de la réponse de l'API en format JSON et le renvoie au then*/
  })
  .then(data => { /*récupère les données du body de la réponse en format JSON*/
    console.log(data)/*noté dans la console*/
    alldata = data;
    data.forEach(element => { /*Parcours chaque élément de data (Les donnaient de l'api.)*/
    createElement(element);
    });
  })