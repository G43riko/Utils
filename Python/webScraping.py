from BeautifulSoup import BeautifulSoup

import urllib2

pageFile = urllib2.urlopen("http://www.reddit.com")

pageHtml = pageFile.read()

pageFile.close()

soup = BeautifulSoup("".join(pageHtml))

#sAll = soup.findAll("li")

sAll = soup.findAll("a")

for href in sAll:
    print href