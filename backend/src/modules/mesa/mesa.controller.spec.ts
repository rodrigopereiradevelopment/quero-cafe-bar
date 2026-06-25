import { Test, TestingModule } from '@nestjs/testing';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';

describe('MesaController', () => {
  let controller: MesaController;
  let service: MesaService;

  const mockMesa = {
    id: 1,
    qtd_cadeiras: 4,
    status: true,
    numero: 1,
    localizacao: 'salao',
    posicao_x: 100,
    posicao_y: 200,
    reservado_por: null,
    reservado_em: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesaController],
      providers: [
        {
          provide: MesaService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockMesa),
            create: jest.fn().mockResolvedValue(mockMesa),
            update: jest.fn().mockResolvedValue({ ...mockMesa, qtd_cadeiras: 6 }),
            remove: jest.fn().mockResolvedValue({ id: 1 }),
            findAll: jest.fn().mockResolvedValue({ data: [], total: 0, skip: 0, take: 20 }),
            findAllForMapa: jest.fn().mockResolvedValue([]),
            reservar: jest.fn().mockResolvedValue({ ...mockMesa, reservado_por: 'Cliente' }),
            liberar: jest.fn().mockResolvedValue(mockMesa),
          },
        },
      ],
    }).compile();

    controller = module.get<MesaController>(MesaController);
    service = module.get<MesaService>(MesaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new mesa', async () => {
      const createMesaDto = {
        qtd_cadeiras: 4,
        status: true,
      };
      const result = { ...mockMesa, ...createMesaDto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createMesaDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createMesaDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated mesas', async () => {
      const result = {
        data: [mockMesa],
        total: 1,
        skip: 0,
        take: 20,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll({})).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a single mesa', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockMesa);

      expect(await controller.findOne(1)).toBe(mockMesa);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a mesa', async () => {
      const updateMesaDto = { id: 1, qtd_cadeiras: 6 };
      const result = { ...mockMesa, qtd_cadeiras: 6 };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateMesaDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updateMesaDto);
    });
  });

  describe('remove', () => {
    it('should remove a mesa', async () => {
      const result = { id: 1 };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(1)).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
