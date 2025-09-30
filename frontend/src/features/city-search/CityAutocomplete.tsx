import React, { useEffect, useRef, useMemo } from 'react';
import { Autocomplete, AutocompleteProps, Loader } from '@mantine/core';
import { useCitySearch } from '../../hooks/useCitySearch';
import { City } from '../../types';

interface CityAutocompleteProps extends Omit<AutocompleteProps, 'data'> {
  onCitySelect?: (city: City | null) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  onCitySelect,
  value,
  onChange,
  ...props
}) => {
  const { results, isLoading, searchCities, selectCity, selectedCity, clearSelection } = useCitySearch();
  const onCitySelectRef = useRef(onCitySelect);
  
  useEffect(() => {
    onCitySelectRef.current = onCitySelect;
  }, [onCitySelect]);

  useEffect(() => {
    if (selectedCity) {
      onCitySelectRef.current?.(selectedCity);
    }
  }, [selectedCity]);

  const handleSearchChange = (newValue: string) => {
    onChange?.(newValue);
    
    if (selectedCity && newValue !== `${selectedCity.name}, ${selectedCity.region}`) {
      clearSelection();
    }
    
    searchCities(newValue);
  };

  const handleItemSelect = (item: { value: string; label: string }) => {
    const cityName = item.value.split(',')[0].trim();
    const city = results.find(c => c.name === cityName);
    if (city) {
      selectCity(city);
    }
  };

  const cityOptions = useMemo(() => 
    results.map(city => ({
      value: `${city.name}, ${city.region}`,
      label: `${city.name}, ${city.region}`
    })), [results]);

  const displayValue = value || '';


  return (
    <Autocomplete
      {...props}
      data={cityOptions}
      value={displayValue}
      onChange={handleSearchChange}
      onItemSubmit={handleItemSelect}
      placeholder="Search for a Norwegian city..."
      rightSection={isLoading ? <Loader size="xs" /> : undefined}
      nothingFound="No cities found"
      maxDropdownHeight={200}
    />
  );
};
