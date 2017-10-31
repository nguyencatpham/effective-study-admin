import {
  Injectable,
} from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ImgZoomClickService {

  public onImgClick = new Subject<string>();
  // Observable string streams
  public onImgClick$ = this.onImgClick.asObservable();

  public clickToZoom(url: string) {
    this.onImgClick.next(url);
  }
}
