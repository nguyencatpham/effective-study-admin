import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  AuthService
} from '../shared/services/auth';

import { LoginForm } from '../shared/models';

import {
  bottomToTopFadeAnimation
} from '../shared/animations'

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'sign-in',  // <sign-in></sign-in>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'sign-in.template.html',
  styleUrls: [
    'signin.style.scss',
  ],
  animations: [bottomToTopFadeAnimation()],
  host: { '[@routerTransition]': 'true' }
})
export class SignInComponent implements OnInit {
  public frm: FormGroup;
  public formErrors = {
    email: '',
    password: ''
  };
  public validationMessages = {
    email: {
      required: 'Email is required.',
    },
    password: {
      required: 'Password is required.',
    }
  };
  public hasError: boolean = false;
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor(private _fb: FormBuilder,
              private _router: Router,
              private _authService: AuthService) { }

  public ngOnInit(): void {
    let isLogged: boolean = this._authService.checkLogged();
    if(isLogged)
      this._router.navigate(['dashboard']);
    this.buildForm();
  }



  public buildForm(): void {
    this.frm = this._fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.frm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  public onValueChanged(data?: any) {
    if (!this.frm) {
      return;
    }
    const form = this.frm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  public onSubmit(value: LoginForm) {
    this._authService.login(value.email, value.password);
  }
}
