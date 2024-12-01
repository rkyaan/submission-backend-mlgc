const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getAllData = require("../services/loadData");


async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const imageBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      image.on('data', (chunk) => chunks.push(chunk));
      image.on('end', () => resolve(Buffer.concat(chunks)));
      image.on('error', reject);
    });
    


    const { confidenceScore, label, explanation, suggestion } = 
      await predictClassification(model, imageBuffer);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error in handler:', error);
    throw error;
  }
}

async function getAllDataHandler(request, h) {
  try {
    const allData = await getAllData();
    const response = h.response({
      status: "success",
      data: allData,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return h
      .response({
        status: "failed",
        message: "An unexpected error occurred",
      })
      .code(500);
  }
}

module.exports = { postPredictHandler, getAllDataHandler }; 