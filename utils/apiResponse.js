// this is the custom class for sending consistent successfull reponse and it save's time from repeating the same code again and again
export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.status = statusCode < 400 ? "ok" : "fail";
    this.success = statusCode < 400 ? true : false;
  }
  // this is very useful save's time
  send(res) {
    const { statusCode, message, data, success, status } = this;
    return res
      .status(statusCode)
      .json({ statusCode, message, data, success, status });
  }
}
