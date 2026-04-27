import { Test, TestingModule } from '@nestjs/testing';
import { EnergyController } from './energy.controller';
import { EnergyService } from './energy.service';

describe('EnergyController', () => {
  let controller: EnergyController;
  let service: EnergyService;

  const mockEnergyService = {
    getFilteredBalance: jest.fn(),
    ingestData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnergyController],
      providers: [
        {
          provide: EnergyService,
          useValue: mockEnergyService,
        },
      ],
    }).compile();

    controller = module.get<EnergyController>(EnergyController);
    service = module.get<EnergyService>(EnergyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBalance', () => {
    it('should call energyService.getFilteredBalance with correct params', async () => {
      const filterDto = {
        startDate: '2026-04-01T00:00',
        endDate: '2026-04-30T23:59',
      };
      mockEnergyService.getFilteredBalance.mockResolvedValue({
        data: [],
        count: 0,
      });

      await controller.getBalance(filterDto);

      expect(service.getFilteredBalance).toHaveBeenCalledWith(
        filterDto.startDate,
        filterDto.endDate,
      );
    });
  });

  describe('ingestData', () => {
    it('should call energyService.ingestData with correct params', async () => {
      const filterDto = {
        startDate: '2026-04-01T00:00',
        endDate: '2026-04-30T23:59',
      };
      mockEnergyService.ingestData.mockResolvedValue({ message: 'Success' });

      await controller.ingestData(filterDto);

      expect(service.ingestData).toHaveBeenCalledWith(
        filterDto.startDate,
        filterDto.endDate,
      );
    });
  });
});
