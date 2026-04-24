import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsAfterOrEqual } from 'src/common/decorators/is-after.decorator';

export class GetEnergyFilterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message:
      'startDate debe tener el formato YYYY-MM-DDTHH:mm (ej: 2026-04-15T00:00)',
  })
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    message:
      'endDate debe tener el formato YYYY-MM-DDTHH:mm (ej: 2026-04-15T23:59)',
  })
  @IsAfterOrEqual('startDate', {
    message:
      'La fecha límite (endDate) no puede ser anterior a la fecha de inicio (startDate)',
  })
  endDate: string;
}
