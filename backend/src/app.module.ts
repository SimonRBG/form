import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { FormsModule } from "./forms/forms.module";
import { FieldsModule } from "./fields/fields.module";
import { AiModule } from "./ai/ai.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    FormsModule,
    FieldsModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
