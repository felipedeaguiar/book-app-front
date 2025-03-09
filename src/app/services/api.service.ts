// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // Importando o arquivo de configuração do ambiente

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;  // URL base da API obtida do ambiente

  constructor(private http: HttpClient) { }

  // Método GET genérico
  get(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  // Método POST genérico
  post(endpoint: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Método PUT genérico
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Método DELETE genérico
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
