import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style/mapsimplon.css';
import axios from 'axios';

function MapSimplon() {
    const mapStyle = {
        height: '350px',
        width: '700px'
    };

    const factories = [
        {
            "factoryName": "Becode Anvers",
            "lat": 51.2211,
            "lng": 4.39971,
        },
        {
            "factoryName": "Becode Bruxelles",
            "lat": 50.8505,
            "lng": 4.34878,
        },
        {
            "factoryName": "Becode Charleroi",
            "lat": 50.412,
            "lng": 4.44362,
        },
        // Add more factories as needed
    ];

    const [weatherData, setWeatherData] = useState([]);;

    useEffect(() => {
        // Function to fetch weather data for a specific location
        const fetchWeatherData = async (lat, lng) => {
            // Replace 'YOUR_API_KEY' with your actual OpenWeather API key
            const apiKey = '9635f9e06e30fb2404a28b96af67ec69';
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
            
            try {
                const response = await axios.get(apiUrl);
                return response.data;
            } catch (error) {
                console.error('Error fetching weather data:', error);
                return null;
            }
        };

        // Fetch weather data for each factory
        const fetchAllWeatherData = async () => {
            const updatedFactories = await Promise.all(
                factories.map(async (factory) => {
                    const weather = await fetchWeatherData(factory.lat, factory.lng);
                    return { ...factory, weather };
                })
            );

            setWeatherData(updatedFactories);
        };

        fetchAllWeatherData();
    }, []);

    return (
        <div>
            <div style={mapStyle}>
                <MapContainer
                    style={mapStyle}
                    center={[51.505, -0.09]}
                    zoom={4}
                    scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {weatherData.map((factory, index) => (
                        <Marker
                            key={index}
                            position={[factory.lat, factory.lng]}>
                            <Popup>
                                <h2>{factory.factoryName}</h2>
                                <p>Latitude: {factory.lat}</p>
                                <p>Longitude: {factory.lng}</p>
                                {factory.weather && (
                                    <div>
                                        <p>Temperature: {factory.weather.main.temp}°C</p>
                                        <p>Weather: {factory.weather.weather[0].description}</p>
                                        {/* Add more weather data as needed */}
                                    </div>
                                )}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapSimplon;
