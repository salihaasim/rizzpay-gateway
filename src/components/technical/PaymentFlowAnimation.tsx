
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, Html, RoundedBox } from '@react-three/drei';
import { Vector3, Mesh, Group } from 'three';
import { MeshPhongMaterial } from 'three';
import { motion } from '@/components/ui/motion';

// Node component for the payment flow
const FlowNode = ({ 
  position, 
  name, 
  color = '#0052FF',
  scale = 1,
  icon,
  active,
  onClick
}: { 
  position: [number, number, number]; 
  name: string; 
  color?: string;
  scale?: number;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => {
  const ref = useRef<Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      if (active) {
        // Pulse effect when active
        const pulseFactor = (Math.sin(state.clock.getElapsedTime() * 3) + 1) * 0.05 + 1;
        ref.current.scale.set(scale * pulseFactor, scale * pulseFactor, scale * pulseFactor);
      } else {
        ref.current.scale.set(scale, scale, scale);
      }
    }
  });
  
  return (
    <group 
      ref={ref} 
      position={new Vector3(...position)}
      onClick={onClick}
    >
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
        <meshPhongMaterial 
          color={color} 
          opacity={active ? 1 : 0.7} 
          transparent 
          emissive={active ? color : 'black'}
          emissiveIntensity={active ? 0.3 : 0}
        />
      </RoundedBox>
      
      <Text 
        position={[0, -0.8, 0]} 
        fontSize={0.2} 
        color="#ffffff" 
        anchorX="center" 
        anchorY="middle"
      >
        {name}
      </Text>
      
      {icon && (
        <Html position={[0, 0, 0.51]} transform style={{ pointerEvents: 'none' }}>
          <div className="bg-white rounded-full p-1 flex items-center justify-center" style={{ transform: 'scale(0.3)' }}>
            {icon}
          </div>
        </Html>
      )}
    </group>
  );
};

// Connection line between nodes
const ConnectionLine = ({
  start,
  end,
  active,
  color = '#0052FF'
}: {
  start: [number, number, number];
  end: [number, number, number];
  active?: boolean;
  color?: string;
}) => {
  const ref = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as MeshPhongMaterial;
      if (active && material) {
        // Animated pulse effect on active connections
        material.opacity = (Math.sin(state.clock.getElapsedTime() * 4) + 1) * 0.4 + 0.2;
        material.emissiveIntensity = (Math.sin(state.clock.getElapsedTime() * 4) + 1) * 0.3;
      }
    }
  });
  
  // Calculate direction vector
  const dir = new Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const length = dir.length();
  dir.normalize();
  
  // Calculate rotation
  const rotation = [
    Math.atan2(dir.z, Math.sqrt(dir.x * dir.x + dir.y * dir.y)),
    0,
    Math.atan2(dir.x, dir.y)
  ];
  
  return (
    <mesh 
      ref={ref}
      position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      <cylinderGeometry args={[0.03, 0.03, length, 8]} />
      <meshPhongMaterial 
        color={color} 
        opacity={active ? 0.8 : 0.3} 
        transparent 
        emissive={color}
        emissiveIntensity={active ? 0.2 : 0}
      />
    </mesh>
  );
};

