const { signUp, signIn } = require('../controllers/auth.controller');

module.exports = (app) => {
  app.post('/crm/api/v1/auth/signup', signUp);
  app.post('/crm/api/v1/auth/signin', signIn);
}