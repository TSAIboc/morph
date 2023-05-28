import { configureStore } from "@reduxjs/toolkit";
import controllerSlice from "./controllerSlice";
import viewangleSlice from "./viewangleSlice";
const store = configureStore({
    reducer: {
        controller: controllerSlice,
        viewangle: viewangleSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;