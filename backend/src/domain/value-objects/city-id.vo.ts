import { UuidValueObject } from '@/shared/value-objects/uuid.vo';

export class CityId extends UuidValueObject {
  constructor(value?: string) {
    super(value);
  }
}

