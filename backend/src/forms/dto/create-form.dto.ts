import { IsString, IsNotEmpty, MaxLength, Matches } from "class-validator";

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase with hyphens only (e.g., my-form-name)",
  })
  slug: string;
}
