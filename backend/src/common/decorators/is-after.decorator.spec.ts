import { validate } from 'class-validator';
import { IsAfterOrEqual } from './is-after.decorator';

class TestDto {
  startDate: string;

  @IsAfterOrEqual('startDate')
  endDate: string;
}

describe('IsAfterOrEqual Decorator', () => {
  it('should pass if endDate is after startDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2026-04-01';
    dto.endDate = '2026-04-02';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass if endDate is equal to startDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2026-04-01';
    dto.endDate = '2026-04-01';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if endDate is before startDate', async () => {
    const dto = new TestDto();
    dto.startDate = '2026-04-02';
    dto.endDate = '2026-04-01';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isAfterOrEqual');
  });

  it('should pass if one of the values is missing (handled by other decorators)', async () => {
    const dto = new TestDto();
    dto.startDate = '2026-04-01';
    // endDate is missing

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
