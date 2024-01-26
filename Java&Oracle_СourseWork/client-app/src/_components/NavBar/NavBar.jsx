import React from 'react';
import {Navbar, Nav, Button, Container, NavDropdown, NavLink} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Link} from "react-router-dom";
import logo from "../../images/logo.png";

const NavBar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.role);
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }
    return (
        <>
            <Navbar expand="lg" bg="light" variant="light">
                <Container>
                    <Navbar.Brand>
                        <img src={logo} width="100" height="80"
                             className="d-inline-block align-top" alt="TrainJet logo"/>
                    </Navbar.Brand>
                </Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="schedule" className="nav-link">Schedule</Link>
                        <Link to="account" className="nav-link">Account</Link>
                        <Link to="card" className="nav-link">Card</Link>
                    </Nav>
                    {user.role === 'ROLE_ADMIN' &&
                        <Nav>
                            <NavDropdown
                                id="collasible-nav-dropdown"
                                title="Admin"
                                menuVariant="light">
                                <LinkContainer to="create-train">
                                    <NavDropdown.Item>Trains</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="create-trainType">
                                    <NavDropdown.Item>Train Types</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="create-waggonType">
                                    <NavDropdown.Item>Waggon Types</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="stations">
                                    <NavDropdown.Item>Stations</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="movement-routes">
                                    <NavDropdown.Item>Routes</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="train-flights">
                                    <NavDropdown.Item>Flights</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="statistic">
                                    <NavDropdown.Item>Statistic</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="all-orders">
                                    <NavDropdown.Item>All orders</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                    }
                    <Nav>
                        <Button variant="outline-success" onClick={handleLogout}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default NavBar;