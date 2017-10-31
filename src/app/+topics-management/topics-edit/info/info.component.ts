import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
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
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

// Services
import {
  TopicsManagementService
} from '../../topics-management.service';

// Interfaces
import {
  BasicResponse,
  ResponseMessage
} from '../../../shared/models/respone.model';
import {
  CategoryInfo
} from '../../../+categories-management/categories-management.model';
import {
  ConfirmDialogComponent
} from '../../../shared/modules/confirm-dialog';

@Component({
  selector: 'topics-edit-info',
  templateUrl: 'info.template.html',
  styleUrls: [
    'info.style.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class TopicEditInfoComponent implements OnInit {
  public frm: FormGroup;
  public formErrors = {
    name: ''
  };
  public validationMessages = {
    name: {
      required: 'Name is required.'
    }
  };

  public topic: any;

  constructor(private _fb: FormBuilder,
              private _localStorageService: LocalStorageService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _topicsManagementService: TopicsManagementService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService) {

  }

  public ngOnInit(): void {
    this.buildForm();

    this._activatedRoute.parent.params.subscribe((params) => {
      if (!isNaN(params.id)) {
        this._topicsManagementService.getTopic(params.id).subscribe(
          (topic: any) => {
            this.topic = topic;
            this.frm.patchValue(this.topic);
          },
          (err) => {
            this._toastrService.error(err, 'Error');
            this._router.navigate(['topics-management', 'main']);
          });
      }
    });
  }

  public buildForm(): void {
    this.frm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });

    this.frm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
    this.backupData();
  }

  public onValueChanged(data?: any): void {
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
    if (this.topic && this.topic.id) {
      this._topicsManagementService.updateTopic(this.topic.id, this.frm.value).subscribe(
        (resp: BasicResponse) => {
          this._toastrService.success("Topic is updated", 'Success');
          this._router.navigate(['topics-management']);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    } else {
      let model = {
        ...this.frm.value,
        languageId: 1
      };
      this._topicsManagementService.createTopic(model).subscribe(
        (resp: any) => {
          this._toastrService.success("Topic is added", 'Success');
          this._router.navigate(['topics-management', resp.id]);
          // this.revertData(false);
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    }
  }

  public cancel(): void {
    this._router.navigate(['topics-management']);
  }

  public delete(): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, { keyboard: true});
    modalRef.componentInstance.title = "Delete Topic";
    modalRef.componentInstance.message = "Are you sure you want to delete this topic? This cannot be undone.";
    modalRef.result.then((resp: boolean) => {
      if(resp) {
        this._topicsManagementService.deleteTopic(this.topic.id).subscribe(
          resp => {
            this._toastrService.success("Topic is deleted", "Success");
            this._router.navigate(['topics-management', 'main']);
          },
          err => {
            this._toastrService.error(err, "Error");
          }
        )
      }
    }).catch(err => {});
  }

  public backupData(): void {
    let data = Object.assign({}, this.frm.value);
    this._localStorageService.set('backupData', data);
  }

  public revertData(isEdit: boolean): void {
    if (!isEdit) {
      // Assign init value because this properties become null after reset
      this.buildForm();
      return;
    }
    this.frm.patchValue(this._localStorageService.get('backupData'));
    this.backupData();
  }
}
