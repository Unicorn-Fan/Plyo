import { BrokerOfficeId } from '../value-objects/broker-office-id.vo';
import { Location } from '../value-objects/location.vo';
import { ContactInfo } from '../value-objects/contact-info.vo';

export class BrokerOffice {
  constructor(
    private readonly _id: BrokerOfficeId,
    private readonly _name: string,
    private readonly _address: string,
    private readonly _contactInfo: ContactInfo,
    private readonly _location: Location,
    private readonly _isActive: boolean = true,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length < 2) {
      throw new Error('Broker office name must be at least 2 characters long');
    }

    if (!this._address || this._address.trim().length < 5) {
      throw new Error('Broker office address must be at least 5 characters long');
    }
  }

  public get id(): BrokerOfficeId {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get address(): string {
    return this._address;
  }

  public get contactInfo(): ContactInfo {
    return this._contactInfo;
  }

  public get location(): Location {
    return this._location;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public isInCity(city: string): boolean {
    return this._location.city.toLowerCase() === city.toLowerCase();
  }

  public calculateDistanceFrom(otherLocation: Location): number | null {
    return this._location.calculateDistance(otherLocation);
  }

  public deactivate(): BrokerOffice {
    return new BrokerOffice(
      this._id,
      this._name,
      this._address,
      this._contactInfo,
      this._location,
      false,
      this._createdAt,
      new Date(),
    );
  }
}

