#include <boost/iostreams/device/mapped_file.hpp> // for mmap
#include <algorithm>  // for std::find
#include <iostream>   // for std::cout
#include <cstring>
#include <sys/stat.h>
#include <fstream>
#include <stdio.h>

class FileManager{
public:
	inline long long getFileSize(const std::string& fileName) const{
		struct stat buf;
		stat(fileName.c_str(), &buf);
		return buf.st_size;
	}
	inline std::string getContent(const std::string& fileName) const{
		std::ifstream ifs(fileName, std::ios::in);
        std::string result = "", line = "";

        if(ifs.is_open()) {
            while(!ifs.eof()) {
                std::getline(ifs, line);
                result.append(line + "\n");
            }
            ifs.close();
        }
        return result;
	}
	inline void setFileContent(const std::string& fileName, const std::string& content){
		FILE *fp = fopen(fileName.c_str(), "wb");
		if(!fp){
	    	throw "súbor " + fileName + " sa nepodarilo vytvoriť";
		}
		fwrite(content.c_str(), 1, content.size(), fp);
		fclose(fp);
	}
	inline void setFileTextOnLine(const std::string& fileName, const std::string& content, const unsigned int& line){
		std::fstream file(fileName) ;
		if (!file){
			throw "súbor " + fileName + " sa nepodarilo vytvoriť";
		}

		unsigned int currentLine = 0;
		while (++currentLine < line){
			//file::getline()
			// We don't actually care about the lines we're reading,
			// so just discard them.
			//std::cout << file << "\n";
			file.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
		}

		// Position the put pointer -- switching from reading to writing.
		file.seekp(file.tellg());
		file << content;
		file.close();
	}
	inline std::string getNthLine(const std::string& fileName, const unsigned int& line) const{
		std::ifstream in(fileName.c_str());

		std::string s;
		
		//for performance
		s.reserve(10000);    

		//skip N lines
		for(unsigned int i = 1; i < line; ++i){
			std::getline(in, s);
		}

		std::getline(in, s);
		return s; 
	}
	inline uintmax_t getNumLines(const std::string& fileName) const{
		boost::iostreams::mapped_file mmap(fileName, boost::iostreams::mapped_file::readonly);
		auto f = mmap.const_data();
		auto l = f + mmap.size();

		uintmax_t numLines = 0;
		while (f && f!=l){
			if ((f = static_cast<const char*>(memchr(f, '\n', l-f)))){
				numLines++, f++;
			}
		}
		return numLines;
	}
	inline bool fileExist(const std::string& fileName) const{
		struct stat buffer;   
		return (stat(fileName.c_str(), &buffer) == 0); 
	}
};

int main(void){
	FileManager manager;
	const std::string inputFileName = "data.txt";
	const std::string outputFileName = "data2.txt";
	const unsigned int readNumLine = 500;
	const unsigned int writeNumLine = 2;
	const std::string testLetters = "a\nb\nc\nd\ne\nf\ng\nh\nj\nk\nl\nm\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz\n";
	const std::string testNumbers = "1\n2\n3\n4\n5\n6\n7\n8\n9\n";
	printf("size: %llu\n", manager.getFileSize(inputFileName));
	printf("lines: %lu\n", manager.getNumLines(inputFileName));

	printf("%dth line is: %s\n", readNumLine, manager.getNthLine(inputFileName, readNumLine).c_str());
	manager.setFileContent(outputFileName, testNumbers);
	manager.setFileTextOnLine(outputFileName, "<--", writeNumLine);
	printf("file content:\n%s", manager.getContent(outputFileName).c_str());
	//printf("file content:\n %s", manager.getContent(inputFileName).c_str());
}