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
    return this.getLoggedUser() != null;
  }

  setAuthToken(token: any) {
    localStorage.setItem('auth_token', token);
  }

  setUser(user: any) {
    this.user = user;
    localStorage.setItem('user', user);
    this.setAuthToken(this.user.token);
  }

  getLoggedUser() {
    return this.user || localStorage.getItem('auth_token');
  }
}
