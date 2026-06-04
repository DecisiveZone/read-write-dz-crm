const { readRecords } = require("../services/read.service");
const { writeRecords } = require("../services/write.service");

exports.processRequest = async (req, res) => {
  try {
    const { mode } = req.body;

    if (!mode) {
      return res.status(400).json({
        success: false,
        message: "mode is required",
      });
    }

    if (mode === "READ") {
      const result = await readRecords(req.body);

      return res.json({
        success: true,
        data: result,
      });
    }

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
