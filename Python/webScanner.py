import os
import socket
import subprocess
import sys
from datetime import datetime

def getDomainName(url):
	from tld import get_tld
	domainName = get_tld(url);
	return domainName;

def scanPort(ip = "8.8.8.8", portRange = [1, 65000]):
	remoteServerIP  = socket.gethostbyname(ip)
	print ("-" * 60)
	print ("Please wait, scanning remote host", remoteServerIP)
	print ("-" * 60)

	t1 = datetime.now()

	try:
		socket.setdefaulttimeout(1);
		for port in range(portRange[0],portRange[1]):  
			sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			result = sock.connect_ex((remoteServerIP, port))
			if result == 0:
				#print ("Port {}: 	 Open - {}".format(port, socket.getservbyport(port)));
				try:
					print ("Port {}: 	 Open - {}".format(port, socket.getservbyport(port)));
				except socket.error:
					print ("Port {}: 	 Open - UNKNOWN TYPE".format(port));
			else:
				print ("Port {}:     Closed".format(port));
			sock.close()

	except KeyboardInterrupt:
		print ("You pressed Ctrl+C")
		sys.exit()

	except socket.gaierror:
		print ('Hostname could not be resolved. Exiting')
		sys.exit()

	except socket.error:
		print ("Couldn't connect to server")
		sys.exit()

	t2 = datetime.now()

	total =  t2 - t1


#print(getDomainName("https://google.com/"))

scanPort()