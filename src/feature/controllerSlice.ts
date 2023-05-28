import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
    size: 3,
    intensity: 3,
    isButtonClick: false
}
const controllerSlice = createSlice({
    name: 'controller',
    initialState,
    reducers: {
        sizeChanged(state, action) {
            state.size = action.payload;
        },
        intensityChanged(state, action) {
            state.intensity = action.payload;
        },
        resetChanged(state) {
            state.isButtonClick = !state.isButtonClick;
        }
    }
});

export const { sizeChanged, intensityChanged, resetChanged } = controllerSlice.actions;
export const controllerSeletor = (state: RootState) => state.controller;
export default controllerSlice.reducer;