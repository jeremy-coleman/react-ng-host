//copy pasted from phosphor coreutils

export class PromiseDelegate<T> {
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  readonly promise: Promise<T>;

  resolve(value: T | PromiseLike<T>): void {
    let resolve = this._resolve;
    resolve(value);
  }

  reject(reason: any): void {
    let reject = this._reject;
    reject(reason);
  }

  private _resolve: (value: T | PromiseLike<T>) => void;
  private _reject: (reason: any) => void;
}