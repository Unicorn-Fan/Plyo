import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLeadQuery } from './get-lead.query';
import { LeadId } from '@/domain/value-objects/lead-id.vo';
import { LeadRepositoryInterface } from '@/domain/repositories/lead.repository.interface';

export interface LeadResponseDto {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  city: string;
  comment?: string;
  status: string;
  assignedBrokerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

@QueryHandler(GetLeadQuery)
export class GetLeadHandler implements IQueryHandler<GetLeadQuery> {
  constructor(
    @Inject('LeadRepositoryInterface')
    private readonly leadRepository: LeadRepositoryInterface,
  ) {}

  async execute(query: GetLeadQuery): Promise<LeadResponseDto | null> {
    const leadId = new LeadId(query.leadId);
    const lead = await this.leadRepository.findById(leadId);

    if (!lead) {
      return null;
    }

    return {
      id: lead.id.value,
      fullName: lead.contactInfo.fullName,
      phoneNumber: lead.contactInfo.phoneNumber,
      emailAddress: lead.contactInfo.emailAddress,
      city: lead.location.city,
      comment: lead.comment.isEmpty() ? undefined : lead.comment.value,
      status: lead.status,
      assignedBrokerId: lead.assignedBrokerId?.value,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }
}
