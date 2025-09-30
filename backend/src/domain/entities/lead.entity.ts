import { LeadId } from '../value-objects/lead-id.vo';
import { ContactInfo } from '../value-objects/contact-info.vo';
import { Location } from '../value-objects/location.vo';
import { Comment } from '../value-objects/comment.vo';
import { LeadStatus } from '../enums/lead-status.enum';
import { BrokerOfficeId } from '../value-objects/broker-office-id.vo';

export class Lead {
  constructor(
    private readonly _id: LeadId,
    private readonly _contactInfo: ContactInfo,
    private readonly _location: Location,
    private readonly _comment: Comment,
    private _status: LeadStatus = LeadStatus.PENDING,
    private _assignedBrokerId?: BrokerOfficeId,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  public get id(): LeadId {
    return this._id;
  }

  public get contactInfo(): ContactInfo {
    return this._contactInfo;
  }

  public get location(): Location {
    return this._location;
  }

  public get comment(): Comment {
    return this._comment;
  }

  public get status(): LeadStatus {
    return this._status;
  }

  public get assignedBrokerId(): BrokerOfficeId | undefined {
    return this._assignedBrokerId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public assignToBroker(brokerId: BrokerOfficeId): void {
    if (this._status !== LeadStatus.PENDING) {
      throw new Error('Only pending leads can be assigned to brokers');
    }

    this._assignedBrokerId = brokerId;
    this._status = LeadStatus.ASSIGNED;
    this._updatedAt = new Date();
  }

  public markAsContacted(): void {
    if (this._status !== LeadStatus.ASSIGNED) {
      throw new Error('Only assigned leads can be marked as contacted');
    }

    this._status = LeadStatus.CONTACTED;
    this._updatedAt = new Date();
  }

  public close(): void {
    if (this._status === LeadStatus.CLOSED) {
      throw new Error('Lead is already closed');
    }

    this._status = LeadStatus.CLOSED;
    this._updatedAt = new Date();
  }

  public isAssigned(): boolean {
    return this._status === LeadStatus.ASSIGNED;
  }

  public isPending(): boolean {
    return this._status === LeadStatus.PENDING;
  }

  public isContacted(): boolean {
    return this._status === LeadStatus.CONTACTED;
  }

  public isClosed(): boolean {
    return this._status === LeadStatus.CLOSED;
  }
}

