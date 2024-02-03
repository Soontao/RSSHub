module.exports =
  (moduleImport) =>
  async (...args) => {
    const router = moduleImport();
    return router(...args);
  };
