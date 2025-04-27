import os
import tempfile
import uvicorn
from removebg import *
from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import shutil
from pathlib import Path
import logging
import python_weather
from recom_screenshot import RecOutfit
from dotenv import load_dotenv
from io import BytesIO

load_dotenv()

WEATHER_API_KEY = os.getenv("bb184681b38f4b3f9fb92309250403")

# Configure the logger
logging.basicConfig(filename="app.log", level=logging.INFO, format="%(asctime)s [%(levelname)s] - %(message)s")

# Create a FastAPI application
app = FastAPI(debug=True,title='Fashion AI',summary='This API Provides Access to all Endpoints of Fashion AI Server')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or use ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1️⃣ A simple root endpoint
@app.get("/")
def root():
    return {"message": "Hello from Fashion AI"}

# 2️⃣ Your existing predict endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # dummy implementation for now
    return {"style": "casual"}
def extract(source_path):
    model = YOLO("model//best.pt")
    results = model.predict(source=source_path, conf=0.4, save=False, line_width=2)
    class_names = ['sunglass', 'hat', 'jacket', 'shirt', 'pants', 'shorts', 'skirt', 'dress', 'bag', 'shoe']

    source = Image.open(source_path)
    items_list = []
    
    # Iterate through the detected items and save each one as a separate image
    for item in results:
        # Extract the bounding box coordinates
        x_min, y_min, x_max, y_max = item.boxes.xyxy[0]
        detected_item = source.crop((float(x_min), float(y_min), float(x_max), float(y_max)))
        if class_names[int(item.boxes.cls.tolist()[0])].lower() not in ['sunglass', 'hat', 'bag']:
            items_list.append({class_names[int(item.boxes.cls.tolist()[0])]: detected_item})  
    return items_list

def remove_bg(img):
    # Remove the image background using the "rembg" library
    removedBGimage = remove(img, True)
    
    # Automatically crop the image
    croppedImage = autocrop_image(removedBGimage, 0)
    
    # Resize the cropped image to a specific size (700 pixels in this case)
    resizedImage = resize_image(croppedImage, 700)
    
    # Create a new canvas with a specific size (1000x1000) and paste the image onto it
    combinedImage = resize_canvas(resizedImage, 1000, 1000)
    return combinedImage

@app.post("/remove_background/")
async def remove_background(file: UploadFile):
    try:
        upload_dir = Path("temp")
        upload_dir.mkdir(parents=True, exist_ok=True)

        with open(upload_dir / file.filename, "wb") as image_file:
            shutil.copyfileobj(file.file, image_file)
        
        image = remove_bg(Image.open(upload_dir / file.filename))
        shutil.rmtree('temp', ignore_errors=True)

        # Save the PIL Image as JPEG in a temporary file
        with BytesIO() as temp_buffer:
            image.save(temp_buffer, format="PNG")
            temp_buffer.seek(0)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
                temp_file.write(temp_buffer.read())
                temp_file_path = temp_file.name
                
        return FileResponse(temp_file_path, media_type="image/jpeg", headers={"Content-Disposition": "attachment; filename=removed.png"})

    except Exception as e:
        logging.error("An error occurred: %s", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/extract/")
async def upload_file(file: UploadFile):
    try:
        upload_dir = Path("temp")
        upload_dir.mkdir(parents=True, exist_ok=True)

        with open(upload_dir / file.filename, "wb") as image_file:
            shutil.copyfileobj(file.file, image_file)

        items_list = extract(upload_dir / file.filename)
        images_list = []

        for item in items_list:
            image_name = list(item.keys())[0]
            image = list(item.values())[0]
            image = remove_bg(image)
            image.save('{}.png'.format(image_name))
            logging.info(image_name)
            images_list.append({'name': image_name, 'image': 'image'}) 

        shutil.rmtree('temp', ignore_errors=True)
        return JSONResponse(content={"message": images_list})
    except Exception as e:
        logging.error("An error occurred: %s", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/getweather/{area}")
async def getweather(area):
    async with python_weather.Client(unit=python_weather.IMPERIAL) as client:
        weather = await client.get(area)
        temperature = weather.current.temperature
        temperature = (temperature - 32) * 5/9
        season = 'winter' if temperature < 25 else 'summer'
        
    return JSONResponse(content={"temperature": temperature, "season": season, 'description': weather.current.description, 'kind': str(weather.current.kind)})

@app.post('/get_recommendation')
async def get_recommendations(file: UploadFile, Gender, Ocassion, Season):
    upload_dir = Path("temp")
    upload_dir.mkdir(parents=True, exist_ok=True)

    with open(upload_dir / file.filename, "wb") as image_file:
        shutil.copyfileobj(file.file, image_file)

    input_image = {'image_path': upload_dir / file.filename, 'Image Tags': {'Gender': Gender.lower(), 'Season': Season.lower(), 'Occasion': Ocassion.lower()}}
    print(input_image)
    
    recoutfit = RecOutfit(input_image, 'Wardrobe')
    recommended_outfit, image = recoutfit.controller()

    # Save the PIL Image as JPEG in a temporary file
    with BytesIO() as temp_buffer:
        image.save(temp_buffer, format="JPEG")
        temp_buffer.seek(0)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(temp_buffer.read())
            temp_file_path = temp_file.name

    return FileResponse(temp_file_path, media_type="image/jpeg", headers={"Content-Disposition": "attachment; filename=recommended.png"})

@app.post('/get_recommendations_collage')
async def get_recommendations_collage(file: UploadFile, Gender, Ocassion, Season):
    upload_dir = Path("temp")
    upload_dir.mkdir(parents=True, exist_ok=True)

    with open(upload_dir / file.filename, "wb") as image_file:
        shutil.copyfileobj(file.file, image_file)

    items_list = extract(upload_dir / file.filename)
    images_list = []
    
    for item in items_list:
        image_name = list(item.keys())[0]
        image = list(item.values())[0]
        image = remove_bg(image)
        image.save('temp.png')

        input_image = {'image_path': upload_dir / file.filename, 'Image Tags': {'Gender': Gender.lower(), 'Season': Season.lower(), 'Occasion': Ocassion.lower()}}
        print(input_image)

        recoutfit = RecOutfit(input_image, 'Wardrobe')
        recommended_outfit, rec_image = recoutfit.controller()
        images_list.append(rec_image)

    try:
        os.remove('temp.png')
    except:
        pass

    total_width = sum([img.width for img in images_list])
    max_height = max([img.height for img in images_list])

    collage = Image.new("RGB", (total_width, max_height))
    x_offset = 0
    for img in images_list:
        collage.paste(img, (x_offset, 0))
        x_offset += img.width

    # Save the PIL Image as JPEG in a temporary file
    with BytesIO() as temp_buffer:
        collage.save(temp_buffer, format="JPEG")
        temp_buffer.seek(0)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(temp_buffer.read())
            temp_file_path = temp_file.name

    return FileResponse(temp_file_path, media_type="image/jpeg", headers={"Content-Disposition": "attachment; filename=recommended.png"})
    
    #run as uvicorn main:app --reload
