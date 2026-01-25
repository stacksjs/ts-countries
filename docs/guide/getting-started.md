# Getting Started

This guide will help you get started with ts-countries, a comprehensive TypeScript library for country data with a simple and intuitive API.

## Installation

Install ts-countries using your preferred package manager:

```bash
# npm
npm install ts-countries

# yarn
yarn add ts-countries

# pnpm
pnpm add ts-countries

# bun
bun add ts-countries
```

## Basic Usage

### Getting a Single Country

```typescript
import { country } from 'ts-countries'

// Get country by ISO alpha-2 code
const usa = country('US')

console.log(usa.getName())           // "United States"
console.log(usa.getOfficialName())   // "United States of America"
console.log(usa.getIsoAlpha2())      // "US"
console.log(usa.getIsoAlpha3())      // "USA"
console.log(usa.getCapital())        // "Washington, D.C."
```

### Getting All Countries

```typescript
import { countries } from 'ts-countries'

// Get all countries (short list)
const allCountries = countries()

// Get all countries (detailed list)
const detailedList = countries(true)

// Get hydrated Country instances
const countryInstances = countries(false, true)

console.log(`Total countries: ${allCountries.length}`)
```

## Country Properties

### Basic Information

```typescript
const usa = country('US')

// Names
usa.getName()           // "United States"
usa.getOfficialName()   // "United States of America"
usa.getNativeName()     // Native name
usa.getNativeOfficialName()  // Native official name
usa.getDemonym()        // "American"

// Codes
usa.getIsoAlpha2()      // "US"
usa.getIsoAlpha3()      // "USA"
usa.getIsoNumeric()     // "840"
```

### Geographic Information

```typescript
const usa = country('US')

// Location
usa.getCapital()        // "Washington, D.C."
usa.getRegion()         // "Americas"
usa.getSubregion()      // "Northern America"
usa.getContinent()      // ["North America"]

// Coordinates
usa.getLatitude()       // "38.883333"
usa.getLongitude()      // "-77.0"
usa.getArea()           // 9372610 (km^2)

// Borders
usa.getBorders()        // ["CAN", "MEX"]
usa.isLandlocked()      // false

// Geographic data
usa.getGeodata()        // Full geographic object
usa.getGeoJson()        // GeoJSON data for the country
```

### Languages and Currency

```typescript
const usa = country('US')

// Languages
usa.getLanguages()      // { eng: "English" }
usa.getLanguage()       // "English"
usa.getLanguage('eng')  // "English"

// Currency
usa.getCurrencies()     // { USD: { name: "United States dollar", symbol: "$" } }
usa.getCurrency()       // { name: "United States dollar", symbol: "$" }
usa.getCurrency('USD')  // { name: "United States dollar", symbol: "$" }
```

### Contact Information

```typescript
const usa = country('US')

// Phone
usa.getCallingCode()    // "+1"
usa.getCallingCodes()   // ["+1"]
usa.getNationalPrefix() // "1"

// Internet
usa.getTld()            // ".us"
usa.getTlds()           // [".us"]
```

### Translations

```typescript
const usa = country('US')

// Get all translations
const translations = usa.getTranslations()
// { ara: { common: "...", official: "..." }, fra: { ... }, ... }

// Get specific translation
const french = usa.getTranslation('fra')
// { common: "Etats-Unis", official: "Les Etats-Unis d'Amerique" }
```

### Additional Data

```typescript
const usa = country('US')

// Flag and emoji
usa.getFlag()           // SVG flag content
usa.getEmoji()          // "US" (flag emoji code)

// Administrative divisions
usa.getDivisions()      // All states/regions
usa.getDivision('CA')   // California data

// Postal code support
usa.usesPostalCode()    // true

// Independence status
usa.isIndependent()     // "Yes"
```

## Working with the Country Class

### Direct Instantiation

```typescript
import { Country, CountryLoader } from 'ts-countries'

// Load country data
const countryData = CountryLoader.country('DE')
const germany = new Country(countryData)

console.log(germany.getName())  // "Germany"
console.log(germany.getCapital())  // "Berlin"
```

### Accessing Raw Attributes

```typescript
const usa = country('US')

// Get all attributes
const attrs = usa.getAttributes()

// Get specific attribute using dot notation
const capital = usa.get('capital')
const region = usa.get('geo.region')
const currencyUSD = usa.get('currency.USD')
```

### Setting Attributes

```typescript
const usa = country('US')

// Set a custom attribute
usa.set('custom.field', 'custom value')

// Replace all attributes
usa.setAttributes(newAttributes)
```

## Error Handling

```typescript
import { country, CountryLoaderException } from 'ts-countries'

try {
  const invalid = country('XX')  // Invalid country code
} catch (error) {
  if (error instanceof CountryLoaderException) {
    console.log('Country not found')
  }
}
```

## TypeScript Types

```typescript
import type {
  CountryAttributes,
  CountryDivision,
  CountryList,
  Translation
} from 'ts-countries'

// Use types for type safety
const handleCountry = (attrs: CountryAttributes) => {
  // Type-safe access
  console.log(attrs.name.common)
}
```

## Common Patterns

### Building a Country Selector

```typescript
import { countries } from 'ts-countries'

// Get list for dropdown
const countryList = countries(false, true).map(c => ({
  code: c.getIsoAlpha2(),
  name: c.getName(),
  flag: c.getEmoji()
}))

// Sort alphabetically
countryList.sort((a, b) => a.name.localeCompare(b.name))
```

### Getting Countries by Region

```typescript
import { countries } from 'ts-countries'

const allCountries = countries(false, true)

// Filter by region
const european = allCountries.filter(c =>
  c.getRegion() === 'Europe'
)

// Filter by currency
const euroCountries = allCountries.filter(c => {
  const currencies = c.getCurrencies()
  return 'EUR' in currencies
})
```

### Phone Number Formatting

```typescript
import { country } from 'ts-countries'

function formatPhoneForCountry(phone: string, countryCode: string) {
  const c = country(countryCode)
  const callingCode = c.getCallingCode()
  return `${callingCode} ${phone}`
}

console.log(formatPhoneForCountry('5551234567', 'US'))
// "+1 5551234567"
```

## Next Steps

- Explore the full [API Reference](/guide/api)
