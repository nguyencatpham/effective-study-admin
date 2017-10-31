import {
  Injectable,
  Inject,
  EventEmitter
} from '@angular/core';

import {
  TranslateService
} from '@ngx-translate/core';

import {
  TranslationModel
} from './translation.model';

@Injectable()
export class Translation {
  private _translations: TranslationModel[] = [];
  private _currentTranslation: TranslationModel;
  private _userLang: string;

  public onTranslationChange = new EventEmitter<TranslationModel>();

  constructor(@Inject('APP_TRANSLATIONS') _translations: TranslationModel[],
              private _translateService: TranslateService) {
    _translations.forEach((tr)=>{
      this._translations.push(new TranslationModel(tr.code, tr.name));
    });
    this._currentTranslation = this._translations[0];
    this._userLang = _translateService.getBrowserLang();
  }

  public get userLang() {
    return this._userLang;
  }

  public use(translation: TranslationModel) {
    // this._translateService.use(translation.code);
    this._currentTranslation = translation;
    this.onTranslationChange.emit(translation);
  }

  public getTranslations(): TranslationModel[] {
    return this._translations;
  }

  public getCurrentTranslation() {
    return this._currentTranslation;
  }
}
