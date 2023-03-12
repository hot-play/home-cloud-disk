const SET_FILES = "SET_FILES";
const SET_CURRENT_DIRECTORY = "SET_CURRENT_DIRECTORY";
const ADD_FILE = "ADD_FILE";
const PUSH_TO_STUCK = "PUSH_TO_STUCK";
const POP_FROM_STUCK = "POP_FROM_STUCK";

const defaultState = {
    files: [],
    currentDirectory: {
        id: 0,
        name: "Home",
    },
    directoryStack: [
        {
            id: 0,
            name: "Home",
        },
    ],
};

export const fileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_FILES:
            return { ...state, files: action.payload };
        case SET_CURRENT_DIRECTORY:
            return { ...state, currentDirectory: action.payload };
        case ADD_FILE:
            return { ...state, files: [...state.files, action.payload] };
        case PUSH_TO_STUCK:
            return {
                ...state,
                directoryStack: [...state.directoryStack, action.payload],
            };
        case POP_FROM_STUCK:
            return {
                ...state,
                directoryStack: [
                    ...state.directoryStack.filter(
                        (directory) => directory.id !== action.payload
                    ),
                ],
            };
        default:
            return state;
    }
};

export const setFiles = (files) => ({ type: SET_FILES, payload: files });
export const setCurrentDirectory = (directory) => ({
    type: SET_CURRENT_DIRECTORY,
    payload: directory,
});
export const addFile = (file) => ({
    type: ADD_FILE,
    payload: file,
});
export const pushToStack = (directory) => ({
    type: PUSH_TO_STUCK,
    payload: directory,
});
export const popFromStack = (directory) => ({
    type: POP_FROM_STUCK,
    payload: directory,
});
