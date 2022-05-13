const lib = (function() {
  let myLibrary = [];
  let count = 0;
  let scount = 1; 

  const add = document.getElementById("add");   //"add new books" button
  add.addEventListener("click", function() {
    document.getElementById("form").style.display = "flex";
  });

  const cls = document.getElementById("b");   //"close" button
  cls.addEventListener("click", function(){
    document.getElementById("f").reset();
    document.getElementById("form").style.display = "none";
  });

  const subm = document.getElementById("a");   //"add" button
  subm.addEventListener("click", function(){
    if(title.checkValidity() && aname.checkValidity() && number.checkValidity()){
      let book = new Book(title.value, aname.value, number.value, r1.checked);
      book.cacheTemplate();
      book.render();
      book.addBook();
      book.setEventListeners();
      myLibrary.push(book);
  }});


  const list = document.getElementById('list');   //"list of books" button
  const table = document.getElementById('bookslist');
  list.addEventListener("click", function() {
    document.getElementById('table').style.display = "flex";
    for(let i of myLibrary) {                                           
      table.insertAdjacentHTML('beforeend', "<tbody class = 'l'></tbody>");
      for(let y in i) {
        if(typeof(i[y]) == "object"){
          break;
        }
        let p = document.createElement('td');
        if(typeof(i[y]) == "boolean"){
          if(i[y] === true){
            p.innerText = "read";
          } else p.innerText = "unread";
        } else p.innerText = i[y];
        table.lastElementChild.appendChild(p);
      }
    }
    document.querySelector('main').style.display = "none";
  });

  document.getElementById('close').addEventListener('click', function() {   //closes the list
    document.querySelector('main').style.display = "flex";
    document.querySelectorAll('.l').forEach(e => e.remove());
    document.getElementById('table').style.display = "none";
  });
  return {count, scount, myLibrary};
})();


let Book = class {
    constructor(title, author, pagenum, read) {
        this.id = lib.count;
        Object.assign(this, {title, author, pagenum, read});
    }

    cacheTemplate() {
      this.cpy =  document.getElementById('o').cloneNode(true);
      this.readStatus = this.cpy.querySelector('.read');
      this.tit = this.cpy.querySelector('.tit');  
      this.auth = this.cpy.querySelector('.author');
      this.pages = this.cpy.querySelector('.pages');
      this.del = this.cpy.querySelector('.del');
    }

    render() {
      this.cpy.removeAttribute('id');  
      if(this.read) {
        this.readStatus.innerText = "read";
      } else this.readStatus.innerText = "unread";
      this.tit.innerText = '"' + this.title + '"';
      this.auth.innerText = "By: " + this.author;
      this.pages.innerText = this.pagenum + " pages";
    }

    addBook() {
      lib.count++;
      checkShelfOverload();
      let shelves = document.getElementsByClassName('shelf');
      for(let i = 0; i < shelves.length; i++) {
        if(index(shelves[i]) == lib.scount){
          shelves[i].firstElementChild.appendChild(this.cpy);
          return;
        }
      }
    }

    setEventListeners() {
        this.del.addEventListener("click", (e) => {  //delete
          adjustShelf(index(e.target.parentElement.parentElement.parentElement.parentElement.parentElement));
          e.target.parentNode.parentNode.parentNode.remove();
          lib.count = lib.count - 1;
          for(let i = lib.myLibrary.length - 1; i >= 0; i = i - 1) {
            if(lib.myLibrary[i].id > this.id) {
              lib.myLibrary[i].id = lib.myLibrary[i].id - 1;
              continue;
            }
            if(lib.myLibrary[i].id === this.id){
              lib.myLibrary.splice(i, 1);
            }
          }
        });

        this.readStatus.addEventListener("click", () => {  //read
          this.switchReadStatus();
        });
    }

    switchReadStatus() {
        if(this.read === true){
            this.read = false
        } else this.read = true;
        this.render();
    }
}






function sortTable(n, number) {
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
        if (number === false) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

            shouldSwitch= true;
            break;
          }
        } else {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {

            shouldSwitch= true;
            break;
          }
        }
      } else if (dir == "desc") {
        if(number === false) {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

            shouldSwitch = true;
            break;
          }
        } else {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {

            shouldSwitch = true;
            break;
          }
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


function checkShelfOverload() {
  if((lib.count - lib.scount * 12 ) > 0) {       //adds a new shelf if there is no more space left
    let main = document.querySelector("main");
    lib.scount++;
    main.insertAdjacentHTML('beforeend', "<div class = 'shelf'><div class = 'grid'></div></div>");
  }
}

function adjustShelf(e) {
  for(let i = e * 12; i < lib.myLibrary.length; i++) {  //shifts the shelves
    if(((lib.myLibrary[i].id % 12) === 0)) {
      lib.myLibrary[i].cpy.remove();
      let shelves = document.getElementsByClassName('shelf');
      for(let k = 0; k < shelves.length; k++) {
        if(index(shelves[k]) - 1 == Math.floor((lib.myLibrary[i].id - 1) / 12)){
          shelves[k].firstElementChild.appendChild(lib.myLibrary[i].cpy);
          break;
        }
      }
    }
  }
  if(document.querySelector('main').lastElementChild.firstElementChild.firstElementChild == null) {    //deletes an empty shelf
    document.querySelector('main').lastElementChild.remove(); 
    lib.scount = lib.scount - 1;
  }
}

function index(el) {
  if (!el) return -1;
  var i = 1;
  while (el = el.previousElementSibling) {
    i++;
  }
  return i;
}

