import socket
import sys
import os;
import getpass
import subprocess
import pwd
import platform


##################>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if sys.platform == 'win32':
  import win32_sysinfo as sysinfo
elif sys.platform == 'darwin':
  import mac_sysinfo as sysinfo
elif 'linux' in sys.platform:
  import linux_sysinfo as sysinfo
#etc

print('Memory available:', sysinfo.memory_available())

##################<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

print('platform:', platform.platform());
print('platform machine:', platform.machine());
print('platform version:', platform.version());
print('platform system:', platform.system());
print('platform processor:', platform.processor());

uname_result = platform.uname();
print('platform node:', uname_result.node);
print('platform release:', uname_result.release);



#print('HOME:', os.environ('HOME'));
#print('getlogin():', os.getlogin());
print('os.getuid():', os.getuid());
print('pwd.getpwuid(os.getuid())[0]:', pwd.getpwuid(os.getuid())[0]);



#from psutil import virtual_memory
#mem = virtual_memory()
#printf('RAM:' + mem.total);

mem_bytes = os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')  # e.g. 4015976448
mem_gib = mem_bytes / (1024.**3)  # e.g. 3.74
print('RAM:', mem_gib)

print('ip:' + socket.gethostbyname(socket.gethostname()))
print('currentPath:' + os.path.dirname(os.path.abspath(__file__)))
print('userName:' + getpass.getuser())
print('os name:' + os.name)
print('platform:' + sys.platform)
print('hostName:' + socket.gethostname())



#import netifaces as ni
#ni.ifaddresses('wlo1')
#ip = ni.ifaddresses('wlo1')[2][0]['addr']
#print('ip:' + ip)