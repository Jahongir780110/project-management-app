import { TestBed } from '@angular/core/testing';

import { UnauthorisedErrorInterceptor } from './unauthorised-error.interceptor';

describe('UnauthorisedErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UnauthorisedErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UnauthorisedErrorInterceptor = TestBed.inject(UnauthorisedErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
