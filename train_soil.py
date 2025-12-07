from ultralytics import YOLO

def main():
   
    model = YOLO("yolov8n-cls.pt")

   
    model.train(
        data=r"soil_cls",      
        epochs=15,
        imgsz=224,
        device="cuda",         
        project=".",           
        name="soil_training"   
    )

if __name__ == "__main__":
    main()
