

module.exports = function (app,express) {

  app.use('/public',express.static('ui'));
}
