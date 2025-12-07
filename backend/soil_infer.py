import sys
import json
import os
from ultralytics import YOLO


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "soil_training",
    "weights",
    "best.pt",
)

model = YOLO(MODEL_PATH)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "no_image_path"}))
        return

    image_path = sys.argv[1]

 
    results = model.predict(image_path, verbose=False)
    r = results[0]

    probs = r.probs
    top_idx = int(probs.top1)
    top_conf = float(probs.top1conf)
    label = model.names[top_idx]

    output = {
        "soilType": label,
        "confidence": top_conf,
    }

 
    sys.stdout.write(json.dumps(output))
    sys.stdout.flush()

if __name__ == "__main__":
    main()
