import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsUniqueOptions(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isUniqueOptions",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) return true;
          const values = value.map((opt) => opt.value);
          const uniqueValues = new Set(values);
          return values.length === uniqueValues.size;
        },
        defaultMessage(args: ValidationArguments) {
          return "Dropdown options must have unique values";
        },
      },
    });
  };
}
