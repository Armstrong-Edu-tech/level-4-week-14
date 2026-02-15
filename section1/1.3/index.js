const express = require("express");
const app = express();

const upload = require("./middleware/upload");

app.post("/upload-single", upload.single("myFile"), (req, res) => {
    res.json({
        message: "File uploaded successfully",
        file: req.file,
    });
});

app.post("/upload-multiple", upload.array("myFiles", 5), (req, res) => {
    res.json({
        message: "Files uploaded successfully",
        files: req.files,
    });
});

app.post(
    "/upload-fields", upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "gallery", maxCount: 3 },
    ]), (req, res) => {
        res.json({
            message: "Files uploaded successfully",
            files: req.files,
        });
    }
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});