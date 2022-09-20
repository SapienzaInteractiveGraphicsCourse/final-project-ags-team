# Animation

The animations are implemented using **Tween.js**, by changing over time the values of rotation or position of different parts of the models. In order to have smooth animations, different easing functions were used thanks to the _easing_ method.
All animations are realized in the file _Animations.js_ that contains all the functions needed to produce the desired effect, by combining tweens of different parts of the model that is passed as input. A useful tool that allowed to quickly add a very basic user interface to interact with the 3D scene is _lil-gui_, a drop-in replacement for _dat.gui_.
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

it was added to the user interface the possibility to modify the values of rotation and position of the different parts of the robot before writing them in the code, which, togheter with the fact that all the parts of the robots were assigned to homonym class variables to rapidly access them, really simplified the work.

## Robot Animation: Head Tweens

The functions `yesTween(robot)` and `noTween(robot)` realize the animations for making the robot's neck rotate to simulate positive and negative affirmations. In both cases, the neck is rotated twice before returning to the initial position, but, while in the former the rotation happens along the x axis, in the latter it happens along the y axis.

## Robot Animation: Death Tween

The function `deathTween(robot)` simulates the death of the robot by making it fall to the ground. It has been realized by rotating and positioning the body in such a way that its back ends right above the surface of the floor. To complete the animation, shoulders, upper and lower arms and upper and lower legs are rotated to follow-through, and the head is rotated and positioned in such a way to fall next to the body: thanks to the use of the easing function _Bounce Out_, it seems like it is bouncing on the ground before stopping.

## Robot Animation: Lean Tween

The function that handles this animation, `leanTween(robot, angle)`, simply takes an angle of rotation to be used to make the robot lean forward and then go back to the initial postition.
This animation is coupled with the interaction with the bucket: the robot leans forward to see what the bin contains and then has to go back to the initial position.

## Robot Animation: Idle Tween

In order to create such an animation, different functions were created to handle the rotation of the head and of the upper and lower legs of the robot and the position of its body. In order to produce an effective outcome, indeed, while the legs are moving to simulate the bending of the knees, the body is translated along the y axis and the head is rotated. The function `Math.random()` has been used to decide whether the robot should rotate its head to its left, to its right or sideways with different easing functions like the **bounce.inOut** to produce different effects.

## Robot Animation: Turn Tweens

`turnRightTween(robot)`, `turnFrontTween(robot)`, `turnBackTween(robot)` and `turnLeftTween(robot)` realize the animation to change the orientation of the robot. They are often used to put its body in the right position for an effective interaction with the objects in the scene, as it happens with the pinpad, the bucket and the red button, but they are important especially because they are associated to the arrow keys, to make the robot turn in the direction of the walk.

## Robot Animation: Walk Tween

The walk animation is the one that required most attention as it had to be synched with the movement triggered by the press of the arrow keys. In order to do so, a semaphore is used in such a way that a new walk animation can not begin if the previous has not been completed yet. Also, to handle the fact that the arrows can be pressed once to make the robot do just one step, a boolean variable `leftToFront` is used to understand which leg has to be put forward and which backward but also to realize an alternation between them, not to make the robot begin the walk always with the same leg. To make the animation run as smooth as possible, while the left leg goes forward and the right leg goes backward, the left arm goes backward and the right arm goes forward and the body is rotated along the z axis to simulate the weight of the robot shifting between legs during the movement. All of this is realized in the functions `rightToBackWalkTween(robot)`, `leftToBackWalkTween(robot)`, `rightToFrontWalkTween(robot)`, `leftToFrontWalkTween(robot)`, `bodyWalkTweenPhase1(robot)` and `bodyWalkTweenPhase2(robot)`.

## Robot Animation: Wave Tween

`waveTween(robot)` and `waveFinishTween(robot)` realize the animation for the greeting of the player at the beginning of the game. While the latter simply drives the animation for making the robot return to a neutral position, the former really does the work handling the rotation of the right shoulder and upper arm, the tilt of the head, the opening of the right hand through a movement of the components of the fingers as well as the rotation along the _y_ axis of the lower part of the right arm to create a waving movement.

## Robot Animation: Thumbs Up Tween

This animation is realized through the use of two functions `thumbsUpTween(robot)` and `thumbsDownTween(robot)`. The former one handles the movement of the robot to raise the upper part of the right arm and incline its head. At the end, the fingers of the right hand are closed in a fist while the two parts of the thumb are rotated to produce a thumb up. The latter function is used to bring the robot to the initial position, restoring the values of rotation of the parts involved in the animation.

## Robot Animation: Jump Tween

Following the jump triggered by the spacebar, `rightArmJumpTween(robot)` and `leftArmJumpTween(robot)` handles the rotation of the shoulders to simulate the effect of the gravity on the arms of the robot.

## Robot Animation: Dance Tween

The dance animation is used to make the robot celebrate its vincory once the trophy is reached. It is realized in the function `danceTween(robot)` that handles the rotation of the body, the legs, the shoulders and the head. To realize it in a way to represent a convincing robot dance, once the head is rotated sideways, the robot lets the lower parts of its arms fall with a bouncing movement as they reach the final position and the head does a 360 degrees spin. Once again, different easing functions such as the `Bounce.Out` were adopted to produce a smooth and realistic animation. Finally, the second part of the function restores the initial values of the components involved in the animation.

## Robot Animation: Knock Tween

Accompanied with a tune of someone knocking on a door, the animation for the knocking is used for solving a challenge. It is realized thanks to the `knockTween(robot)` function that simply handles the tilt of the robot's head and the rotation of the left upper and lower arm. In order to make it seem like the robot is indeed knocking, the upper arm is quickly rotated forward and backward twice before every body part involved in the animation returns to its original position.

## Door Animations

The functions that handles the doors animations are `openLeftDoor(door)`, `operRightDoor(door)` and `openFinalDoor(door)` that simply change the position along the _z_ axis of the parts of the doors. To improve the effect created, the animations for the sliding doors are coupled with a tune for the opening of the doors, a _thumbs Up_ and a change in the camera view to see the doors opening.

## Camera Animations

Even the camera is subject to changes in values of rotation and position over time to change the point of view. This is doneto see more clearly objects like the desks, the bucket and the pinpad but also to accompany and highlighting the beginning of the game, the doors animations and the final victory dance. In these cases, the animations are realized in the file _Camera.js_
