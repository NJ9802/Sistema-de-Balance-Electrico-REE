import { describe, it, expect } from 'vitest';
import { formatChartData } from './chart-transformer';
import { EnergyRecord } from '../interfaces';

describe('chart-transformer', () => {
  it('should format records into chart data grouped by date', () => {
    const mockRecords: Partial<EnergyRecord>[] = [
      {
        datetime: '2026-04-27T00:00:00.000Z',
        value: 100,
        category: { title: 'Eólica' } as any,
      },
      {
        datetime: '2026-04-27T00:00:00.000Z',
        value: 50,
        category: { title: 'Solar' } as any,
      },
      {
        datetime: '2026-04-28T00:00:00.000Z',
        value: 200,
        category: { title: 'Eólica' } as any,
      },
    ];

    const result = formatChartData(mockRecords as EnergyRecord[]);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('27/04/2026');
    expect(result[0]['Eólica']).toBe(100);
    expect(result[0]['Solar']).toBe(50);
    expect(result[1].name).toBe('28/04/2026');
    expect(result[1]['Eólica']).toBe(200);
  });

  it('should return empty array when no records provided', () => {
    const result = formatChartData([]);
    expect(result).toEqual([]);
  });
});
