# Features Overview

ts-countries provides comprehensive country data with a simple, type-safe API.

## Core Features

### Country Lookup
Find countries by code, name, or various identifiers.
[Learn more](/features/lookup)

### Currency Data
Access currency information for each country.
[Learn more](/features/currency)

### Timezone Information
Get timezone data and UTC offsets.
[Learn more](/features/timezone)

### Language Data
Retrieve official languages and regional variants.
[Learn more](/features/languages)

## Quick Example

```typescript
import { getCountry, getAllCountries, getCountriesByCurrency } from 'ts-countries'

// Get a specific country
const usa = getCountry('US')
console.log(usa.name) // "United States"
console.log(usa.currencies) // [{ code: 'USD', name: 'US Dollar', symbol: '$' }]

// Get all countries
const all = getAllCountries()
console.log(all.length) // 249

// Find by currency
const euroCountries = getCountriesByCurrency('EUR')
```
