# Examples

## Basic Country Information

```typescript
import { country } from 'ts-countries'

// Get basic country information
const usa = country('US')
console.log(usa.getName()) // "United States"
console.log(usa.getOfficialName()) // "United States of America"
console.log(usa.getIsoAlpha2()) // "US"
console.log(usa.getIsoAlpha3()) // "USA"
console.log(usa.getIsoNumeric()) // "840"

// Get native names
console.log(usa.getNativeName()) // "United States"
console.log(usa.getNativeName('eng')) // "United States"
console.log(usa.getNativeNames()) // { eng: { common: "United States", official: "United States of America" } }
```

## Geographic Information

```typescript
import { country } from 'ts-countries'

const france = country('FR')

// Basic geographic data
console.log(france.getRegion()) // "Europe"
console.log(france.getSubregion()) // "Western Europe"
console.log(france.getContinent()) // ["Europe"]
console.log(france.getCapital()) // "Paris"

// Detailed geographic information
console.log(france.getLatitude()) // "46"
console.log(france.getLongitude()) // "2"
console.log(france.getArea()) // 551695
console.log(france.getBorders()) // ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"]
console.log(france.isLandlocked()) // false

// GeoJSON data
const geoJson = france.getGeoJson()
console.log(geoJson) // Returns GeoJSON string for France
```

## Currency and Languages

```typescript
import { country } from 'ts-countries'

const japan = country('JP')

// Currency information
console.log(japan.getCurrency()) // { name: "Japanese yen", symbol: "¥" }
console.log(japan.getCurrency('JPY')) // { name: "Japanese yen", symbol: "¥" }
console.log(japan.getCurrencies()) // { JPY: { name: "Japanese yen", symbol: "¥" } }

// Language information
console.log(japan.getLanguage()) // "Japanese"
console.log(japan.getLanguage('jpn')) // "Japanese"
console.log(japan.getLanguages()) // { jpn: "Japanese" }
```

## Translations and Localization

```typescript
import { country } from 'ts-countries'

const germany = country('DE')

// Get translations
console.log(germany.getTranslation('eng')) // { common: "Germany", official: "Federal Republic of Germany" }
console.log(germany.getTranslation('fra')) // { common: "Allemagne", official: "République fédérale d'Allemagne" }
console.log(germany.getTranslations()) // Returns all available translations

// Get locales and timezones
console.log(germany.getLocales()) // Returns available locales
console.log(germany.getTimezones()) // Returns available timezones
```

## Additional Metadata

```typescript
import { country } from 'ts-countries'

const uk = country('GB')

// Calling codes and dialing information
console.log(uk.getCallingCode()) // "44"
console.log(uk.getCallingCodes()) // ["44"]
console.log(uk.getNationalPrefix()) // "0"

// TLD information
console.log(uk.getTld()) // "uk"
console.log(uk.getTlds()) // ["uk", "gb"]

// Extra codes and identifiers
console.log(uk.getFifa()) // "ENG"
console.log(uk.getIoc()) // "GBR"
console.log(uk.getGeonameid()) // 2635167

// EU membership and VAT information
console.log(uk.isEuMember()) // false
console.log(uk.getVatRates()) // Returns VAT rate information
```

## Working with Collections

```typescript
import { countries, CountryCollection } from 'ts-countries'

// Create a collection of countries
const collection = new CountryCollection(countries(false, true))

// Filter European countries
const europeanCountries = collection.where('geo.region', 'Europe')
console.log(europeanCountries.map(c => c.getName()))

// Filter by currency
const euroCountries = collection.where('currency.EUR')
console.log(euroCountries.map(c => c.getName()))

// Complex filtering
const northAmericanEnglishSpeaking = collection
  .where('geo.subregion', 'North America')
  .where('languages.eng', 'English')
console.log(northAmericanEnglishSpeaking.map(c => c.getName()))

// Filter by area (larger than 1 million sq km)
const largeCountries = collection.where('geo.area', '>', 1000000)
console.log(largeCountries.map(c => c.getName()))
```

## Flags and Divisions

```typescript
import { country } from 'ts-countries'

const canada = country('CA')

// Get flag SVG
const flag = canada.getFlag()
console.log(flag) // Returns SVG string for Canadian flag

// Get administrative divisions
const divisions = canada.getDivisions()
console.log(divisions) // Returns provinces and territories

// Get specific division
const ontario = canada.getDivision('ON')
console.log(ontario) // Returns Ontario's details
```

## Error Handling

```typescript
import { country } from 'ts-countries'

try {
  // Try to get an invalid country
  const invalid = country('XX')
}
catch (error) {
  console.error(error.message) // "Country code may be misspelled, invalid, or data not found on server!"
}

try {
  // Try to create a country with missing mandatory attributes
  const incomplete = new Country({
    name: 'Test Country',
    iso_3166_1_alpha2: 'TC',
  })
}
catch (error) {
  console.error(error.message) // "Missing mandatory country attributes!"
}
```
