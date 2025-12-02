const express = require("express"); 
const multer = require("multer");
const app = express();

// --- Storage Setup ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Make sure this folder exists before running
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

// --- File Filter ---
function fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
}

// --- Multer Setup ---
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
    fileFilter: fileFilter,
});

// --- Routes ---

// Multiple files from the same field
app.post("/upload-multiple", upload.array("productImages", 4), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        res.json({ message: "Files uploaded successfully", files: req.files });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Start Server ---
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
