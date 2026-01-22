import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FieldsService } from "./fields.service";
import { FieldsController } from "./fields.controller";
import { Field } from "./entities/field.entity";
import { FormsModule } from "../forms/forms.module";

@Module({
  imports: [TypeOrmModule.forFeature([Field]), forwardRef(() => FormsModule)],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService],
})
export class FieldsModule {}
