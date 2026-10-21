import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Individual 3D Interactive Table
function TableItem({ table, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isSelected ? 1.08 : hovered ? 1.04 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const getTableColor = () => {
    if (isSelected) return '#D4A24C'; // Regal Gold
    if (hovered) return '#F3C77C'; // Light Gold Glow
    if (table.status === 'booked') return '#4A5568'; // Booked grey
    return '#1A4A38'; // Forest Green Table Top
  };

  return (
    <group
      ref={meshRef}
      position={[table.x, 0, table.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (table.status !== 'booked') {
          onSelect(table);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Table Top */}
      {table.type === '2-seater' ? (
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
          <meshStandardMaterial
            color={getTableColor()}
            roughness={0.3}
            metalness={isSelected ? 0.8 : 0.2}
            emissive={isSelected || hovered ? '#D4A24C' : '#000000'}
            emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0}
          />
        </mesh>
      ) : table.type === '4-seater' ? (
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.1, 0.08, 1.1]} />
          <meshStandardMaterial
            color={getTableColor()}
            roughness={0.3}
            metalness={isSelected ? 0.8 : 0.2}
            emissive={isSelected || hovered ? '#D4A24C' : '#000000'}
            emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0}
          />
        </mesh>
      ) : (
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.7, 0.08, 1.0]} />
          <meshStandardMaterial
            color={getTableColor()}
            roughness={0.3}
            metalness={isSelected ? 0.8 : 0.2}
            emissive={isSelected || hovered ? '#D4A24C' : '#000000'}
            emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0}
          />
        </mesh>
      )}

      {/* Table Base Leg */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.44, 16]} />
        <meshStandardMaterial color="#B88236" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 24]} />
        <meshStandardMaterial color="#B88236" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Chairs around table */}
      {table.chairs.map((chair, idx) => (
        <group key={idx} position={[chair.x, 0, chair.z]} rotation={[0, chair.rot, 0]}>
          {/* Chair Seat */}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.3]} />
            <meshStandardMaterial color="#0E2A1F" roughness={0.7} />
          </mesh>
          {/* Chair Backrest */}
          <mesh position={[0, 0.45, -0.13]}>
            <boxGeometry args={[0.28, 0.36, 0.04]} />
            <meshStandardMaterial color="#D4A24C" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Table Number & Status Label */}
      <Text
        position={[0, 0.55, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color={isSelected ? '#071711' : '#FFF6E5'}
        anchorX="center"
        anchorY="middle"
      >
        {table.id}
      </Text>
    </group>
  );
}

