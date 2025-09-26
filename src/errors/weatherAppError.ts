export class WeatherAppError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly timestamp: Date;

  constructor(errorTitle: string, errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, WeatherAppError.prototype);

    this.name = errorTitle;
    this.message = errorMessage;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WeatherAppError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

export default WeatherAppError;
