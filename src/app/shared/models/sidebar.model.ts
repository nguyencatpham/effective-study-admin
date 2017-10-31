import { RolesEnum } from './enums.model';

export interface MenuItem {
  routerLink: string;
  routerLinkActive: string;
  title: string;
  icon: string;
  permission: RolesEnum[];
}
