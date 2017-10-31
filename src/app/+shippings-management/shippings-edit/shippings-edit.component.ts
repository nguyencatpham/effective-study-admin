import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import {
  ToastrService
} from 'ngx-toastr';

import {
  ShippingsManagementService
} from '../shippings-management.service';

import {
  DistrictInfo
} from '../shippings-management.model';


@Component({
  selector: 'shipping-edit',
  templateUrl: 'shippings-edit.template.html',
  styleUrls: ['shippings-edit.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShippingEditComponent implements OnInit {
  public frm: FormGroup;
  public district: DistrictInfo;

  constructor(private _fb: FormBuilder,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _toastrService: ToastrService,
              private _shippingsManagementService: ShippingsManagementService){}

  public ngOnInit(): void {
    this.builForm();
    this._activatedRoute.parent.params.subscribe((params: {id: number}) => {
      if(params.id) {
        this._shippingsManagementService.getDistrict(params.id).subscribe(
          (resp: DistrictInfo) => {
            this.district = resp;
            this.frm.patchValue(this.district);
          },
          (err) => {
            this._toastrService.error(err, "Error");
          }
        )
      }
    });
  }

  public builForm(): void {
    this.frm = this._fb.group({
      isActive: [false],
      feeShipping: [0]
    });
  }

  public onSubmitForm(): void {
    let data = {
      ...this.frm.value,
    }

    this._shippingsManagementService.updateDistrict(this.district.id, data).subscribe(
      (resp) => {
        this._toastrService.success("District is updated", "Success");
        this._router.navigate(['shippings-management', 'main']);
      },
      (err) => {
        this._toastrService.error(err, "Error");
      }
    )
  }
}