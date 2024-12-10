#pragma once

#include <glad/glad.h>

#include <iostream>
#include <fstream>
#include <sstream>
#include <map>

namespace Graphics {


	// SHADER PROGRAM
	class Program {
	public:
		Program(std::string VertexShaderPath, std::string FragmentShaderPath);
		~Program();
		void useProgram();
		int getProgramID();
	private:
		int _programID = 0;
		int _programUBO = 0;
	private:
		void readAndCompileShaderSource(int shader, std::string path);
	};



	// HELPER FUNCTIONS
	void clearColourAndDepth(float R, float G, float B, float A);



}