import { randomUUID } from 'crypto';

export abstract class UuidValueObject {
  protected readonly _value: string;

  constructor(value?: string) {
    this._value = value || randomUUID();
    this.validate();
  }

  private validate(): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(this._value)) {
      throw new Error('Invalid UUID format');
    }
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: UuidValueObject): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
