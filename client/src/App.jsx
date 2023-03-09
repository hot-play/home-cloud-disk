import React, { useEffect } from "react";import { NavbarComponent } from "./components/navbar/NavbarComponent";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RegistrationComponent } from "./components/authorization/RegistrationComponent";
import { AuthorizationComponent } from "./components/authorization/AuthorizationComponent";
import { useDispatch, useSelector } from "react-redux";
import { tokenAuthorization } from "./action/user";
import { Disk } from "./components/disk/Disk";

const App = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(tokenAuthorization());
    }, []);

    return (
        <BrowserRouter>
            <div className="app">
                <NavbarComponent />
                {!isAuth ? (
                    <Routes>
                        <Route
                            path="/registration"
                            element={<RegistrationComponent />}
                        />
                        <Route
                            path="/authorization"
                            element={<AuthorizationComponent />}
                        />
                        <Route
                            path="/authorization"
                            element={<Navigate to="/" replace />}
                        />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/" element={<Disk />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                )}
            </div>
        </BrowserRouter>
    );
};
export default App;
