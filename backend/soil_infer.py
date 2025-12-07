import sys
import json
import os
from ultralytics import YOLO

# Path to your trained model: ../soil_training/weights/best.pt (relative to backend/)
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "soil_training",
    "weights",
    "best.pt",
)

# Load model once
model = YOLO(MODEL_PATH)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "no_image_path"}))
        return

    image_path = sys.argv[1]

    # Run prediction
    results = model(image_path)
    r = results[0]
    probs = r.probs
    top_idx = int(probs.top1)
    top_conf = float(probs.top1conf)
    label = model.names[top_idx]

    output = {
        "soilType": label,
        "confidence": top_conf,
    }

    # Node.js will read this JSON from stdout
    print(json.dumps(output))

if __name__ == "__main__":
    main()
