import { defs, tiny } from './examples/common.js';
import { Shape_From_File } from './examples/obj-file-demo.js'
import {Text_Line} from './examples/text-demo.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Texture, Scene,
} = tiny;
const { Triangle, Square, Tetrahedron, Windmill, Subdivision_Sphere, Cylindrical_Tube, Textured_Phong } = defs;




export class BeachScene extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        const initial_corner_point = vec3(-15, -15, 0);
        const row_operation = (s, p) => p ? Mat4.translation(0, .2, 0).times(p.to4(1)).to3()
            : initial_corner_point;
        const column_operation = (t, p) => Mat4.translation(.2, 0, 0).times(p.to4(1)).to3();

        this.shapes = {
            sphere: new defs.Subdivision_Sphere(2),
        };

        // *** Materials
        this.materials = {
            sun: new Material(new defs.Phong_Shader(),{ambient: 1, diffusivity: 0, color: hex_color("#ffffff")}),
                
        }
        this.initial_camera_location = Mat4.look_at(vec3(0, 20, 10), vec3(0, 0, 0), vec3(0, -1, 0));
    

        // this.chair_position; 
        // this.umbrella_positions; 
        //console.log(this.chair_position)
    }


    make_control_panel() {
        this.key_triggered_button("Up", ["u"], () => {

        });
        this.key_triggered_button("Down", ["j"], () => {

        });
        this.key_triggered_button("Left", ["h"], () => {

        });
        this.key_triggered_button("Right", ["k"], () => {

        });
        this.new_line(); 
        this.new_line(); 
        this.key_triggered_button("Restart", ["r"], () => {
        });

    }

    // NOTE: still need to figure out how to get camera to be angled
    // sets camera to be in player's pov (follows player)
    set_camera_view(program_state) {
        if (this.attached != undefined) {
            var blending_factor = 0.1, desired;
            desired = Mat4.inverse(this.attached.times(Mat4.translation(4, -35, 25))
                                                .times(Mat4.rotation(Math.PI/3, 1, 0, 0))
                                                .times(Mat4.scale(0.4, 0.4, 1)));
            desired = desired.map((x, i) => Vector.from(program_state.camera_inverse[i]).mix(x, blending_factor));
            program_state.set_camera(desired);
        }
    }




    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 100000);

        //const light_position = vec4(0, 5, 5, 1);
        //program_state.lights = [new Light(vec4(0, 1, 1, 0), color(1, 1, 1, 1), 999999)];

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        
        //  Create Sun
        let sun_transform = Mat4.identity();
        sun_transform     = sun_transform.times(Mat4.scale(2+Math.sin(t),
                                                       2+1*Math.sin(t), 2+Math.sin(t)));

        // Sun Lighting
        const light_position = vec4(0, 0, 0, 1);
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, color(1, 2+Math.sin(t), 2+Math.sin(t), 1), 10**(2+Math.sin(t)))];
        

        const sun_color = vec4(1, Math.sin(t), Math.sin(t), 1);
        this.shapes.sun.draw(context,program_state,sun_transform,this.materials.sun.override({color: sun_color}));
  
        

        this.set_camera_view(program_state);
    }
}