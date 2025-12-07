// src/components/WeatherLocation.js
import React from "react";
import {
  MapPin,
  SunMedium,
  Droplets,
  ThermometerSun,
} from "lucide-react";

export function WeatherLocation({ weather, location, isLoading }) {
  if (isLoading) {
    return (
      <section className="loc-weather-card">
        <p className="loading-text">Detecting your location and weather…</p>
      </section>
    );
  }

  if (!weather || !location) {
    return null;
  }

  return (
    <section className="loc-weather-card">
      {/* LEFT: LOCATION INFO */}
      <div className="loc-col">
        <div className="loc-header">
          <div className="loc-icon">
            <MapPin size={22} />
          </div>
          <div>
            <h2>Your Location</h2>
            <p>Detected coordinates</p>
          </div>
        </div>

        <div className="loc-row">
          <span className="label">Location</span>
          <span className="value">
            {location.city}, {location.country}
          </span>
        </div>

        <div className="loc-row">
          <span className="label">Climate Zone</span>
          <span className="value">
            <span className="badge-climate">{location.climate}</span>
          </span>
        </div>

        <div className="loc-row">
          <span className="label">Coordinates</span>
          <span className="value">
            {location.latitude.toFixed(4)}°N,&nbsp;
            {location.longitude.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* RIGHT: WEATHER INFO */}
      <div className="weather-col">
        <div className="loc-header">
          <div className="loc-icon loc-icon--blue">
            <SunMedium size={22} />
          </div>
          <div>
            <h2>Current Weather</h2>
            <p>Real-time conditions</p>
          </div>
        </div>

        <div className="weather-main">
          <div className="weather-box weather-box--temp">
            <div className="weather-box-icon">
              <ThermometerSun size={24} />
            </div>
            <div>
              <div className="weather-box-value">
                {weather.temperature}°C
              </div>
              <div className="weather-box-label">Temperature</div>
            </div>
          </div>

          <div className="weather-box weather-box--humid">
            <div className="weather-box-icon">
              <Droplets size={24} />
            </div>
            <div>
              <div className="weather-box-value">
                {weather.humidity}%</div>
              <div className="weather-box-label">Humidity</div>
            </div>
          </div>
        </div>

        <div className="weather-footer">
          <div>
            <span className="footer-label">Season</span>
            <span className="footer-value">{weather.season}</span>
          </div>
          <div>
            <span className="footer-label">Condition</span>
            <span className="footer-value">{weather.condition}</span>
          </div>
          <div>
            <span className="footer-label">Rainfall</span>
            <span className="footer-value">{weather.rainfall} mm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
