import { Test, TestingModule } from '@nestjs/testing';
import { GeoGateway } from './geo.gateway';
import { GeoService } from './geo.service';

describe('GeoGateway', () => {
  let gateway: GeoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoGateway, GeoService],
    }).compile();

    gateway = module.get<GeoGateway>(GeoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
