class ApiResponse {
  constructor(success = true, message, statusCode = 200, data = "") {
    (this.success = success),
      (this.message = message),
      (this.statusCode = statusCode),
      (this.data = data);
  }
}
export { ApiResponse };
