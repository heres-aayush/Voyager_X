from fastapi import FastAPI, WebSocket
import speech_recognition as sr
import json
import asyncio

app = FastAPI()

def check_microphone():
    try:
        # List microphone names
        mic_list = sr.Microphone.list_microphone_names()
        if not mic_list:
            return False, "No microphones found"
        print("Available microphones:", mic_list)
        return True, mic_list[0]
    except Exception as e:
        return False, str(e)

def recognize_speech_sync():
    # Check microphone first    
    mic_available, message = check_microphone()
    if not mic_available:
        return f"Error: {message}"

    recognizer = sr.Recognizer()
    try:
        # Try to use the default microphone
        with sr.Microphone() as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            print("Listening...")
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
            try:
                text = recognizer.recognize_google(audio)
                return text
            except sr.UnknownValueError:
                return "Could not understand audio"
            except sr.RequestError:
                return "Could not request results"
    except Exception as e:
        return f"Microphone Error: {str(e)}"

@app.websocket("/ws/speech")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            if data == "start":
                await websocket.send_json({"status": "listening"})
                
                loop = asyncio.get_event_loop()
                text = await loop.run_in_executor(None, recognize_speech_sync)
                
                if text.startswith("Error:") or text.startswith("Microphone Error:"):
                    await websocket.send_json({"error": text})
                else:
                    await websocket.send_json({"text": text})
    except Exception as e:
        print(f"Error: {str(e)}")
        await websocket.send_json({"error": str(e)})
