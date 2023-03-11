import React, { useState } from "react";import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { authorization } from "../../action/user";
import { useDispatch } from "react-redux";

export const AuthorizationComponent = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    return (
        <Container className="col-4">
            <InputGroup className="mb-3">
                <Form.Control
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Введите логин"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <Form.Control
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Введите пароль"
                    aria-describedby="basic-addon2"
                />
            </InputGroup>
            <Button
                className="dark"
                onClick={() => dispatch(authorization(login, password))}
            >
                Войти
            </Button>
        </Container>
    );
};
