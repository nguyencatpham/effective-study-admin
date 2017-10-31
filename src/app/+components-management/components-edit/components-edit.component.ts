import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

// 3rd modules
import {
  BreadcrumbService
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  ToastrService
} from 'ngx-toastr';

//Services
import {
  ComponentsManagementService
} from '../components-management.service';

//Model
import {
  ComponentInfo
} from '../components-management.model';

@Component({
  selector: 'component-edit',
  templateUrl: './components-edit.template.html',
  styleUrls: ['components-edit.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentEditComponent implements OnInit {
  public frm: FormGroup;
  public model: ComponentInfo;
  public formErrors = {
    name: ""
  };
  public validationMessages = {
    name: {
      required: 'Name is required.'
    }
  };

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _componentsManagementService: ComponentsManagementService,
              private _toastrService: ToastrService,
              private _breadcrumbService: BreadcrumbService){}

  public ngOnInit(): void {
    this.buildForm();
    this._activatedRoute.parent.params.subscribe((params: { id: number }) => {
      if (params.id) {
        this._componentsManagementService.getComponent(params.id).subscribe(
          (resp: ComponentInfo) => {
            this.model = resp;
            this.frm.patchValue(this.model);
          },
          (err) => {
            this._toastrService.error(err, 'Error');
          }
        );
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      name: ['', Validators.required]
    });

    this.frm.valueChanges.subscribe((data) => this.onChangeValues(data));
    this.onChangeValues();
    this.backupData();
  }

  public onChangeValues(data?: ComponentInfo): void {
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

  public backupData(): void {
    let data = Object.assign({}, this.frm.value);
    this._localStorageService.set('backupData', data);
  }

  public revertData(isEdit: boolean): void {
    if(!isEdit) {
      this.buildForm();
      return;
    }

    this.frm.patchValue(this._localStorageService.get('backupData'));
    this.backupData();
  }

  public onSubmitForm(): void {
    if (this.model && this.model.id) {
      this._componentsManagementService.updateComponent(this.model.id, this.frm.value).subscribe(
        (resp: any) => {
          this._toastrService.success("Component is updated", 'Success');
          this._router.navigate(['components-management']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
          this.revertData(true);
        }
      );
    } else {
      let data = {
        ...this.frm.value
      };
      this._componentsManagementService.createComponent(data).subscribe(
        (resp: ComponentInfo) => {
          this._toastrService.success("Component is created", 'Success');
          this._router.navigate(['components-management']);
          this._router.navigate(['components-management', resp.id]);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        }
      );
    }
  }

   public cancel(): void {
    this._router.navigate(['components-management']);
  }
}
