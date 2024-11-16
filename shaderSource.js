const VertexShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec4 vertPosition;
    out vec3 fragColour;

    uniform mat4 u_projection;
    uniform mat4 u_camera;
    uniform vec3 u_colour;
    
    void main()
    {
        float prop = mod(float(gl_VertexID)/1.356267297,1.0);
        gl_Position = u_projection * u_camera  * vertPosition  ;
        fragColour = u_colour * (1.0 - prop) + vec3(0.7,0.7,0.9) * prop;
    }
`

const FragmentShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec3 fragColour;
    out vec4 outColour;

    void main()
    {
       outColour = vec4(fragColour,1.0);
    }
`