import { Injectable } from '@angular/core';
import {ApiService} from "./services/api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null;
  constructor(
    private apiService: ApiService,
  ) { }


  login(credentials: any) {
    return this.apiService.post('login', credentials);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') != null && localStorage.getItem('auth_token') !== 'null';
  }

  setAuthToken(token: any) {
    localStorage.setItem('auth_token', token);
  }

  logout() {
    return this.apiService.post('logout', {});
  }

  setUser(user: any) {
    this.user = user;
    localStorage.setItem('user', user);
  }

  getLoggedUser() {
    return this.user;
  }
}
