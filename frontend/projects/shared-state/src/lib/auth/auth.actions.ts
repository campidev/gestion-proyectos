import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{token: string }>()
);

export const logout = createAction('[Auth] Logout');

export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);