import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  @ViewChild('recPrism') recPrism: ElementRef | undefined;
  prism: HTMLDivElement | undefined;
  title = 'loginapp';
  errorText = '';
  isNotMatched = false;

  loginForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  registerForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
    confirmPassword: new FormControl<string>(''),
  });

  constructor(private authService: AuthService) {}

  ngAfterViewInit() {
    this.prism = this.recPrism?.nativeElement;
  }

  onSubmit(event: any) {
    console.log(event);
    event.preventDefault();
    let body = { ...this.loginForm.value };
    this.authService.login(body).subscribe((res: { result: string }) => {
      if (res?.result !== 'LOL, no way :))') {
        this.errorText = '';
        this.showThankYou();
      } else this.errorText = res.result;
    });
  }

  showSignup() {
    this.prism!.style.transform = 'translateZ(-100px) rotateY( -90deg)';
  }
  showLogin() {
    this.prism!.style.transform = 'translateZ(-100px)';
  }
  showForgotPassword() {
    this.prism!.style.transform = 'translateZ(-100px) rotateY( -180deg)';
  }

  showSubscribe() {
    this.prism!.style.transform = 'translateZ(-100px) rotateX( -90deg)';
  }

  showContactUs() {
    this.prism!.style.transform = 'translateZ(-100px) rotateY( 90deg)';
  }

  showThankYou() {
    this.prism!.style.transform = 'translateZ(-100px) rotateX( 90deg)';
  }

  onSubmitRegister() {
    let registerInfo = this.registerForm.value;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registerInfo.email as string))
      console.log('Email OK');
    else
      console.log('Not a valid email');
    if (registerInfo.password !== registerInfo.confirmPassword)
      this.isNotMatched = true;
    else {
      this.isNotMatched = false;
      let mockInfo: any = registerInfo;
      delete mockInfo.confirmPassword;
      // mockInfo: {username: string, password: string}
      console.log(mockInfo);
      this.authService
        .register(mockInfo as { username: string; password: string })
        .subscribe(() => {});
    }
  }
}
