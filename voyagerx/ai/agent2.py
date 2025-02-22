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
import re
from typing import Dict, Any  # For type hints
import time

load_dotenv()
# Replace with your actual API keys
GROQ_API_KEY = os.getenv("YOUR_GROQ_API_KEY")
HERE_API_KEY = os.getenv("YOUR_HERE_API_KEY")
OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast"
AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
AVIATIONSTACK_API_URL = "https://router.hereapi.com/v8/routes"
GOOGLE_FLIGHTS_API = os.getenv("GOOGLE_FLIGHTS_API")

# Base Agent Classes and API Clients

class GroqApiClient:
    def __init__(self, api_key):
        self.llm = ChatGroq(
            groq_api_key=api_key,
            model_name="llama3-70b-8192"
        )
        
        system_prompt = """You are Atlas AI, a multi-skilled AI travel consultant who talks in a very friendly manner and you have expertise in:
1. Itinerary Planning
2. Destination Information
3. Transportation Guidance
4. Travel Preparation
5. Local Insights

*Core Protocol*
1. Always respond in the same language as the user's input
2. MODE SELECTION:
- Determine user's need through conversation:
  a) If user wants full itinerary planning → Follow Itinerary Protocol
  b) If user needs specific information → Follow Information Protocol
  c) If user is undecided → Offer guidance on trip planning process
  d) Always respond in the same language as the user's input.For example if the input is in বাংলা , respond in বাংলা.

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
- Always maintain professional yet more of a friendly tone
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
        
    def generate_response(self, prompt: str) -> str:
        try:
            if not prompt or not isinstance(prompt, str):
                return "Please provide a valid text prompt."
            
            # Detect language and add instruction
            lang_instruction = f"\nPlease respond in the same language as this query: {prompt}"
            enhanced_prompt = prompt + lang_instruction
            
            # Get base response with retry logic
            max_retries = 3
            response = None
            for attempt in range(max_retries):
                try:
                    response = self.conversation.predict(input=enhanced_prompt)
                    if response:
                        break
                    time.sleep(2 ** attempt)  # Exponential backoff
                except Exception as e:
                    if attempt == max_retries - 1:  # Last attempt
                        raise
                    time.sleep(2 ** attempt)

            if not response:
                return "I apologize, but I couldn't generate a meaningful response."

            # Enhance formatting
            formatted_response = self._format_response(response)
            return formatted_response

        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            print(error_msg)  # Log the error
            return "I apologize, but I encountered an error. Please try again in a moment."

    def _format_response(self, text: str) -> str:
        """Enhance the formatting of the response."""
        try:
            # Extract potential locations from the text
            here_client = HereApiClient(HERE_API_KEY)
            location_pattern = r'\b(?:in|at|to|from|visit(?:ing)?|stay(?:ing)? (?:in|at)) ([A-Z][a-zA-Z\s]+)(?=[\.,\s])'
            
            # Find all location matches
            matches = re.finditer(location_pattern, text)
            
            # Replace locations with links
            offset = 0
            for match in matches:
                location = match.group(1).strip()
                if len(location) > 2:  # Avoid short matches
                    maps_url = here_client.get_google_maps_url(location)
                    if maps_url:
                        # Create the replacement text with the location name and map link
                        replacement = f"{location} ([__Location->📍__]({maps_url}))"
                        
                        # Calculate positions accounting for previous insertions
                        start = match.start(1) + offset
                        end = match.end(1) + offset
                        
                        # Replace the location with the linked version
                        text = text[:start] + replacement + text[end:]
                        
                        # Update offset for next replacement
                        offset += len(replacement) - len(location)

            # Continue with existing formatting...
            sections = text.split('\n\n')
            formatted_sections = []
            
            for section in sections:
                # Add extra newline before each section for better spacing
                section = f"\n{section}"
                
                # Existing emoji logic
                if any(keyword in section.lower() for keyword in ['hello', 'hi', 'hey', 'greetings']):
                    section = f"👋 {section}"
                elif any(keyword in section.lower() for keyword in ['recommend', 'suggest']):
                    section = f"💡 {section}"
                elif any(keyword in section.lower() for keyword in ['warning', 'caution', 'note']):
                    section = f"⚠️ {section}"
                elif any(keyword in section.lower() for keyword in ['price', 'cost', '$', '€', '£']):
                    section = f"💰 {section}"
                elif any(keyword in section.lower() for keyword in ['time', 'schedule', 'duration']):
                    section = f"⏰ {section}"
                elif any(keyword in section.lower() for keyword in ['location', 'place', 'destination']):
                    section = f"📍 {section}"
                
                formatted_sections.append(f"{section}\n")

            # Rest of existing formatting code...
            response = "\n\n\n".join(formatted_sections)
            
            # Add helpful tips with extra spacing
            if any(keyword in text.lower() for keyword in ['travel', 'trip', 'visit']):
                response += "\n\n\n💭 *Travel Tip: Don't forget to check local customs and current travel advisories!*"
            
            # Add markdown formatting for headers
            final_response = re.sub(r'(?m)^(.+:)$', r'\n\n# \1\n\n', response)
            
            # Add bullet points for lists
            final_response = re.sub(r'(?m)^(\d+\.)(.+)$', r'   ▪️ *\2*\n\n', final_response)
            
            # Add extra spacing between bullet points
            final_response = re.sub(r'(\n   ▪️[^\n]+)(\n   ▪️)', r'\1\n\n\2', final_response)
            
            # Add subtle dividers between major sections
            final_response = re.sub(r'\n\n\n(?=[📍💰⏰💡])', r'\n\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n\n', final_response)
            
            # Clean up excessive newlines
            final_response = re.sub(r'\n{4,}', r'\n\n\n', final_response)
            
            return final_response
            
        except Exception as e:
            print(f"Error in _format_response: {str(e)}")
            return text  # Return original text if formatting fails

class HereApiClient:
    def __init__(self, api_key):
        self.api_key = api_key

    def get_route(self, start: str, destination: str) -> Any:
        url = "https://router.hereapi.com/v8/routes"
        params = {
            "origin": start,
            "destination": destination,
            "apiKey": self.api_key,
            "transportMode": "car"
        }
        response = requests.get(url, params=params)
        return response.json() if response.status_code == 200 else f"Error: {response.status_code}"

    def search_places(self, query: str, location: str) -> Any:
        url = "https://discover.search.hereapi.com/v1/discover"
        params = {
            "q": query,
            "at": location,
            "apiKey": self.api_key
        }
        response = requests.get(url, params=params)
        return response.json() if response.status_code == 200 else f"Error: {response.status_code}"

    def get_coordinates(self, location_name: str) -> Any:
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

    def get_google_maps_url(self, location_name: str, coordinates: tuple = None) -> str:
        """Generate Google Maps URL for a location."""
        try:
            if coordinates:
                lat, lng = coordinates
                # Use place search with coordinates for more accurate results
                return f"https://www.google.com/maps/search/{requests.utils.quote(location_name)}/@{lat},{lng},13z"
            else:
                # Fallback to direct search if no coordinates
                encoded_location = requests.utils.quote(location_name)
                return f"https://www.google.com/maps/search/{encoded_location}"
        except Exception as e:
            print(f"Error generating maps URL: {str(e)}")
            return None

class OpenMeteoClient:
    def __init__(self):
        self.api_url = OPEN_METEO_API_URL

    def get_weather_forecast(self, latitude: float, longitude: float) -> Dict[str, Any]:
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

    def get_flight_status(self, flight_number: str) -> Any:
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

    def get_flights_between_airports(self, dep_iata: str, arr_iata: str, date: str) -> Any:
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

class BaseAgent:
    def __init__(self, name: str, expertise: str):
        self.name = name
        self.expertise = expertise
        self.subagents = []
        
    def add_subagent(self, agent: 'BaseAgent'):
        self.subagents.append(agent)
        
    def handle_query(self, query: Any) -> Dict[str, Any]:
        raise NotImplementedError

class MasterControllerAgent(BaseAgent):
    def __init__(self):
        super().__init__("Master Controller", "Orchestration and Routing")
        self.initialized = False
        self.llm = GroqApiClient(GROQ_API_KEY)  # Add LLM client
        self.initialize_system()
        
    def initialize_system(self):
        try:
            # Create subagents
            self.itinerary_agent = ItineraryAgent()
            self.transport_agent = TransportationAgent()
            self.weather_agent = WeatherAgent()
            
            # Add subagents
            self.add_subagent(self.itinerary_agent)
            self.add_subagent(self.transport_agent)
            self.add_subagent(self.weather_agent)
            
            self.initialized = True
            print("System initialized successfully.")
        except Exception as e:
            print(f"Initialization failed: {str(e)}")
            self.initialized = False
    
    def handle_query(self, query: Any) -> Dict[str, Any]:
        if not self.initialized:
            return {
                "response": "System is still initializing. Please try again in a moment.",
                "agent": self.name,
                "type": "error"
            }
            
        try:
            # First check for greetings
            if self._is_greeting(query):
                return {
                    "response": "Hello! I'm Atlas, your AI travel assistant. How can I help with your travel plans today?",
                    "agent": self.name,
                    "type": "greeting"
                }
                
            # Routing logic based on keywords
            if self._is_itinerary_query(query):
                return self.itinerary_agent.handle_query(query)
            elif self._is_transport_query(query):
                return self.transport_agent.handle_query(query)
            elif self._is_weather_query(query):  # Fix the weather query condition
                return self.weather_agent.handle_query(query)
            else:
                # Use the LLM for general queries instead of a simple message
                response = self.llm.generate_response(query)
                return {
                    "response": response,
                    "agent": self.name,
                    "type": "general_response"
                }
        except Exception as e:
            return {
                "response": f"An error occurred while processing your request: {str(e)}",
                "agent": self.name,
                "type": "error"
            }
    
    def _is_greeting(self, query: str) -> bool:
        # Add multilingual greetings
        greetings = [
            "hi", "hello", "hey", "greetings", "good morning", "good afternoon",
            "hola", "bonjour", "ciao", "hallo", "你好", "こんにちは", "안녕하세요",
            "namaste", "مرحبا", "привет"
        ]
        return any(query.lower().startswith(g) for g in greetings)
    
    def _is_itinerary_query(self, query: str) -> bool:
        return any(keyword in query.lower() for keyword in ["itinerary", "plan", "schedule", "trip plan"])
    
    def _is_transport_query(self, query: str) -> bool:
        return any(keyword in query.lower() for keyword in ["flight", "transport", "route", "how to get"])
    
    def _is_weather_query(self, query: str) -> bool:
        return "weather" in query.lower()

class ItineraryAgent(BaseAgent):
    def __init__(self):
        super().__init__("Itinerary Specialist", "Travel Planning")
        self.llm = GroqApiClient(GROQ_API_KEY)
        self.weather_agent = WeatherAgent()
        
        self.system_prompt = """You are an expert travel planner specializing in:
