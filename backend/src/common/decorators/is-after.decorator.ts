import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAfterOrEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0] as string;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) {
            return true;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const startDate = new Date(relatedValue);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const endDate = new Date(value);

          return endDate.getTime() >= startDate.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0] as string;
          return `${args.property} no puede ser anterior a ${relatedPropertyName}`;
        },
      },
    });
  };
}
