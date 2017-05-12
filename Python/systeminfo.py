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
	if hasattr(os, "getpid"):
		print('proces id:', os.getpid())
	if hasattr(os, "getuid"):
		print('userId:', os.getuid());

	mem_bytes = 0
	if hasattr(os, "sysconf"):
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
