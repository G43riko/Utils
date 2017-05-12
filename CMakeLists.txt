cmake_minimum_required(VERSION 3.6)
project(Utils)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES
        #c/main.c
        c++/GMath.cpp
        c++/main.cpp)

add_executable(Utils ${SOURCE_FILES})