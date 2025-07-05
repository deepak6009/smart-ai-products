const { saveProductDetails } = require("../services/dynamoService");
const { generateQRCode, uploadToS3 } = require("../services/qrService");
const { v4: uuidv4 } = require("uuid");

exports.addProduct = async (req, res) => {
  try {
    const { admin_id, title, description, bot_behavior } = req.body;
    const product_id = uuidv4();

    const productURL = `http://localhost:5500/chatbot.html?product_id=${product_id}`;
    const qrData = await generateQRCode(productURL);
    const qrUrl = await uploadToS3(product_id, qrData);

    const productData = {
      admin_id,
      product_id,
      title,
      description,
      bot_behavior,
      qr_url: qrUrl,
      status: "pending"
    };

    await saveProductDetails(productData);
    res.json({ message: "Product created", qrUrl });

  } catch (err) {
    console.error("Product creation failed:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

exports.listProducts = async (req, res) => {
  const { getProductsByAdmin } = require("../services/dynamoService");

  try {
    const { admin_id } = req.params;
    const products = await getProductsByAdmin(admin_id);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};
