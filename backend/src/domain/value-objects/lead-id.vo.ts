import { UuidValueObject } from '@/shared/value-objects/uuid.vo';

export class LeadId extends UuidValueObject {
  constructor(value?: string) {
    super(value);
  }
}

