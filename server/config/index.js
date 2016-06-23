const testingMongodbUri = process.env.TEST_MONGODB_URI
  || 'mongodb://localhost:27017/documents-test';
const mongodbUri = process.env.MONGODB_URI
  || 'mongodb://localhost:27017/documents';
const production = process.env.NODE_ENV === 'production';
const testing = process.env.NODE_ENV === 'testing';
const development = !(production || testing);
const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY || '3ctC0L16ZkjYrhSslcg+qzP2t5VkOoEU';


module.exports = {
  env: {
    production,
    testing,
    development,
  },
  mongodbUri,
  testingMongodbUri,
  port,
  secretKey,
};
