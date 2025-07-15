export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.status = statusCode < 400 ? "ok" : "fail";
    this.success = statusCode < 400 ? true : false;
  }

  send(res) {
    const { statusCode, message, data, success, status } = this;
    return res
      .status(statusCode)
      .json({ statusCode, message, data, success, status });
  }
}
