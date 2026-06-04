const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const dzcrmRoutes = require("./routes/dzcrm.routes");

const app = express();

app.use(express.json());

app.use("/api/dzcrm", dzcrmRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        service: "Read-Write DZ CRM API"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});