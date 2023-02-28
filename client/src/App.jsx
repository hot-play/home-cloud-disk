import React from "react";import { NavbarComponent } from "./components/navbar/NavbarComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegistrationComponent } from "./components/registration/RegistrationComponent";

const App = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <NavbarComponent />
                <RegistrationComponent />
                <Routes>
                    <Route
                        path="/registration"
                        element={RegistrationComponent}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
};
export default App;
