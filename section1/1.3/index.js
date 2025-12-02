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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter,
});

// --- Routes ---

// Single file
app.post("/upload-single", upload.single("myFile"), (req, res) => {
    try {
        res.json({ message: "File uploaded successfully", file: req.file });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Multiple files (same field)
app.post("/upload-multiple", upload.array("myFiles", 5), (req, res) => {
    try {
        res.json({ message: "Files uploaded successfully", files: req.files });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Multiple fields (different names)
app.post("/upload-fields", upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "gallery", maxCount: 3 }
]), (req, res) => {
    try {
        res.json({ message: "Files uploaded successfully", files: req.files });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Error Handling ---
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

// --- Start Server ---
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
