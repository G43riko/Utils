
#from PyQt5.QtWidgets import QApplication, QWidget

from PyQt5 import QtCore, QtGui, QtWidgets
import cv2
import sys

cap = cv2.VideoCapture(0);
app = QtWidgets.QApplication(sys.argv)

class MyWindow(QtWidgets.QMainWindow):
	def __init__(self):
		super().__init__()
		self.initUI()
		
		
	def initUI(self):
		self.resize(800, 600)
		self.move(300, 300)
		self.setWindowTitle('Simple')

		self.make_menu();
		self.make_toolbar();
		self.make_image();
		self.home();
	def setImage(self, frame):
		frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
		img = QtGui.QImage(frame, frame.shape[1], frame.shape[0], QtGui.QImage.Format_RGB888)
		pix = QtGui.QPixmap.fromImage(img)
		self.label.setPixmap(pix)
	def make_image(self):
		self.label = QtWidgets.QLabel(self)
		#pixmap = QtGui.QPixmap('gabo.jpg')
		#self.label.setPixmap(pixmap)
		offset = 10;
		self.resize(800, 600)
		self.label.resize(640, 480)
		self.label.move(800 - 640 - offset, 600 - 480 - offset);
	def make_toolbar(self):
		extractAction = QtWidgets.QAction('Flee the Scene', self)
		extractAction.triggered.connect(self.close_application)

		self.toolBar = self.addToolBar("Extraction")
		self.toolBar.addAction(extractAction)

	def make_menu(self):
		extractAction = QtWidgets.QAction("&GET TO THE CHOPPAH!!!", self)
		extractAction.setShortcut("Ctrl+Q")
		extractAction.setStatusTip('Leave The App')
		extractAction.triggered.connect(self.close_application)

		self.statusBar()

		mainMenu = self.menuBar()
		fileMenu = mainMenu.addMenu('&File')
		fileMenu.addAction(extractAction)
	def home(self):
		btn = QtWidgets.QPushButton("Quit", self)
		btn.clicked.connect(self.close_application);
		btn.resize(btn.minimumSizeHint())
		btn.move(0,60)
		self.show()
	def close_application(self):
		choice = QtWidgets.QMessageBox.question(self, 'Extract!', "Chceš skončiť??", QtWidgets.QMessageBox.Yes | QtWidgets.QMessageBox.No)
		if choice == QtWidgets.QMessageBox.Yes:
			print("Extracting Naaaaaaoooww!!!!")

			cap.release();
			cv2.destroyAllWindows();
			sys.exit()
		else:
			pass

def run():
	gui = MyWindow()

	def loopAction():
		ret, frame = cap.read();
		gui.setImage(frame);

	timer = QtCore.QTimer()
	timer.timeout.connect(loopAction)
	timer.start(30)
		

	sys.exit(app.exec_())

run();