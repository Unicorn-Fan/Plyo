export class ContactInfo {
  constructor(
    private readonly _fullName: string,
    private readonly _phoneNumber: string,
    private readonly _emailAddress: string,
  ) {
    this.validate();
  }

  public get fullName(): string {
    return this._fullName;
  }

  public get phoneNumber(): string {
    return this._phoneNumber;
  }

  public get emailAddress(): string {
    return this._emailAddress;
  }

  private validate(): void {
    if (!this._fullName || this._fullName.trim().length === 0) {
      throw new Error('Full name is required');
    }

    if (!this._phoneNumber || this._phoneNumber.trim().length === 0) {
      throw new Error('Phone number is required');
    }

    if (!this._emailAddress || this._emailAddress.trim().length === 0) {
      throw new Error('Email address is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._emailAddress)) {
      throw new Error('Invalid email address format');
    }
  }
}
