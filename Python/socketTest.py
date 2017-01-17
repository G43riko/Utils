import sys
import socket

host = '127.0.0.1';
port = 5555;

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1);

#s.connect(("www.mcmillan-inc.com", 80))
try:
    s.bind((host, port));
except socket.error as e:
    print(str(e));

s.listen(5);

conn, addr = s.accept();
print('connected to address ' + addr[0] + ': ' + str(addr[1]));