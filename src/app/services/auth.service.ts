import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DOMAIN } from "../constant/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: {userName?: string | null, password?: string | null}): Observable<{result: string}> {
    return this.http.post<{result: string}>(`${DOMAIN}/login`, body);
  }

  register(body: {username: string | null, password: string | null}) {
    return this.http.post<{result: string}>(`${DOMAIN}/register`, body);
  }
}