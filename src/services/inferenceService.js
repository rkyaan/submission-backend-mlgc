const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  let tensor = null;
  let prediction = null;

  try {
    // Modern null/undefined check
    if (model == null || image == null) {
      throw new InputError('Model dan gambar harus disediakan');
    }

    // Create and process tensor
    tensor = tf.tidy(() => {
      const decoded = tf.node.decodeImage(image, 3);
      return decoded
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()
        .div(255.0);
    });

    // Make prediction
    prediction = await model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';
    const suggestion = confidenceScore > 50 
      ? "Segera periksa ke dokter!"
      : "Penyakit kanker tidak terdeteksi.";

    const explanation = "Hasil ini hanya prediksi awal dan tidak menggantikan diagnosis profesional medis.";

    return {
      confidenceScore: Number(confidenceScore.toFixed(2)),
      label,
      explanation,
      suggestion
    };

  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  } finally {
    // Clean up tensors
    if (tensor) tensor.dispose();
    if (prediction) prediction.dispose();
  }
}

module.exports = predictClassification;