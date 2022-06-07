import React from 'react';
import {
    Navbar,
    Nav,
} from 'react-bootstrap';

const Navigation = () => {
    //Navbar holds three links that direct to each component
        return(
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand className="text-white">Library</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Books</Nav.Link>
                        <Nav.Link href="/authors">Authors</Nav.Link>
                        <Nav.Link href="/publishers">Publishers</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
};
export default Navigation;
