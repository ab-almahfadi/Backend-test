import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import ResponsePresenter from 'src/presenters/response.presenter';
import { AuthModule } from 'src/auth/auth.module';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController, ResponsePresenter],
      imports: [UsersModule, AuthModule],
      providers: [ResponsePresenter],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
