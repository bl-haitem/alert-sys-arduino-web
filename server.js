import express from "express";
import cors from "cors";
import { SerialPort, ReadlineParser } from "serialport";

const app = express();
app.use(cors());

const serial = new SerialPort({ path: "COM5", baudRate: 9600 });
const parser = serial.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let baseline = null;
let alert = false;
let consecutiveAlerts = 0;
const THRESHOLD = 10; // فرق 10 سم
const REQUIRED_HITS = 2; // يجب أن يتكرر مرتين متتاليتين

parser.on("data", (data) => {
  const distance = parseInt(data, 10);

  if (!isNaN(distance) && distance > 0) {
    if (baseline === null) {
      baseline = distance;
      console.log(`Baseline set to ${baseline} cm`);
    }

    if (distance < baseline - THRESHOLD) {
      consecutiveAlerts++;
      if (consecutiveAlerts >= REQUIRED_HITS) {
        alert = true;
        console.log(`Intrusion detected! Distance=${distance}`);
      }
    } else {
      consecutiveAlerts = 0;
      alert = false;
    }
  }
});

app.get("/status", (req, res) => {
  res.json({
    alert: alert,
    time: new Date().toLocaleTimeString(),
  });
});

app.listen(3001, () =>
  console.log(`Server running on http://localhost:3001`)
);
