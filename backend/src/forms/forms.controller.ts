import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { FormsService } from "./forms.service";
import { CreateFormDto } from "./dto/create-form.dto";
import { UpdateFormDto } from "./dto/update-form.dto";
import { SyncFormDto } from "./dto/sync-form.dto";

@Controller("forms")
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.formsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formsService.update(id, updateFormDto);
  }

  @Post(":id/sync")
  @HttpCode(HttpStatus.OK)
  sync(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() syncFormDto: SyncFormDto,
  ) {
    return this.formsService.syncForm(id, syncFormDto);
  }

  @Post(":id/publish")
  @HttpCode(HttpStatus.OK)
  publish(@Param("id", ParseUUIDPipe) id: string) {
    return this.formsService.publish(id);
  }

  @Post(":id/unpublish")
  @HttpCode(HttpStatus.OK)
  unpublish(@Param("id", ParseUUIDPipe) id: string) {
    return this.formsService.unpublish(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.formsService.remove(id);
  }
}
