#!/usr/bin/env python3
"""
AgroSmart 360 - Standalone Zero-Dependency ML Inference Server
Stage 3: Provides HTTP REST API on port 8000 using only Python standard library.
Compatible with standard Python 3.8+ environments.
"""

import os
import json
import math
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("ML_PORT", "8000"))
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "crop_classifier.json")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "model", "evaluation_metrics.json")

model_data = None
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "r", encoding="utf-8") as f:
        model_data = json.load(f)

CROP_NAME_MAP = {
    "rice": "Basmati & Wetland Rice",
    "wheat": "Bread Wheat",
    "chickpea": "Desi & Kabuli Chickpea",
    "maize": "Yellow Hybrid Maize (Corn)",
    "cotton": "Bt Cotton (Long Staple)",
    "jute": "Golden Fibre Jute",
    "coffee": "Arabica & Robusta Coffee",
    "kidneybeans": "Rajma (Kidney Beans)",
    "pigeonpeas": "Arhar (Pigeon Pea)",
    "mothbeans": "Moth Bean",
    "mungbean": "Green Mungbean",
    "blackgram": "Black Urad Bean",
    "lentil": "Masoor (Lentil)"
}

class MLRequestHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health" or self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            resp = {
                "status": "UP",
                "service": "AgroSmart-ML-Engine",
                "model_loaded": model_data is not None,
                "model_version": model_data.get("version", "3.1.0") if model_data else "none",
                "features": model_data.get("features", []) if model_data else [],
                "port": PORT
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/predict":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                self.send_response(400)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"detail": "Invalid JSON input"}).encode("utf-8"))
                return

            if not model_data or "centroids" not in model_data:
                self.send_response(503)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"detail": "Model artifact not initialized"}).encode("utf-8"))
                return

            # Required parameters
            for k in ["N", "P", "K", "temperature", "ph", "rainfall"]:
                if k not in data:
                    self.send_response(422)
                    self._send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"detail": f"Missing required field: {k}"}).encode("utf-8"))
                    return

            centroids = model_data["centroids"]
            features = {
                "N": float(data["N"]),
                "P": float(data["P"]),
                "K": float(data["K"]),
                "temperature": float(data["temperature"]),
                "humidity": float(data.get("humidity", 65.0)),
                "ph": float(data["ph"]),
                "rainfall": float(data["rainfall"])
            }

            scores = {}
            for label, stat in centroids.items():
                log_prob = math.log(stat["prior"])
                for k, v in features.items():
                    if k in stat["means"]:
                        m = stat["means"][k]
                        s = max(0.5, stat["stds"][k])
                        exponent = -0.5 * ((v - m) / s) ** 2
                        log_prob += exponent - math.log(s * math.sqrt(2 * math.pi))
                scores[label] = log_prob

            max_score = max(scores.values())
            exp_scores = {k: math.exp(v - max_score) for k, v in scores.items()}
            sum_exp = sum(exp_scores.values())
            sorted_probs = sorted(
                [(k, exp_scores[k] / sum_exp) for k in exp_scores],
                key=lambda x: x[1],
                reverse=True
            )

            top_crop, top_prob = sorted_probs[0]
            display_name = CROP_NAME_MAP.get(top_crop, top_crop.title())
            alternatives = [
                {"crop": CROP_NAME_MAP.get(c, c.title()), "probability": round(p, 4)}
                for c, p in sorted_probs[1:4]
            ]

            caveats = [
                "Prediction derived from ICAR open research trials.",
                "Cross-reference with field irrigation infrastructure."
            ]
            uncertainty_warning = None
            if top_prob < 0.45:
                uncertainty_warning = "Moderate prediction dispersion across multiple candidate crops."

            result = {
                "predicted_crop": display_name,
                "confidence": round(top_prob, 4),
                "model_version": model_data.get("version", "3.1.0"),
                "alternative_predictions": alternatives,
                "validation_status": "VALID",
                "uncertainty_warning": uncertainty_warning,
                "caveats": caveats
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), MLRequestHandler)
    print(f"AgroSmart 360 ML Server running on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()
