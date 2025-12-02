const express = require("express");
const multer = require("multer");
const app = express();

// --- Storage Setup ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

// --- File Filter ---
function fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
}

// --- Multer Setup ---
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter,
});

// --- Route ---
app.post("/upload", upload.single("myFile"), (req, res) => {
    try {
        res.json({
            message: "File uploaded successfully",
            file: req.file,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Start Server ---
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
