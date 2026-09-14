# Dependency Stripping Reference Guide

When extracting an enterprise or client Angular component into the benchmark harness, strip away all state management and business logic dependencies, retaining only visual presentation and local UI interactions.

---

## 1. NgRx Store & Selectors

### Before (Client Component):
```typescript
// BEFORE: Coupled to NgRx Store
@Component({ ... })
export class UserListComponent implements OnInit {
  private readonly store = inject(Store<AppState>);
  users$ = this.store.select(selectActiveUsers);
  isLoading$ = this.store.select(selectIsLoading);

  ngOnInit() {
    this.store.dispatch(loadUsersAction());
  }

  onDelete(id: number) {
    this.store.dispatch(deleteUserAction({ id }));
  }
}
```

### After (Dumb Component):
```typescript
// AFTER: Pure Presentational Component
@Component({
  selector: 'storybook-user-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.less',
})
export class UserListComponent {
  @Input() items: UserListItem[] = [];
  @Output() delete = new EventEmitter<number>();

  trackById(_index: number, item: UserListItem): number {
    return item.id;
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
```

---

## 2. Injected Services (HTTP, APIs, Routers)

### Before:
```typescript
constructor(
  private api: UserApiService,
  private router: Router,
  private toast: ToastService,
) {}

loadData() {
  this.api.getUsers().subscribe(users => this.users = users);
}

viewDetail(id: number) {
  this.router.navigate(['/users', id]);
}
```

### After:
- Remove all service injections. Data is passed in exclusively through `@Input() items`.
- Navigation actions either emit an `@Output()` event or simply update internal display state.

---

## 3. Template Async Pipes (`| async`)

### Before:
```html
<div *ngIf="!(isLoading$ | async); else loading">
  <div *ngFor="let user of users$ | async">
    {{ user.name }}
  </div>
</div>
```

### After:
```html
<div class="user-list-shell">
  <div *ngFor="let user of items; trackBy: trackById" class="user-item" data-user-list-item>
    {{ user.name }}
  </div>
</div>
```

---

## 4. Retaining Local Presentation State

Local UI state that does not require external services should be retained:
- Collapsing/expanding accordion rows or tree nodes.
- Local hover states, tooltips, or active tabs.
- Page index or selection highlights that affect rendering.
