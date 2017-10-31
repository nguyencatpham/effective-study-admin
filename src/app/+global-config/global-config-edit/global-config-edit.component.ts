import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

import {
  ToastrService
} from 'ngx-toastr';

import {
  ConfirmDialogComponent
} from '../../shared/modules/confirm-dialog';

import {
  GlobalConfigService
} from '../global-config.service';

import {
  SettingInfo
} from '../global-config.model';


@Component({
  selector: 'global-config-edit',
  templateUrl: 'global-config-edit.template.html',
  styleUrls: ['global-config-edit.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalConfigEditComponent implements OnInit {
  public setting: SettingInfo;
  public frm: FormGroup;
  public formErrors = {
    key: ''
  };
  public validationMessages = {
    key: {
      required: 'Key is required.'
    }
  };

  constructor(private _fb: FormBuilder,
              private _modalService: NgbModal,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _globalConfigService: GlobalConfigService) {}

  public ngOnInit(): void {
    this.buildForm();
    this._activatedRoute.parent.params.subscribe((params: {id: number}) => {
      if(params.id) {
        this._globalConfigService.getSetting(params.id).subscribe(
          (resp: SettingInfo) => {
            this.setting = resp;
            this.frm.patchValue(this.setting);
          },
          (err) => {
            this._toastrService.error(err, "Error");
            this._router.navigate(['global-config', 'main']);
          }
        )
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      key: ["", Validators.required],
      value: [""],
      isDisabled: [false]
    });
    this.frm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  public onValueChanged(data?: SettingInfo): void {
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

  public onSubmitForm(): void {
    let model = {
      ...this.frm.value,
      isDisabled: false
    }
    if(this.setting && this.setting.id) {
      this._globalConfigService.updateSetting(this.setting.id, model).subscribe(
        (resp: SettingInfo) => {
          this._toastrService.success("Config is updated", "Success");
          this._router.navigate(['global-config', 'main']);
        },
        (err) => {
          this._toastrService.error(err, "Error");
        }
      );
    } else {
      this._globalConfigService.addSetting(model).subscribe(
        (resp: SettingInfo) => {
          this._toastrService.success("Config is added", "Success");
          this.buildForm();
        },
        (err) => {
          this._toastrService.error(err, "Error");
        }
      );
    }
  }

  public delete(): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, {
      keyboard: true,
    });
    modalRef.componentInstance
      .message = 'Are you sure you want to remove the config? This cannot be undone.';
    modalRef.componentInstance.title = 'Remove Config';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this._globalConfigService.deleteSetting(this.setting.id).subscribe(
          (resp) => {
            this._toastrService.success("Config is deleted", "Success");
            this._router.navigate(['global-config', 'main']);
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        );
      }
    });
  }

  public cancel(): void {
    this._router.navigate(['global-config', 'main']);
  }
}

