
#include "Graphics.h"

// SHADER PROGRAM ////////////////////////////////////////////////////

Graphics::Program::Program(std::string VertexShaderPath, std::string FragmentShaderPath) {
	_programID = glCreateProgram();
	int vertexShader = glCreateShader(GL_VERTEX_SHADER);
	int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);

	readAndCompileShaderSource(vertexShader, VertexShaderPath);
	readAndCompileShaderSource(fragmentShader, FragmentShaderPath);

	glAttachShader(_programID, vertexShader);
	glAttachShader(_programID, fragmentShader);

	glLinkProgram(_programID);

	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);

	// TODO : Add Error handling here too.
}

Graphics::Program::~Program() {
	glDeleteProgram(_programID);
}

void Graphics::Program::useProgram() {
	glUseProgram(_programID);
}

int Graphics::Program::getProgramID() {
	return _programID;
}

void Graphics::Program::readAndCompileShaderSource(int shader, std::string path) {

	// Reading In
	std::string filepath;
	filepath = path;
	std::ifstream shaderFile;
	shaderFile = std::ifstream(filepath);

	std::stringstream buffer;
	buffer << shaderFile.rdbuf();
	std::string shaderString = buffer.str();

	// And Compiling
	const char* shaderCode = shaderString.c_str();
	glShaderSource(shader, 1, &shaderCode, NULL);
	glCompileShader(shader);

	// Checking for errors
	const std::map<int, std::string> SHADER_NUMBER2NAME = {
		{ GL_VERTEX_SHADER,"VERTEX_SHADER" },
		{ GL_FRAGMENT_SHADER,"FRAGMENT_SHADER" }
	};

	int isCompiled;
	char infoLog[512]; // Took this from learnopengl
	glGetShaderiv(shader, GL_COMPILE_STATUS, &isCompiled);
	if (!isCompiled)
	{
		int shaderNumber;
		glGetShaderiv(shader, GL_SHADER_TYPE, &shaderNumber);
		glGetShaderInfoLog(shader, 512, NULL, infoLog);
		std::cout << "ERROR! " << SHADER_NUMBER2NAME.at(shaderNumber) << " COMPILATION FAILED!\n" << infoLog << std::endl;
	}
}

// HELPER FUNCTIONS /////////////////////////////////////////////////////

void Graphics::clearColourAndDepth(float R, float G, float B, float A)
{
	glClearColor(R, G, B, A);
	glClear(GL_COLOR_BUFFER_BIT);
	glClear(GL_DEPTH_BUFFER_BIT);
}
