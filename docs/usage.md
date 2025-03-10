# Usage

```typescript
// Import specific functions
import { countries, country } from 'ts-countries'

// Or import classes directly
import { Country, CountryCollection, CountryLoader } from 'ts-countries'
```

### Working with Single Countries

The simplest way to work with a single country is using the `country()` function:

```typescript
import { country } from 'ts-countries'

// Get a country by its ISO 3166-1 alpha-2 code
const usa = country('US')

// Access basic information
console.log(usa.getName()) // "United States"
console.log(usa.getOfficialName()) // "United States of America"
console.log(usa.getCapital()) // "Washington, D.C."
```

### Working with Multiple Countries

To work with multiple countries, use the `countries()` function:

```typescript
import { countries } from 'ts-countries'

// Get all countries in short format
const allCountries = countries()

// Get detailed country information
const detailedCountries = countries(true) // longlist format

// Get hydrated Country instances
const countryInstances = countries(false, true)
```

### Using the CountryCollection

The `CountryCollection` class provides powerful filtering capabilities:

```typescript
import { CountryCollection } from 'ts-countries'

const collection = new CountryCollection(countries(false, true))

// Filter by region
const europeanCountries = collection.where('geo.region', 'Europe')

// Filter by currency
const euroCountries = collection.where('currency.EUR')

// Chain multiple filters
const largeEuropeanCountries = collection
  .where('geo.region', 'Europe')
  .where('geo.area', '>', 100000)
```

## Advanced Usage

### Custom Country Instantiation

You can create custom country instances with specific data:

```typescript
import { Country } from 'ts-countries'

const customCountry = new Country({
  name: {
    common: 'Custom Country',
    official: 'Republic of Custom',
    native: {
      eng: {
        common: 'Custom Country',
        official: 'Republic of Custom'
      }
    }
  },
  iso_3166_1_alpha2: 'CC',
  iso_3166_1_alpha3: 'CCC',
  iso_3166_1_numeric: '999',
  geo: {
    region: 'Custom Region',
    subregion: 'Custom Subregion',
    continent: ['Custom Continent'],
    region_code: 'CR'
  }
})
```

### Working with Translations

Access and work with country translations:

```typescript
const france = country('FR')

// Get all translations
const translations = france.getTranslations()

// Get specific translation
const germanTranslation = france.getTranslation('deu')
console.log(germanTranslation.common) // "Frankreich"
console.log(germanTranslation.official) // "Französische Republik"
```

### Accessing Geographic Data

Get detailed geographic information:

```typescript
const russia = country('RU')

// Basic geographic data
console.log(russia.getRegion()) // "Europe"
console.log(russia.getSubregion()) // "Eastern Europe"

// Detailed coordinates
console.log(russia.getLatitude())
console.log(russia.getLongitude())

// Area and borders
console.log(russia.getArea())
console.log(russia.getBorders())

// Get GeoJSON data
const geoJson = russia.getGeoJson()
```

### Working with Administrative Divisions

Access country divisions and subdivisions:

```typescript
const canada = country('CA')

// Get all divisions
const divisions = canada.getDivisions()

// Get specific division
const quebec = canada.getDivision('QC')
```

### Error Handling

Implement proper error handling in your applications:

```typescript
try {
  const country = country('XX')
}
catch (error) {
  if (error.message.includes('Country code')) {
    console.error('Invalid country code provided')
  }
  else {
    console.error('An unexpected error occurred:', error)
  }
}
```

## Best Practices

1. **Cache Results**: The library implements internal caching, but consider caching results in your application for frequently accessed data.

```typescript
// Example of application-level caching
const countryCache = new Map()

function getCountryWithCache(code: string) {
  if (!countryCache.has(code)) {
    countryCache.set(code, country(code))
  }
  return countryCache.get(code)
}
```

2. **Type Safety**: Utilize TypeScript's type system for better code reliability:

```typescript
import type { CountryAttributes } from 'ts-countries'

function processCountry(data: CountryAttributes) {
  // Your code here
}
```

3. **Resource Management**: When working with large datasets, consider using the hydration parameter judiciously:

```typescript
// Only hydrate when needed
const rawCountries = countries(false, false) // No hydration
const hydratedCountries = countries(false, true) // With hydration
```

4. **Error Boundaries**: Implement proper error boundaries in your application:

```typescript
function safeGetCountry(code: string) {
  try {
    return country(code)
  }
  catch (error) {
    console.error(`Failed to load country ${code}:`, error)
    return null
  }
}
```

## Performance Tips

1. Use the short format when you don't need detailed information:

```typescript
const countries = countries(false) // short format
```

2. Only hydrate country instances when needed:

```typescript
const rawData = country('US', false) // no hydration
```

3. Use specific getters instead of accessing all data:

```typescript
// Better
const name = country.getName()

// Less efficient
const data = country.getAttributes()
const name = data.name.common
```

4. Implement your own caching for frequently accessed data:

```typescript
const cache = new Map()
function getCachedCountryName(code: string) {
  if (!cache.has(code)) {
    const c = country(code)
    cache.set(code, c.getName())
  }
  return cache.get(code)
}
```
