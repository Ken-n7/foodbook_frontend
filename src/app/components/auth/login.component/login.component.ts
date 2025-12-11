import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { Modal } from  'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;

  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;

        // const modalEl = document.getElementById('loginModal');
        // const modal = Modal.getInstance(modalEl!) || new Modal(modalEl!);
        // modal.hide();
        alert('Login successful!');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.loading = false;
        alert('Invalid credentials');
      },
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        alert('Logout successful!');
      },
      error: () => {
        alert('Something went wrong');
      },
    });
  }
}
