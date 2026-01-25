// spinner.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { SpinnerService } from './spinner.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(SpinnerService); // inject service
  spinner.show();

  return next(req).pipe(
    finalize(() => spinner.hide())
  );
};