export default function DiningRoom3D({ selectedTable, onSelectTable }) {
  // Table layouts in the dining hall
  const tables = [
    // 2-Seaters (Intimate / Couple)
    {
      id: 'T-01',
      type: '2-seater',
      name: 'Intimate Table 1',
      capacity: 2,
      x: -3.0,
      z: -2.0,
      status: 'available',
      chairs: [
        { x: 0, z: -0.5, rot: 0 },
        { x: 0, z: 0.5, rot: Math.PI },
      ],
    },
    {
      id: 'T-02',
      type: '2-seater',
      name: 'Intimate Table 2',
      capacity: 2,
      x: -3.0,
      z: 0.2,
      status: 'available',
      chairs: [
        { x: 0, z: -0.5, rot: 0 },
        { x: 0, z: 0.5, rot: Math.PI },
      ],
    },
    {
      id: 'T-03',
      type: '2-seater',
      name: 'Intimate Table 3',
      capacity: 2,
      x: -3.0,
      z: 2.4,
      status: 'available',
      chairs: [
        { x: 0, z: -0.5, rot: 0 },
        { x: 0, z: 0.5, rot: Math.PI },
      ],
    },

    // 4-Seaters (Main Courtyard)
    {
      id: 'T-04',
      type: '4-seater',
      name: 'Courtyard Table 4',
      capacity: 4,
      x: -0.8,
      z: -2.0,
      status: 'available',
      chairs: [
        { x: 0, z: -0.7, rot: 0 },
        { x: 0, z: 0.7, rot: Math.PI },
        { x: -0.7, z: 0, rot: Math.PI / 2 },
        { x: 0.7, z: 0, rot: -Math.PI / 2 },
      ],
    },
    {
      id: 'T-05',
      type: '4-seater',
      name: 'Courtyard Table 5',
      capacity: 4,
      x: -0.8,
      z: 0.2,
      status: 'available',
      chairs: [
        { x: 0, z: -0.7, rot: 0 },
        { x: 0, z: 0.7, rot: Math.PI },
        { x: -0.7, z: 0, rot: Math.PI / 2 },
        { x: 0.7, z: 0, rot: -Math.PI / 2 },
      ],
    },
    {
      id: 'T-06',
      type: '4-seater',
      name: 'Courtyard Table 6',
      capacity: 4,
      x: -0.8,
      z: 2.4,
      status: 'available',
      chairs: [
        { x: 0, z: -0.7, rot: 0 },
        { x: 0, z: 0.7, rot: Math.PI },
        { x: -0.7, z: 0, rot: Math.PI / 2 },
        { x: 0.7, z: 0, rot: -Math.PI / 2 },
      ],
    },

    // 6-Seaters & Family Booths (Right side)
    {
      id: 'T-07',
      type: '6-seater',
      name: 'Family Table 7',
      capacity: 6,
      x: 1.8,
      z: -2.0,
      status: 'available',
      chairs: [
        { x: -0.5, z: -0.7, rot: 0 },
        { x: 0.5, z: -0.7, rot: 0 },
        { x: -0.5, z: 0.7, rot: Math.PI },
        { x: 0.5, z: 0.7, rot: Math.PI },
        { x: -0.9, z: 0, rot: Math.PI / 2 },
        { x: 0.9, z: 0, rot: -Math.PI / 2 },
      ],
    },
    {
      id: 'T-08',
      type: '6-seater',
      name: 'Family Table 8',
      capacity: 6,
      x: 1.8,
      z: 0.2,
      status: 'available',
      chairs: [
        { x: -0.5, z: -0.7, rot: 0 },
        { x: 0.5, z: -0.7, rot: 0 },
        { x: -0.5, z: 0.7, rot: Math.PI },
        { x: 0.5, z: 0.7, rot: Math.PI },
        { x: -0.9, z: 0, rot: Math.PI / 2 },
        { x: 0.9, z: 0, rot: -Math.PI / 2 },
      ],
    },
    {
      id: 'T-09',
      type: 'family-booth',
      name: 'Royal VIP Booth 9',
      capacity: 8,
      x: 1.8,
      z: 2.4,
      status: 'available',
      chairs: [
        { x: -0.6, z: -0.7, rot: 0 },
        { x: 0, z: -0.7, rot: 0 },
        { x: 0.6, z: -0.7, rot: 0 },
        { x: -0.6, z: 0.7, rot: Math.PI },
        { x: 0, z: 0.7, rot: Math.PI },
        { x: 0.6, z: 0.7, rot: Math.PI },
      ],
    },
  ];

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden bg-forest-950 border border-gold/30">
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-forest-900/90 border border-gold/30 text-[11px] text-cream font-medium">
          ● Hover table to preview • Click to select
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 6.5, 4.5], fov: 48 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={1.6} castShadow />
        <pointLight position={[-4, 5, -3]} intensity={0.8} color="#D4A24C" />

        {/* Polished Green Marble Floor */}
        <mesh position={[0, -0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11, 9]} />
          <meshStandardMaterial color="#0A2017" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Outer Brass Perimeter Border */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.3, 64]} />
          <meshBasicMaterial color="#D4A24C" />
        </mesh>

        <Suspense fallback={null}>
          {tables.map((table) => (
            <TableItem
              key={table.id}
              table={table}
              isSelected={selectedTable?.id === table.id}
              onSelect={onSelectTable}
            />
          ))}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
