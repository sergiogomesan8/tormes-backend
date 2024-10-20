class CloudinaryError extends Error {
  constructor(
    public message: string,
    public code: number,
  ) {
    super(message);
    this.name = 'CloudinaryError';
  }
}

export { CloudinaryError };
