class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 404;
  }
}

class AccessDenyError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 403;
  }
}

module.exports = {
  NotFoundError,
  AccessDenyError,
};
