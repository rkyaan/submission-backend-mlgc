const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

async function storeData(id, data) {
  try {
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

module.exports = storeData;