import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  Router,
  ActivatedRoute,
} from '@angular/router';

// 3rd modules
import {
  BreadcrumbService,
} from 'ng2-breadcrumb/ng2-breadcrumb';
import {
  ToastrService,
} from 'ngx-toastr';
import {
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

// Services
import {
  SeoService
} from '../../../shared/services';

import {
  ProductsManagementService
} from '../../products-management.service';

// Interfaces
import {
  SeoInfo
} from '../../../shared/models';
import {
  BasicResponse,
  ResponseMessage,
} from '../../../shared/models/respone.model';

import {
  ConfirmDialogComponent
} from '../../../shared/modules/confirm-dialog';


@Component({
  selector: 'products-edit-seo',
  templateUrl: 'seo.template.html',
  styleUrls: [
    'seo.style.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsEditSeoComponent implements OnInit {
  public productId: number;
  public seo: SeoInfo;
  public frm: FormGroup;
  public formErrors = {
    name: '',
    metaKeyword: '',
    metaDescription: '',
    metaTitle: ''
  };
  public validationMessages = {
    name: {
      required: 'Name is required.'
    },
    metaKeyword: {
      required: 'Meta keyword is required.'
    },
    metaDescription: {
      required: 'Meta description is required.'
    },
    metaTitle: {
      required: 'Meta title is required.'
    }
  };

  constructor(private _fb: FormBuilder,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _seoService: SeoService,
              private _productsManagementService: ProductsManagementService,
              private _toastrService: ToastrService,
              private _modalService: NgbModal,
              private _breadcrumbService: BreadcrumbService) {

  }
  public ngOnInit(): void {
    this.buildForm();
    this._activatedRoute.parent.params.subscribe((params: {id: number}) => {
      if(params.id) {
        this.productId = params.id;
        this._productsManagementService.getProductSeo(params.id).subscribe(
          (resp: SeoInfo) => {
            this.seo = resp;
            this.frm.patchValue(this.seo);
          },
          (err) => {
            //this._toastrService.error(err, "Error");
          }
        )
      }
    });
  }
  
  public buildForm(): void {
    this.frm = this._fb.group({
      name: ['', Validators.required],
      metaKeyword: ['', Validators.required],
      metaDescription: ['', Validators.required],
      metaTitle: ['', Validators.required],
      // entityId: [''],
      // entityName: [''],
      // languageId: [''],
    });

    this.frm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  public onValueChanged(data?: SeoInfo): void {
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
        entityId: this.productId,
        entityName: 'products',
        languageId: 1,
      };
    if (this.seo && this.seo.id) {
      this._seoService.updateSeo(this.seo.id, model).subscribe(
        (resp: BasicResponse) => {
          this._toastrService.success("Product SEO is updated", 'Success');
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    } else {
      
      this._seoService.createSeo(model).subscribe(
        (resp: SeoInfo) => {
          this.seo = resp;
          this.frm.patchValue(this.seo);
          this._toastrService.success("Product SEO is added", 'Success');
        },
        (err) => {
          this._toastrService.error(err, 'Error');
        });
    }
  }

  public cancel(): void {
    this._router.navigate(['products-management']);
  }

  public delete(): void {
    let modalRef = this._modalService.open(ConfirmDialogComponent, { keyboard: true});
    modalRef.componentInstance.title = "Delete SEO";
    modalRef.componentInstance.message = "Are you sure you want to delete this SEO? This cannot be undone.";
    modalRef.result.then((resp: boolean) => {
      if(resp) {
        this._seoService.deleteSeo(this.seo.id).subscribe(
          resp => {
            this.seo = null;
            this.buildForm();
            this._toastrService.success("Product SEO is deleted", "Success");
          },
          err => {
            this._toastrService.error(err, "Error");
          }
        )
      }
    }).catch(err => {});
  }
}
