import { UuidValueObject } from '@/shared/value-objects/uuid.vo';

export class BrokerOfficeId extends UuidValueObject {
  constructor(value?: string) {
    super(value);
  }
}

