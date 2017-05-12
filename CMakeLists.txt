cmake_minimum_required(VERSION 3.6)
project(Utils)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES
    c/linkedList/linkedList.c
    c/sorts/mergeSort.c
    c/sorts/quickSort.c
    c/avlTree.c
    c/buffer.c
    c/front.c
    c/hashMap.c
    c++/FileManager/FileManager.cpp
    c++/Utils/Hasher.cpp
    c++/GMath.cpp
    c++/GMath.h
    c++/GMaths2.h
    c++/GMathUtils.h
    c++/main.cpp
    c++/unitsTester.cpp)

add_executable(Utils ${SOURCE_FILES})