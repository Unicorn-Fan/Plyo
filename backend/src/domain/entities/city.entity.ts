import { CityId } from '../value-objects/city-id.vo';
import { Location } from '../value-objects/location.vo';

export class City {
  constructor(
    private readonly _id: CityId,
    private readonly _name: string,
    private readonly _region: string,
    private readonly _location: Location,
    private readonly _createdAt: Date = new Date(),
    private readonly _updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length < 2) {
      throw new Error('City name must be at least 2 characters long');
    }

    if (!this._region || this._region.trim().length < 2) {
      throw new Error('Region must be at least 2 characters long');
    }
  }

  public get id(): CityId {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get region(): string {
    return this._region;
  }

  public get location(): Location {
    return this._location;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public calculateDistanceFrom(otherLocation: Location): number | null {
    return this._location.calculateDistance(otherLocation);
  }

  public matchesSearchQuery(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim();
    return (
      this._name.toLowerCase().includes(normalizedQuery) ||
      this._region.toLowerCase().includes(normalizedQuery)
    );
  }
}

