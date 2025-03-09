import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api.service";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPassForm: FormGroup;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastController: ToastController,
    private router: Router,
  ) {
    this.resetPassForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
   }

  ngOnInit() {
  }

  reset() {
    this.isLoading = true;
    if (this.resetPassForm.valid) {
      this.apiService.post('forgot-password', this.resetPassForm.value).subscribe(
        async (data) => {
          this.resetPassForm.reset();
          const toast = await this.toastController.create({
            message: data.message,
            duration: 3000,
          });
          await toast.present();
        },
        async (response) => {
          const toast = await this.toastController.create({
            message: response.error.message,
            duration: 1500,
          });
          this.isLoading = false;
          await toast.present();
        });
    }
  }

}
