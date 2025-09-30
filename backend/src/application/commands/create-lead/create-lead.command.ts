export class CreateLeadCommand {
  constructor(
    public readonly fullName: string,
    public readonly phoneNumber: string,
    public readonly emailAddress: string,
    public readonly city: string,
    public readonly comment?: string,
  ) {}
}

