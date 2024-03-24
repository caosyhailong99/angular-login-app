import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  isNotValidEmail = false;
  isNotMatched = false;

  loginForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  registerForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, this.validatePassword]],
    confirmPassword: ['', Validators.required],
  });

  get registeredEmail() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngAfterViewInit() {
    this.prism = this.recPrism?.nativeElement;
  }

  onSubmit(event: any) {
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
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registerInfo.email as string)) {
      this.isNotValidEmail = false;
    }
    else {
      this.isNotValidEmail = true;
      return;
    }
    if (registerInfo.password !== registerInfo.confirmPassword)
      this.isNotMatched = true;
    else {
      this.isNotMatched = false;
      let mockInfo: any = {...registerInfo};
      delete mockInfo.confirmPassword;
      // mockInfo: {username: string, password: string}
      this.authService
        .register(mockInfo as { username: string; password: string })
        .subscribe(() => {});
    }
  }

  validatePassword(control: FormControl) {
    let isValid = true;
    const validationRegex = [
      { regex: /.{8,}/ }, // min 8 letters,
      { regex: /[0-9]/ }, // numbers from 0 - 9
      { regex: /[a-z]/ }, // letters from a - z (lowercase)
      { regex: /[A-Z]/}, // letters from A-Z (uppercase),
      { regex: /[^A-Za-z0-9]/} // special characters
    ];
      if(control.value) {
        for(let test of validationRegex) {
          isValid = test.regex.test(control.value);
          if(!isValid) break;
        }
      } else isValid = false;
      return !isValid ? { notValid: { value: control.value } } : null;
  }
}
