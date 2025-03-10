<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-countries

> A modern TypeScript library for managing and retrieving comprehensive country data with a simple and intuitive API.

## Features

- 🌍 **Comprehensive Data** _Extensive country info including names, codes, currencies, languages, and more_
- 🔍 **Smart Search** _Powerful filtering and search capabilities_
- 🌐 **i18n Ready** _Support for multiple languages and translations_
- 💪 **Type-Safe** _Full TypeScript support with comprehensive type definitions_
- 🎯 **ISO Compliant** _Implements ISO 3166-1 standards for country codes_
- 🧪 **Well-Tested** _Comprehensive test suite ensuring reliability_
- 📦 **Zero Dependencies** _Lightweight and self-contained_
- 🔄 **Caching** _Built-in caching system for optimal performance_

## Installation

```bash
# Using npm
npm install ts-countries

# Using yarn
yarn add ts-countries

# Using pnpm
pnpm add ts-countries

# Using bun
bun add ts-countries
```

## Usage

### Basic Usage

```typescript
import { countries, country } from 'ts-countries'

// Get a single country
const usa = country('US')
console.log(usa.getName()) // Returns 'United States'
console.log(usa.getIsoAlpha2()) // Returns 'US'
console.log(usa.getIsoAlpha3()) // Returns 'USA'

// Get all countries
const allCountries = countries()

// Get detailed country list
const detailedCountries = countries(true) // longlist format

// Get hydrated Country instances
const countryInstances = countries(false, true) // returns Country[]
```

### Advanced Usage

```typescript
import { Country, CountryLoader } from 'ts-countries'

// Working with country data
const usa = country('US')

// Access various country properties
console.log(usa.getCapital()) // Get capital city
console.log(usa.getCurrencies()) // Get currency information
console.log(usa.getLanguages()) // Get official languages
console.log(usa.getTimezones()) // Get timezone information
console.log(usa.getGeodata()) // Get geographic data

// Get translations
console.log(usa.getTranslations()) // Get all translations
console.log(usa.getTranslation('fra')) // Get French translation

// Working with native names
console.log(usa.getNativeName()) // Get native name
console.log(usa.getNativeNames()) // Get all native names

// Geographic information
console.log(usa.getRegion()) // Get region
console.log(usa.getSubregion()) // Get subregion
console.log(usa.getContinent()) // Get continent
console.log(usa.getBorders()) // Get bordering countries

// Additional metadata
console.log(usa.getDemonym()) // Get demonym
console.log(usa.getCallingCode()) // Get calling code
console.log(usa.getTld()) // Get top-level domain
```

### Filtering Countries

```typescript
import { CountryCollection } from 'ts-countries'

const collection = new CountryCollection(countries(false, true))

// Filter by region
const europeanCountries = collection.where('geo.region', 'Europe')

// Filter by currency
const euroCountries = collection.where('currency.EUR')

// Filter using comparison operators
const largeCountries = collection.where('geo.area', '>', 1000000)

// Complex filtering
const northAmericanEnglishSpeaking = collection
  .where('geo.subregion', 'North America')
  .where('languages.eng', 'English')
```

## API Reference

### Main Classes

#### Country

Represents a single country with comprehensive data and helper methods.

#### CountryLoader

Static class for loading country data with built-in caching.

#### CountryCollection

Collection class for working with multiple countries and filtering.

### Key Methods

#### Country Class Methods

- `getName()`: Get country name
- `getOfficialName()`: Get official country name
- `getNativeName(languageCode?)`: Get native name
- `getIsoAlpha2()`: Get ISO 3166-1 alpha-2 code
- `getIsoAlpha3()`: Get ISO 3166-1 alpha-3 code
- `getIsoNumeric()`: Get ISO 3166-1 numeric code
- `getCurrencies()`: Get currency information
- `getLanguages()`: Get official languages
- And many more...

#### CountryLoader Methods

- `country(code: string, hydrate?: boolean)`: Load single country
- `countries(longlist?: boolean, hydrate?: boolean)`: Load all countries
- `where(key: string, operator: string, value?: any)`: Filter countries

## Error Handling

The library throws descriptive exceptions for various error conditions:

- **Invalid Country Code**: When a country code doesn't exist
- **Missing Data**: When required country data is missing
- **Invalid Format**: When data format is incorrect

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-countries/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Credits

- [Rinvex](https://github.com/rinvex) for the original PHP library
- [Chris Breuer](https://github.com/chrisbreuer) for the TypeScript conversion

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-countries?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-countries
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-countries/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-countries/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-starter/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-starter -->
