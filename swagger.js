const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BarberPro API',
      version: '1.0.0',
      description: 'Documentação da API do BarberPro',
    },
    servers: [
      {
        url: 'https://apps-dev-production.up.railway.app',
        description: 'Servidor em Produção',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./server.js', './routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
