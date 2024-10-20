class StripeError extends Error {
  constructor(
    public message: string,
    public code: number,
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

export { StripeError };
