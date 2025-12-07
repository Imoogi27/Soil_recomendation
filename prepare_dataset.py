import os
import random
import shutil


SOURCE = r"C:\Users\Imoogi\Desktop\Electives3_proj\soil_types_dataset"


TARGET = r"C:\Users\Imoogi\Desktop\Electives3_proj\soil_cls"

TRAIN_SPLIT = 0.8  # 80% train, 20% val

random.seed(42)

print("SOURCE FOLDER:", SOURCE)
print("Exists?", os.path.isdir(SOURCE))
print("\n Folders found under SOURCE:")

# list all folders under SOURCE
for name in os.listdir(SOURCE):
    print(" -", name)

print("\n➡ Starting processing...\n")

# create main train/val folders
os.makedirs(os.path.join(TARGET, "train"), exist_ok=True)
os.makedirs(os.path.join(TARGET, "val"), exist_ok=True)

for classname in os.listdir(SOURCE):
    class_folder = os.path.join(SOURCE, classname)

    if not os.path.isdir(class_folder):
        continue  # ignore files

    images = [
        img for img in os.listdir(class_folder)
        if img.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    if len(images) == 0:
        print(f"⚠ No images in '{classname}', skipping")
        continue

    random.shuffle(images)
    split = int(len(images) * TRAIN_SPLIT)

    train_imgs = images[:split]
    val_imgs = images[split:]

    # create class folders inside train/ and val/
    train_class_dir = os.path.join(TARGET, "train", classname)
    val_class_dir = os.path.join(TARGET, "val", classname)
    os.makedirs(train_class_dir, exist_ok=True)
    os.makedirs(val_class_dir, exist_ok=True)

    for img in train_imgs:
        shutil.copy2(
            os.path.join(class_folder, img),
            os.path.join(train_class_dir, img)
        )

    for img in val_imgs:
        shutil.copy2(
            os.path.join(class_folder, img),
            os.path.join(val_class_dir, img)
        )

    print(f"✔ {classname}: {len(train_imgs)} train | {len(val_imgs)} val")

print("\n Dataset prepared successfully!")
print("YOLO dataset at:", TARGET)
