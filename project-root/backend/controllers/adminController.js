const { saveAdminDetails } = require("../services/dynamoService");

exports.addAdmin = async (req, res) => {
  try {
    const { admin_id, company_name, about } = req.body;
    await saveAdminDetails({ admin_id, company_name, about, status: "pending" });
    res.json({ message: "Admin info saved and ready for embedding!" });
  } catch (err) {
    console.error("Error adding admin:", err);
    res.status(500).json({ error: "Failed to add admin" });
  }
};
