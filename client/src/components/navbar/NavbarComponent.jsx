import React from "react";import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/user.reducer";

export const NavbarComponent = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const dispatch = useDispatch();

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <NavLink className="navbar-brand" to="/">
                    Home-cloud
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!isAuth && (
                            <Nav.Item>
                                <NavLink
                                    className="nav-link"
                                    to="/authorization"
                                >
                                    Войти
                                </NavLink>
                            </Nav.Item>
                        )}
                        {!isAuth && (
                            <Nav.Item>
                                <NavLink
                                    className="nav-link"
                                    to="/registration"
                                >
                                    Регистрация
                                </NavLink>
                            </Nav.Item>
                        )}
                        {isAuth && (
                            <Nav.Item>
                                <NavLink
                                    className="nav-link"
                                    onClick={() => dispatch(logoutUser())}
                                >
                                    Выход
                                </NavLink>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
