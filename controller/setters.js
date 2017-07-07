

module.exports = function (app,express) {
    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, remember-me, x-access-token');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      if (req.method.toUpperCase() === 'OPTIONS') {
        return res.status(200).send();
      }
      next()
    });

    app.use('/public',express.static('ui'));

}
