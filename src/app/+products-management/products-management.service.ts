import {
  EventEmitter,
  Injectable
} from '@angular/core';

import {
  Response,
  URLSearchParams
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

// App Constant
import {
  AppConstant
} from '../app.constant';

// Services
import {
  ExtendedHttpService
} from '../shared/services/http';

// Interfaces
import {
  BasicResponse,
  ResponseMessage,
  TypeEnum
} from '../shared/models';
import {
  ProductInfo,
  ProductListResp,
  BasicProduct,
  ImageInfo,
  ProductImageInfo,
  ProductNutritionInfo,
  ProductComponentInfo
} from './products-management.model';
import {
  ComponentInfo
} from '../+components-management/components-management.model';

import {
  NutritionInfo
} from '../+nutritions-management/nutritions-management.model';

import {
  SeoInfo
} from '../shared/models';


@Injectable()
export class ProductsManagementService {
  public subpath: string;
  constructor(private http: ExtendedHttpService) {
    // empty
    this.subpath = "products";
  }

  public getListProduct(params: URLSearchParams): Observable<ResponseMessage<ProductListResp>> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}`, {
      search: params
    }).map(this.extractData);
  }

  public getProducts(): Observable<ProductInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/all`)
      .map(this.extractData);
  }

  public getProduct(id: Number): Observable<ProductInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}`)
      .map(this.extractData);
  }

  public createProduct(model: ProductInfo): Observable<ProductInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}`, JSON.stringify(model))
      .map(this.extractData);
  }

  public updateProduct(id: number, model: ProductInfo): Observable<BasicResponse> {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/${id}`, JSON.stringify(model))
      .map(this.extractData);
  }

  public deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/${id}`)
        .map(this.extractData);
  }

  public getImages(id: number): Observable<ProductImageInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}/images`)
      .map(this.extractData);
  }

  public addImageToProduct(id: number, data: any): Observable<any> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}/${id}/image`, JSON.stringify(data))
      .map(this.extractData);
  }

  public updateProductImage(id: number, data: any): Observable<any> {
    return this.http.put(`${AppConstant.domain}/${this.subpath}/images/${id}`, JSON.stringify(data))
      .map(this.extractData);
  }

  public removeImageFromProduct(productImageId: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/images/${productImageId}`)
      .map(this.extractData);
  }

  public getComponents(): Observable<ComponentInfo[]> {
    return this.http.get(`${AppConstant.domain}/components/all`)
      .map(this.extractData);
  }

  public getProductComponents(id: number): Observable<ProductComponentInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}/components`)
      .map(this.extractData);
  }

  public addComponentToProduct(id: number, data: any): Observable<ProductComponentInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}/${id}/components`, JSON.stringify(data))
      .map(this.extractData);
  }

  public removeComponentFromProduct(productComponentId: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/components/${productComponentId}`)
      .map(this.extractData);
  }

  public getNutritions(): Observable<NutritionInfo[]> {
    return this.http.get(`${AppConstant.domain}/nutritions/all`)
      .map(this.extractData);
  }

  public getProductNutritions(id: number): Observable<ProductNutritionInfo[]> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}/nutritions`)
      .map(this.extractData);
  }

  public addNutritionToProduct(productId: number, data: any): Observable<ProductNutritionInfo> {
    return this.http.post(`${AppConstant.domain}/${this.subpath}/${productId}/nutritions`, JSON.stringify(data))
      .map(this.extractData);
  }

  public removeNutritionFromProduct(productNutritionId: number): Observable<any> {
    return this.http.delete(`${AppConstant.domain}/${this.subpath}/nutritions/${productNutritionId}`)
      .map(this.extractData);
  }

  public getProductSeo(id: number): Observable<SeoInfo> {
    return this.http.get(`${AppConstant.domain}/${this.subpath}/${id}/seo`)
      .map(this.extractData);
  }

  public printFileImport(): Observable<any> {
    return this.http.get(`${AppConstant.domain}/public/uploads/product-import.xlsx`, {
      responseType: 3
    });
  }

  public extractData(resp: Response): any {
    let body = resp.json();
    return body || {};
  }
}
