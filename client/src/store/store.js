import { combineReducers, applyMiddleware, compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user.reducer";
import { fileReducer } from "./file.reducer";
import thunk from "redux-thunk";

const composeEnhancers = compose;

const rootReducer = combineReducers({
    user: userReducer,
    files: fileReducer,
});

export const store = configureStore(
    { reducer: rootReducer },
    composeEnhancers(applyMiddleware(thunk))
);
