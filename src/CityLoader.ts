import type { CityAttributes, CityList } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { City } from './City'

/**
 * CityLoader - Static class for loading and searching city data
 */
export class CityLoader {
  private static cache: Map<string, CityList> = new Map()

  /**
   * Load cities for a country
   */
  public static loadForCountry(countryCode: string): CityList {
    const code = countryCode.toLowerCase()

    if (this.cache.has(code)) {
      return this.cache.get(code)!
    }

    const filePath = path.join(__dirname, 'resources', 'cities', `${code}.json`)

    if (!fs.existsSync(filePath)) {
      return {}
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const cities = JSON.parse(content) as CityList
      this.cache.set(code, cities)
      return cities
    }
    catch {
      return {}
    }
  }

  /**
   * Get a city by slug
   */
  public static getCity(countryCode: string, citySlug: string): City | null {
    const cities = this.loadForCountry(countryCode)
    const cityData = cities[citySlug]

    if (!cityData) {
      return null
    }

    return new City(cityData)
  }

  /**
   * Search cities by name
   */
  public static searchByName(countryCode: string, query: string): City[] {
    const cities = this.loadForCountry(countryCode)
    const lowerQuery = query.toLowerCase()
    const results: City[] = []

    for (const [, cityData] of Object.entries(cities)) {
      if (cityData.name.toLowerCase().includes(lowerQuery)) {
        results.push(new City(cityData))
      }
    }

    return results.sort((a, b) => b.getPopulation()! - a.getPopulation()!)
  }

  /**
   * Get cities in a state/region
   */
  public static getCitiesInState(countryCode: string, stateCode: string): City[] {
    const cities = this.loadForCountry(countryCode)
    const results: City[] = []

    for (const [, cityData] of Object.entries(cities)) {
      if (cityData.stateCode === stateCode) {
        results.push(new City(cityData))
      }
    }

    return results.sort((a, b) => (b.getPopulation() || 0) - (a.getPopulation() || 0))
  }

  /**
   * Get cities in a metro area
   */
  public static getCitiesInMetro(countryCode: string, metro: string): City[] {
    const cities = this.loadForCountry(countryCode)
    const lowerMetro = metro.toLowerCase()
    const results: City[] = []

    for (const [, cityData] of Object.entries(cities)) {
      if (cityData.metro?.toLowerCase().includes(lowerMetro)) {
        results.push(new City(cityData))
      }
    }

    return results.sort((a, b) => (b.getPopulation() || 0) - (a.getPopulation() || 0))
  }

  /**
   * Find the nearest city to given coordinates
   */
  public static findNearest(
    countryCode: string,
    latitude: number,
    longitude: number,
    maxDistanceKm?: number,
  ): City | null {
    const cities = this.loadForCountry(countryCode)
    let nearestCity: City | null = null
    let nearestDistance = Number.POSITIVE_INFINITY

    for (const [, cityData] of Object.entries(cities)) {
      const city = new City(cityData)
      const distance = city.distanceToCoordinates(latitude, longitude)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestCity = city
      }
    }

    if (maxDistanceKm && nearestDistance > maxDistanceKm) {
      return null
    }

    return nearestCity
  }

  /**
   * Find cities within a radius of given coordinates
   */
  public static findWithinRadius(
    countryCode: string,
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Array<{ city: City, distance: number }> {
    const cities = this.loadForCountry(countryCode)
    const results: Array<{ city: City, distance: number }> = []

    for (const [, cityData] of Object.entries(cities)) {
      const city = new City(cityData)
      const distance = city.distanceToCoordinates(latitude, longitude)

      if (distance <= radiusKm) {
        results.push({ city, distance })
      }
    }

    return results.sort((a, b) => a.distance - b.distance)
  }

  /**
   * Get all cities for a country
   */
  public static getAllCities(countryCode: string): City[] {
    const cities = this.loadForCountry(countryCode)
    return Object.values(cities).map(data => new City(data))
  }

  /**
   * Get top cities by population
   */
  public static getTopCities(countryCode: string, limit: number = 10): City[] {
    const cities = this.getAllCities(countryCode)
    return cities
      .sort((a, b) => (b.getPopulation() || 0) - (a.getPopulation() || 0))
      .slice(0, limit)
  }

  /**
   * Clear the cache
   */
  public static clearCache(): void {
    this.cache.clear()
  }
}
