const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g. ".jpg"
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


app.get("/api/soil/demo", (req, res) => {
  res.json({
    soilType: "Demo Soil",
    description: "Backend is running.",
  });
});


app.post("/api/soil/analyze-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fullImagePath = path.join(__dirname, "uploads", req.file.filename);

  console.log("Received image:", fullImagePath);

    execFile(
    "python",
    ["soil_infer.py", fullImagePath],
    { cwd: __dirname },
    (error, stdout, stderr) => {
        if (error) {
        console.error("Python error:", error);
        console.error("stderr:", stderr.toString());
        return res.status(500).json({ error: "Model execution failed" });
        }

        try {
        const raw = stdout.toString().trim();
        const lastLine = raw.split("\n").pop();
        console.log("raw stdout:", raw);
        console.log("parsed line:", lastLine);

        const result = JSON.parse(lastLine);
        return res.json(result);
        } catch (e) {
        console.error("JSON parse error:", e);
        console.log("RAW:", stdout.toString());
        return res.status(500).json({ error: "Invalid model output" });
        }
    }
    );

});



app.listen(PORT, () => {
  console.log(`🌱 Backend running on http://localhost:${PORT}`);
});

