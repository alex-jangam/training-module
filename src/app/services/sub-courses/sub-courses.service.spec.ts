import { TestBed, inject } from '@angular/core/testing';

import { SubCoursesService } from './sub-courses.service';

describe('SubCoursesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubCoursesService]
    });
  });

  it('should be created', inject([SubCoursesService], (service: SubCoursesService) => {
    expect(service).toBeTruthy();
  }));
});
