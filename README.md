# AI-Based Smart Fashion Recommender System

## Overview

This project is a **personalized AI-powered fashion recommendation system** that suggests clothing options based on user inputs such as gender, occasion, season, weather conditions, and AI-based style prediction. The system combines machine learning, computer vision, and real-time data to deliver smart, context-aware fashion suggestions.

The frontend is built with **React.js**, the backend uses **FastAPI**, and the system integrates **MongoDB** for storing user profiles and recommendations. A style prediction model is included that processes webcam input or uploaded images to infer the user’s current style. Real-time weather data is fetched from an external API to adjust recommendations accordingly.


## Features

* Personalized clothing recommendations based on:

  * Gender
  * Occasion (e.g., Formal, Party, Casual)
  * Season and weather
  * Style (predicted from image input or webcam)
* **Image-based AI model** to predict user style using a webcam
* **Live weather API** integration for contextual recommendations
* **MongoDB** storage of user inputs and past recommendations
* **React frontend** with light/dark theme switch
* Fast, responsive user interface
* Styled using Tailwind CSS for a modern look
* Built with modular and scalable components


## Project Architecture

* **Frontend**: React.js with Tailwind CSS
* **Backend**: FastAPI
* **Database**: MongoDB Atlas
* **Machine Learning**:

  * CSV-based recommendation model (e.g., Decision Tree, Random Forest)
  * Pre-trained model for style prediction using webcam input
* **External Integration**:

  * OpenWeather API for real-time weather conditions


## Modules Breakdown

1. **Recommendation Engine**

   * Uses a trained model on a labeled dataset with clothing features.
   * Accepts gender, season, occasion, and weather as input.

2. **Style Prediction Module**

   * Takes webcam input or uploaded image.
   * Applies a pre-trained deep learning model to infer clothing style.

3. **Weather Integration**

   * Fetches user’s current weather using OpenWeather API.
   * Filters suggestions that align with the current temperature and conditions.

4. **Frontend Interface**

   * User form for input selection.
   * Displays recommended outfits with categories and details.
   * Optional image input for style detection.
   * Theme toggle and responsive design.

5. **Backend API**

   * Receives requests from the frontend.
   * Processes inputs and returns relevant recommendations.
   * Communicates with MongoDB for storing and retrieving user history.


## Installation Instructions

### Prerequisites

* Node.js
* Python 3.8+
* MongoDB Atlas or local MongoDB setup
* An OpenWeather API key

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Environment Variables

Create `.env` files to store:

* OpenWeather API Key
* MongoDB connection string
* Any model paths (if needed)


## Dataset Used

The recommendation engine is trained on a custom CSV dataset containing clothing attributes such as:

* Category
* Gender
* Season
* Occasion
* Material
* Price
* Style Tags


## How It Works

1. User visits the site and selects their preferences.
2. Optionally uploads a photo or uses the webcam for style detection.
3. Weather data is fetched based on user location.
4. Backend processes all inputs and returns a list of clothing suggestions.
5. The recommendations are displayed in a visually appealing format.


## License

This project is for academic purposes and open for learning and demonstration. For any reuse or contributions, kindly mention the source and credit the author(s).

