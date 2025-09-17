import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: string | null;
  token: string | null;
  role: string | null;
  name:string | null;
  isLoggedIn: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: '1',
  name: null,
  role: null,
  isLoggedIn: false,
};


// 🔹 Reducer
export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, { token }) => {        
    
    return {
      ...state,
      user:extractUser(token),
      token,
      name: extractName(token),
      role: extractRole(token),
      isLoggedIn: true,
    };
  }),

  on(AuthActions.logout, (state) => {
     
    return {
      ...state,
      user: null,
      token: null,
      name:null,
      role: null,
      isLoggedIn: false,
    };
  }),

  on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => {
 
    return {
      user:extractUser(accessToken),
      token:accessToken,
      name: extractName(accessToken),
      role: extractRole(accessToken),
      isLoggedIn: true,// si hay usuario, sigue logueado
    };
  })

);

function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function extractRole(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Ajusta según lo que devuelva tu backend
  return decoded.roles || decoded.roles?.[0] || decoded.authorities?.[0] || null;
  
}
function extractUser(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Ajusta según lo que devuelva tu backend
  return decoded.sub  || null;
  
}
function extractName(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Ajusta según lo que devuelva tu backend
  return decoded.name || null;
  
}