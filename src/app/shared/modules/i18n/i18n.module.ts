import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import {
  TranslationModel
} from './translation.model';

import {
  Translation
} from './translation.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [
  ],
  providers: [
    Translation
  ]
})
export class AppI18n {

  static forRoot(translations: TranslationModel[] = [], pathPreFix:string = '/assets/i18n/') : ModuleWithProviders  {
    return {
      ngModule: AppI18n,
      providers: [
        { provide: 'APP_TRANSLATIONS', useValue: translations },
        { provide: 'APP_TRANSLATION_PATH_PREFIX', useValue: pathPreFix },
        { provide: 'Translation', useValue: Translation }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: AppI18n
    };
  }
}
