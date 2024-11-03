export class HttpError extends Error {
  private _status: number;

  get status() {
    return this._status;
  }

  constructor(status: number, message?: string) {
    super(message);
    this._status = status;
  }
}
