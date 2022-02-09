import {Injectable} from '@angular/core';

const ACCESS_TOKEN = 'access-token';
const REFRESH_TOKEN = 'refresh-token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  saveAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
