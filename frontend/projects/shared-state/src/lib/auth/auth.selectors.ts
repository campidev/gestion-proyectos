import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.isLoggedIn
);

export const selectUser = createSelector(
  selectAuthState,
  (state) => state?.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state?.token
);

export const selectRole = createSelector(
  selectAuthState,
  (state) => state.role
);

export const selectName = createSelector(
  selectAuthState,
  (state) => state.name
);