const express = require("express");
const app = express();

const upload = require('./middleware/upload');

app.post("/upload", upload.single("myFile"), (req, res) => {
    res.json({
        message: "File uploaded successfully",
        file: req.file,
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});