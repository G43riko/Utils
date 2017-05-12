import numpy as np
import cv2
import matplotlib.pyplot as plt


saveFile = False;
cap = cv2.VideoCapture(0);

if saveFile:
	fourcc = cv2.VideoWritter_fourcc(*'XVID');
	out = cv2.VideoWritter("output.avi", fourcc, 20.0, (640, 480));

def makeGrey(original_image):
	processed_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY);
	return processed_image;

def makeEdges(original_image):
	processed_image = makeGrey(original_image);
	processed_image = cv2.Canny(processed_image, threshold1=200, threshold2=300);
	return processed_image

def makeMask(original_image):
	img2gray = makeGrey(original_image);
	ret, mask = cv2.threshold(img2gray, 240, 255, cv2.THRESH_BINARY_INV);
	return mask;

def makeThreshold(original_image):
	ret, threshold = cv2.threshold(original_image, 12, 255, cv2.THRESH_BINARY);
	return threshold;


def makeGreyThreshold(original_image):
	greyscaled = makeGrey(original_image);
	#ret, threshold = cv2.threshold(greyscaled, 12, 255, cv2.THRESH_BINARY);
	#return threshold;
	gaus = cv2.adaptiveThreshold(greyscaled, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 151, 1);
	return gaus;

def makeFilterColor(original_image, minVal = [0, 0, 0], maxVal = [255, 255, 255]):
	hsv = cv2.cvtColor(original_image, cv2.COLOR_BGR2HSV);
	mask = cv2.inRange(hsv, np.array(minVal), np.array(maxVal));
	res = cv2.bitwise_and(original_image, original_image, mask = mask);
	return res;

def makeFilterColorSmooth(original_image, minVal = [0, 0, 0], maxVal = [255, 255, 255]):
	kernel = np.ones((15, 15), np.float32) / 225;
	smoother = cv2.filter2D(makeFilterColor(original_image, minVal, maxVal), -1, kernel);
	return smoother

def findMatches(source, patern, numberOfMatches = 10):
	orb = cv2.ORB_create();
	kp1, des1 = orb.detectAndCompute(source, None);
	kp2, des2 = orb.detectAndCompute(patern, None);
	bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck = True);
	matches = bf.match(des1, des2);
	matches = sorted(matches, key = lambda x:x.distance)
	res = cv2.drawMatches(source, kp1, patern, kp2, matches[:numberOfMatches], None, flags = 2);
	return res;

face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml");
eye_cascade = cv2.CascadeClassifier("haarcascade_eye.xml");
def findFace(source):
	greyscaled = cv2.cvtColor(source, cv2.COLOR_BGR2GRAY);
	faces = face_cascade.detectMultiScale(greyscaled, 1.3, 5);
	for(x, y, w, h) in faces:
		cv2.rectangle(source, (x, y), (x + w, y + h), (255, 0, 0), 2);
		roi_gray = greyscaled[y:y + h, x:x + w];
		roi_color = source[y:y + h, x:x + w];
		eyes = eye_cascade.detectMultiScale(roi_gray)
		for(ex, ey, ew, eh) in eyes:
			cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2);
	return source;


fgbg = cv2.createBackgroundSubtractorMOG2();
def findMovement(source):
	fgmask = fgbg.apply(source);
	return fgmask;

gabo = cv2.imread("gabo.jpg", 0);

while True:
	ret, frame = cap.read();
	#frame = makeEdges(frame);
	#frame = makeGrey(frame);
	#frame = makeMask(frame);
	#frame = makeThreshold(frame);
	#frame = makeGreyThreshold(frame);
	#frame = makeFilterColor(frame, [0, 0, 0], [205, 205, 205]);
	#frame = makeFilterColorSmooth(frame, [0, 0, 0], [205, 205, 205]);
	#frame = findMatches(frame, gabo);
	#frame = findMovement(frame);
	#frame = findFace(frame);
	if saveFile:
		out.write(frame);
	cv2.imshow("frame", frame);
	cv2.imshow("frame2", makeGreyThresholdcv(frame))
	if cv2.waitKey(1) & 0xFF == ord('q'):
		break;

cap.release();

if saveFile:
	out.release();
cv2.destroyAllWindows();