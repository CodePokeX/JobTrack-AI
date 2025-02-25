particlesJS("particles-js", {
  interactivity: {
    detect_on: "window", // Detect interaction on the entire window
    events: {
      onclick: {
        enable: false,
        mode: "push",
      },
      onhover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 350,
        duration: 2,
        opacity: 0.8,
        size: 30,
        speed: 3,
      },
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
      repulse: {
        distance: 120,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#38bdf8", // Blue color for particles
    },
    line_linked: {
      color: "#38bdf8", // Blue color for connecting lines
      distance: 150,
      enable: true,
      opacity: 0.4,
      width: 1,
    },
    move: {
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
      bounce: false,
      direction: "none",
      enable: true,
      out_mode: "out",
      random: false,
      speed: 4, // Slightly reduced speed for a calmer effect
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 1000,
      },
      value: 90,
    },
    opacity: {
      anim: {
        enable: false,
        opacity_min: 0.1,
        speed: 1,
        sync: false,
      },
      random: true,
      value: 0.5,
    },
    shape: {
      image: {
        height: 100,
        src: "img/github.svg",
        width: 100,
      },
      polygon: {
        nb_sides: 5,
      },
      stroke: {
        color: "#38bdf8", // Match stroke color with particles
        width: 1,
      },
      type: "triangle",
    },
    size: {
      anim: {
        enable: true,
        size_min: 0.1,
        speed: 2.43,
        sync: false,
      },
      random: true,
      value: 3,
    },
  },
  retina_detect: true,
});
