import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AssignLeadCommand } from './assign-lead.command';
import { LeadId } from '@/domain/value-objects/lead-id.vo';
import { LeadRepositoryInterface } from '@/domain/repositories/lead.repository.interface';
import { LeadAssignmentService } from '@/domain/services/lead-assignment.service';

@CommandHandler(AssignLeadCommand)
export class AssignLeadHandler implements ICommandHandler<AssignLeadCommand> {
  constructor(
    @Inject('LeadRepositoryInterface')
    private readonly leadRepository: LeadRepositoryInterface,
    private readonly leadAssignmentService: LeadAssignmentService,
  ) {}

  async execute(command: AssignLeadCommand): Promise<void> {
    const leadId = new LeadId(command.leadId);
    const lead = await this.leadRepository.findById(leadId);

    if (!lead) {
      throw new Error(`Lead with ID "${command.leadId}" not found`);
    }

    await this.leadAssignmentService.assignLeadToBroker(lead, command.brokerOfficeId);
    await this.leadRepository.update(lead);
  }
}
