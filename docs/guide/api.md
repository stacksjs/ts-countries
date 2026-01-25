# API Reference

Complete API reference for ts-countries.

## Utility Functions

### country(code)

Get a single country by its ISO alpha-2 code.

```typescript
import { country } from 'ts-countries'

const usa = country('US')
const germany = country('DE')
const japan = country('JP')
```

**Parameters:**
- `code` (string) - ISO 3166-1 alpha-2 country code (e.g., "US", "DE", "JP")

**Returns:** `Country` instance

**Throws:** `CountryLoaderException` if the country code is not found

### countries(longlist?, hydrate?)

Get all countries.

```typescript
import { countries } from 'ts-countries'

// Short list (basic data)
const shortList = countries()

// Long list (detailed data)
const longList = countries(true)

// Hydrated Country instances
const instances = countries(false, true)

// Long list with Country instances
const detailedInstances = countries(true, true)
```

**Parameters:**
- `longlist` (boolean, default: false) - Return detailed country data
- `hydrate` (boolean, default: false) - Return Country instances instead of raw data

**Returns:** Array of country data or Country instances

### currencies()

Get all currency data.

```typescript
import { currencies } from 'ts-countries'

const allCurrencies = currencies()
// { USD: { name: "United States dollar", symbol: "$" }, EUR: { ... }, ... }
```

**Returns:** Object with currency codes as keys

## Country Class

### Constructor

```typescript
import { Country } from 'ts-countries'

const country = new Country(attributes)
```

**Throws:** Error if mandatory attributes (name, ISO codes) are missing

### Name Methods

#### getName()

Get the common name.

```typescript
country.getName()  // "United States"
```

#### getOfficialName()

Get the official name.

```typescript
country.getOfficialName()  // "United States of America"
```

#### getNativeName(languageCode?)

Get the native name, optionally for a specific language.

```typescript
country.getNativeName()       // First available native name
country.getNativeName('eng')  // English native name
```

#### getNativeOfficialName(languageCode?)

Get the native official name.

```typescript
country.getNativeOfficialName()  // Native official name
```

#### getNativeNames()

Get all native names.

```typescript
country.getNativeNames()
// { eng: { common: "...", official: "..." }, ... }
```

#### getDemonym()

Get the demonym (e.g., "American", "German").

```typescript
country.getDemonym()  // "American"
```

### ISO Code Methods

#### getIsoAlpha2()

Get the ISO 3166-1 alpha-2 code.

```typescript
country.getIsoAlpha2()  // "US"
```

#### getIsoAlpha3()

Get the ISO 3166-1 alpha-3 code.

```typescript
country.getIsoAlpha3()  // "USA"
```

#### getIsoNumeric()

Get the ISO 3166-1 numeric code.

```typescript
country.getIsoNumeric()  // "840"
```

### Geographic Methods

#### getCapital()

Get the capital city.

```typescript
country.getCapital()  // "Washington, D.C."
```

#### getGeodata()

Get all geographic data.

```typescript
country.getGeodata()
// { region: "...", subregion: "...", latitude: "...", ... }
```

#### getContinent()

Get the continent(s).

```typescript
country.getContinent()  // ["North America"]
```

#### getRegion()

Get the region.

```typescript
country.getRegion()  // "Americas"
```

#### getSubregion()

Get the subregion.

```typescript
country.getSubregion()  // "Northern America"
```

#### getWorldRegion()

Get the world region.

```typescript
country.getWorldRegion()  // "AMER"
```

#### getRegionCode()

Get the region code.

```typescript
country.getRegionCode()  // "019"
```

#### getSubregionCode()

Get the subregion code.

```typescript
country.getSubregionCode()  // "021"
```

#### getLatitude() / getLongitude()

Get coordinates.

```typescript
country.getLatitude()   // "38.883333"
country.getLongitude()  // "-77.0"
```

#### getLatitudeDesc() / getLongitudeDesc()

Get described coordinates.

```typescript
country.getLatitudeDesc()   // "38 53 N"
country.getLongitudeDesc()  // "77 00 W"
```

#### getMaxLatitude() / getMaxLongitude() / getMinLatitude() / getMinLongitude()

Get coordinate bounds.

```typescript
country.getMaxLatitude()   // "71.441055"
country.getMinLatitude()   // "18.776344"
country.getMaxLongitude()  // "-66.949895"
country.getMinLongitude()  // "-179.148909"
```

#### getArea()

Get the area in square kilometers.

```typescript
country.getArea()  // 9372610
```

#### getBorders()

Get bordering countries (ISO alpha-3 codes).

```typescript
country.getBorders()  // ["CAN", "MEX"]
```

#### isLandlocked()

Check if the country is landlocked.

```typescript
country.isLandlocked()  // false
```

#### isIndependent()

Check if the country is independent.

```typescript
country.isIndependent()  // "Yes"
```

#### usesPostalCode()

Check if the country uses postal codes.

```typescript
country.usesPostalCode()  // true
```

### Language Methods

#### getLanguages()

Get all official languages.

```typescript
country.getLanguages()  // { eng: "English" }
```

#### getLanguage(languageCode?)

Get a specific language or the first language.

```typescript
country.getLanguage()       // "English"
country.getLanguage('eng')  // "English"
```

### Currency Methods

#### getCurrencies()

Get all currencies.

```typescript
country.getCurrencies()
// { USD: { name: "United States dollar", symbol: "$" } }
```

#### getCurrency(currencyCode?)

