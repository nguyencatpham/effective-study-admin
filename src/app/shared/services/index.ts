import{
  Http
} from '@angular/http';

import { ThemeSetting } from './theme-setting';
import { AuthService } from './auth';
import { ResetGuard } from './reset-guard';
import { ProgressService } from './progress';
import { AuthGuard } from './auth-guard';
import { ExtendedHttpService } from './http';
import { UserContext } from './user-context';
import { NoisMedia } from './nois-media';
import { Util } from './util';
import { SeoService } from './seo';
import { ChefService } from './chef';

export const SHARED_SERVICES = [
  ThemeSetting,
  AuthGuard,
  ResetGuard,
  AuthService,
  UserContext,
  ProgressService,
  NoisMedia,
  Util,
  SeoService,
  ChefService,
  { provide: Http, useClass: ExtendedHttpService }
];

export * from './theme-setting';
export * from './auth';
export * from './reset-guard';
export * from './auth-guard';
export * from './progress';
export * from './http';
export * from './user-context';
export * from './nois-media';
export * from './util';
export * from './seo';
export * from './chef';

