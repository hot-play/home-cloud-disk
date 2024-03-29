import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
