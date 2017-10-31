/***************************************************
 ******************* CONTAINERS ********************
 ***************************************************/
import { AuthLayoutComponent } from './auth-layout-container';
import { MainLayoutComponent } from './main-layout-container';
import { PageHeaderComponent } from './main-layout-container/components/page-header';
import { SidebarComponent } from './main-layout-container/components/sidebar';
import { QuickViewComponent } from './main-layout-container/components/quickview';

export const SHARED_LAYOUT_CONTAINERS = [
  AuthLayoutComponent,
  MainLayoutComponent,
  PageHeaderComponent,
  SidebarComponent,
  QuickViewComponent
];
