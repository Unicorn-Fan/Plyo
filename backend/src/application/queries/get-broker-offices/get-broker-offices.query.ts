export class GetBrokerOfficesQuery {
  constructor(
    public readonly city?: string,
    public readonly latitude?: number,
    public readonly longitude?: number,
    public readonly limit?: number,
  ) {}
}

