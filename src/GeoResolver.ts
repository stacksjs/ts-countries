import type { GeoCoordinates, GeoLocation } from './types'
import { City } from './City'
import { CityLoader } from './CityLoader'
import { CountryLoader } from './CountryLoader'

/**
 * GeoResolver - Utilities for resolving geographic locations
 */
export class GeoResolver {
  /**
   * Resolve coordinates to a location (reverse geocoding)
   *
   * @param latitude Latitude coordinate
   * @param longitude Longitude coordinate
   * @param options Options for resolution
   * @returns GeoLocation with country, state, city info
   */
  public static resolveCoordinates(
    latitude: number,
    longitude: number,
    options: {
      /** Max distance in km to consider a city match */
      maxCityDistanceKm?: number
      /** Country code hint (improves performance if known) */
      countryCodeHint?: string
    } = {},
  ): GeoLocation | null {
    const { maxCityDistanceKm = 50, countryCodeHint } = options

    // If we have a country hint, search there first
    if (countryCodeHint) {
      const result = this.resolveInCountry(countryCodeHint, latitude, longitude, maxCityDistanceKm)
      if (result) {
        return result
      }
    }

    // Otherwise, check common countries
    // In production, you'd use a proper geo database or IP geolocation service
    const countriesToCheck = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'JP', 'BR', 'IN', 'MX']

    for (const countryCode of countriesToCheck) {
      const result = this.resolveInCountry(countryCode, latitude, longitude, maxCityDistanceKm)
      if (result) {
        return result
      }
    }

    return null
  }

  /**
   * Resolve coordinates within a specific country
   */
  private static resolveInCountry(
    countryCode: string,
    latitude: number,
    longitude: number,
    maxDistanceKm: number,
  ): GeoLocation | null {
    const country = CountryLoader.country(countryCode)
    if (!country) {
      return null
    }

    // Check if coordinates are within country bounds
    const minLat = Number.parseFloat(country.getMinLatitude() || '-90')
    const maxLat = Number.parseFloat(country.getMaxLatitude() || '90')
    const minLon = Number.parseFloat(country.getMinLongitude() || '-180')
    const maxLon = Number.parseFloat(country.getMaxLongitude() || '180')

    if (latitude < minLat || latitude > maxLat || longitude < minLon || longitude > maxLon) {
      return null
    }

    // Find nearest city
    const nearestCity = CityLoader.findNearest(countryCode, latitude, longitude, maxDistanceKm)

    // Get state/division info
    const divisions = country.getDivisions()
    let division: { code: string, name: string } | undefined

    if (nearestCity) {
      division = {
        code: nearestCity.getStateCode(),
        name: nearestCity.getState(),
      }
    }
    else if (divisions) {
      // Try to find the nearest division by checking bounds
      division = this.findNearestDivision(divisions, latitude, longitude)
    }

    return {
      countryCode: country.getIsoAlpha2()!,
      countryName: country.getName()!,
      region: division?.name,
      regionCode: division?.code,
      city: nearestCity?.getName(),
      metro: nearestCity?.getMetro(),
      latitude,
      longitude,
      timezone: nearestCity?.getTimezone(),
    }
  }

  /**
   * Find the nearest division based on coordinates
   */
  private static findNearestDivision(
    divisions: Record<string, { name: string, geo?: { latitude?: number, longitude?: number } }>,
    latitude: number,
    longitude: number,
  ): { code: string, name: string } | undefined {
    let nearestCode: string | undefined
    let nearestName: string | undefined
    let nearestDistance = Number.POSITIVE_INFINITY

    for (const [code, div] of Object.entries(divisions)) {
      if (div.geo?.latitude && div.geo?.longitude) {
        const distance = this.haversineDistance(
          latitude,
          longitude,
          div.geo.latitude,
          div.geo.longitude,
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestCode = code
          nearestName = div.name
        }
      }
    }

    if (nearestCode && nearestName) {
      return { code: nearestCode, name: nearestName }
    }

    return undefined
  }

  /**
   * Find location from city name and country
   */
  public static findCity(
    cityName: string,
    countryCode: string,
    stateCode?: string,
  ): City | null {
    const cities = CityLoader.searchByName(countryCode, cityName)

    if (cities.length === 0) {
      return null
    }

    // If state code provided, filter by it
    if (stateCode) {
      const matchingCity = cities.find(c => c.getStateCode() === stateCode)
      if (matchingCity) {
        return matchingCity
      }
    }

    // Return the most populous match
    return cities[0]
  }

  /**
   * Get formatted location string
   */
  public static formatLocation(location: GeoLocation): string {
    const parts: string[] = []

    if (location.city) {
      parts.push(location.city)
    }

    if (location.region) {
      parts.push(location.region)
    }

    if (location.countryName) {
      parts.push(location.countryName)
    }

    return parts.join(', ')
  }

  /**
   * Get short formatted location string
   */
  public static formatLocationShort(location: GeoLocation): string {
    if (location.city && location.regionCode) {
      return `${location.city}, ${location.regionCode}`
    }

    if (location.region) {
      return `${location.region}, ${location.countryCode}`
    }

    return location.countryName || location.countryCode
  }

  /**
   * Haversine distance calculation
   */
  private static haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a
      = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}

/**
 * Convenience function to resolve coordinates
 */
export function resolveCoordinates(
  latitude: number,
  longitude: number,
  options?: Parameters<typeof GeoResolver.resolveCoordinates>[2],
): GeoLocation | null {
  return GeoResolver.resolveCoordinates(latitude, longitude, options)
}

/**
 * Convenience function to find a city
 */
export function findCity(
  cityName: string,
  countryCode: string,
  stateCode?: string,
): City | null {
  return GeoResolver.findCity(cityName, countryCode, stateCode)
}
