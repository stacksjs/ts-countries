import type { CityAttributes, GeoCoordinates } from './types'

/**
 * City class for handling city-specific data and operations
 */
export class City {
  protected attributes: CityAttributes

  constructor(attributes: CityAttributes) {
    this.attributes = attributes
  }

  /**
   * Get the city name
   */
  public getName(): string {
    return this.attributes.name
  }

  /**
   * Get the state/province code
   */
  public getStateCode(): string {
    return this.attributes.stateCode
  }

  /**
   * Get the state/province name
   */
  public getState(): string {
    return this.attributes.state
  }

  /**
   * Get the county/district
   */
  public getCounty(): string | undefined {
    return this.attributes.county
  }

  /**
   * Get the metro area name
   */
  public getMetro(): string | undefined {
    return this.attributes.metro
  }

  /**
   * Get the population
   */
  public getPopulation(): number | undefined {
    return this.attributes.population
  }

  /**
   * Get the latitude
   */
  public getLatitude(): number {
    return this.attributes.geo.latitude ?? this.attributes.geo.lat ?? 0
  }

  /**
   * Get the longitude
   */
  public getLongitude(): number {
    return this.attributes.geo.longitude ?? this.attributes.geo.lon ?? 0
  }

  /**
   * Get the timezone
   */
  public getTimezone(): string | undefined {
    return this.attributes.geo.timezone ?? this.attributes.geo.tz
  }

  /**
   * Get the geo coordinates
   */
  public getCoordinates(): GeoCoordinates {
    return {
      latitude: this.getLatitude(),
      longitude: this.getLongitude(),
    }
  }

  /**
   * Get the full location string (City, State)
   */
  public getFullName(): string {
    return `${this.attributes.name}, ${this.attributes.state}`
  }

  /**
   * Get the short location string (City, StateCode)
   */
  public getShortName(): string {
    return `${this.attributes.name}, ${this.attributes.stateCode}`
  }

  /**
   * Calculate distance to another city in kilometers
   */
  public distanceTo(other: City): number {
    return this.haversineDistance(
      this.getLatitude(),
      this.getLongitude(),
      other.getLatitude(),
      other.getLongitude(),
    )
  }

  /**
   * Calculate distance to coordinates in kilometers
   */
  public distanceToCoordinates(lat: number, lon: number): number {
    return this.haversineDistance(
      this.getLatitude(),
      this.getLongitude(),
      lat,
      lon,
    )
  }

  /**
   * Haversine formula to calculate distance between two points
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a
      = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Get all attributes
   */
  public getAttributes(): CityAttributes {
    return this.attributes
  }
}
