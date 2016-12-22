# Citations and Formulas

Gregory et al. describe the game engine architecture adopted by Naughty Dog and Ogre [^gregory2014].

## Volume Rendering Integral

\[ I(D) = I_0 e^{-\int_{s_0}^{D} \kappa(t) dt} + \int_{s_0}^D q(s) e^{-\int_{s_0}^{D} \kappa(d) dt} \; ds \]

According to Klaus Engel et al. in their book [Real Time Volume Graphics](http://www.real-time-volume-graphics.org/), The emission-absorption optical model leads to this volume rendering integral.