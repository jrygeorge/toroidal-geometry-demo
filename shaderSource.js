const VertexShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec4 vertPosition;
    in vec3 vertNormal;
    in vec3 instanceTranslate;
    in vec3 instanceRotate;
    out vec3 normal;
    out float Z;

    uniform mat4 u_projection;
    uniform mat4 u_camera;

    mat4 RotateYandTranslate(vec3 translate, vec3 rotate)
    {
    // only rotates around the Y axis, because thats all we need for this
    
    return mat4(
                    vec4(cos(rotate.y),0,sin(rotate.y),0),
                    vec4(0,1,0,0),
                    vec4(-sin(rotate.y),0,cos(rotate.y),0),
                    vec4(0,0,0,1)
                ) * 
            mat4(
                    vec4(1,0,0,0),
                    vec4(0,1,0,0),
                    vec4(0,0,1,0),
                    vec4(translate,1.0)
                );
    }
    
    void main()
    {
        mat4 finalInstanceTransform = RotateYandTranslate( instanceTranslate , instanceRotate);
        //mat4 finalInstanceTransform = RotateYandTranslate( vec3(0,0,0) , vec3(0,0,0) );
        gl_Position = u_projection * u_camera * finalInstanceTransform * vertPosition  ;
        normal = vertNormal ;
        Z = gl_Position.z ;
    }
`

const NormalFragmentShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec3 normal;
    in float Z;
    out vec4 outColour;

    void main()
    {   
        vec3 normalColour = (normal+1.0)*0.5 + vec3(0.1);
        outColour = vec4( normalColour ,1.0);
    }
`

const SunsetFragmentShaderSource = 
    `#version 300 es
    precision mediump float;

    in vec3 normal;
    in float Z;
    out vec4 outColour;

    const vec3 sunset1 = vec3(160,109,186)/256.0;
    const vec3 sunset2 = vec3(254,184,89)/256.0;
    const vec3 sunset3 = vec3(255,228,27)/256.0;

    void main()
    {   
        float zScaled = (Z+1.0)*0.002;
        float ramp_blend = smoothstep(0.2,0.7,zScaled);

        // fwidth(Z) gives us this fresnel-y look, helps define the corners
        // clamping with min so its less sharp
        float whiteblendfactor = min(fwidth(Z)*0.3,0.8)-pow(zScaled*1.2,0.8);
    
        vec3 blendedColour = sunset2*(1.0-ramp_blend) + sunset1*(ramp_blend);
        vec3 finalColour = blendedColour* (1.0 - whiteblendfactor) + vec3(whiteblendfactor);

        outColour = vec4( finalColour ,1.0);
    }
`