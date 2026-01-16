# Weather App Backend

A full-stack weather application with a **FastAPI** backend to fetch weather data from the OpenWeather API and a **React TypeScript** frontend.

![Weather App Screenshot](https://res.cloudinary.com/do63p55lo/image/upload/v1768567999/weather/weather_j1r9zl.png)

UI Design inspired by [Weather web app by Aleksandr Seredkin](https://dribbble.com/shots/15524720-Weather-web-app) on Dribbble

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Provider](#api-provider)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SaleemIlahi/weather-app-fullstack.git
```

### 2. Backend Setup

```bash
cd backend
```

### 3. Create and Activate Virtual Environment

**macOS/Linux:**

```bash
python -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

### 4. Install Dependencies

**Option 1: Using Poetry (recommended)**

```bash
pip install poetry
poetry install
```

**Option 2: Using requirements.txt**

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```env
WEATHER_API_KEY=your_openweather_api_key
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
CORS_METHODS=GET
CORS_HEADERS=Content-Type,Authorization,Origin,Accept
```

---

## API Provider

### OpenWeather API

**What it provides:** Weather data including temperature, humidity, wind speed, and forecasts for cities worldwide.

**Getting your API key:**

1. Go to [OpenWeather](https://openweathermap.org/) and sign up for a free account
2. Verify your email and log in
3. Navigate to [API Keys](https://home.openweathermap.org/api_keys)
4. Click **Create Key**, name it (e.g., "WeatherApp"), and copy the generated key
5. Paste the key into your `.env` file as `WEATHER_API_KEY`

---

## Running the Application

### Backend

**From the backend folder:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**From the root folder:**

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Assumptions & Limitations

### Location Detection

- **API Used:** [ipapi.co/json](https://ipapi.co/json/) (free tier)
- **Purpose:** Provides approximate user location based on IP address
- **Accuracy:** Location may be inaccurate as it relies on cell phone tower triangulation and IP geolocation
- **Limitations:**
  - Rate limiting enforced after excessive requests
  - Free tier has usage restrictions
  - May not reflect actual user location accurately

### Other Limitations

- OpenWeather API free tier has rate limits
- Weather data accuracy depends on OpenWeather's data sources
- CORS is configured for localhost development only
