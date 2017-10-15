#! /bin/bash

l_folder="$HOME/.myconf"
l_bashrc="$HOME/.bashrc";
l_tmp_folder="/tmp/linuxInstall"
l_on_terminal_run_file="onTerminalRun"
l_line=". $l_folder/$l_on_terminal_run_file";	# riadok ktorým sa spustí náš súbor
l_git_repo="https://github.com/G43riko/Linux";
l_repo_aliases_file="aliases.sh"
l_instal_packages=0


if [ $l_instal_packages -gt 0 ]; then
#aktualizuje zoznam balíkov
	sudo apt-get update

#aktualizuje všetky balíky
	sudo apt-get upgrade

#nainštaluje
#	1.git 
	sudo apt-install git

#	2 clasic menu indicator
	sudo add-apt-repository ppa:diesch/testing
	sudo apt-get update
	sudo apt-get install classicmenu-indicator

fi;

#vytvorí priečinok kde su moje veci
if [ ! -d "$l_folder" ]; then
	mkdir "$l_folder";
fi;

#vytvorí tmp priečinok kde sa stiahnu veci s githubu

if [ ! -d "$l_tmp_folder" ]; then
	mkdir "$l_tmp_folder";
fi;

#stiahne s githubu .onTerminalRun subor
git clone "$l_git_repo" "$l_tmp_folder";

# skoopíruje ho do zložky kde sú všetky veci
mv "$l_tmp_folder/$l_repo_aliases_file" "$l_folder/$l_on_terminal_run_file"

# do ~/.bashrc prida spustenie .onTerminalRun súboru
if [ -f "$l_bashrc" ]; then # ak taký súbor existuje
	if [ `grep "$l_line" "$l_bashrc" | wc -l` -eq 0 ]; then # ak sa v ňom taký riadok nenachádza
		echo >> "$l_bashrc";
		echo "$l_line" >> "$l_bashrc";
		echo >> "$l_bashrc";
	fi;
fi;

#stiahne s githubu templaty podla nejakého súboru takisto na githabe


#zmaže tmp priečinok
rm -rf "$l_tmp_folder";