import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import * as authActions from "./auth.actions";
import { state } from "@angular/animations";


export interface State{
    user:User;
    authError:string;
    loading:boolean;
}

const initialState : State = {
    user:null,
    authError:null,
    loading:false
}

export const authReducer = createReducer(
    initialState,
    on(authActions.login, (state,action) => {
        const user = new User(action.email,action.userId,action.token,action.expirationDate);
        return {
            ...state,
            authError:null,
            user : user,
            loading:false
        }
    }),
    on(authActions.logout, (state,action) => (
        {
            ...state,
            user:null
        }
    )),
    on(authActions.login_start,(state,action) => (
    {
        ...state,
        authError:null,
        loading:true
    })),
    on(authActions.signup_start,(state,action) => (
    {
        ...state,
        authError:null,
        loading:true
    })),
    on(authActions.login_fail, (state,action) => (
        {
            ...state,
            user:null,
            authError:action.message,
            loading:false
        }
    )),
    on(authActions.clear_error, (state,action) => (
        {
            ...state,
            authError:null
        }
    ))
)