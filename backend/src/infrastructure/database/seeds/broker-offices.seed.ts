import { DataSource } from 'typeorm';
import { BrokerOfficeEntity } from '../entities/broker-office.entity';

export async function seedBrokerOffices(dataSource: DataSource) {
  const brokerOfficeRepository = dataSource.getRepository(BrokerOfficeEntity);

  const brokerOffices = [
    {
      name: 'Oslo Eiendomsmegler AS',
      address: 'Karl Johans gate 1, 0154 Oslo',
      phoneNumber: '+47 22 00 00 01',
      emailAddress: 'oslo@eiendomsmegler.no',
      city: 'oslo',
      latitude: 59.9139,
      longitude: 10.7522,
    },
    {
      name: 'Oslo Sentrum Meglerkontor',
      address: 'Stortingsgata 15, 0161 Oslo',
      phoneNumber: '+47 22 00 00 02',
      emailAddress: 'sentrum@oslomegler.no',
      city: 'oslo',
      latitude: 59.9142,
      longitude: 10.7422,
    },
    {
      name: 'Oslo Vest Eiendomsmeglere',
      address: 'Frognerveien 20, 0255 Oslo',
      phoneNumber: '+47 22 00 00 03',
      emailAddress: 'vest@oslomegler.no',
      city: 'oslo',
      latitude: 59.9291,
      longitude: 10.7065,
    },

    {
      name: 'Bergen Eiendomsmegler',
      address: 'Bryggen 5, 5003 Bergen',
      phoneNumber: '+47 55 00 00 01',
      emailAddress: 'bergen@eiendomsmegler.no',
      city: 'bergen',
      latitude: 60.3913,
      longitude: 5.3221,
    },
    {
      name: 'Bergen Sentrum Meglerkontor',
      address: 'Torgalmenningen 8, 5014 Bergen',
      phoneNumber: '+47 55 00 00 02',
      emailAddress: 'sentrum@bergenmegler.no',
      city: 'bergen',
      latitude: 60.3929,
      longitude: 5.3239,
    },

    {
      name: 'Trondheim Eiendomsmegler AS',
      address: 'Munkegata 25, 7030 Trondheim',
      phoneNumber: '+47 73 00 00 01',
      emailAddress: 'trondheim@eiendomsmegler.no',
      city: 'trondheim',
      latitude: 63.4305,
      longitude: 10.3951,
    },
    {
      name: 'Trondheim Sentrum Meglerkontor',
      address: 'Nordre gate 1, 7011 Trondheim',
      phoneNumber: '+47 73 00 00 02',
      emailAddress: 'sentrum@trondheimmegler.no',
      city: 'trondheim',
      latitude: 63.4339,
      longitude: 10.4034,
    },

    {
      name: 'Stavanger Eiendomsmeglere',
      address: 'Olav Vs gate 3, 4005 Stavanger',
      phoneNumber: '+47 51 00 00 01',
      emailAddress: 'stavanger@eiendomsmegler.no',
      city: 'stavanger',
      latitude: 58.9699,
      longitude: 5.7331,
    },
    {
      name: 'Stavanger Sentrum Meglerkontor',
      address: 'Kirkegata 15, 4005 Stavanger',
      phoneNumber: '+47 51 00 00 02',
      emailAddress: 'sentrum@stavangermegler.no',
      city: 'stavanger',
      latitude: 58.9708,
      longitude: 5.7319,
    },

    {
      name: 'Kristiansand Eiendomsmegler AS',
      address: 'Markens gate 10, 4612 Kristiansand',
      phoneNumber: '+47 38 00 00 01',
      emailAddress: 'kristiansand@eiendomsmegler.no',
      city: 'kristiansand',
      latitude: 58.1467,
      longitude: 7.9956,
    },

    {
      name: 'Tromsø Eiendomsmeglere',
      address: 'Storgata 64, 9008 Tromsø',
      phoneNumber: '+47 77 00 00 01',
      emailAddress: 'tromso@eiendomsmegler.no',
      city: 'tromsø',
      latitude: 69.6492,
      longitude: 18.9553,
    },

    {
      name: 'Drammen Eiendomsmegler',
      address: 'Bragernes Torg 1, 3017 Drammen',
      phoneNumber: '+47 32 00 00 01',
      emailAddress: 'drammen@eiendomsmegler.no',
      city: 'drammen',
      latitude: 59.7441,
      longitude: 10.2044,
    },

    {
      name: 'Ålesund Eiendomsmeglere',
      address: 'Keiser Wilhelms gate 8, 6002 Ålesund',
      phoneNumber: '+47 70 00 00 01',
      emailAddress: 'alesund@eiendomsmegler.no',
      city: 'ålesund',
      latitude: 62.4722,
      longitude: 6.1549,
    },

    {
      name: 'Bodø Eiendomsmegler AS',
      address: 'Storgata 1, 8001 Bodø',
      phoneNumber: '+47 75 00 00 01',
      emailAddress: 'bodo@eiendomsmegler.no',
      city: 'bodø',
      latitude: 67.2826,
      longitude: 14.3751,
    },
  ];

  for (const officeData of brokerOffices) {
    const existingOffice = await brokerOfficeRepository.findOne({
      where: { name: officeData.name }
    });

    if (!existingOffice) {
      const office = brokerOfficeRepository.create({
        name: officeData.name,
        address: officeData.address,
        phoneNumber: officeData.phoneNumber,
        emailAddress: officeData.emailAddress,
        city: officeData.city,
        latitude: officeData.latitude,
        longitude: officeData.longitude,
        isActive: true,
      });

      await brokerOfficeRepository.save(office);
      console.log(`Seeded broker office: ${officeData.name}`);
    }
  }

  console.log('Broker offices seeding completed');
}

