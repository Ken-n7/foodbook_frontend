// login.component.ts
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Properly typed form — this fixes the template errors 100%
  form: FormGroup<LoginForm>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.error.set(null));
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth
      .login({ email, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.closeModalIfExists();
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.error.set(
            err?.message?.includes('Invalid credentials')
              ? 'Invalid email or password'
              : 'Login failed. Please try again later.'
          );
        },
      });
  }

  private closeModalIfExists() {
    const modalEl = document.getElementById('loginModal');
    if (!modalEl) return;

    const bs = (window as any).bootstrap?.Modal;
    if (bs) {
      const instance = bs.getInstance(modalEl) ?? new bs(modalEl);
      instance.hide();
    }
  }

  logout() {
    this.auth.logout();
  }
}
