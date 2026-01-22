import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormsService } from "./forms.service";
import { FormsController } from "./forms.controller";
import { Form } from "./entities/form.entity";
import { Field } from "../fields/entities/field.entity";
import { FieldsModule } from "../fields/fields.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, Field]),
    forwardRef(() => FieldsModule),
  ],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
