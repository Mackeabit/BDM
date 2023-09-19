const authorize = (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        next();
      } else {
        res.status(403).send({ error: 'Access denied.' });
      }
    };
  };
  
  module.exports = authorize;
  