# Animation

The animations are implemented using **Tween.js**, by changing over time the values of rotation or position of different parts of the models. In order to have smooth animations, different easing functions were used thanks to the _easing_ method.
All animations are realized in the file _Animations.js_ that contains all the functions needed to produce the desired effect by combining tweens of different parts of the model that is passed as input. A useful tool that allowed to quickly add a very basic user interface to interact with the 3D scene is _lil-gui_, a drop-in replacement for _dat.gui_.
With the formula,

```
let boneFolder = this.gui.addFolder("Bone");
        boneFolder
            .add(this.bone.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.0001);
        boneFolder.close();
```

it was added to teh user interface the possibility to modify the values of rotation and position of the different parts of the robot before writing them in the code, which, togheter with the fact that all the part of the robots were assigned to homonym class variables to rapidly access them, really simplified the work.

## Robot Animation: Head Tweens

The functions `yesTween()` and `noTween()` realize the animations for making the robot's neck rotate to simulate positive and negative affirmations. In both cases the neck is rotated twice before returning to the initial position, but while in the former the rotation happens along the x axis, in the latter the it happens along the y axis

## Robot Animation: Death Tween

The function `deathTween()` simulates the death of the robot by making it fall to the ground. It has been realized by rotating and positioning the body in such a way that its back ends right above the surface of the floor. To completa the animation, shoulders, upper and lower arms and upper and lower legs are rotated to follow-through and the head is rotated and positioned in such a way to fall next to the body and thanks to the use of the easing function _Bounce Out_, it seems like it is bouncing on the ground before stopping.

## Robot Animation: Lean Tween

The function that handles this animation simply takes an angle of rotation to be used to make the robot lean forward and then go back to the initial postition.
This animation is coupled with the interaction with the bean: the robot leans forward to see what the bin contains and then has to go back to the initial position.

## Robot Animation: Idle Tween

In order to create such an animation, different functions were created to handle the rotation of the head and of the upper and lower legs of the robot and the position of its body. In order to produce an effective outcome, indeed, while the legs are moving to simulate the bending of the knees, the body is translated along the y axis and the head is rotated. The function `Math.floor()` has been created to decide whether the robot should rotate its head to its left, to its right or sideways with different easing functions like the "bounce.inOut" to produce different effects.

## Robot Animation: Walk Tween & Turn Tweens

## Robot Animation: Wave Tween

## Robot Animation: Thumbs Up Tween

This animation is realized through the use of two functions: `thumbsUpTween()` and `thumbsDownTween()`. The former one handles the movement of the robot to raise the upper part of the right arm and incline its head. At the end, the fingers of the right hand are closed in a fist while the two parts of the thumb are rotated to produce a thumb up. The latter function is used to bring the robot to the initial position, restoring the values of rotation of the parts involved in the animation.

## Robot Animation: Jump Tween

Following the jump, `rightArmJumpTween()` and `leftArmJumpTween()` handles the rotation of the shoulders to simulate the effect of the gravity on the arms of the robot.

## Robot Animation: Dance Tween

## Robot Animation: Knock Tween

Accompanied with a tune of someone knocking on a door, the animation for the knocking is used for solving a challenge. It is realized thanks to the `knockTween()` function that simply handles the tilt of the robot's head and the rotation of the left upper and lower arm. In order to make it seem like the robot is indeed knocking, the upper arm is quickly rotated forward and backward twice before every body part involved in the animation returns to its original position.

## Door Animations

The functions that handles the doors animations are `openLeftDoor()`, `operRightDoor()` and `openFinalDoor()` that simply change the position along the _z_ axis of the parts of the doors and to improve the effect created, the animation for the sliding doors are coupled with a tune for the opening of the doors, the _thumbs Up_ animation and a change in the camera view to see the doors opening.
