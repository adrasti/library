let myLibrary = [];

let count = 0;
let scount = 1;   //shelf count
let cshelf = 0;  


setTimeout(() => {          //waiting for the DOM to load

  let add = document.getElementById("add");   //"add new books" button
  add.addEventListener("click", function() {
    document.getElementById("form").style.display = "flex";
  });

  let cls = document.getElementById("b");   //"close" button
  cls.addEventListener("click", function(){
    document.getElementById("f").reset();
    document.getElementById("form").style.display = "none";
  });

  let subm = document.getElementById("a");   //"add" button
  subm.addEventListener("click", function(){
    if(title.checkValidity() && aname.checkValidity() && number.checkValidity()){
      newBook(title.value, aname.value, number.value, r1.checked);    //adds a book to the list
      addbook(title.value, aname.value, number.value, r1.checked);    //adds a book to the DOM
  }});


  let list = document.getElementById('list');   
  let table = document.getElementById('bookslist');
  list.addEventListener("click", function() {
  document.getElementById('table').style.display = "flex";
  let count1 = 1;

  for(let i of myLibrary) {                                           //"list of books" button
    table.insertAdjacentHTML('beforeend', "<tbody class = 'l'></tbody>");
    let p1 = document.createElement('td');
    p1.innerText = String(count1);
    table.lastElementChild.appendChild(p1);
    for(let y in i) {

      if(typeof(i[y]) == "function"){
        break
      }
      let p = document.createElement('td');
      if(typeof(i[y]) == "boolean"){
        if(i[y] === true){
          p.innerText = "read";
        } else p.innerText = "unread";
      } else p.innerText = i[y];
      table.lastElementChild.appendChild(p);
    }
    count1++;
  }
    document.querySelector('main').style.display = "none";
  })

  document.getElementById('close').addEventListener('click', function() {   //closes the list
    document.querySelector('main').style.display = "flex";
    document.querySelectorAll('.l').forEach(e => e.remove());
    document.getElementById('table').style.display = "none";
  })
}, 5);




function newBook(title, author, pagenum, read) {    //ADDS A BOOK TO AN ARRAY OF OBJECTS
  let a = {
    title: title,
    author: author,
    pagenum: pagenum,
    read: read,
    swit(){
      if(this.read === true){
        this.read = false
      } else this.read = true;
    }
  }
  myLibrary.push(a);
  count++;
}

function adddel(el) {        //adds functionality to the "delete" button
  el.addEventListener("click", function() {
    let y = Number(this.parentNode.parentNode.parentNode.id);
    let i = Number(this.parentNode.parentNode.parentNode.parentNode.parentNode.id.slice(1)) + 1
    for(let i = y+1; i < count+1; i++){       //shifts ids before node's removal
      document.getElementById(`${i}`).id = Number(document.getElementById(`${i}`).id) - 1;
    }
    this.parentNode.parentNode.parentNode.remove();
    myLibrary.splice(y-1, 1)  //also delete book from library
    count = count - 1;

    while(document.getElementById(`s${i}`) !== null) {      //makes sure books in other shelves also shift
      let c = document.getElementById(`s${i}`).firstElementChild.firstElementChild.cloneNode(true);
      document.getElementById(`s${i}`).firstElementChild.firstElementChild.remove();
      document.getElementById(`s${i-1}`).firstElementChild.appendChild(c);

      document.getElementById(`s${i-1}`).firstElementChild.lastElementChild.querySelector('.read').addEventListener("click", function() {  //add event listeners to 
        if(this.innerText === "read"){                                                                                                     //the replicated elements
          this.innerText = "unread";
        } else this.innerText = "read";
        myLibrary[Number(this.parentNode.parentNode.parentNode.id)-1].swit();
      });
      adddel(document.getElementById(`s${i-1}`).firstElementChild.lastElementChild.querySelector('.del'));
      i = i + 1;
    }
    if(document.getElementById(`s${scount-1}`).firstElementChild.firstElementChild == null) {    //deletes an empty shelf
      document.getElementById(`s${scount-1}`).remove(); 
      scount = scount - 1;
    }
  });
}

function addbook(title, author, pagenum, r) {         //adds a book to the DOM
  if(count !== 0){ 
    cshelf = Math.floor((count - 1) / 12);     //last shelf that has books in it
  }
  if((count - scount * 12 ) > 0) {       //adds a new shelf if there is no more space left
    let main = document.querySelector("main");
    main.insertAdjacentHTML('beforeend', `<div class = 'shelf' id = 's${cshelf}'><div class = "grid"></div></div>`);
    scount++;
  }
  let shelf = document.getElementById(`s${cshelf}`);
  let o = document.getElementById('o');    
  let cpy = o.cloneNode(true);   //copies and pastes the tepmlate book
  cpy.id = count;

  let read = cpy.querySelector('.read')
  let del = cpy.querySelector('.del');  ///////////////

  adddel(del);
  

  read.addEventListener("click", function() {    //adds "read"/"unread" switch functionality
    if(this.innerText === "read"){
      this.innerText = "unread";
    } else this.innerText = "read";
    myLibrary[Number(this.parentNode.parentNode.parentNode.id)-1].swit();
  });

  let tit = cpy.querySelector('.tit');    //writes stuff on top of the book
  let auth = cpy.querySelector('.author');
  let pages = cpy.querySelector('.pages');
  let rea = cpy.querySelector('.read')
  if(r) {
    rea.innerText = "read"
  } else rea.innerText = "unread";
  tit.innerText = '"' + title + '"';
  auth.innerText = "By: " + author;
  pages.innerText = pagenum + " pages";


  shelf.firstElementChild.appendChild(cpy);  
}

function sortTable(n) {
  let shouldSwitch;
  let switchcount = 0;
  let switching = true;

  let dir = "asc"; 

  while (switching) {

    switching = false;
    rows = document.getElementsByClassName('l');

    for (i = 0; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      let x = rows[i].getElementsByTagName("td")[n];
      let y = rows[i + 1].getElementsByTagName("td")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;

      switchcount ++;      
    } else {

      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}