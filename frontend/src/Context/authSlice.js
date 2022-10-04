import { createSlice } from '@reduxjs/toolkit';

const initialUserState = {
    isLoggedIn: true,
    money: 1000
}

export const authSlice = createSlice({
    name: "Authentication",
    initialState: initialUserState,
    reducers: {
        logIn: (state, action) => {
            state.isLoggedIn = true;
        }
    }
})

export const { logIn } = authSlice.actions;
export default authSlice.reducer;