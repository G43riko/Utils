#include <chrono>
#include <unistd.h>


#define MILLISECONDS_IN_SECOND 1000
#define MICROSECONDS_IN_SECOND 1000000
#define NANOSECONDS_IN_MICROSECOND 1000
#define NANOSECONDS_IN_SECOND 1000000000

class GameLoop{
	inline std::chrono::time_point<std::chrono::system_clock> getNow(void)const{
		return std::chrono::system_clock::now();
	}
	double _initTime = getCurrentNanoseconds();
	double _outputTime = getCurrentNanoseconds() + NANOSECONDS_IN_SECOND;
	const uint _FPS, _frameTimeNs;
	uint _fps = 0, _lastFPS = 0;
	float _delta = 1.0f;
public:
	inline double getCurrentMilliseconds(void) const{
		return std::chrono::duration_cast<std::chrono::milliseconds>(getNow().time_since_epoch()).count();
	}
	inline double getCurrentNanoseconds(void) const{
		return std::chrono::duration_cast<std::chrono::nanoseconds>(getNow().time_since_epoch()).count();
	}
	inline double getCurrentMicroseconds(void) const{
		return std::chrono::duration_cast<std::chrono::microseconds>(getNow().time_since_epoch()).count();
	}
	inline GameLoop(uint FPS) :
			_FPS(FPS),
			_frameTimeNs(NANOSECONDS_IN_SECOND / FPS){
		printf("FPS: %d, frameTimeNS: %d\n", _FPS, _frameTimeNs);
	}
	inline float getDelta(void) const{return _delta;}
	inline uint getFPS(void) const{return _lastFPS;}
	
	bool loop(){
		while(getCurrentNanoseconds() + NANOSECONDS_IN_MICROSECOND < _frameTimeNs + _initTime){
			usleep(1);
		}
		_fps++;
		const double tmpInitTime = getCurrentNanoseconds();
		_delta = (float)((tmpInitTime - _initTime) / _frameTimeNs);
		_initTime = tmpInitTime;

		if(tmpInitTime >= _outputTime){
			_outputTime = tmpInitTime + NANOSECONDS_IN_SECOND;
			_lastFPS = _fps;
			_fps = 0;
			return true;
		}
		return false;
	}

	bool loop2(){
		const double loopStart = getCurrentNanoseconds();
		const double diff = loopStart - _initTime;

		if(diff < _frameTimeNs){
			//printf("diff: %f, sleep: %f\n", diff, _frameTimeNs - diff);
			usleep((_frameTimeNs - diff) / NANOSECONDS_IN_MICROSECOND);
		}
		_fps++;
		const double tmpInitTime = getCurrentNanoseconds();
		_delta = (float)((tmpInitTime - _initTime) / _frameTimeNs);
		_initTime = tmpInitTime;

		if(_initTime - _outputTime > NANOSECONDS_IN_SECOND){
			_outputTime = _initTime;
			_lastFPS = _fps;
			_fps = 0;
			return true;
		}
		return false;
	}
};

