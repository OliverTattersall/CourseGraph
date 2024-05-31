import { TestBed } from '@angular/core/testing';

import { ManagerusersService } from './managerusers.service';

describe('ManagerusersService', () => {
  let service: ManagerusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
