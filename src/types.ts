export interface CountryAttributes {
  name: string | {
    common: string
    official: string
    native?: {
      [languageCode: string]: {
        common: string
        official: string
      }
    }
  }
  official_name?: string
  native_name?: string
  native_official_name?: string
  iso_3166_1_alpha2: string
  iso_3166_1_alpha3: string
  iso_3166_1_numeric?: string
  currency?: {
    [currencyCode: string]: {
      name: string
      symbol: string
    }
  }
  tld?: string[]
  alt_spellings?: string[]
  languages?: {
    [languageCode: string]: string
  }
  geo?: {
    continent?: string[]
    postal_code?: boolean
    latitude?: string
    longitude?: string
    latitude_desc?: string
    longitude_desc?: string
    max_latitude?: string
    max_longitude?: string
    min_latitude?: string
    min_longitude?: string
    area?: number
    region?: string
    subregion?: string
    world_region?: string
    region_code?: string
    subregion_code?: string
    landlocked?: boolean
    borders?: string[]
    independent?: string
  }
  dialling?: {
    calling_code?: string[]
    national_prefix?: string
    national_number_lengths?: number[]
    national_destination_code_lengths?: number[]
    international_prefix?: string
  }
  calling_code?: string[]
  extra?: {
    geonameid?: number
    edgar?: string
    itu?: string
    marc?: string
    wmo?: string
    ds?: string
    fifa?: string
    fips?: string
    gaul?: number
    ioc?: string
    cowc?: string
    cown?: number
    fao?: number
    imf?: number
    ar5?: string
    address_format?: string
    eu_member?: boolean
    data_protection?: string
    vat_rates?: {
      standard: number
      reduced: number[]
      super_reduced?: number
      parking?: number
    }
    emoji?: string
  }
  emoji?: string
  demonym?: string
  capital?: string
}

export interface Translation {
  common: string
  official: string
}

export interface CountryDivision {
  name: string
  code: string
  [key: string]: any
}

export interface CountryList {
  [countryCode: string]: CountryAttributes
}

// ============================================================================
// City Types
// ============================================================================

/**
 * Geographic coordinates
 */
export interface GeoCoordinates {
  latitude: number
  longitude: number
}

/**
 * City geographic information
 * Supports both long format (latitude/longitude) and short format (lat/lon)
 */
export interface CityGeo {
  latitude?: number
  longitude?: number
  lat?: number
  lon?: number
  timezone?: string
  tz?: string
}

/**
 * City attributes
 */
export interface CityAttributes {
  /** City name */
  name: string
  /** State/province code (e.g., "CA" for California) */
  stateCode: string
  /** State/province full name */
  state: string
  /** County or district name */
  county?: string
  /** Metropolitan area name */
  metro?: string
  /** Population */
  population?: number
  /** Geographic data */
  geo: CityGeo
}

/**
 * City list keyed by slug
 */
export interface CityList {
  [slug: string]: CityAttributes
}

/**
 * Resolved geographic location
 */
export interface GeoLocation {
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string
  /** Country name */
  countryName: string
  /** State/province/region name */
  region?: string
  /** State/province/region code */
  regionCode?: string
  /** City name */
  city?: string
  /** Metro area */
  metro?: string
  /** Latitude */
  latitude?: number
  /** Longitude */
  longitude?: number
  /** Timezone identifier */
  timezone?: string
}
