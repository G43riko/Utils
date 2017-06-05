def printPlatformInfo():
	import platform

	print('platform:', platform.platform());
	print('platform machine:', platform.machine());
	print('platform version:', platform.version());
	print('platform system:', platform.system());
	print('platform processor:', platform.processor());

	uname_result = platform.uname();
	print('platform node:', uname_result.node);
	print('platform release:', uname_result.release);


def printSocketInfo():
	import socket
	print('hostName:', socket.gethostname())
	print('ip:', socket.gethostbyname(socket.gethostname()))

def printOsInfo():
	import os
	print('currentPath:', os.path.dirname(os.path.abspath(__file__)))
	print('os name:', os.name)
	print('proces id:', os.getpid())
	print('userId:', os.getuid());

	mem_bytes = os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')  # e.g. 4015976448
	mem_gib = mem_bytes / (1024.**3)  # e.g. 3.74
	print('RAM:', mem_gib)

def printTimeInfo():
	import time
	now = time.time()
	print('time:', time.ctime(now))

def printSysInfo():
	import sys
	print('platform:', sys.platform)

def printGetpassInfo():
	import getpass
	print('userName:', getpass.getuser())

printPlatformInfo();
printSocketInfo();
printOsInfo();
printTimeInfo();
printSysInfo();
printGetpassInfo();


#DONT WORK

#print('HOME:', os.environ('HOME'));
#print('getlogin():', os.getlogin());

#from psutil import virtual_memory
#mem = virtual_memory()
#printf('RAM:', mem.total);

#import netifaces as ni
#ni.ifaddresses('wlo1')
#ip = ni.ifaddresses('wlo1')[2][0]['addr']
#print('ip:', ip)