export class Comment {
  constructor(private readonly _value: string) {
    this.validate();
  }

  public get value(): string {
    return this._value;
  }

  public isEmpty(): boolean {
    return !this._value || this._value.trim().length === 0;
  }

  private validate(): void {
    if (this._value && this._value.length > 1000) {
      throw new Error('Comment cannot exceed 1000 characters');
    }
  }
}
