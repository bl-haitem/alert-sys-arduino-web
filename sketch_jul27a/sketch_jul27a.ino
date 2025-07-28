#define TRIG 9
#define ECHO 10

long duration;
int distance;
int baseline = 0;
bool calibrated = false;

int readDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  duration = pulseIn(ECHO, HIGH, 30000UL);
  return (duration > 0) ? duration * 0.034 / 2 : 0;
}

void calibrateBaseline() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += readDistance();
    delay(100);
  }
  baseline = sum / 10;
  calibrated = true;
  Serial.print("B:"); Serial.println(baseline); // baseline للباك
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
  calibrateBaseline();
}

void loop() {
  distance = readDistance();
  Serial.println(distance); // إرسال المسافة
  delay(500);
}
