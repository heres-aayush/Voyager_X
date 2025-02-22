import os
from groq import Groq
from dotenv import load_dotenv 
from flask import Flask, request, jsonify
import requests
import json
from serpapi import GoogleSearch  

from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_groq import ChatGroq
from flask_cors import CORS

load_dotenv()
# Replace with your actual API keys
GROQ_API_KEY = os.getenv("YOUR_GROQ_API_KEY")
HERE_API_KEY = os.getenv("YOUR_HERE_API_KEY")
OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast"
AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
AVIATIONSTACK_API_URL = "https://router.hereapi.com/v8/routes"
GOOGLE_FLIGHTS_API = os.getenv("GOOGLE_FLIGHTS_API")

# Groq API Client remains unchanged
class GroqApiClient:
    def __init__(self, api_key):
        self.llm = ChatGroq(
            groq_api_key=api_key,
            model_name="llama3-70b-8192"
        )
        
        system_prompt = """You are Atlas AI, a multi-skilled AI travel consultant who talks in a friendly manner and you have expertise in:
1. Itinerary Planning
2. Destination Information
3. Transportation Guidance
4. Travel Preparation
5. Local Insights

*Core Protocol*
1. MODE SELECTION:
- Determine user's need through conversation:
  a) If user wants full itinerary planning → Follow Itinerary Protocol
  b) If user needs specific information → Follow Information Protocol
  c) If user is undecided → Offer guidance on trip planning process

2. ITINERARY PROTOCOL (ONLY WHEN EXPLICITLY REQUESTED):
- Follow detailed planning process:
  * Collect ALL required information (dates, destination, preferences, etc.)
  * Create structured day-by-day plan
  * Include transport, costs, and alternatives
  * Provide packing suggestions
  * Offer revision options

3. INFORMATION PROTOCOL:
- Provide detailed, accurate information about:
  * Transportation options (flights, trains, local transit)
  * Visa requirements and documentation
  * Local customs and etiquette
  * Must-see attractions and hidden gems
  * Weather patterns and packing suggestions
  * Safety information and emergency contacts
  * Currency and payment methods
  * Language tips and key phrases

4. GENERAL GUIDANCE:
- Always maintain professional yet more of a  friendly tone
- Ask clarifying questions when needed
- Provide multiple options when applicable
- Highlight unique local experiences
- Offer to switch between modes as needed
- Use HERE API data for accurate transport information
- Suggest related travel considerations

*Critical Rules*
- Never assume user wants itinerary unless explicitly stated
- Always confirm understanding before proceeding
- Maintain flexibility in conversation flow
- Provide clear, structured information in all modes
- Offer to expand or reduce detail level as needed
- for price detailing never forget to mention that price may change
- Please format your responses in Markdown"""
        
        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(system_prompt),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])
        
        self.memory = ConversationBufferMemory(return_messages=True)
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=prompt_template,
            verbose=False
        )

    def generate_response(self, prompt):
        try:
            return self.conversation.predict(input=prompt)
        except Exception as e:
            return f"Error: {str(e)}"

# HereApiClient remains available for route and weather queries
class HereApiClient:
    def __init__(self, api_key):
        self.api_key = api_key

    def get_route(self, start, destination):
        url = "https://router.hereapi.com/v8/routes"
        params = {
            "origin": start,
            "destination": destination,
            "apiKey": self.api_key,
            "transportMode": "car"
        }
        response = requests.get(url, params=params)
        return response.json() if response.status_code == 200 else f"Error: {response.status_code}"

    def search_places(self, query, location):
        url = "https://discover.search.hereapi.com/v1/discover"
        params = {
            "q": query,
            "at": location,
            "apiKey": self.api_key
        }
        response = requests.get(url, params=params)
        return response.json() if response.status_code == 200 else f"Error: {response.status_code}"

    def get_coordinates(self, location_name):
        url = "https://geocode.search.hereapi.com/v1/geocode"
        params = {
            "q": location_name,
            "apiKey": self.api_key
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data.get("items"):
                position = data["items"][0]["position"]
                return position["lat"], position["lng"]
            else:
                return None
        else:
            return None

class OpenMeteoClient:
    def __init__(self):
        self.api_url = OPEN_METEO_API_URL

    def get_weather_forecast(self, latitude, longitude):
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current_weather": True,
            "daily": "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
            "timezone": "auto"
        }
        response = requests.get(self.api_url, params=params)
        if response.status_code == 200:
            data = response.json()
            current = data.get("current_weather", {})
            daily = data.get("daily", {})

            temperature = current.get("temperature")
            weather_code = current.get("weathercode")
            time_str = current.get("time")

            today_index = daily.get("time", []).index(time_str.split("T")[0]) if "time" in daily else None
            precipitation_probability = daily.get("precipitation_probability_max", [None])[today_index] if today_index is not None else None

            weather_code_map = {
                0: "Clear sky",
                1: "Mainly clear",
                2: "Partly cloudy",
                3: "Overcast",
                45: "Fog",
                48: "Depositing rime fog",
                51: "Light drizzle",
                53: "Moderate drizzle",
                55: "Dense drizzle",
                56: "Light freezing drizzle",
                57: "Dense freezing drizzle",
                61: "Slight rain",
                63: "Moderate rain",
                65: "Heavy rain",
                66: "Light freezing rain",
                67: "Heavy freezing rain",
                71: "Slight snow fall",
                73: "Moderate snow fall",
                75: "Heavy snow fall",
                77: "Snow grains",
                80: "Slight rain showers",
                81: "Moderate rain showers",
                82: "Violent rain showers",
                85: "Slight snow showers",
                86: "Heavy snow showers",
                95: "Thunderstorm",
                96: "Thunderstorm with slight hail",
                99: "Thunderstorm with heavy hail"
            }
            description = weather_code_map.get(weather_code, "Unknown weather")

            return {
                "temperature": temperature,
                "precipitation_probability": precipitation_probability,
                "description": description
            }
        else:
            return {"error": f"API request failed with status code {response.status_code}"}

class AviationStackClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = AVIATIONSTACK_API_URL

    def get_flight_status(self, flight_number):
        params = {
            "access_key": self.api_key,
            "flight_iata": flight_number
        }
        response = requests.get(self.api_url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data.get("data"):
                flight = data["data"][0]
                return {
                    "flight_number": flight.get("flight", {}).get("iata"),
                    "departure_airport": flight.get("departure", {}).get("airport"),
                    "arrival_airport": flight.get("arrival", {}).get("airport"),
                    "status": flight.get("flight_status"),
                    "departure_time": flight.get("departure", {}).get("estimated"),
                    "arrival_time": flight.get("arrival", {}).get("estimated")
                }
            else:
                return {"error": "No flight data found"}
        else:
            return {"error": f"API request failed with status code {response.status_code}"}

    def get_flights_between_airports(self, dep_iata, arr_iata, date):
        params = {
            "access_key": self.api_key,
            "dep_iata": dep_iata,
            "arr_iata": arr_iata,
            "flight_date": date
        }
        response = requests.get(self.api_url, params=params)
        if response.status_code == 200:
            return response.json().get('data', [])
        return {"error": f"API Error: {response.status_code}"}


class TravelAIAgent:
    
    def __init__(self, groq_api_key, here_api_key):
        self.groq_client = GroqApiClient(groq_api_key)
        self.here_client = HereApiClient(here_api_key)
        self.weather_client = OpenMeteoClient()
        #self.aviation_client = AviationStackClient(AVIATIONSTACK_API_KEY)

    def chat(self, message):
        response = self.groq_client.generate_response(message)
        return {"response": response}

    def interact_with_user(self, input_text):
        if "route" in input_text.lower():
            start = input("Enter starting location: ")
            destination = input("Enter destination: ")
            route = self.here_client.get_route(start, destination)
            return f"Route details: {json.dumps(route, indent=2)}"
        elif "places" in input_text.lower():
            query = input("What are you looking for? (e.g., restaurants, hotels): ")
            location = input("Enter location (e.g., Berlin): ")
            places = self.here_client.search_places(query, location)
            return f"Places found: {json.dumps(places, indent=2)}"
        elif "weather" in input_text.lower():
            location = input("Enter location for weather forecast (e.g., Berlin): ")
            coords = self.here_client.get_coordinates(location)
            if not coords:
                return "Sorry, could not find coordinates for that location."
            lat, lng = coords
            weather = self.weather_client.get_weather_forecast(lat, lng)
            if isinstance(weather, dict) and "error" not in weather:
                precipitation = weather.get('precipitation_probability', "N/A")
                return (
                    f"Weather forecast for {location}:\n"
                    f"Temperature: {weather['temperature']}°C\n"
                    f"Precipitation Probability: {precipitation}%\n"
                    f"Conditions: {weather['description']}"
                )
            else:
                return f"Error retrieving weather: {weather.get('error', 'Unknown error')}"
    def get_flights(self, dep_iata, arr_iata, outbound_date, round_trip=False, return_date=None):
        # Construct a search query for flight info.
        query = f"flights from {dep_iata} to {arr_iata} on {outbound_date}"
        if round_trip and return_date:
            query += f" return on {return_date}"
        
        params = {
            "engine": "google",  # Use the general Google search engine
            "q": query,
            "hl": "en",
            "num": "5",  # Limit to top 5 results
            "api_key": GOOGLE_FLIGHTS_API
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        if "error" in results:
            return {"error": results["error"]}

        result_str = f"Search results for: {query}\n\n"
        organic_results = results.get("organic_results", [])
        if organic_results:
            for res in organic_results:
                title = res.get("title", "No title")
                snippet = res.get("snippet", "No description")
                link = res.get("link", "No link")
                result_str += f"**{title}**\n{snippet}\nLink: {link}\n\n"
            return {"result": result_str}
        else:
            return {"result": "No flight-related results found."}

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

agent = TravelAIAgent(GROQ_API_KEY, HERE_API_KEY)

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "No message provided."}), 400
    result = agent.chat(message)
    return jsonify(result)

@app.route("/api/flights", methods=["POST"])
def api_flights():
    data = request.get_json()
    dep_iata = data.get("dep_iata", "").strip().upper()
    arr_iata = data.get("arr_iata", "").strip().upper()
    outbound_date = data.get("outbound_date", "").strip()
    round_trip = data.get("round_trip", False)
    return_date = data.get("return_date", "").strip() if round_trip else None

    if not dep_iata or not arr_iata or not outbound_date:
        return jsonify({"error": "Please provide departure IATA, arrival IATA, and outbound date."}), 400

    result = agent.get_flights(dep_iata, arr_iata, outbound_date, round_trip, return_date)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)