import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import { X, Flame, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

function SingleDish3D({ dish }) {
  const isDessert = dish.name.toLowerCase().includes('shrikhand') || dish.name.toLowerCase().includes('brownie') || dish.name.toLowerCase().includes('jamun');
  const isBread = dish.name.toLowerCase().includes('naan') || dish.name.toLowerCase().includes('kulcha') || dish.name.toLowerCase().includes('rotlo');
  const isBeverage = dish.name.toLowerCase().includes('chaas') || dish.name.toLowerCase().includes('lassi') || dish.name.toLowerCase().includes('mojito');

  return (
    <group position={[0, -0.2, 0]}>
      {/* Porcelain / Ceramic Plate */}
      <mesh receiveShadow castShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[2.0, 1.6, 0.12, 48]} />
        <meshStandardMaterial color="#0A1E16" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Plate Gold Rim */}
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[1.98, 0.04, 16, 48]} />
        <meshStandardMaterial color="#D4A24C" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Procedural dish shape based on type */}
      {isBeverage ? (
        <group position={[0, 0.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.6, 0.45, 1.3, 32]} />
            <meshStandardMaterial color="#FAF0CA" transparent opacity={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <torusGeometry args={[0.58, 0.05, 16, 32]} />
            <meshStandardMaterial color="#D4A24C" metalness={0.8} />
          </mesh>
        </group>
      ) : isBread ? (
        <group position={[0, 0.1, 0]} rotation={[0.2, 0.3, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.06, 32]} />
            <meshStandardMaterial color="#DDA15E" roughness={0.85} />
          </mesh>
          <mesh position={[0.2, 0.05, 0.1]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#FFF" roughness={0.3} />
          </mesh>
        </group>
      ) : isDessert ? (
        <group position={[0, 0.15, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#9C6644" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#FFF" roughness={0.2} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0.1, 0]}>
          {/* Main Curry / Biryani / Dish */}
          <mesh castShadow>
            <cylinderGeometry args={[1.3, 1.1, 0.3, 32]} />
            <meshStandardMaterial color="#BC4749" roughness={0.5} />
          </mesh>
          {/* Paneer / Veggies Cubes */}
          <mesh position={[-0.3, 0.22, 0.2]} rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial color="#FFFDEB" roughness={0.6} />
          </mesh>
          <mesh position={[0.3, 0.22, -0.2]} rotation={[0.1, -0.3, 0.2]}>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial color="#FFFDEB" roughness={0.6} />
          </mesh>
          {/* Green Coriander Garnish */}
          <mesh position={[0, 0.24, 0]}>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#386641" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* Floating Sparkles around Dish */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[1.4, 0.8, -0.6]}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color="#D4A24C" metalness={0.9} />
        </mesh>
      </Float>
    </group>
  );
}

export default function DishViewerModal({ dish, onClose }) {
  const { addToCart, setIsDrawerOpen } = useCart();

  if (!dish) return null;

  const handleOrder = () => {
    addToCart(dish, 1);
    onClose();
    setIsDrawerOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-forest-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-forest-900 border border-gold/30 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-forest-950/70 border border-gold/30 text-cream/80 hover:text-gold hover:border-gold transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: 3D Interactive Canvas */}
          <div className="relative h-72 sm:h-96 lg:h-full bg-gradient-to-b from-forest-950 to-forest-900 flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Interactive View</span>
            </div>
            <p className="absolute bottom-3 text-center w-full z-10 text-[11px] text-cream/40 pointer-events-none">
              Drag to rotate 360°
            </p>

            <Canvas camera={{ position: [0, 2, 3.5], fov: 45 }} dpr={[1, 2]}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[4, 6, 4]} intensity={1.5} />
              <pointLight position={[-3, 2, -2]} intensity={0.8} color="#D4A24C" />
              <Suspense fallback={null}>
                <SingleDish3D dish={dish} />
                <ContactShadows position={[0, -0.3, 0]} opacity={0.6} scale={4} blur={2} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
              </Suspense>
            </Canvas>
          </div>

          {/* Right: Dish Details & Action */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Type & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    dish.type === 'jain'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : dish.type === 'veg'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  ● {dish.type.toUpperCase()}
                </span>
                {dish.chef_special && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/40 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Chef's Special</span>
                  </span>
                )}
              </div>

              {/* Dish Name */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-2">
                {dish.name}
              </h2>

              {/* Price */}
              <div className="text-2xl font-bold text-gold mb-4">
                ₹{dish.price}
              </div>

              {/* Description */}
              <p className="text-sm text-cream/70 leading-relaxed mb-6">
                {dish.description}
              </p>

              {/* Meta information tags */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-forest-950/60 border border-gold/15">
                  <div className="flex items-center space-x-2 text-gold text-xs font-medium mb-1">
                    <Flame className="w-4 h-4 text-saffron" />
                    <span>Spice Level</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((lvl) => (
                      <span
                        key={lvl}
                        className={`text-sm ${
                          lvl <= (dish.spice_level || 1) ? 'text-saffron' : 'text-cream/20'
                        }`}
                      >
                        🌶️
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-forest-950/60 border border-gold/15">
                  <div className="flex items-center space-x-2 text-gold text-xs font-medium mb-1">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>Prep Time</span>
                  </div>
                  <span className="text-sm text-cream font-semibold">
                    ~{dish.preparation_time || 15} mins
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gold/20 flex items-center gap-3">
              <button
                onClick={handleOrder}
                className="flex-1 py-3 px-6 rounded-xl bg-gold-gradient text-forest-950 font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-lg hover:shadow-[0_0_20px_rgba(212,162,76,0.4)] transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ₹{dish.price}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
