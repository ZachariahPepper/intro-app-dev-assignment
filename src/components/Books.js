import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Table,
  Button,
  Modal,
  Row,
  Col,
  Form,
  Pagination,
} from 'react-bootstrap';

//URL to the api on heroku where the data is fetched and posted to
const URL = 'https://damp-peak-79447.herokuapp.com/api/books'

const Books = () => {
  //States for various conditions including setting data, pagination and displaying modals
    const [books, setBooks] = useState([])
    const [authors, setAuthors] = useState([])
    const [publishers, setPublishers] = useState([])
    const [title, setTitle] = useState('');
    const [release_date, setReleaseDate] = useState('');
    const [pages, setPages] = useState('');
    const [currBook, setCurrBook] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [showAddModal, setAddShow] = useState(false);
    const [showEditModal, setEditShow] = useState(false);
    const [showDelModal, setDelShow] = useState(false);
    const [showDetailsModal, setDetailsShow] = useState(false);
    
  //States to set the opening and closing of modals
    const handleAddClose = () => setAddShow(false);
    const handleAddShow = () => setAddShow(true);

    const handleEditClose = () => setEditShow(false);

    const handleDelClose = () => setDelShow(false);

    const handleDetailsClose = () => setDetailsShow(false);

  //Pagination, sets the amount of books displayed per page and the changing of pages and adding data to new pages  
    const indexOfLastbook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastbook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastbook);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = []

    const int = Math.ceil(books.length / booksPerPage) 
      for (let i = 1; i<= int; i++) {
          pageNumbers.push(i) 
      }

  //Calls the fetch methods for all three tables
    useEffect(() => {
        getData()
        getAuthors()
        getPublishers()
    }, [])

  //Specifically for fetching the books from the API and sets the books state to be the data retrieved
    const getData = async () => {
        const response = await axios.get(URL)
        setBooks(response.data)
    }    

  //Fetches authors from the API so their data can be displayed in a modal and sets the authors state to be the data retrieved
    const getAuthors = async () => {
      const response = await axios.get('https://damp-peak-79447.herokuapp.com/api/authors')
      setAuthors(response.data)
    }

  //Fetches publishers from the API so their data can be displayed in a modal and sets the publishers state to be the data retrieved  
    const getPublishers = async () => {
      const response = await axios.get('https://damp-peak-79447.herokuapp.com/api/publishers')
      setPublishers(response.data)
    }
  
  //Uses the author and publisher data and creates a dropdown to be used in a modal, 
  //the dropdown fetches the author and publisher id and displays all data via their name
    const authorOptions = authors.map((author) => {
      return (
        <option key={author.id} value={author.id}>
          {author.name}
        </option>
      )
    })

    const publisherOptions = publishers.map((publisher) => {
      return (
        <option key={publisher.id} value={publisher.id}>
          {publisher.name}
        </option>
      )
    })

  //Stores the input of the fields in the add modal as an event and pushes it to the API on heroku to be stored  
    const handleAddSubmit = async (e) => {
      e.preventDefault();
      let data = {   
        title: e.target.title.value,
        release_date: e.target.release_date.value,
        pages: e.target.pages.value,
        author_id: e.target.author_id.value,
        publisher_id: e.target.publisher_id.value,
      };

      axios({
        method: 'post',
        url: URL,
        data: data
      })

  //Only if all fields are input correctly will the modal close on submit, the page will then fetch the data again
  //acting as a refresh to display new data
      .then((response) => {
        handleAddClose();
        getData();
        console.log(response);
      }, (error) => {
        console.log(error);
      });
  };

  //Selects the book via Id, and deletes the book when confirmed
    const removeData = (id) => {
      axios.delete(`${URL}/${id}`)
        .then(res => {
          const del = books.filter(book => id !== book.id)
          setBooks(del);
      })
    }

  //Acts like the add function except a variable called currBook allows a specific book to be retrieved,
  //and have its values edited then posted to the API
    const editData = async (id) => {
      let currBook = {
        title: title,
        release_date: release_date,
        pages: pages
      };

      axios.put(`${URL}/${id}`, currBook)

  //Only if all fields are input correctly will the modal close on submit, the page will then fetch the data again
  //acting as a refresh to display new data
      .then((response) => {
        handleEditClose();
        getData();
        console.log(response);
      }, (error) => {
        console.log(error);
      });
    };

  //Return is what is displayed on the page and how the user interacts with the app  
    return (
      <>
      <div className='book-container'>
        <div className="header"><h1>Books</h1>

  {/* Opens the modal for creating books */}
      <Button className="addButton" variant="primary" onClick={handleAddShow}>
        Add Book
      </Button></div>

  {/* Table where all the data, buttons and pagination is displayed */}
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Release Date</th>
              <th>Pages</th>
              <th>Options</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

  {/* For each book on a page (10 per page) map the book variable via their id 
  to them and set each of their fields to be displayed */}
            {currentBooks.map((book) => {
              return (
            <tr key={book.id} className='list'>

  {/* Title is a link that when clicked displays a modal with all its details, 
  set it as a current book so that specific book can be viewed */}
              <td className='book-title'><a href="#"onClick={() => {setDetailsShow(true); setCurrBook(book); }}>{book.title}</a></td>
              <td className='book-release_date'>{book.release_date}</td>
              <td className='book-pages'>{book.pages}</td>

  {/* When the button is clicked, display the edit modal and set the current book */}
              <td> 
                <Button onClick={() => {setEditShow(true); setCurrBook(book); }}>Edit</Button>
              </td>

  {/* When the button is clicked, display the delete modal and set the current book */}
              <td>  
                <Button variant="danger" className="deleteButton" onClick={() => {setDelShow(true); setCurrBook(book); }}>Delete</Button>
              </td>
            </tr>
              );
            })}  

  {/* Footer contains the pagination, has a next and prev buttons on both ends, and depending on the number of pages
  which depends on the number of books create that many links to those pages e.g. if there are 7 pages then there will
  be 7 links corresponding to each of those pages */}
             <footer className='footer'>
              <nav>
                <Pagination>
                  <Pagination.Prev>
                    {pageNumbers.includes(currentPage -1) && <a onClick={() => {
                      setCurrentPage(currentPage - 1);
                      paginate(currentPage - 1);
                    }} className="page-link">
                      Prev
                    </a>}
                  </Pagination.Prev >

                  {pageNumbers.map(number=> (
                  <Pagination.Item key={number}>
                    <a onClick={()=> {
                      setCurrentPage(number)
                      paginate(number)
                    }} href="!#" className="page-link">
                      {number} 
                    </a>
                  </Pagination.Item >
                    ))}

                  <Pagination.Next>
                    {pageNumbers.includes(currentPage + 1) && <a onClick={() => {
                      setCurrentPage(currentPage + 1);
                      paginate(currentPage + 1);
                    }} className="page-link">
                      Next
                    </a>}
                  </Pagination.Next>
                </Pagination>
              </nav>
            </footer>
          </tbody>
        </Table>

  {/* The add modal which is displayed when the add button is clicked,
  contains input fields and the values in these fields correspond to the fields of the API data and 
  are what is posted to the API, some fields have required attributes on them, 
  if these are not filled then the data will not be posted */}
        <Modal show={showAddModal} onHide={handleAddClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">Add Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <Row>
                <Col>
                  <Form onSubmit={handleAddSubmit}>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        id="title"
                        required
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Release Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="release_date"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Pages</Form.Label>
                      <Form.Control
                        type="text"
                        name="pages"
                        id="pages"
                        required
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        as="select"
                        name="author_id"
                        id="author"
                        required
                        custom
                      >
  {/* Calls the dropdown that is created above and renders it here, displays each author to be selected */}
                        {authorOptions}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Publisher</Form.Label>
                      <Form.Control
                        as="select"
                        name="publisher_id"
                        id="publisher"
                        required
                        custom
                      >
  {/* Calls the dropdown that is created above and renders it here, displays each publisher to be selected */}
                        {publisherOptions}
                      </Form.Control>
                    </Form.Group>
                    <Modal.Footer>

  {/* When clicked the data will be submitted to the add book function only when all required fields have been filled */}
                    <Button className="SaveBook" variant="primary" type="submit">
                      Save Book
                    </Button>

  {/* Close the modal */}
                      <Button variant="secondary" onClick={handleAddClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Form>
                  </Col>
                </Row>
            </div>
          </Modal.Body>
        </Modal>

  {/* The edit modal which is displayed when the edit button is clicked,
    contains input fields and the values in these fields correspond to the fields of the API data and 
    are what is posted to the API, some fields have required attributes on them, 
    if these are not filled then the data will not be posted, current book is set so the data that the book already has
    is displayed in each field allowing for easier editing */}
        <Modal show={showEditModal} onHide={handleEditClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Row>
              <Col>
                <Form>
                <Form.Group>
                    <Form.Label>Book ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="id"
                      id="id"
                      required
                      disabled
                      defaultValue = {currBook.id}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      id="title"
                      required
                      defaultValue = {currBook.title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="release_date"
                      id="release_date"
                      defaultValue = {currBook.release_date}
                      onChange={e => setReleaseDate(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Pages</Form.Label>
                    <Form.Control
                      type="text"
                      name="pages"
                      id="pages"
                      required
                      defaultValue = {currBook.pages}
                      onChange={e => setPages(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      as="select"
                      name="author_id"
                      id="author"
                      required
                      defaultValue = {currBook.author_id}
                      custom
                    >
  {/* Calls the dropdown that is created above and renders it here, displays each publisher to be selected, 
  except the value that was already stored is displayed*/}
                      {authorOptions}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Publisher</Form.Label>
                    <Form.Control
                      as="select"
                      name="publisher_id"
                      id="publisher"
                      required
                      defaultValue = {currBook.publisher_id}
                      custom
                    >
  {/* Calls the dropdown that is created above and renders it here, displays each publisher to be selected, 
  except the value that was already stored is displayed*/}
                      {publisherOptions}
                    </Form.Control>
                  </Form.Group>
                  <Modal.Footer>

  {/* When clicked the data will be submitted to the edit book function only when all required fields have been filled but only for that specific book
  based on its id */}                    
                  <Button variant="primary" type="button" onClick={() => {editData(currBook.id);}}>
                    Update Book
                  </Button>

  {/* Close the modal */}
                    <Button variant="secondary" onClick={handleEditClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Form>
                </Col>
              </Row>
          </div>
         </Modal.Body>
        </Modal>

  {/* The delete modal that simply asks the user if they want to delete the book they clicked on */}
        <Modal show={showDelModal} onHide={handleDelClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Are you sure you want to delete this book?</Modal.Title>
              </Modal.Header>
              
              <Modal.Footer>
              <Button variant="primary" type="submit" onClick={() => {removeData(currBook.id);handleDelClose();}}>
                Yes
              </Button>
                <Button variant="secondary" onClick={handleDelClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
      </div>

  {/* The details modal which essentially acts like the edit modal by displaying their data, except it cannot be edited,
  all fields are set to read only */}
      <Modal show={showDetailsModal} onHide={handleDetailsClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">{currBook.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Row>
              <Col>
                <Form>
                <Form.Group>
                    <Form.Label>Book ID:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currBook.id}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Release Date:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currBook.release_date}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Pages:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currBook.pages}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      as="select"
                      plaintext
                      readOnly
                      required
                      disabled
                      defaultValue = {currBook.author_id}
                    >
                      {authorOptions}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Publisher</Form.Label>
                    <Form.Control
                      as="select"
                      plaintext
                      readOnly
                      required
                      disabled
                      defaultValue = {currBook.publisher_id}
                    >
                      {publisherOptions}
                    </Form.Control>
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleDetailsClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Form>
                </Col>
              </Row>
          </div>
         </Modal.Body>
        </Modal>
        </>
    )
}
export default Books;