- Multi-day itinerary creation
- Activity sequencing
- Budget optimization
- Local experience integration
- Risk mitigation planning

Always consider weather conditions when suggesting activities. For outdoor activities, provide alternatives in case of bad weather.

When creating itineraries:
1. Extract all locations being visited
2. Include weather information for each location
3. Suggest appropriate activities based on weather
4. Provide indoor alternatives for rainy days
5. Mention what to pack based on weather conditions"""
        
    def handle_query(self, query: str) -> Dict[str, Any]:
        try:
            # First get the base itinerary response
            response = self.llm.generate_response(query)
            
            # Extract locations from the response
            locations = self._extract_locations(response)
            
            # Get weather for each location and enhance the response
            weather_info = {}
            for location in locations:
                weather_result = self.weather_agent.handle_query(f"weather in {location}")
                if weather_result["type"] != "weather_error":
                    weather_info[location] = weather_result["response"]
            
            # If we found weather information, append it to the response
            if weather_info:
                response += "\n\n**Current Weather Conditions:**\n"
                for location, weather in weather_info.items():
                    response += f"\n{weather}\n"
                
                # Add weather-based recommendations
                response += "\n**Weather-based Recommendations:**\n"
                response += "• Pack appropriate clothing for the temperatures mentioned above\n"
                response += "• Consider indoor alternatives for outdoor activities if rain is forecasted\n"
                response += "• Check weather updates closer to your travel dates as conditions may change\n"
            
            return {
                "type": "itinerary",
                "response": response,
                "agent": self.name,
                "weather_data": weather_info
            }
        except Exception as e:
            return {
                "response": f"Failed to generate itinerary: {str(e)}",
                "agent": self.name,
                "type": "error"
            }
    
    def _extract_locations(self, text: str) -> list:
        # Enhanced location extraction
        locations = set()
        
        # Look for city names after prepositions
        location_patterns = [
            r'(?:in|to|from|at|visit(?:ing)?) ([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*)',
            r'([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*) (?:city|town|village|area)',
            r'stay(?:ing)? (?:in|at) ([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*)'
        ]
        
        for pattern in location_patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                location = match.group(1).strip()
                if len(location) > 2:  # Avoid short abbreviations
                    locations.add(location)
        
        return list(locations)

class TransportationAgent(BaseAgent):
    def __init__(self):
        super().__init__("Transportation Expert", "Mobility Solutions")
        self.here_client = HereApiClient(HERE_API_KEY)
        self.llm = GroqApiClient(GROQ_API_KEY)
        
    def handle_query(self, query: Any) -> Dict[str, Any]:
        try:
            print(f"Processing transport query: {query}")  # Debug log
            
            # If it's a flight-related query
            if isinstance(query, str) and any(keyword in query.lower() for keyword in ["flight", "fly", "plane", "airport"]):
                # Use LLM to extract flight details
                prompt = f"""Extract flight details from this query. Return only a JSON with these exact keys:
                dep_iata: departure airport IATA code
                arr_iata: arrival airport IATA code
                date: date in YYYY-MM-DD format
                Query: {query}"""
                
                llm_response = self.llm.generate_response(prompt)
                try:
                    # Try to parse the JSON response
                    flight_details = json.loads(llm_response)
                    return self.get_flight_data(
                        flight_details.get("dep_iata", ""),
                        flight_details.get("arr_iata", ""),
                        flight_details.get("date", "")
                    )
                except json.JSONDecodeError:
                    return {
                        "type": "flight_error",
                        "response": "Could not parse flight details. Please provide departure airport (IATA), arrival airport (IATA), and date (YYYY-MM-DD).",
                        "agent": self.name
                    }
            
            # If it's already a structured flight query
            elif isinstance(query, dict):
                return self.get_flight_data(
                    query.get("dep_iata", ""),
                    query.get("arr_iata", ""),
                    query.get("date", "")
                )
            
            # For other transport queries
            else:
                response = self.llm.generate_response(query)
                return {
                    "type": "transport_info",
                    "response": response,
                    "agent": self.name
                }
                
        except Exception as e:
            print(f"Error in handle_query: {str(e)}")  # Debug log
            return {
                "type": "error",
                "response": f"Error processing transportation query: {str(e)}",
                "agent": self.name
            }

    def get_flight_data(self, dep_iata: str, arr_iata: str, date: str) -> Dict[str, Any]:
        try:
            print(f"Getting flight data for {dep_iata} to {arr_iata} on {date}")  # Debug log
            
            # Validate inputs
            dep_iata = dep_iata.strip().upper()
            arr_iata = arr_iata.strip().upper()
            date = date.strip()
            
            if not all([dep_iata, arr_iata, date]):
                return {
                    "type": "flight_error",
                    "response": "Missing required flight parameters. Please provide departure airport, arrival airport, and date.",
                    "agent": self.name
                }
            
            if len(dep_iata) != 3 or len(arr_iata) != 3:
                return {
                    "type": "flight_error",
                    "response": "Invalid IATA airport codes. Please use 3-letter IATA codes (e.g., JFK, LAX).",
                    "agent": self.name
                }
            
            # Use SerpApi to get Google Flights data
            params = {
                "engine": "google_flights",
                "departure_id": dep_iata,
                "arrival_id": arr_iata,
                "outbound_date": date,
                "api_key": GOOGLE_FLIGHTS_API
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            if not results or "error" in results:
                return {
                    "type": "flight_error",
                    "response": f"Error fetching flight data: {results.get('error', 'No results found')}",
                    "agent": self.name
                }
            
            # Format the results
            formatted_response = self._format_flight_results(results, dep_iata, arr_iata, date)
            
            return {
                "type": "flight_info",
                "response": formatted_response,
                "raw_data": results,
                "agent": self.name
            }
            
        except Exception as e:
            print(f"Error in get_flight_data: {str(e)}")  # Debug log
            return {
                "type": "flight_error",
                "response": f"Failed to get flight information: {str(e)}",
                "agent": self.name
            }

    def _format_flight_results(self, results: Dict[str, Any], dep_iata: str, arr_iata: str, date: str) -> str:
        try:
            flights = results.get("flights_results", [])
            if not flights:
                return f"No flights found from {dep_iata} to {arr_iata} on {date}"
            
            response = f"**Flights from {dep_iata} to {arr_iata} on {date}**\n\n"
            
            for idx, flight in enumerate(flights, 1):
                response += f"Flight Option {idx}:\n"
                
                # Airline and flight number
                airline = flight.get('airline', 'N/A')
                flight_number = flight.get('flight_number', '')
                response += f"• Airline: {airline}\n"
                if flight_number:
                    response += f"• Flight Number: {flight_number}\n"
                
                # Duration and stops
                duration = flight.get('duration', 'N/A')
                stops = flight.get('stops', 'N/A')
                response += f"• Duration: {duration}\n"
                response += f"• Stops: {stops}\n"
                
                # Departure details
                dep_time = flight.get('departure_time', {})
                if dep_time:
                    time = dep_time.get('time', 'N/A')
                    airport = dep_time.get('airport', dep_iata)
                    response += f"• Departure: {time} ({airport})\n"
                
                # Arrival details
                arr_time = flight.get('arrival_time', {})
                if arr_time:
                    time = arr_time.get('time', 'N/A')
                    airport = arr_time.get('airport', arr_iata)
                    response += f"• Arrival: {time} ({airport})\n"
                
                # Price
                price = flight.get('price', 'N/A')
                response += f"• Price: {price}\n\n"
            
            response += "*Note: Prices and availability may change. Please verify with the airline before booking.*"
            return response
            
        except Exception as e:
            print(f"Error formatting flight results: {str(e)}")  # Debug log
            return f"Error formatting flight results: {str(e)}"

class WeatherAgent(BaseAgent):
    def __init__(self):
        super().__init__("Meteorology Specialist", "Weather Analysis")
        self.weather_client = OpenMeteoClient()
        self.here_client = HereApiClient(HERE_API_KEY)

    def handle_query(self, query: str) -> Dict[str, Any]:
        try:
            print(f"Processing weather query: {query}")
            
            # Extract main location only
            location = self._extract_location(query)
            if not location:
                return {
                    "type": "weather_error",
                    "response": "I couldn't determine the location. Please specify a city or location.",
                    "agent": self.name
                }
            
            # Only get weather for the main location
            coords = self.here_client.get_coordinates(location)
            if not coords:
                return {
                    "type": "weather_error",
                    "response": f"I couldn't find the location '{location}'. Please check the spelling.",
                    "agent": self.name
                }
            
            weather = self.weather_client.get_weather_forecast(*coords)
            if isinstance(weather, dict) and "error" in weather:
                return {
                    "type": "weather_error",
                    "response": f"Error getting weather data: {weather['error']}",
                    "agent": self.name
                }

            # Format the weather response
            response = self._format_weather_response(location, weather)
            
            return {
                "type": "weather_report",
                "response": response,
                "location": location,
                "data": weather,
                "agent": self.name
            }
            
        except Exception as e:
            print(f"Error in handle_query: {str(e)}")
            return {
                "type": "weather_error",
                "response": f"An error occurred while getting weather information: {str(e)}",
                "agent": self.name
            }

    def _extract_location(self, query: str) -> str:
        try:
            # Multiple patterns to match location names
            patterns = [
                r'weather (?:in|for|at) ([A-Za-z\s]+)',  # "weather in New York"
                r'(?:in|at) ([A-Za-z\s]+) weather',      # "in London weather"
                r'([A-Za-z\s]+)(?:\'s)? weather',        # "Paris weather" or "Paris's weather"
                r'temperature (?:in|at) ([A-Za-z\s]+)',  # "temperature in Tokyo"
                r'forecast (?:for|in) ([A-Za-z\s]+)',    # "forecast for Chicago"
                r'([A-Za-z\s]+) (?:weather|temperature|forecast)'  # "London weather"
            ]
            
            for pattern in patterns:
                match = re.search(pattern, query, re.IGNORECASE)
                if match:
                    location = match.group(1).strip()
                    # Clean up the location name
                    location = re.sub(r'\s+', ' ', location)  # Remove extra spaces
                    return location

            # If no pattern matches, try to extract the last meaningful word sequence
            words = query.split()
            location_words = []
            for word in words:
                if word.lower() not in ['weather', 'temperature', 'forecast', 'in', 'at', 'for', 'the']:
                    location_words.append(word)
            
            if location_words:
                return ' '.join(location_words)
                
            return None
            
        except Exception as e:
            print(f"Error in _extract_location: {str(e)}")  # Debug log
            return None

    def _format_weather_response(self, location: str, weather: Dict[str, Any]) -> str:
        try:
            response = f"**Weather in {location}**\n\n"
            
            # Add temperature
            if 'temperature' in weather:
                response += f"🌡️ Temperature: {weather['temperature']}°C\n"
            
            # Add weather description
            if 'description' in weather:
                response += f"☁️ Conditions: {weather['description']}\n"
            
            # Add precipitation probability if available
            if 'precipitation_probability' in weather and weather['precipitation_probability'] is not None:
                response += f"🌧️ Chance of precipitation: {weather['precipitation_probability']}%\n"
            
            # Add recommendations based on weather
            response += "\n**Recommendations:**\n"
            
            # Temperature-based recommendations
            temp = weather.get('temperature', 0)
            if temp < 10:
                response += "• Dress warmly with layers\n"
                response += "• Don't forget a warm coat and gloves\n"
            elif temp < 20:
                response += "• Light jacket or sweater recommended\n"
                response += "• Comfortable for outdoor activities\n"
            else:
                response += "• Light clothing suitable\n"
                response += "• Don't forget sun protection\n"
            
            # Precipitation-based recommendations
            precip_prob = weather.get('precipitation_probability', 0)
            if precip_prob and precip_prob > 30:
                response += "• Carry an umbrella\n"
                response += "• Consider indoor alternatives for activities\n"
            
            return response
            
        except Exception as e:
            print(f"Error in _format_weather_response: {str(e)}")  # Debug log
            return f"Weather data available for {location}, but there was an error formatting the response."

# class MediaAgent(BaseAgent):
#     def __init__(self):
#         super().__init__("Media Curator", "Content Enhancement")
#         self.unsplash_client = UnsplashClient(UNSPLASH_API_KEY)
#     def get_location_images(self, locations):
#         return {loc: self.unsplash_client.get_location_images(loc) for loc in locations}

class TravelAIAgent:
    def __init__(self):
        self.controller = MasterControllerAgent()
        
    def process_query(self, query: Any) -> Dict[str, Any]:
        try:
            if not query or not isinstance(query, str):
                return {
                    "response": "Please provide a valid text query",
                    "agent": "System",
                    "type": "input_error"
                }
            return self.controller.handle_query(query)
        except Exception as e:
            return {
                "response": f"System error: {str(e)}",
                "agent": "System",
                "type": "critical_error"
            }
        
    def get_flights(self, dep_iata: str, arr_iata: str, outbound_date: str, round_trip: bool=False, return_date: str=None) -> Dict[str, Any]:
        try:
            if not all([dep_iata, arr_iata, outbound_date]):
                raise ValueError("Missing required flight parameters")
            
            if len(dep_iata) != 3 or len(arr_iata) != 3:
                raise ValueError("Invalid IATA airport codes")
            
            flight_query = {
                "dep_iata": dep_iata.upper(),
                "arr_iata": arr_iata.upper(),
                "date": outbound_date,
                "return_date": return_date if round_trip else None
            }
            
            transport_agent = self.controller.transport_agent
            return transport_agent.handle_flight_query(flight_query)
            
        except ValueError as ve:
            return {
                "response": f"Validation error: {str(ve)}",
                "agent": "TransportationSystem",
                "type": "input_error"
            }
        except Exception as e:
            return {
                "response": f"Flight search failed: {str(e)}",
                "agent": "TransportationSystem",
                "type": "api_error"
            }

# Flask Integration
app = Flask(__name__)
CORS(app)
agent = TravelAIAgent()

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "No message provided."}), 400
    
    response = agent.process_query(message)
    return jsonify(response)

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
