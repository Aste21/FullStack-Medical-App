import { Student } from './student.model';

describe('Student', () => {
  it('should create an instance', () => {
    // @ts-ignore
    expect(new Student()).toBeTruthy();
  });
});
