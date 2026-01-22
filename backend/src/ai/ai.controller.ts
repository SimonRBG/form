import { Controller, Post, Body } from "@nestjs/common";
import { AiService } from "./ai.service";
import { GenerateFormDto } from "./dto/generate-form.dto";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate-form")
  generateForm(@Body() generateFormDto: GenerateFormDto) {
    return this.aiService.generateForm(generateFormDto.description);
  }
}