// Main scene component
const PaymentFlowScene = ({ step, setStep }: { step: number, setStep: (step: number) => void }) => {
  const handleNodeClick = (nodeIndex: number) => {
    setStep(nodeIndex);
  };
  
  // Define node positions
  const nodePositions = [
    [-3, 0, 0],    // Customer
    [-1, 1, 0],    // UPI/Card Interface
    [1, 1, 0],     // RizzPay Gateway
    [3, 1, 0],     // Bank/Processor
    [1, -1, 0],    // Merchant Ledger
    [-1, -1, 0],   // Wallet
    [-3, -2, 0],   // Merchant
  ];
  
  // Define connections between nodes
  const connections = [
    { start: 0, end: 1 },  // Customer to Interface
    { start: 1, end: 2 },  // Interface to Gateway
    { start: 2, end: 3 },  // Gateway to Bank
    { start: 3, end: 2 },  // Bank back to Gateway (response)
    { start: 2, end: 4 },  // Gateway to Ledger
    { start: 4, end: 5 },  // Ledger to Wallet
    { start: 5, end: 6 },  // Wallet to Merchant
  ];
  
  // Determine active nodes and connections based on current step
  const getActiveNodes = () => {
    switch(step) {
      case 0: return [0];
      case 1: return [0, 1];
      case 2: return [1, 2];
      case 3: return [2, 3];
      case 4: return [2, 3, 4];
      case 5: return [4, 5];
      case 6: return [5, 6];
      default: return [];
    }
  };
  
  const getActiveConnections = () => {
    switch(step) {
      case 1: return [0];
      case 2: return [1];
      case 3: return [2];
      case 4: return [2, 3];
      case 5: return [4];
      case 6: return [5];
      default: return [];
    }
  };
  
  const activeNodes = getActiveNodes();
  const activeConnections = getActiveConnections();
  
  return (
    <>
      {/* Render connections */}
      {connections.map((conn, idx) => (
        <ConnectionLine 
          key={`conn-${idx}`}
          start={nodePositions[conn.start] as [number, number, number]}
          end={nodePositions[conn.end] as [number, number, number]}
          active={activeConnections.includes(idx)}
        />
      ))}
      
      {/* Render nodes */}
      <FlowNode 
        position={nodePositions[0] as [number, number, number]} 
        name="Customer" 
        color="#10B981" 
        active={activeNodes.includes(0)}
        onClick={() => handleNodeClick(0)}
      />
      
      <FlowNode 
        position={nodePositions[1] as [number, number, number]} 
        name="Payment Interface" 
        color="#3B82F6" 
        active={activeNodes.includes(1)}
        onClick={() => handleNodeClick(1)}
      />
      
      <FlowNode 
        position={nodePositions[2] as [number, number, number]} 
        name="RizzPay Gateway" 
        color="#0052FF" 
        active={activeNodes.includes(2)}
        onClick={() => handleNodeClick(2)}
      />
      
      <FlowNode 
        position={nodePositions[3] as [number, number, number]} 
        name="Bank/Processor" 
        color="#8B5CF6" 
        active={activeNodes.includes(3)}
        onClick={() => handleNodeClick(3)}
      />
      
      <FlowNode 
        position={nodePositions[4] as [number, number, number]} 
        name="Merchant Ledger" 
        color="#F59E0B" 
        active={activeNodes.includes(4)}
        onClick={() => handleNodeClick(4)}
      />
      
      <FlowNode 
        position={nodePositions[5] as [number, number, number]} 
        name="Wallet System" 
        color="#EC4899" 
        active={activeNodes.includes(5)}
        onClick={() => handleNodeClick(5)}
      />
      
      <FlowNode 
        position={nodePositions[6] as [number, number, number]} 
        name="Merchant" 
        color="#10B981" 
        active={activeNodes.includes(6)}
        onClick={() => handleNodeClick(6)}
      />
      
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      
      {/* Directional Lights */}
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, 10, 5]} intensity={0.4} />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={20}
        target={[0, 0, 0]}
      />
    </>
  );
};

// Step descriptions for the animation
const stepDescriptions = [
  {
    title: "Customer Initiates Payment",
    description: "Customer decides to make a payment to a merchant using RizzPay services",
  },
  {
    title: "Payment Interface",
    description: "The customer interacts with UPI, card payment, or bank transfer interface",
  },
  {
    title: "RizzPay Gateway",
    description: "The payment request is securely processed by our payment gateway",
  },
  {
    title: "Bank Processing",
    description: "The transaction is verified with the customer's bank or UPI provider",
  },
  {
    title: "Ledger Recording",
    description: "The transaction is recorded in our secure immutable ledger system",
  },
  {
    title: "Wallet Credit",
    description: "Funds are credited to the merchant's RizzPay wallet",
  },
  {
    title: "Merchant Settlement",
    description: "The merchant can view their balance and withdraw funds to their bank account",
  }
];

// Main component that combines 3D scene with controls
const PaymentFlowAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  
  // Auto advance through steps if autoPlay is enabled
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stepDescriptions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoPlay]);
  
  return (
    <div className="w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="relative aspect-[16/9] w-full">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          className="w-full h-full"
        >
          <PaymentFlowScene step={currentStep} setStep={setCurrentStep} />
        </Canvas>
        
        {/* Overlay with step description */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-white"
          >
            <h3 className="text-xl font-bold mb-2">{stepDescriptions[currentStep].title}</h3>
            <p className="text-gray-200">{stepDescriptions[currentStep].description}</p>
          </motion.div>
        </div>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 space-x-2 flex">
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            disabled={currentStep === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 ${autoPlay ? 'bg-primary/70' : 'bg-white/10'} hover:bg-white/20 rounded-full text-white`}
            title={autoPlay ? "Pause" : "Auto Play"}
          >
            {autoPlay ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <button 
            onClick={() => setCurrentStep(Math.min(stepDescriptions.length - 1, currentStep + 1))}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            disabled={currentStep === stepDescriptions.length - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Step indicators */}
        <div className="absolute top-4 left-4 flex space-x-1">
          {stepDescriptions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full ${currentStep === idx ? 'bg-primary' : 'bg-white/30'}`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-800 text-white text-center">
        <p className="text-sm text-gray-300">
          Interactive 3D visualization of RizzPay's payment processing flow.
          <br />
          Click on any node to focus on that step, or use the controls to navigate the payment journey.
        </p>
      </div>
    </div>
  );
};

export default PaymentFlowAnimation;
