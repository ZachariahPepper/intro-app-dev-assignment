import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Table,
  Button,
  Modal,
  Row,
  Col,
  Form,
  Pagination
} from 'react-bootstrap';

//URL to the api on heroku where the data is fetched and posted to
const URL = 'https://damp-peak-79447.herokuapp.com/api/authors'

const Authors = () => {
  //States for various conditions including setting data, pagination and displaying modals
    const [authors, setAuthors] = useState([])
    const [name, setName] = useState('');
    const [dob, setDOB] = useState('');
    const [genre, setGenre] = useState('');
    const [country, setCountry] = useState('');
    const [currAuthor, setCurrAuthor] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [authorsPerPage] = useState(10);
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

  //Pagination, sets the amount of authors displayed per page and the changing of pages and adding data to new pages  
    const indexOfLastauthor = currentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastauthor - authorsPerPage;
    const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastauthor);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = []

    const int = Math.ceil(authors.length / authorsPerPage) 
      for (let i = 1; i<= int; i++) {
          pageNumbers.push(i) 
      }
  
  //Calls the fetch methods for the author table
    useEffect(() => {
        getData()
    }, [])

  //Specifically for fetching the authors from the API and sets the authors state to be the data retrieved
    const getData = async () => {
        const response = await axios.get(URL)
        setAuthors(response.data)
    }    

  //Stores the input of the fields in the add modal as an event and pushes it to the API on heroku to be stored  
    const handleAddSubmit = async (e) => {
    e.preventDefault();
      let data = {   
        name: e.target.name.value,
        dob: e.target.dob.value,
        genre: e.target.genre.value,
        country: e.target.country.value,
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

  //Selects the author via Id, and deletes the author when confirmed
    const removeData = (id) => {
      axios.delete(`${URL}/${id}`).then(res => {
          const del = authors.filter(author => id !== author.id)
          setAuthors(del)
      })
    }

  //Acts like the add function except a variable called currAuthor allows a specific author to be retrieved,
  //and have its values edited then posted to the API
    const editData = async (id) => {
      const currAuthor = {
        name: name,
        dob: dob,
        genre: genre,
        country: country
      }
      axios.put(`${URL}/${id}`, currAuthor)

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
      <div className='author-container'>
      <div className="header"><h1>Authors</h1>

  {/* Opens the modal for creating authors */}
      <Button className="addButton" variant="primary" onClick={handleAddShow}>
        Add Author
      </Button></div>

  {/* Table where all the data, buttons and pagination is displayed */}
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>D.O.B</th>
              <th>Genre</th>
              <th>Country</th>
              <th>Options</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

  {/* For each author on a page (10 per page) map the author variable via their id 
  to them and set each of their fields to be displayed */}
            {currentAuthors.map((author) => {
              return (
            <tr key={author.id} className='list'>

  {/* Name is a link that when clicked displays a modal with all its details, 
  set it as a current author so that specific author can be viewed */}                
              <td className='author-name'><a href="#" onClick={() => {setDetailsShow(true); setCurrAuthor(author); }}>{author.name}</a></td>
              <td className='author-dob'>{author.dob}</td>
              <td className='author-genre'>{author.genre}</td>
              <td className='author-country'>{author.country}</td>

  {/* When the button is clicked, display the edit modal and set the current author */}              
              <td> 
                <Button onClick={() => {setEditShow(true); setCurrAuthor(author); }}>Edit</Button>
              </td>

  {/* When the button is clicked, display the delete modal and set the current author */}              
              <td>  
                <Button variant="danger" className="mr-2" onClick={() => {setDelShow(true); setCurrAuthor(author); }}>Delete</Button>
              </td>
            </tr>
              );
            })}   

  {/* Footer contains the pagination, has a next and prev buttons on both ends, and depending on the number of pages
  which depends on the number of authors create that many links to those pages e.g. if there are 7 pages then there will
  be 7 links corresponding to each of those pages */}            
            <footer className='footer'>
              <nav>
                <Pagination>
                  <Pagination.Prev  className="page-item">
                    {pageNumbers.includes(currentPage -1) && <a onClick={() => {
                      setCurrentPage(currentPage - 1);
                      paginate(currentPage - 1);
                    }} className="page-link">
                      Prev
                    </a>}
                  </Pagination.Prev >

                  {pageNumbers.map(number=> (
                  <Pagination.Item key={number} className="page-item">
                    <a onClick={()=> {
                      setCurrentPage(number)
                      paginate(number)
                    }} href="!#" className="page-link">
                      {number} 
                    </a>
                  </Pagination.Item >
                    ))}

                  <Pagination.Next className="page-item">
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
            <Modal.Title id="contained-modal-title-vcenter">Add Author</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <Row>
                <Col>
                  <Form onSubmit={handleAddSubmit}>
                    <Form.Group controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        id="name"
                        required
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>D.O.B</Form.Label>
                      <Form.Control
                        type="text"
                        name="dob"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Genre</Form.Label>
                      <Form.Control
                        type="text"
                        name="genre"
                        id="genre"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        id="country"
                        required
                      />
                    </Form.Group>
                    <Modal.Footer>

  {/* When clicked the data will be submitted to the add author function only when all required fields have been filled */}                      
                    <Button variant="primary" type="submit">
                      Save Author
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
    if these are not filled then the data will not be posted, current author is set so the data that the author already has
    is displayed in each field allowing for easier editing */}
        <Modal show={showEditModal} onHide={handleEditClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Edit Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Row>
              <Col>
                <Form>
                <Form.Group>
                    <Form.Label>Author ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="id"
                      id="id"
                      required
                      disabled
                      defaultValue = {currAuthor.id}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      id="name"
                      required
                      defaultValue = {currAuthor.name}
                      onChange={e => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>D.O.B</Form.Label>
                    <Form.Control
                      type="text"
                      name="dob"
                      id="dob"
                      defaultValue = {currAuthor.dob}
                      onChange={e => setDOB(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      type="text"
                      name="genre"
                      id="genre"
                      defaultValue = {currAuthor.genre}
                      onChange={e => setGenre(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      id="country"
                      required
                      defaultValue = {currAuthor.country}
                      onChange={e => setCountry(e.target.value)}
                    />
                  </Form.Group>
                  <Modal.Footer>

  {/* When clicked the data will be submitted to the edit author function only when all required fields have been filled but only for that specific author
  based on its id */}                         
                  <Button variant="primary" type="button" onClick={() => {editData(currAuthor.id);}}>
                    Update Author
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

  {/* The delete modal that simply asks the user if they want to delete the author they clicked on */}
        <Modal show={showDelModal} onHide={handleDelClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Are you sure you want to delete this author?</Modal.Title>
              </Modal.Header>
              
              <Modal.Footer>
              <Button variant="primary" type="submit" onClick={() => {removeData(currAuthor.id);handleDelClose();}}>
                Yes
              </Button>
                <Button variant="secondary" onClick={handleDelClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>

  {/* The details modal which essentially acts like the edit modal by displaying their data, except it cannot be edited,
  all fields are set to read only */}
        <Modal show={showDetailsModal} onHide={handleDetailsClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">{currAuthor.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <Row>
              <Col>
                <Form>
                <Form.Group>
                    <Form.Label>Author ID:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currAuthor.id}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>D.O.B:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currAuthor.dob}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Genre:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currAuthor.genre}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Country:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currAuthor.country}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Books Count:</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue = {currAuthor.books_count}
                    />
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
      </div>
      </>
    )
}
export default Authors;