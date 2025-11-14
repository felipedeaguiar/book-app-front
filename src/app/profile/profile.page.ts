import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  photo: string | null = null;
  generos: any;
  userGeneros: any;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      old_password: [''],
      password: [''],
      bio:['']
    });
  }

  ngOnInit() {
    this.getProfile();
    this.getProfilePic();
    this.getGeneros();
  }

  async edit() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Aguarde...', // Mensagem do loading
      spinner: 'bubbles', // Tipo de spinner
      duration: 0 // O loading vai ficar até ser fechado manualmente
    });

    await loading.present(); // Exibir o loading

    this.apiService.put('user/profile', this.profileForm.value).subscribe(
      async (result) => {
        this.isLoading = false;

        const toast = await this.toastController.create({
          message: 'Salvo com sucesso!',
          duration: 1500,
        });
        await toast.present();
        loading.dismiss();
      },
      async (response) => {
        const toast = await this.toastController.create({
          message: response.error.message,
          duration: 1500,
        });
        this.isLoading = false;
        await toast.present();
        loading.dismiss();
      });
  }

  getProfile() {
    this.apiService.get('user/profile').subscribe(
      (result) => {
        this.profileForm.patchValue({
          email: result.data.email,
          name: result.data.name,
          old_password: '',
          password: '',
          bio: result.data.bio,
        });
        this.userGeneros = result.data.generos.map((g: any) => g.id);
      },
      async (response) => {
        // const toast = await this.toastController.create({
        //   message: response.error.message,
        //   duration: 1500,
        // });
        // this.isLoading = false;
        // await toast.present();
      });
  }

  getProfilePic() {
    this.apiService.getImage('user/profile/picture').subscribe((result) => {
       this.photo = URL.createObjectURL(result);
    });
  }

  getGeneros() {
    this.apiService.get('generos').subscribe((result) => {
      this.generos = result.data
    });
  }
}
