// src/app/components/auth/register/register.component.ts
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

interface RegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  password_confirmation: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  form: FormGroup<RegisterForm>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    });

    // Auto-clear error when user starts typing
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.error.set(null));
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { name, email, password, password_confirmation } = this.form.getRawValue();

    this.auth
      .register({ name, email, password, password_confirmation })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.closeModalIfExists();
          // Optional: auto-login after register or just go home
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          const msg = err?.error?.message || err?.message || 'Registration failed';
          this.error.set(msg);
        },
      });
  }

  private closeModalIfExists() {
    const modalEl = document.getElementById('signupModal');
    if (!modalEl) return;

    const bs = (window as any).bootstrap?.Modal;
    if (bs) {
      const instance = bs.getInstance(modalEl) ?? new bs(modalEl);
      instance.hide();
    }
  }
}
