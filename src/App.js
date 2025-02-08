import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useSpring, useSprings, animated, config } from 'react-spring';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
  position: relative;
`;

const GlassPanel = styled(animated.div)`
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  text-align: center;
`;

const Title = styled(animated.h1)`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const FloatingTeddy = styled(animated.div)`
  font-size: 5rem;
  margin-bottom: 2rem;
`;

const SorryMessage = styled(animated.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #ffffff;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
`;

const Button = styled(animated.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  margin: 0.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#ff4d4d' : '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#ff4d4d'};
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const Heart = styled(animated.div)`
  position: absolute;
  font-size: 2rem;
`;

function App() {
  const [showHearts, setShowHearts] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });

  const panelSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.wobbly,
  });

  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300,
  });

  const teddyAnimation = useSpring({
    from: { y: 0, rotate: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: 10, rotate: 5 });
        await next({ y: 0, rotate: -5 });
      }
    },
    config: { duration: 2000 },
  });

  const heartAnimations = useSprings(
    50,
    [...Array(50)].map(() => ({
      from: { opacity: 0, transform: 'translate3d(0,0,0) scale(0)' },
      to: { 
        opacity: 1, 
        transform: `translate3d(${Math.random() * 100 - 50}vw, ${Math.random() * 100 - 50}vh, 0) scale(${Math.random() * 0.5 + 0.5})` 
      },
      config: { duration: 3000 },
    }))
  );

  const handleNoButtonHover = useCallback(() => {
    setNoButtonPosition({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    });
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <Container>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <SorryMessage style={useSpring({ opacity: 1, from: { opacity: 0 }, delay: 1000 })}>
        I'm sorry for being a bad gf
      </SorryMessage>
      <GlassPanel style={panelSpring}>
        <Title style={titleSpring}>Yash Jain, will you be my Valentine?</Title>
        <FloatingTeddy style={teddyAnimation}>🧸</FloatingTeddy>
        <div>
          <Button primary onClick={() => setShowHearts(true)}>Yes</Button>
          <Button
            style={{ transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)` }}
            onMouseEnter={handleNoButtonHover}
          >
            No
          </Button>
        </div>
      </GlassPanel>
      {showHearts && heartAnimations.map((props, i) => (
        <Heart key={i} style={props}>❤️</Heart>
      ))}
    </Container>
  );
}

export default App;

