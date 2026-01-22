import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log(configService.get<string>("DB_HOST", "localhost"));
        console.log(configService.get<number>("DB_PORT", 5432));
        console.log(configService.get<string>("DB_USERNAME", "postgres"));
        console.log(configService.get<string>("DB_PASSWORD", "postgres"));
        console.log(
          configService.get<string>("DB_NAME", "form_administration"),
        );
        console.log(configService.get<boolean>("DB_SYNCHRONIZE", true));
        console.log(configService.get<boolean>("DB_LOGGING", false));
        return {
          type: "postgres",
          url: configService.get<string>("DATABASE_URL"),
          ssl: { rejectUnauthorized: false },
          entities: [__dirname + "/../**/*.entity{.ts,.js}"],
          synchronize: configService.get<boolean>("DB_SYNCHRONIZE", true),
          logging: configService.get<boolean>("DB_LOGGING", false),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
