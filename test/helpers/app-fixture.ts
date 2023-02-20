import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule } from "../../src/app.module";
import { default as dbConfig } from '../config/db';

export const testingAppModuleFactory = (): Promise<TestingModule> => {
    return Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [dbConfig],
          }),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              type: 'mysql',
              host: configService.get('db.host'),
              port: configService.get('db.port'),
              username: configService.get('db.username'),
              password: configService.get('db.password'),
              database: configService.get('db.name'),
              autoLoadEntities: true,
              synchronize: true,
            }),
            inject: [ConfigService],
          }),
          AppModule,
        ],
      }).compile()
}
