import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { registration } from "../../action/user";
import { useDispatch } from "react-redux";

export const RegistrationComponent = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const registrationHandler = () => {
        dispatch(registration(login, password));
    };
    return (
        <Container className="col-4 mt-5">
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
            <Button className="dark" onClick={() => registrationHandler()}>
                Регистрация
            </Button>
        </Container>
    );
};
