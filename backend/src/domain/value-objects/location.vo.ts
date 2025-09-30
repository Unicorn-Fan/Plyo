export class Location {
  constructor(
    public readonly city: string,
    public readonly latitude?: number,
    public readonly longitude?: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.city || this.city.trim().length < 2) {
      throw new Error('City name must be at least 2 characters long');
    }

    if (this.latitude !== undefined && (this.latitude < -90 || this.latitude > 90)) {
      throw new Error('Latitude must be between -90 and 90');
    }

    if (this.longitude !== undefined && (this.longitude < -180 || this.longitude > 180)) {
      throw new Error('Longitude must be between -180 and 180');
    }
  }

  public calculateDistance(other: Location): number | null {
    if (!this.latitude || !this.longitude || !other.latitude || !other.longitude) {
      return null;
    }

    const R = 6371;
    const dLat = this.toRadians(other.latitude - this.latitude);
    const dLon = this.toRadians(other.longitude - this.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(other.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public equals(other: Location): boolean {
    return (
      this.city === other.city &&
      this.latitude === other.latitude &&
      this.longitude === other.longitude
    );
  }
}

