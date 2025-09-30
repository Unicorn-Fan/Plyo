import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateLeadCommand } from './create-lead.command';
import { LeadId } from '@/domain/value-objects/lead-id.vo';
import { ContactInfo } from '@/domain/value-objects/contact-info.vo';
import { Location } from '@/domain/value-objects/location.vo';
import { Comment } from '@/domain/value-objects/comment.vo';
import { Lead } from '@/domain/entities/lead.entity';
import { LeadRepositoryInterface } from '@/domain/repositories/lead.repository.interface';
import { CityRepositoryInterface } from '@/domain/repositories/city.repository.interface';

@CommandHandler(CreateLeadCommand)
export class CreateLeadHandler implements ICommandHandler<CreateLeadCommand> {
  constructor(
    @Inject('LeadRepositoryInterface')
    private readonly leadRepository: LeadRepositoryInterface,
    @Inject('CityRepositoryInterface')
    private readonly cityRepository: CityRepositoryInterface,
  ) {}

  async execute(command: CreateLeadCommand): Promise<string> {
    const cityName = command.city.split(',')[0].trim();
    
    const city = await this.cityRepository.findByName(cityName);
    if (!city) {
      throw new Error(`City "${cityName}" not found`);
    }

    const leadId = new LeadId();
    const contactInfo = new ContactInfo(
      command.fullName,
      command.phoneNumber,
      command.emailAddress,
    );
    const location = new Location(
      cityName,
      city.location.latitude,
      city.location.longitude,
    );
    const comment = new Comment(command.comment || '');

    const lead = new Lead(
      leadId,
      contactInfo,
      location,
      comment,
    );

    await this.leadRepository.save(lead);

    return leadId.value;
  }
}
