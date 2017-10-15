#include <vector>
#include <unordered_map>
#include <string>

namespace simplification {
	enum Axis{
		x,
		y,
		z
	};
	struct vec3{
		float x, y, z;
	};
	class Vertex;
	class Face;
	std::string toString(float x, float y, float z){
		return std::to_string(x) + "_" + std::to_string(y) + "_" + std::to_string(z);
	};
	std::unordered_map<std::string, Vertex*> vertices;
	std::vector<Face *> faces;


	class Vertex{
		std::vector<Face*> faces;
		Vertex(float x, float y, float z) : 
				_x(x),
				_y(y),
				_z(z){};
	public:
		float _x, _y, _z;
		inline static Vertex * create(float x, float y, float z){
			std::string key = toString(x, y, z);
			if(vertices.find(key) == vertices.end()){
				Vertex * vertex = new Vertex(x, y, z);
				vertices[key] = vertex;
				return vertex;
			}

			return vertices[key];
			
		}
		inline void addFace(Face * face){
			faces.push_back(face);
		};
		inline void show(void) const{
			printf("%f, %f, %f -> [%lu]\n", _x, _y, _z, faces.size());
		}
	};


	class Face{
		 Axis axis;
		std::vector<Vertex*> _vertices;
	public:
		Face(Vertex* a, Vertex* b, Vertex* c){
			_vertices.push_back(a);
			_vertices.push_back(b);
			_vertices.push_back(c);

			a -> addFace(this);
			b -> addFace(this);
			c -> addFace(this);


			if(a -> _x == b -> _x && b -> _x == c -> _x){
				axis = Axis::x;
			}
			else if(a -> _y == b -> _y && b -> _y == c -> _y){
				axis = Axis::y;
			}
			else{
				axis = Axis::z;
			}

			faces.push_back(this);
		}
		void show(void) const{
			printf("Axis: %c\n", axis == Axis::x ? 'x' : axis == Axis::y ? 'y' : 'z');
		}
	};

	void makeFace(vec3 a, vec3 b, vec3 c){
		new Face(Vertex::create(a.x, a.y, a.z), Vertex::create(b.x, b.y, b.z), Vertex::create(c.x, c.y, c.z));
	};

	void test(void){
		makeFace({0, 0, 0}, {0, 0, 1}, {1, 0, 1});
		makeFace({0, 0, 0}, {1, 0, 1}, {1, 0, 0});
		makeFace({1, 0, 0}, {1, 0, 1}, {2, 0, 1});
		makeFace({1, 0, 0}, {2, 0, 1}, {2, 0, 0});
		printf("faces: %lu\n", faces.size());
		printf("vertices: %lu\n", vertices.size());
		for(auto i : vertices){
			i.second -> show();
		}
		for(auto i : faces){
			i -> show();
		}
		/*
		Vertex a(0, 0, 0);
		Vertex b(0, 0, 1);
		Vertex c(1, 0, 0);
		Vertex d(1, 0, 1);
		Vertex e(2, 0, 0);
		Vertex f(2, 0, 1);

		Face abd(&a, &b, &d);
		Face adx(&a, &d, &c);
		Face cdf(&c, &d, &f);
		Face cfe(&c, &f, &e);
		*/
	};
};