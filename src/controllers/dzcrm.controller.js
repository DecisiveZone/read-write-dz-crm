const { readRecords } = require("../services/read.service");
const { writeRecords } = require("../services/write.service");

exports.processRequest = async (req, res) => {
  try {
    const { mode, crm } = req.body;

    /*
     * CRM VALIDATION
     */

    if (!crm) {
      return res.status(400).json({
        success: false,
        message: "crm is required. Allowed values: live, sandbox",
      });
    }

    if (!["live", "sandbox"].includes(crm.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid crm value. Allowed values: live, sandbox",
      });
    }

    /*
     * MODE VALIDATION
     */

    if (!mode) {
      return res.status(400).json({
        success: false,
        message: "mode is required",
      });
    }

    /*
     * READ
     */

    if (mode === "READ") {
      const result = await readRecords(req.body);

      return res.json({
        success: true,
        data: result,
      });
    }

    /*
     * WRITE
     */

    if (mode === "WRITE") {
      const result = await writeRecords(req.body);

      return res.json({
        success: true,
        data: result,
      });
    }

    return res.status(400).json({
      success: false,
      message: `Unsupported mode: ${mode}`,
    });
  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(400).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
