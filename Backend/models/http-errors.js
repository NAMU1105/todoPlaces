// 에러 핸들링 클래스
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a "message" property
    this.code = errorCode; // Adds a "code" property
  }
}

module.exports = HttpError;
