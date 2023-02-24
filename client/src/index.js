import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import { store } from "./reducers";
import { Provider } from "react";

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
