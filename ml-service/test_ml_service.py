#!/usr/bin/env python3
"""
AgroSmart 360 - ML Service Automated Test Suite
"""

import os
import json
import unittest
from train import predict_single, compute_statistics, load_dataset, DATA_PATH

class TestMLService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.records = load_dataset(DATA_PATH)
        _, cls.centroids = compute_statistics(cls.records)

    def test_dataset_loaded(self):
        self.assertGreater(len(self.records), 50, "Dataset should contain at least 50 records")

    def test_rice_prediction(self):
        # Rice profile: high N, high humidity, high rainfall
        features = {
            "N": 90.0, "P": 45.0, "K": 40.0,
            "temperature": 23.0, "humidity": 82.0, "ph": 6.5,
            "rainfall": 220.0
        }
        pred_label, probs = predict_single(features, self.centroids)
        self.assertEqual(pred_label, "rice", "Should predict rice for high rainfall/humidity profile")
        self.assertGreater(probs.get("rice", 0.0), 0.5, "Rice confidence should exceed 50%")

    def test_chickpea_prediction(self):
        # Chickpea profile: low N, high P, high K, low rainfall
        features = {
            "N": 35.0, "P": 70.0, "K": 80.0,
            "temperature": 18.0, "humidity": 17.0, "ph": 7.2,
            "rainfall": 80.0
        }
        pred_label, _ = predict_single(features, self.centroids)
        self.assertEqual(pred_label, "chickpea", "Should predict chickpea for pulse profile")

    def test_cotton_prediction(self):
        # Cotton profile: high N, moderate rainfall
        features = {
            "N": 120.0, "P": 45.0, "K": 20.0,
            "temperature": 25.0, "humidity": 80.0, "ph": 6.7,
            "rainfall": 180.0
        }
        pred_label, _ = predict_single(features, self.centroids)
        self.assertEqual(pred_label, "cotton", "Should predict cotton for high N vertisol profile")

if __name__ == "__main__":
    unittest.main()
