from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator, LANGUAGES
import requests

app = Flask(__name__)
CORS(app)

translator = Translator()

# Get all Google Translate language codes (free/unofficial)
google_all_langs = list(LANGUAGES.keys())

# Multiple LibreTranslate fallback servers
LIBRE_SERVERS = [
    "https://translate.fedilab.app/translate",
    "https://libretranslate.de/translate",
    "https://translate.astian.org/translate"
]

def libre_translate(text, target):
    payload = {
        "q": text,
        "source": "en",
        "target": target,
        "format": "text"
    }

    for server in LIBRE_SERVERS:
        try:
            r = requests.post(server, json=payload, timeout=15)
            if r.status_code == 200:
                return r.json().get("translatedText", "")
        except:
            continue  # try next server

    return None  # all servers failed

@app.route("/api/translate", methods=["POST"])
def translate_text():
    try:
        data = request.get_json(force=True)
        text = data.get("text", "").strip()
        target_lang = data.get("targetLang", "").strip().lower()

        if not text or not target_lang:
            return jsonify({"error": "Missing text or target language"}), 400

        # Google Translate for all supported languages
        if target_lang in google_all_langs:
            try:
                result = translator.translate(text, dest=target_lang)
                translated = result.text
            except Exception as e:
                return jsonify({"error": f"Google Translate error: {str(e)}"}), 500

        # LibreTranslate for other languages
        else:
            translated = libre_translate(text, target_lang)
            if not translated:
                return jsonify({"error": "LibreTranslate failed on all servers"}), 500

        return jsonify({"translatedText": translated})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
