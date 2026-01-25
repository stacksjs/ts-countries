import type { CityAttributes } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { City } from './City'

/**
 * Internal city list type (normalized to array)
 */
type CityDataList = CityAttributes[]

/**
 * Get the directory of the current module
 */
function getModuleDir(): string {
  // Try import.meta.dir first (Bun)
  if (typeof import.meta.dir === 'string') {
    return import.meta.dir
  }
  // Fallback for Node.js
  if (typeof import.meta.url === 'string') {
    return path.dirname(fileURLToPath(import.meta.url))
  }
  // Last resort - use process.cwd()
  return process.cwd()
}

/**
 * CityLoader - Static class for loading and searching city data
 */
export class CityLoader {
  private static cache: Map<string, CityDataList> = new Map()

  /**
   * Load cities for a country
   * Supports both old format (single file) and new format (state-based directories)
   */
  public static loadForCountry(countryCode: string): CityDataList {
    const code = countryCode.toLowerCase()

    if (this.cache.has(code)) {
      return this.cache.get(code)!
    }

    const moduleDir = getModuleDir()

    // Try new format: state-based directory structure
    const countryDir = path.join(moduleDir, 'resources', 'cities', code)
    let allCities: CityDataList = []

    if (fs.existsSync(countryDir) && fs.statSync(countryDir).isDirectory()) {
      try {
        const stateFiles = fs.readdirSync(countryDir).filter(f => f.endsWith('.json'))

        for (const stateFile of stateFiles) {
          const filePath = path.join(countryDir, stateFile)
          try {
            const content = fs.readFileSync(filePath, 'utf8')
            const parsed = JSON.parse(content)

            // Handle both array format and object format
            if (Array.isArray(parsed)) {
              allCities = allCities.concat(parsed)
            }
            else {
              // Object format: { "city-slug": CityAttributes }
              allCities = allCities.concat(Object.values(parsed) as CityAttributes[])
            }
          }
          catch {
            // Skip files that can't be parsed
          }
        }
      }
      catch {
        // Directory read failed
      }
    }

    // Try old format: single file (fallback)
    if (allCities.length === 0) {
      const singleFilePath = path.join(moduleDir, 'resources', 'cities', `${code}.json`)

      if (fs.existsSync(singleFilePath)) {
        try {
          const content = fs.readFileSync(singleFilePath, 'utf8')
          const parsed = JSON.parse(content)

          // Handle both array format and object format
          if (Array.isArray(parsed)) {
            allCities = parsed
          }
          else {
            // Old object format: { "city-slug": CityAttributes }
            allCities = Object.values(parsed)
          }
        }
        catch {
          // File read failed
        }
      }
    }

    this.cache.set(code, allCities)
    return allCities
  }

  /**
   * Generate a slug from city name
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[äàáâã]/g, 'a')
      .replace(/[öòóôõ]/g, 'o')
      .replace(/[üùúû]/g, 'u')
      .replace(/[ëèéê]/g, 'e')
      .replace(/[ïìíî]/g, 'i')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /**
   * Get a city by slug or name
   */
  public static getCity(countryCode: string, citySlugOrName: string): City | null {
    const cities = this.loadForCountry(countryCode)
    const slug = this.generateSlug(citySlugOrName)
    const lowerName = citySlugOrName.toLowerCase()

    for (const cityData of cities) {
      const citySlug = this.generateSlug(cityData.name)
      if (citySlug === slug || cityData.name.toLowerCase() === lowerName) {
        return new City(cityData)
      }
    }

    return null
  }

  /**
   * Search cities by name
   */
  public static searchByName(countryCode: string, query: string): City[] {
    const cities = this.loadForCountry(countryCode)
    const lowerQuery = query.toLowerCase()
    const results: City[] = []

    for (const cityData of cities) {
      if (cityData.name.toLowerCase().includes(lowerQuery)) {
        results.push(new City(cityData))
      }
    }

    return results.sort((a, b) => (b.getPopulation() || 0) - (a.getPopulation() || 0))
  }

  /**
   * Get cities in a state/region
   */
  public static getCitiesInState(countryCode: string, stateCode: string): City[] {
    const cities = this.loadForCountry(countryCode)
    const results: City[] = []

    for (const cityData of cities) {
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

    for (const cityData of cities) {
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

    for (const cityData of cities) {
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

    for (const cityData of cities) {
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
    return cities.map(data => new City(data))
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
