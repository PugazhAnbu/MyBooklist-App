//Book Class: Represents a Book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class : Handle UI Tasks
class UI {
    static displayBooks() {
     
    const books = Store.getBooks();

    books.forEach((book) =>{
        UI.addBookToList(book)
    });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete"></a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // vanish in 3s
        setTimeout(() => document.querySelector('.alert').remove(), 2000)
    }

    static clearFeilds() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}

// Store Class: Handles Storage

// local storage basically stores in key value pairs 
// local storage has store in string format if you use those value in js then u want to convert object use the json.parse method


class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = []
        }else{
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        // now the books variable is array of objects so u cannot store in local storage so u have to make sting u use json.stringify()

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) =>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }
}



//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);



//Event: Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault()
    
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Pease fill in all feilds', 'danger');
    }else{
        // Instatiate Book

        const book = new Book(title, author, isbn);


        //Add book to UI
        UI.addBookToList(book);

        //Add book to store in local storage
        Store.addBook(book);

        UI.showAlert('Book Added', 'success')

        // when the form was submit and i want the feild was clear 

        UI.clearFeilds()
    }

    

})

//Event: Remove a Book

document.querySelector('#book-list').addEventListener('click', (e) => {

    // Remove book from UI
    UI.deleteBook(e.target)

    // Remove book from store
    console.log(e.target.parentElement.previousElementSibling.textContent)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show book deleted success message
    UI.showAlert('Book Deleted', 'success')
})