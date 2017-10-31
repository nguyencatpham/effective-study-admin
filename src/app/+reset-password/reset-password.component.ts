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

import {
  ActivatedRoute
} from '@angular/router';

// 3rd modules
import { ToastrService } from 'ngx-toastr';

// Services
import {
  AuthService
} from '../shared/services/auth';

import { Router } from '@angular/router';

// Validators
import { Matcher } from '../shared/validators/matcher.validator';

// Interfaces
import { ResetUserInfo } from '../shared/models';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'reset-password',  // <forgot-password></forgot-password>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'reset-password.template.html',
  styleUrls: [
    'reset-password.style.scss'
  ]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  public frm: FormGroup;
  public formErrors = {
    password: '',
    confirmPassword: '',
  };
  public validationMessages = {
    password: {
      required: 'Password is required.',
      pattern: 'Password must have a upperCase, a lowerCase and a number.'
    },
    confirmPassword: {
      required: 'ConfirmPassword is required.',
      nomatch: 'Password is not match'
    },
  };
  public submitted: boolean = false;
  private subId;

  constructor(private _activatedRoute: ActivatedRoute,
              private _fb: FormBuilder,
              private _router: Router,
              private _toasterService: ToastrService,
              private _authService: AuthService) {

  }

  public ngOnInit(): void {
    this.buildForm();
    this.subId = this._activatedRoute.params.subscribe((params) => {
      let id = params['id'] as number;
      let code = params['code'] as string;
      this.frm.get('userId').setValue(id);
      this.frm.get('code').setValue(code);
    });
  }

  public buildForm() {
    this.frm = this._fb.group({
      userId: 0,
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*[ ]).*$')
      ])),
      confirmPassword: new FormControl('', [Validators.required, Matcher('password')]),
      code: ''
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

  public onSubmit(value: ResetUserInfo) {
    this.submitted = true;
    this._authService.resetPassword(value)
      .subscribe((resp) => {
        if (resp.status) {
          this.submitted = true;
          this._toasterService.success(resp.message, 'Success');
          this._router.navigate(['auth']);
        } else {
          this.submitted = false;
          this._toasterService.error(resp.errorMessages, 'Error');
        }
      }, (err) => {
        //empty
      });
  }

  public ngOnDestroy() {
    this.subId.unsubscribe();
  }
}
