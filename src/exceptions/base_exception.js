export default class BaseException extends Error {
  constructor(code, message, cause, status, name) {
    const fullMsg = message ? `${code}: ${message}` : code;
    super(fullMsg);
    this.message = message;
    this.cause = cause;
    this.status = status || 500;
    this.name = name || this.constructor.name;
    this.code = code || `E_${this.name.toUpperCase()}`;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toString() {
    return this.message;
  }
}
