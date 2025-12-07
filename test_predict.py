from ultralytics import YOLO

model = YOLO(r"soil_training\weights\best.pt")  


test_image = r"soil_types_dataset\Sandy soil\sandy 1.png"  

results = model.predict(test_image)

results = model(test_image)
r = results[0]


top_idx = int(probs.top1)          
top_conf = float(probs.top1conf)   


label = model.names[top_idx]

print("=== SOIL PREDICTION ===")
print("Index:     ", top_idx)
print("Soil type: ", label)
print("Confidence:", f"{top_conf*100:.2f}%")