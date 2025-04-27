import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "./services/api.service";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
  private router: Router,
  private authService: AuthService,
  ) {
    this.authService = authService;
  }

  logout() {
    this.authService.logout().subscribe(
      (data) => {
        this.authService.setUser(null)
        this.authService.setAuthToken(null);
        this.router.navigate(['/login']); // Substitua '/dashboard' pela rota para onde deseja redirecionar
      },
      async (response) => {
      });
  }

  goToProfile() {
    this.router.navigate(['perfil']);
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
