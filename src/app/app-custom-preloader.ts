import type { PreloadingStrategy, Route } from '@angular/router';

import type { Observable } from 'rxjs';
import { of } from 'rxjs';

export class AppCustomPreloader implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}
