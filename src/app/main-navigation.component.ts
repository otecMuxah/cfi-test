import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import { Component, inject, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FakeServiceService} from './fake.service';
import {map} from "rxjs";

interface MenuItem {
  path: string;
  name: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  template: `
    <ng-container *ngFor="let menu of menus">
      <a
        class="border px-4 py-2 rounded-md"
        [routerLink]="menu.path"
        routerLinkActive="isSelected">
        {{ menu.name }}
      </a>
    </ng-container>
  `,
  styles: [
    `
      a.isSelected {
        @apply bg-gray-600 text-white;
      }
    `,
  ],
  host: {
    class: 'flex flex-col p-2 gap-2',
  },
})
export class NavigationComponent {
  @Input() menus!: MenuItem[];
}

@Component({
  standalone: true,
  imports: [NavigationComponent, NgIf, AsyncPipe],
  template: `
    <!--    Just not to use functions in template. It's not a good practice. It was so near :)-->
    <ng-container *ngIf="info$ | async as info">
      <ng-container *ngIf="info !== null; else noInfo">
        <app-nav [menus]="info" />
      </ng-container>
    </ng-container>

    <ng-template #noInfo>
      <app-nav [menus]="[]" />
    </ng-template>
  `,
  host: {},
})
export class MainNavigationComponent {
  private fakeBackend = inject(FakeServiceService);

  readonly info$ = this.fakeBackend.getInfoFromBackend().pipe(map((val: string) => {
    return this.getMenu(val);
  }));

  getMenu(prop: string) {
    return [
      { path: '/foo', name: `Foo ${prop}` },
      { path: '/bar', name: `Bar ${prop}` },
    ];
  }
}
