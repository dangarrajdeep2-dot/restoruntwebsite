import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Thali & Delicacies
function RoyalThaliModel({ mousePosition }) {
  const groupRef = useRef();
  const steamRef = useRef();

  // Gentle continuous rotation & mouse parallax response
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      // Mouse parallax easing
      const targetX = (mousePosition.current.x * Math.PI) / 16;
      const targetY = (-mousePosition.current.y * Math.PI) / 16;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.45 + targetY, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetX, 0.05);
    }
  });

  // Steam particle positions
  const steamParticles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 28; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 1.5,
        y: Math.random() * 2 + 0.3,
        z: (Math.random() - 0.5) * 1.5,
        scale: Math.random() * 0.08 + 0.04,
        speed: Math.random() * 0.4 + 0.2,
      });
    }
    return pts;
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* 1. Large Royal Brass / Gold Thali Platter */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.3, 0.12, 64]} />
        <meshStandardMaterial
          color="#D4A24C"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Rim of the Thali */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[2.46, 0.06, 16, 64]} />
        <meshStandardMaterial color="#E5B96B" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 2. Central Basmati Saffron Rice Mound */}
      <group position={[0, 0.07, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFF9E6" roughness={0.8} />
        </mesh>
        {/* Saffron Strands / Coriander Garnish on Rice */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
          <meshStandardMaterial color="#E8782A" roughness={0.5} />
        </mesh>
      </group>

      {/* 3. Outer Circle of Traditional Katoris (Bowls) */}
      {[
        { angle: 0, color: '#9E2A2B', garnish: '#E8782A', name: 'Paneer Butter Masala' },
        { angle: (Math.PI * 2) / 6, color: '#3B2F2F', garnish: '#FFF', name: 'Dal Bukhara' },
        { angle: (Math.PI * 4) / 6, color: '#5B4033', garnish: '#4CAF50', name: 'Ringan Olo' },
        { angle: (Math.PI * 6) / 6, color: '#F4A261', garnish: '#D62828', name: 'Sev Tameta' },
        { angle: (Math.PI * 8) / 6, color: '#4E7037', garnish: '#FFF', name: 'Pudina Chutney' },
        { angle: (Math.PI * 10) / 6, color: '#5A189A', garnish: '#D4A24C', name: 'Gulab Jamun' },
      ].map((bowl, idx) => {
        const radius = 1.7;
        const x = Math.cos(bowl.angle) * radius;
        const z = Math.sin(bowl.angle) * radius;

        return (
          <group key={idx} position={[x, 0.07, z]}>
            {/* Small Brass Bowl (Katori) */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.48, 0.38, 0.28, 32]} />
              <meshStandardMaterial color="#D4A24C" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Curry / Food inside */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
              <meshStandardMaterial color={bowl.color} roughness={0.6} />
            </mesh>
            {/* Cream or Tadka swirl */}
            <mesh position={[0, 0.15, 0]}>
              <torusGeometry args={[0.16, 0.03, 8, 24]} />
              <meshStandardMaterial color={bowl.garnish} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* 4. Warm Hand-Patted Bajra Rotla / Garlic Naan Wedge */}
      <group position={[-0.8, 0.12, 0.6]} rotation={[0.1, 0.4, -0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
          <meshStandardMaterial color="#CBB282" roughness={0.9} />
        </mesh>
        {/* White homemade Makhan butter dollop */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
      </group>

      {/* 5. Crispy Golden Rolled Papadum */}
      <mesh
        castShadow
        position={[0.85, 0.15, -0.6]}
        rotation={[Math.PI / 2, 0.3, 0.8]}
      >
        <cylinderGeometry args={[0.14, 0.14, 0.9, 24, 1, true]} />
        <meshStandardMaterial color="#E9D8A6" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 6. Delicate Steam Particles rising */}
      <group ref={steamRef} position={[0, 0.2, 0]}>
        {steamParticles.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.scale, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Floating Aromatic Spices & Rose Petals around the Scene
function FloatingSpices() {
  const floatingItems = useMemo(() => {
    const items = [];
    const colors = ['#8B2500', '#3D6B35', '#E8782A', '#D4A24C', '#C2185B'];
    for (let i = 0; i < 18; i++) {
      items.push({
        pos: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3 + 1,
          (Math.random() - 0.5) * 4,
        ],
        rotSpeed: Math.random() * 0.02 + 0.01,
        color: colors[i % colors.length],
        scale: Math.random() * 0.12 + 0.08,
      });
    }
    return items;
  }, []);

  return (
    <>
      {floatingItems.map((item, idx) => (
        <Float
          key={idx}
          speed={1.5}
          rotationIntensity={1.8}
          floatIntensity={1.5}
          position={item.pos}
        >
          <mesh>
            <octahedronGeometry args={[item.scale, 0]} />
            <meshStandardMaterial
              color={item.color}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function FoodThaliHero3D() {
  const mousePosition = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    // Normalize coordinates between -1 and 1
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mousePosition.current = {
      x: (clientX / innerWidth) * 2 - 1,
      y: -(clientY / innerHeight) * 2 + 1,
    };
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative w-full h-full min-h-[550px] lg:min-h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      <Canvas
        camera={{ position: [0, 2.2, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Cinematic Ambient & Studio Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 4, -3]} intensity={0.6} color="#F3C77C" />
        <pointLight position={[0, 3, 2]} intensity={1.2} color="#FFF6E5" />

        <Suspense fallback={null}>
          <RoyalThaliModel mousePosition={mousePosition} />
          <FloatingSpices />
          <ContactShadows
            position={[0, -0.42, 0]}
            opacity={0.6}
            scale={6}
            blur={2.4}
            far={4}
            color="#071711"
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
