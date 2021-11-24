class Book {
    constructor(title,author,isbn){

        this.author =author;
        this.title = title;
        this.isbn = isbn;
    }
}

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books =[];
        }else{
           books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){

        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){

        const books = Store.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));

    }
}

class UI{
    static displayBooks(){
        const StoreBooks = Store.getBooks();


        const books = StoreBooks;

        books.forEach(function(book){
            UI.addBookToList(book)
        });
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row  = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static clearFields(){
        document.querySelector('#title').value="";
        document.querySelector('#author').value="";
        document.querySelector('#isbn').value="";
    }
    static deleteBooks(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message,className){

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.col-md-8');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded',UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit',(e)=>{

    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(title == '' || author == '' || isbn == ''){
      //  alert('Please fills All the fileds');
        UI.showAlert('PLEASE FILL ALL FIELDS','danger')
    }else{
        const book = new Book(title,author,isbn);
       
        UI.addBookToList(book);
        Store.addBook(book);
        UI.showAlert('Book Added Sucessfully','success');
        UI.clearFields();
    }

   
});


document.querySelector("#book-list").addEventListener('click',(e)=>{
  UI.deleteBooks(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
  UI.showAlert('Book Removed Sucessfully','success');
})
