import { createAction,props } from "@ngrx/store";

export const login = createAction(
    '[auth] login',
    props <{email:string, userId:string, token:string, expirationDate : Date, redirect:boolean}> ()
);

export const logout = createAction(
    '[auth] logout'
);

export const login_start = createAction(
    '[auth] login_start',
    props <{email:string, password:string}> ()
);

export const login_fail=createAction(
    '[auth] login_error',
    props <{message:string}>()
);

export const signup_start = createAction(
    '[auth] signup_start',
    props <{email:string, password:string}> ()
);

export const clear_error = createAction(
    '[auth] clear_error'
);

export const autoLogin = createAction(
    '[auth] autoLogin'
);