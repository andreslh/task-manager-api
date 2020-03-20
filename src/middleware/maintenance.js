const MAINTENANCE_MODE = false;

const maintenance = (req, res, next) => {
  if (MAINTENANCE_MODE) {
    res.status(503).send('Server under maintenance');
  } else {
    next();
  }
};

module.exports = maintenance;