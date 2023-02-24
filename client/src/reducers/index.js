import { combineReducer, createStore } from " redux";import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import userReducer from "./user.reducer";
import fileReducer from "./file.reducer";

const rootReducer = combineReducer({
    user: userReducer,
    files: fileReducer,
});

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
