const { postPredictHandler, getAllDataHandler } = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream', // Try changing between 'stream' and 'file'
        parse: true,
        maxBytes: 1000000
      },
    }
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getAllDataHandler,
  },
];

module.exports = routes;