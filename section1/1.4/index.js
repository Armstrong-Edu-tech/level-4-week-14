const express = require("express"); 
const app = express();

const upload = require('./middleware/upload');

app.post("/upload-multiple", upload.array("productImages", 4), (req, res) => {
    res.json({ message: "Files uploaded successfully", files: req.files });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});