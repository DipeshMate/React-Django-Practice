import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// --> A function that accepts an initial state, an object of reducer functions, and a "slice name",
// and automatically generates action creators and action types that correspond to the reducers and state.
// --> A function that accepts a Redux action type string and a callback function that should return a promise. 
// It generates promise lifecycle action types based on the action type prefix that you pass in, and returns a thunk action creator 
// that will run the promise callback and dispatch the lifecycle actions based on the returned promise.

import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"))


const initialState = {
    user: user ? user : null,
    userInfo: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const register = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
        
    }
)

// export const login = createAsyncThunk(
//     "auth/login",
//     async (userData, thunkAPI) => {
//         try {
//             return await authService.login(userData)
//         } catch (error) {
//             const message = (error.response && error.response.data
//                 && error.response.data.message) ||
//                 error.message || error.toString()

//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )

// export const logout = createAsyncThunk(
//     "auth/logout",
//     async () => {
//         authService.logout()
//     }
// )

// export const activate = createAsyncThunk(
//     "auth/activate",
//     async (userData, thunkAPI) => {
//         try {
//             return await authService.activate(userData)
//         } catch (error) {
//             const message = (error.response && error.response.data
//                 && error.response.data.message) ||
//                 error.message || error.toString()

//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )

// export const resetPassword = createAsyncThunk(
//     "auth/resetPassword",
//     async (userData, thunkAPI) => {
//         try {
//             return await authService.resetPassword(userData)
//         } catch (error) {
//             const message = (error.response && error.response.data
//                 && error.response.data.message) ||
//                 error.message || error.toString()

//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )

// export const resetPasswordConfirm = createAsyncThunk(
//     "auth/resetPasswordConfirm",
//     async (userData, thunkAPI) => {
//         try {
//             return await authService.resetPasswordConfirm(userData)
//         } catch (error) {
//             const message = (error.response && error.response.data
//                 && error.response.data.message) ||
//                 error.message || error.toString()

//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )

// export const getUserInfo = createAsyncThunk(
//     "auth/getUserInfo",
//     async (_, thunkAPI) => {
//         try {
//             const accessToken = thunkAPI.getState().auth.user.access
//             return await authService.getUserInfo(accessToken)
//         } catch (error) {
//             const message = (error.response && error.response.data
//                 && error.response.data.message) ||
//                 error.message || error.toString()

//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            // .addCase(login.pending, (state) => {
            //     state.isLoading = true
            // })
            // .addCase(login.fulfilled, (state, action) => {
            //     state.isLoading = false
            //     state.isSuccess = true
            //     state.user = action.payload
            // })
            // .addCase(login.rejected, (state, action) => {
            //     state.isLoading = false
            //     state.isSuccess = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.user = null
            // })
            // .addCase(logout.fulfilled, (state) => {
            //     state.user = null
            // })
            // .addCase(activate.pending, (state) => {
            //     state.isLoading = true
            // })
            // .addCase(activate.fulfilled, (state, action) => {
            //     state.isLoading = false
            //     state.isSuccess = true
            //     state.user = action.payload
            // })
            // .addCase(activate.rejected, (state, action) => {
            //     state.isLoading = false
            //     state.isSuccess = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.user = null
            // })
            // .addCase(resetPassword.pending, (state) => {
            //     state.isLoading = true
            // })
            // .addCase(resetPassword.fulfilled, (state) => {
            //     state.isLoading = false
            //     state.isSuccess = true
            // })
            // .addCase(resetPassword.rejected, (state, action) => {
            //     state.isLoading = false
            //     state.isSuccess = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.user = null
            // })
            // .addCase(resetPasswordConfirm.pending, (state) => {
            //     state.isLoading = true
            // })
            // .addCase(resetPasswordConfirm.fulfilled, (state) => {
            //     state.isLoading = false
            //     state.isSuccess = true
            // })
            // .addCase(resetPasswordConfirm.rejected, (state, action) => {
            //     state.isLoading = false
            //     state.isSuccess = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.user = null
            // })
            // .addCase(getUserInfo.fulfilled, (state, action) => {
            //     state.userInfo = action.payload
            // })
    }
})




export const { reset } = authSlice.actions

export default authSlice.reducer