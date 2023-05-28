import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
    view: 'front',
    isButtonClick: false
}
const viewangleSlice = createSlice({
    name: 'viewangle',
    initialState,
    reducers: {
        viewangleChanged(state, action) {
            state.view = action.payload;
            state.isButtonClick = !state.isButtonClick;
        }
    }
});

export const { viewangleChanged } = viewangleSlice.actions;
export const viewangleSelector = (state: RootState) => state.viewangle;
export default viewangleSlice.reducer;