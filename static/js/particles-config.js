particlesJS("particles-js", {
  "interactivity": {
    "detect_on": "window",  // Detect interaction on the entire window
    "events": {
      "onclick": {
        "enable": false,
        "mode": "push"  // Disabled onclick event
      },
      "onhover": {
        "enable": true,  // Hover effect enabled
        "mode": "repulse"  // Enable repulse mode on hover
      },
      "resize": true
    },
    "modes": {
      "repulse": {
        "distance": 100,  // Distance for repulsion effect
        "duration": 0.4   // Duration of the repulsion effect
      }
    }
  },
  "particles": {
    "color": {
      "value": "#007bff"  // Blue color for particles
    },
    "line_linked": {
      "color": "#007bff",  // Blue color for the lines connecting particles
      "distance": 150,  // Maximum distance between particles for the lines to appear
      "enable": true,  // Enables the lines
      "opacity": 0.4,  // Line opacity (set to 0 for invisible lines)
      "width": 1  // Line thickness (set to 1, can be adjusted for thicker lines)
    },
    "move": {
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      },
      "bounce": false,
      "direction": "none",
      "enable": true,
      "out_mode": "out",
      "random": false,
      "speed": 4,  // Particle speed
      "straight": false
    },
    "number": {
      "density": {
        "enable": true,
        "value_area": 1000
      },
      "value": 90
    },
    "opacity": {
      "anim": {
        "enable": false,
        "opacity_min": 0.1,
        "speed": 1,
        "sync": false
      },
      "random": true,
      "value": 0.5
    },
    "shape": {
      "image": {
        "height": 100,
        "src": "img/github.svg",
        "width": 100
      },
      "polygon": {
        "nb_sides": 5
      },
      "stroke": {
        "color": "#007bff",  // Match stroke color with particle color
        "width": 1  // Particle stroke thickness (set to 1)
      },
      "type": "triangle"  // Shape of the particles (triangle)
    },
    "size": {
      "anim": {
        "enable": true,
        "size_min": 0.1,  // Minimum particle size
        "speed": 2.43,  // Speed of particle size animation
        "sync": false
      },
      "random": true,  // Random particle sizes
      "value": 3  // Default particle size (can be increased for bigger particles)
    }
  },
  "retina_detect": true
});
