/**
 * CountryLoaderException class for handling country loading exceptions
 */
export class CountryLoaderException extends Error {
  /**
   * Create a new exception instance for invalid country
   *
   * @returns The exception instance
   */
  public static invalidCountry(): CountryLoaderException {
    return new CountryLoaderException('Country code may be misspelled, invalid, or data not found on server!')
  }
}
