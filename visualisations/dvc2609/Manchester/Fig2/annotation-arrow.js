
    
    
    
    //use flip = true to reverse the curve of the arrow.
    
    
    function draw_curve(x1, y1, x2, y2, flip) {
    
    
        //the height of the curve, as a proportion of the length of direct line from A to B. Default should be 0.25
        var curve_height = 0.25
       
       
        //pythag to get the length of the line
            var M = ((Math.sqrt((Math.pow((x2-x1),2))+(Math.pow((y2-y1), 2)))))*curve_height
        if (flip == true){var M = 0-M }
       
            // Find midpoint J
            var Jx = x1 + (x2 - x1) / 2
            var Jy = y1 + (y2 - y1) / 2
       
            // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
            var a = x2 - x1
            var asign = (a < 0 ? -1 : 1)
            var b = y2 - y1
            var bsign = (b < 0 ? -1 : 1)
            var theta = Math.atan(b / a)
       
       
       
            // Find the point that's perpendicular to J on side
            var costheta = asign * Math.cos(theta)
            var sintheta = asign * Math.sin(theta)
       
            // Find c and d
            var c = M * sintheta
            var d = M * costheta
       
            // Use c and d to find Kx and Ky
            var Kx = Jx - c
            var Ky = Jy + d
       
            return "M" + x1 + "," + y1 +
              "Q" + Kx + "," + Ky +
              " " + x2 + "," + y2
          }
       
    