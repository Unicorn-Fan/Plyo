import axios from 'axios';

export interface NorwegianCity {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export class NorwegianCitiesService {
  private readonly geoNamesApiUrl = 'http://api.geonames.org';
  private readonly username = process.env.GEONAMES_USERNAME || 'JanAdolf'; 
  
  async getNorwegianCities(): Promise<NorwegianCity[]> {
    try {
      const response = await axios.get(`${this.geoNamesApiUrl}/searchJSON`, {
        params: {
          country: 'NO',
          featureClass: 'P',
          maxRows: 100,
          username: this.username,
          style: 'FULL'
        }
      });

      const cities = response.data.geonames || [];
      
      return cities.map((city: any) => ({
        name: city.name,
        region: city.adminName1 || 'Unknown',
        latitude: parseFloat(city.lat),
        longitude: parseFloat(city.lng)
      }));
    } catch (error) {
      console.error('Error fetching Norwegian cities from GeoNames:', error);
      
      if (error.response?.data?.status?.value === 18) {
        console.warn('GeoNames API rate limit exceeded. Using fallback data.');
        console.warn('To fix this, get a free GeoNames username at: https://www.geonames.org/login');
      }
      
      return this.getFallbackCities();
    }
  }

  async searchCities(query: string): Promise<NorwegianCity[]> {
    try {
      const response = await axios.get(`${this.geoNamesApiUrl}/searchJSON`, {
        params: {
          country: 'NO',
          q: query,
          featureClass: 'P',
          maxRows: 20,
          username: this.username,
          style: 'FULL'
        }
      });

      const cities = response.data.geonames || [];
      
      return cities.map((city: any) => ({
        name: city.name,
        region: city.adminName1 || 'Unknown',
        latitude: parseFloat(city.lat),
        longitude: parseFloat(city.lng)
      }));
    } catch (error) {
      console.error('Error searching Norwegian cities:', error);
      
      if (error.response?.data?.status?.value === 18) {
        console.warn('GeoNames API rate limit exceeded. Using fallback search.');
        console.warn('To fix this, get a free GeoNames username at: https://www.geonames.org/login');
      }
      
      const allCities = this.getFallbackCities();
      return allCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.region.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  private getFallbackCities(): NorwegianCity[] {
    return [
      {
        name: 'Oslo',
        region: 'Oslo',
        latitude: 59.9139,
        longitude: 10.7522
      },
      {
        name: 'Bergen',
        region: 'Vestland',
        latitude: 60.3913,
        longitude: 5.3221
      },
      {
        name: 'Trondheim',
        region: 'Trøndelag',
        latitude: 63.4305,
        longitude: 10.3951
      },
      {
        name: 'Stavanger',
        region: 'Rogaland',
        latitude: 58.9700,
        longitude: 5.7331
      },
      {
        name: 'Bærum',
        region: 'Viken',
        latitude: 59.9333,
        longitude: 10.5000
      },
      {
        name: 'Kristiansand',
        region: 'Agder',
        latitude: 58.1467,
        longitude: 7.9956
      },
      {
        name: 'Fredrikstad',
        region: 'Viken',
        latitude: 59.2167,
        longitude: 10.9500
      },
      {
        name: 'Tromsø',
        region: 'Troms og Finnmark',
        latitude: 69.6492,
        longitude: 18.9553,
      },
      {
        name: 'Drammen',
        region: 'Viken',
        latitude: 59.7439,
        longitude: 10.2044,
      },
      {
        name: 'Skien',
        region: 'Vestfold og Telemark',
        latitude: 59.2000,
        longitude: 9.6000,
      },
      {
        name: 'Ålesund',
        region: 'Møre og Romsdal',
        latitude: 62.4722,
        longitude: 6.1549,
      },
      {
        name: 'Tønsberg',
        region: 'Vestfold og Telemark',
        latitude: 59.2667,
        longitude: 10.4167,
      },
      {
        name: 'Moss',
        region: 'Viken',
        latitude: 59.4333,
        longitude: 10.6667,
      },
      {
        name: 'Haugesund',
        region: 'Rogaland',
        latitude: 59.4167,
        longitude: 5.2667,
      },
      {
        name: 'Sandefjord',
        region: 'Vestfold og Telemark',
        latitude: 59.1333,
        longitude: 10.2167,
      },
      {
        name: 'Arendal',
        region: 'Agder',
        latitude: 58.4667,
        longitude: 8.7667,
      },
      {
        name: 'Bodø',
        region: 'Nordland',
        latitude: 67.2833,
        longitude: 14.3833,
      },
      {
        name: 'Tromsø',
        region: 'Troms og Finnmark',
        latitude: 69.6492,
        longitude: 18.9553,
      },
      {
        name: 'Hamar',
        region: 'Innlandet',
        latitude: 60.7947,
        longitude: 11.0681,
      },
      {
        name: 'Larvik',
        region: 'Vestfold og Telemark',
        latitude: 59.0500,
        longitude: 10.0333,
      }
    ];
  }
}
