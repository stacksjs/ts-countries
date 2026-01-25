# Advanced Usage

Advanced patterns and customizations for ts-countries.

## Topics

### Custom Data Sets
Create filtered or extended country datasets.
[Learn more](/advanced/custom-data)

### Filtering & Sorting
Advanced querying and sorting of country data.
[Learn more](/advanced/filtering)

### Locale Support
Internationalize country names and data.
[Learn more](/advanced/locales)

### Performance Tips
Optimize for large-scale applications.
[Learn more](/advanced/performance)

## Quick Example

```typescript
import { createCustomDataset, filterCountries } from 'ts-countries'

// Create a custom dataset for EU countries
const euCountries = filterCountries({
  region: 'Europe',
  hasEuro: true,
})

// Create a minimal dataset for dropdowns
const dropdown = createCustomDataset({
  fields: ['code', 'name'],
  filter: (c) => c.independent,
})
```
