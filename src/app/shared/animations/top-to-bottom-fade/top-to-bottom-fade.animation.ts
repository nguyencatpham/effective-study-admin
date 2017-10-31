import {
  trigger,
  animate,
  style,
  transition,
  state
} from '@angular/core';

export function topToBottomFadeAnimation() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%', height:'100%'}) ),
    state('*', style({position:'fixed', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(-30%)', opacity: 0}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)', opacity: 1}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)', opacity: 1}),
      animate('0.5s ease-in-out', style({transform: 'translateY(-30%)', opacity: 0}))
    ])
  ]);
}
