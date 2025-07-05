const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

exports.saveAdminDetails = async (data) => {
  const params = {
    TableName: "AdminDetails",
    Item: data
  };
  await docClient.put(params).promise();
};
exports.saveProductDetails = async (data) => {
  const params = {
    TableName: "ProductInfo",
    Item: data
  };
  await docClient.put(params).promise();
};
exports.getProductsByAdmin = async (admin_id) => {
  const params = {
    TableName: "ProductInfo",
    KeyConditionExpression: "admin_id = :a",
    ExpressionAttributeValues: {
      ":a": admin_id
    }
  };
  const result = await docClient.query(params).promise();
  return result.Items;
};
