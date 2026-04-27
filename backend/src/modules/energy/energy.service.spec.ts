import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnergyCategory, EnergyRecord } from 'modules/energy/entities';
import { of, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { EnergyService } from './energy.service';

describe('EnergyService', () => {
  let service: EnergyService;
  let httpService: HttpService;
  let categoryRepo: Repository<EnergyCategory>;
  let recordRepo: Repository<EnergyRecord>;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockCategoryRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRecordRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnergyService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: getRepositoryToken(EnergyCategory),
          useValue: mockCategoryRepo,
        },
        {
          provide: getRepositoryToken(EnergyRecord),
          useValue: mockRecordRepo,
        },
      ],
    }).compile();

    service = module.get<EnergyService>(EnergyService);
    httpService = module.get<HttpService>(HttpService);
    categoryRepo = module.get<Repository<EnergyCategory>>(
      getRepositoryToken(EnergyCategory),
    );
    recordRepo = module.get<Repository<EnergyRecord>>(
      getRepositoryToken(EnergyRecord),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAndStore', () => {
    const startDate = '2026-04-27T00:00';
    const endDate = '2026-04-27T23:59';
    const mockREEData = {
      included: [
        {
          type: 'Generación',
          attributes: {
            content: [
              {
                id: '1',
                attributes: {
                  title: 'Eólica',
                  color: '#ffffff',
                  values: [
                    {
                      value: 100,
                      percentage: 0.5,
                      datetime: '2026-04-27T00:00:00.000+02:00',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };

    it('should fetch data from REE and store it in DB', async () => {
      mockHttpService.get.mockReturnValue(of({ data: mockREEData }));
      mockCategoryRepo.save.mockResolvedValue({ id: '1', title: 'Eólica' });
      mockRecordRepo.findOne.mockResolvedValue(null);
      mockRecordRepo.save.mockResolvedValue({});

      const result = await service.fetchAndStore(startDate, endDate);

      expect(httpService.get).toHaveBeenCalled();
      expect(categoryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', title: 'Eólica' }),
      );
      expect(recordRepo.save).toHaveBeenCalled();
      expect(result.message).toBe('Ingesta de datos procesada correctamente');
    });

    it('should throw BadGatewayException if REE API fails', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('API Down')),
      );

      await expect(service.fetchAndStore(startDate, endDate)).rejects.toThrow(
        BadGatewayException,
      );
    });

    it('should throw InternalServerErrorException if DB fails', async () => {
      mockHttpService.get.mockReturnValue(of({ data: mockREEData }));
      mockCategoryRepo.save.mockRejectedValue(new Error('DB Error'));

      await expect(service.fetchAndStore(startDate, endDate)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getFilteredBalance', () => {
    it('should return filtered balance data', async () => {
      const mockCategories = [{ id: '1', title: 'Eólica' }];
      const mockRecords = [
        {
          id: 1,
          value: 100,
          datetime: new Date(),
          category: { id: '1' },
        },
      ];

      mockCategoryRepo.find.mockResolvedValue(mockCategories);
      mockRecordRepo.find.mockResolvedValue(mockRecords);

      const result = await service.getFilteredBalance(
        '2026-04-01T00:00',
        '2026-04-30T23:59',
      );

      expect(result.data.categories).toBeDefined();
      expect(result.count).toBe(1);
    });

    it('should throw InternalServerErrorException if query fails', async () => {
      mockCategoryRepo.find.mockRejectedValue(new Error('DB Error'));

      await expect(
        service.getFilteredBalance('2026-04-01', '2026-04-30'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