Get a specific currency or the first currency.

```typescript
country.getCurrency()       // { name: "United States dollar", symbol: "$" }
country.getCurrency('USD')  // { name: "United States dollar", symbol: "$" }
```

### Contact Methods

#### getCallingCode()

Get the primary calling code.

```typescript
country.getCallingCode()  // "+1"
```

#### getCallingCodes()

Get all calling codes.

```typescript
country.getCallingCodes()  // ["+1"]
```

#### getNationalPrefix()

Get the national dialing prefix.

```typescript
country.getNationalPrefix()  // "1"
```

#### getNationalNumberLength()

Get the typical national number length.

```typescript
country.getNationalNumberLength()  // 10
```

#### getNationalNumberLengths()

Get all valid national number lengths.

```typescript
country.getNationalNumberLengths()  // [10]
```

#### getNationalDestinationCodeLength()

Get the destination code length.

```typescript
country.getNationalDestinationCodeLength()  // 3
```

#### getNationalDestinationCodeLengths()

Get all valid destination code lengths.

```typescript
country.getNationalDestinationCodeLengths()  // [3]
```

#### getInternationalPrefix()

Get the international dialing prefix.

```typescript
country.getInternationalPrefix()  // "011"
```

#### getTld()

Get the primary top-level domain.

```typescript
country.getTld()  // ".us"
```

#### getTlds()

Get all top-level domains.

```typescript
country.getTlds()  // [".us"]
```

### Translation Methods

#### getTranslations()

Get all translations.

```typescript
country.getTranslations()
// { ara: { common: "...", official: "..." }, fra: { ... }, ... }
```

#### getTranslation(languageCode?)

Get a specific translation.

```typescript
country.getTranslation('fra')
// { common: "Etats-Unis", official: "Les Etats-Unis d'Amerique" }
```

### Alternative Spellings

#### getAltSpellings()

Get alternative spellings.

```typescript
country.getAltSpellings()  // ["US", "USA", "United States of America"]
```

### Division Methods

#### getDivisions()

Get all administrative divisions (states, provinces, etc.).

```typescript
country.getDivisions()
// { "US-CA": { name: "California", ... }, "US-NY": { name: "New York", ... }, ... }
```

#### getDivision(code)

Get a specific division.

```typescript
country.getDivision('US-CA')
// { name: "California", type: "state", ... }
```

### Extra Data Methods

#### getExtra()

Get all extra data.

```typescript
country.getExtra()
// { geonameid: 6252001, edgar: "2J", fifa: "USA", ... }
```

#### getGeonameid()

Get the GeoNames ID.

```typescript
country.getGeonameid()  // 6252001
```

#### getEdgar() / getItu() / getMarc() / getWmo() / getDs() / getFifa() / getFips() / getGaul() / getIoc() / getCowc() / getCown() / getFao() / getImf() / getAr5()

Get various international codes.

```typescript
country.getFifa()  // "USA"
country.getIoc()   // "USA"
```

#### getAddressFormat()

Get the address format template.

```typescript
country.getAddressFormat()
// "{name}\n{street}\n{city}, {state} {zip}\n{country}"
```

#### isEuMember()

Check if the country is an EU member.

```typescript
country.isEuMember()  // false
```

#### getDataProtection()

Get data protection status.

```typescript
country.getDataProtection()  // "adequate"
```

#### getVatRates()

Get VAT rates.

```typescript
country.getVatRates()
// { standard: 0, reduced: [0], parking: null, ... }
```

### Visual Data Methods

#### getEmoji()

Get the flag emoji.

```typescript
country.getEmoji()  // "US"
```

#### getFlag()

Get the SVG flag content.

```typescript
country.getFlag()  // "<svg>...</svg>"
```

#### getGeoJson()

Get GeoJSON data for the country.

```typescript
country.getGeoJson()  // GeoJSON string
```

### Attribute Methods

#### get(key, defaultValue?)

Get an attribute using dot notation.

```typescript
country.get('name.common')     // "United States"
country.get('geo.region')      // "Americas"
country.get('missing', 'N/A')  // "N/A"
```

#### set(key, value)

Set an attribute.

```typescript
country.set('custom.field', 'value')
```

#### getAttributes()

Get all attributes.

```typescript
country.getAttributes()
```

#### setAttributes(attributes)

Replace all attributes.

```typescript
country.setAttributes(newAttributes)
```

## CountryLoader Class

Static class for loading country data.

### CountryLoader.country(code)

Load a single country.

```typescript
const data = CountryLoader.country('US')
```

### CountryLoader.countries(longlist?, hydrate?)

Load all countries.

```typescript
const all = CountryLoader.countries()
const detailed = CountryLoader.countries(true)
const instances = CountryLoader.countries(false, true)
```

## CurrencyLoader Class

Static class for loading currency data.

### CurrencyLoader.currencies()

Load all currencies.

```typescript
const currencies = CurrencyLoader.currencies()
```

## CountryLoaderException

Exception thrown when a country cannot be loaded.

```typescript
import { CountryLoaderException } from 'ts-countries'

try {
  const invalid = country('XX')
} catch (error) {
  if (error instanceof CountryLoaderException) {
    console.error('Country not found:', error.message)
  }
}
```

## Types

### CountryAttributes

Full type definition for country data.

### CountryDivision

Type for administrative divisions.

### CountryList

Type for country list data.

### Translation

Type for translation data.

```typescript
interface Translation {
  common: string
  official: string
}
```
