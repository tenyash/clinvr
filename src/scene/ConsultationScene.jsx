import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './ConsultationScene.css';

function Box({ position, size, color, ...props }) {
  return (
    <mesh position={position} castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}

function Cylinder({ position, radiusTop, radiusBottom, height, color, rotation, ...props }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow {...props}>
      <cylinderGeometry args={[radiusTop, radiusBottom, height, 20]} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}

function Room() {
  return (
    <group>
      {/* Open-front consultation room */}
      <Box position={[0, -0.18, 0]} size={[12, 0.36, 10]} color="#d9e4e2" />
      <Box position={[0, 2.55, -5]} size={[12, 5.1, 0.22]} color="#f1f5f2" />
      <Box position={[-6, 2.55, 0]} size={[0.22, 5.1, 10]} color="#e8efeb" />
      <Box position={[6, 2.55, 0]} size={[0.22, 5.1, 10]} color="#e8efeb" />

      {/* Window with a quiet view of the campus */}
      <Box position={[-2.8, 3.35, -4.86]} size={[3.4, 1.8, 0.06]} color="#badce0" />
      <Box position={[-2.8, 3.35, -4.79]} size={[0.07, 1.82, 0.08]} color="#ffffff" />
      <Box position={[-2.8, 3.35, -4.78]} size={[3.45, 0.07, 0.08]} color="#ffffff" />
      <Box position={[-2.8, 3.35, -4.73]} size={[0.06, 1.7, 0.05]} color="#ffffff" />
      <Box position={[-2.8, 3.35, -4.72]} size={[3.3, 0.06, 0.05]} color="#ffffff" />

      {/* Wall cabinet and clinical supplies */}
      <Box position={[3.65, 3.4, -4.63]} size={[2.35, 1.15, 0.44]} color="#d7e2df" />
      <Box position={[3.65, 2.79, -4.59]} size={[2.55, 0.08, 0.53]} color="#ffffff" />
      <Box position={[3.1, 3.42, -4.38]} size={[0.04, 1, 0.04]} color="#becdca" />
      <Box position={[4.18, 3.42, -4.38]} size={[0.04, 1, 0.04]} color="#becdca" />
      <Cylinder position={[3.35, 2.96, -4.44]} radiusTop={0.12} radiusBottom={0.12} height={0.25} color="#d5a56e" />
      <Cylinder position={[4.3, 2.96, -4.44]} radiusTop={0.14} radiusBottom={0.14} height={0.25} color="#86a897" />

      {/* Examination bed */}
      <Box position={[-1.55, 0.86, -0.2]} size={[3.3, 0.25, 1.55]} color="#ffffff" />
      <Box position={[-1.55, 0.98, -0.2]} size={[3.27, 0.1, 1.5]} color="#b8d4d1" />
      <Box position={[-1.55, 0.42, -0.2]} size={[0.18, 0.86, 0.18]} color="#99aaa7" />
      <Box position={[-2.95, 0.42, -0.2]} size={[0.18, 0.86, 0.18]} color="#99aaa7" />
      <Box position={[-0.15, 0.42, -0.2]} size={[0.18, 0.86, 0.18]} color="#99aaa7" />
      <Box position={[-1.55, 0.11, -0.2]} size={[3.05, 0.12, 0.3]} color="#819591" />

      {/* Bedside monitor */}
      <Box position={[-4.25, 1.48, -0.7]} size={[0.84, 0.72, 0.2]} color="#d5dfdc" />
      <Box position={[-4.25, 1.5, -0.57]} size={[0.68, 0.49, 0.05]} color="#a7cebf" />
      <Box position={[-4.25, 0.65, -0.7]} size={[0.08, 0.9, 0.08]} color="#8fa09c" />
      <Box position={[-4.25, 0.2, -0.7]} size={[0.6, 0.09, 0.48]} color="#8fa09c" />
      <Box position={[-4.25, 1.51, -0.535]} size={[0.42, 0.025, 0.014]} color="#e8fbef" />

      {/* Clinician desk, stool and plant */}
      <Box position={[3.25, 1.05, 1.6]} size={[2.15, 0.14, 1.05]} color="#ffffff" />
      <Box position={[3.25, 0.55, 1.6]} size={[1.85, 0.95, 0.8]} color="#dfe8e4" />
      <Cylinder position={[4.76, 0.48, 0.1]} radiusTop={0.09} radiusBottom={0.09} height={0.9} color="#728884" />
      <Cylinder position={[4.76, 0.95, 0.1]} radiusTop={0.4} radiusBottom={0.4} height={0.14} color="#91aaa1" />
      <Cylinder position={[4.85, 0.35, -3.55]} radiusTop={0.25} radiusBottom={0.32} height={0.55} color="#d9b795" />
      <Cylinder position={[4.85, 1, -3.55]} radiusTop={0.065} radiusBottom={0.13} height={0.85} color="#708d73" />
      <Cylinder position={[4.54, 1.16, -3.55]} radiusTop={0.07} radiusBottom={0.14} height={0.58} color="#87a88a" rotation={[0, 0, -0.8]} />
      <Cylinder position={[5.16, 1.16, -3.55]} radiusTop={0.07} radiusBottom={0.14} height={0.58} color="#87a88a" rotation={[0, 0, 0.8]} />

      {/* Ceiling light */}
      <Box position={[0, 4.96, -1]} size={[2.5, 0.08, 0.75]} color="#fffdf4" />
    </group>
  );
}

function Patient({ onPatientClick, examView }) {
  const [hovered, setHovered] = useState(false);
  const skin = '#bd8469';
  const gown = hovered ? '#3a8e83' : '#4a9a8f';
  return (
    <group
      position={[-0.3, 0, 0.22]}
      onClick={(event) => {
        event.stopPropagation();
        onPatientClick?.();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Seated legs */}
      <Box position={[-0.2, 1.02, 0.05]} size={[0.42, 0.26, 0.9]} color="#465a6a" rotation={[-0.04, 0, 0]} />
      <Box position={[0.26, 1.02, 0.05]} size={[0.42, 0.26, 0.9]} color="#465a6a" rotation={[-0.04, 0, 0]} />
      <Cylinder position={[-0.2, 0.55, 0.45]} radiusTop={0.105} radiusBottom={0.13} height={0.75} color="#465a6a" />
      <Cylinder position={[0.26, 0.55, 0.45]} radiusTop={0.105} radiusBottom={0.13} height={0.75} color="#465a6a" />
      <Box position={[-0.2, 0.17, 0.57]} size={[0.32, 0.16, 0.48]} color="#f4f1eb" />
      <Box position={[0.26, 0.17, 0.57]} size={[0.32, 0.16, 0.48]} color="#f4f1eb" />

      {/* Torso, neck and head */}
      <Cylinder position={[0, 1.64, 0]} radiusTop={0.4} radiusBottom={0.48} height={0.92} color={gown} />
      <Cylinder position={[0, 2.16, 0]} radiusTop={0.13} radiusBottom={0.13} height={0.2} color={skin} />
      <mesh position={[0, 2.49, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.32, 32, 24]} />
        <meshStandardMaterial color={skin} roughness={0.86} />
      </mesh>
      {/* Hair and ears */}
      <mesh position={[0, 2.7, -0.015]} castShadow>
        <sphereGeometry args={[0.31, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
        <meshStandardMaterial color="#302b2b" roughness={0.96} />
      </mesh>
      <mesh position={[-0.31, 2.47, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position={[0.31, 2.47, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      {/* Calm, neutral facial features */}
      <mesh position={[-0.11, 2.52, 0.285]}>
        <sphereGeometry args={[0.026, 12, 8]} />
        <meshBasicMaterial color="#3b302e" />
      </mesh>
      <mesh position={[0.11, 2.52, 0.285]}>
        <sphereGeometry args={[0.026, 12, 8]} />
        <meshBasicMaterial color="#3b302e" />
      </mesh>
      <Box position={[0, 2.39, 0.306]} size={[0.1, 0.025, 0.012]} color="#875e56" />

      {/* Arms rest comfortably at the sides */}
      <Cylinder position={[-0.49, 1.67, 0.08]} radiusTop={0.13} radiusBottom={0.105} height={0.72} color={gown} rotation={[0, 0, -0.22]} />
      <Cylinder position={[0.49, 1.67, 0.08]} radiusTop={0.13} radiusBottom={0.105} height={0.72} color={gown} rotation={[0, 0, 0.22]} />
      <mesh position={[-0.57, 1.28, 0.1]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color={skin} roughness={0.86} />
      </mesh>
      <mesh position={[0.57, 1.28, 0.1]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color={skin} roughness={0.86} />
      </mesh>
      {examView && <ExamMarker view={examView} />}
    </group>
  );
}

function Clinician() {
  const skin = '#a96f59';
  return (
    <group position={[1.5, 0, 0.72]} rotation={[0, -0.72, 0]}>
      {/* Shoes and trousers */}
      <Box position={[-0.16, 0.11, 0.1]} size={[0.3, 0.16, 0.46]} color="#f6f7f4" />
      <Box position={[0.16, 0.11, 0.1]} size={[0.3, 0.16, 0.46]} color="#f6f7f4" />
      <Cylinder position={[-0.16, 0.55, 0]} radiusTop={0.13} radiusBottom={0.16} height={0.82} color="#3d515c" />
      <Cylinder position={[0.16, 0.55, 0]} radiusTop={0.13} radiusBottom={0.16} height={0.82} color="#3d515c" />

      {/* Scrubs and a simple white coat */}
      <Cylinder position={[0, 1.43, 0]} radiusTop={0.39} radiusBottom={0.33} height={0.96} color="#548b7b" />
      <Box position={[-0.19, 1.43, 0.25]} size={[0.2, 0.84, 0.11]} color="#f5f7f2" />
      <Box position={[0.19, 1.43, 0.25]} size={[0.2, 0.84, 0.11]} color="#f5f7f2" />
      <Box position={[-0.095, 1.68, 0.315]} size={[0.1, 0.31, 0.045]} color="#ffffff" rotation={[0, 0, -0.26]} />
      <Box position={[0.095, 1.68, 0.315]} size={[0.1, 0.31, 0.045]} color="#ffffff" rotation={[0, 0, 0.26]} />
      <Box position={[0.27, 1.52, 0.315]} size={[0.1, 0.13, 0.025]} color="#e7b66f" />

      {/* Arms at the sides, neck and head */}
      <Cylinder position={[-0.43, 1.36, 0.02]} radiusTop={0.12} radiusBottom={0.095} height={0.78} color="#f5f7f2" rotation={[0, 0, -0.16]} />
      <Cylinder position={[0.43, 1.36, 0.02]} radiusTop={0.12} radiusBottom={0.095} height={0.78} color="#f5f7f2" rotation={[0, 0, 0.16]} />
      <mesh position={[-0.49, 0.94, 0.04]}>
        <sphereGeometry args={[0.105, 16, 12]} />
        <meshStandardMaterial color={skin} roughness={0.86} />
      </mesh>
      <mesh position={[0.49, 0.94, 0.04]}>
        <sphereGeometry args={[0.105, 16, 12]} />
        <meshStandardMaterial color={skin} roughness={0.86} />
      </mesh>
      <Cylinder position={[0, 1.99, 0]} radiusTop={0.12} radiusBottom={0.12} height={0.22} color={skin} />
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.29, 28, 20]} />
        <meshStandardMaterial color={skin} roughness={0.84} />
      </mesh>
      <mesh position={[0, 2.48, -0.025]} castShadow>
        <sphereGeometry args={[0.285, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#252b29" roughness={0.96} />
      </mesh>
      <mesh position={[-0.1, 2.32, 0.27]}>
        <sphereGeometry args={[0.023, 12, 8]} />
        <meshBasicMaterial color="#302824" />
      </mesh>
      <mesh position={[0.1, 2.32, 0.27]}>
        <sphereGeometry args={[0.023, 12, 8]} />
        <meshBasicMaterial color="#302824" />
      </mesh>
      <Box position={[0, 2.21, 0.28]} size={[0.09, 0.022, 0.01]} color="#805a50" />

      {/* A small stethoscope chest piece gives the figure a clear clinician cue. */}
      <Cylinder position={[0.13, 1.31, 0.335]} radiusTop={0.055} radiusBottom={0.055} height={0.035} color="#b9c8c5" rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function resolveExamAction(action) {
  const text = String(action ?? '').trim();
  const normalized = text.toLowerCase().replace(/[_-]+/g, ' ');
  if (!text) return null;
  if (normalized.includes('general')) return { label: 'General appearance', target: [0, 2.39, 0.35], fallbackClass: 'head' };
  if (normalized.includes('vital') || normalized.includes('observation')) return { label: 'Observations reviewed', target: [0, 1.87, 0.48], fallbackClass: 'chest' };
  if (normalized.includes('chest') || normalized.includes('respirat') || normalized.includes('cardiac') || normalized.includes('cardiovascular') || normalized.includes('heart')) {
    return { label: 'Chest examination', target: [0, 1.87, 0.49], fallbackClass: 'chest' };
  }
  if (normalized.includes('neuro')) return { label: 'Neurological examination', target: [0, 2.49, 0.34], fallbackClass: 'head' };
  if (normalized.includes('abdomen') || normalized.includes('abdominal') || normalized.includes('focused sign') || normalized.includes('tender')) {
    return { label: 'Abdominal examination', target: [0, 1.45, 0.49], fallbackClass: 'abdomen' };
  }
  const label = text.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return { label, target: [0, 1.6, 0.49], fallbackClass: 'abdomen' };
}

function ExamMarker({ view }) {
  const marker = useRef(null);
  useFrame(({ clock }) => {
    if (!marker.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4.5) * 0.1;
    marker.current.scale.set(pulse, pulse, 1);
    marker.current.material.opacity = 0.72 + Math.sin(clock.elapsedTime * 4.5) * 0.14;
  });
  return (
    <mesh ref={marker} position={view.target} onClick={(event) => event.stopPropagation()}>
      <ringGeometry args={[0.17, 0.22, 48]} />
      <meshBasicMaterial color="#eead5d" transparent opacity={0.8} depthWrite={false} />
    </mesh>
  );
}

function SceneContents({ onPatientClick, examView }) {
  return (
    <>
      <color attach="background" args={['#dbe7e5']} />
      <fog attach="fog" args={['#dbe7e5', 12, 24]} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[-3, 8, 5]} intensity={2.3} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[0, 4, -2]} intensity={0.45} color="#fff4dd" />
      <Room />
      <Clinician />
      <Patient onPatientClick={onPatientClick} examView={examView} />
    </>
  );
}

function SceneControls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(0, 1.45, 0);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 8.5;
    controls.maxDistance = 18;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = 1.48;
    controls.update();
    return () => controls.dispose();
  }, [camera, gl]);
  return null;
}

function StaticFallback({ onPatientClick, examView }) {
  return (
    <div className="clinvr-scene-fallback" role="img" aria-label="Illustrated consultation room with a seated patient">
      <div className="clinvr-fallback-window"><span /></div>
      <div className="clinvr-fallback-cabinet"><i /><i /><i /></div>
      <div className="clinvr-fallback-bed"><span className="clinvr-fallback-bed-base" /></div>
      <div className="clinvr-fallback-monitor"><i /><span /></div>
      <button className="clinvr-fallback-patient" onClick={onPatientClick} aria-label="Talk to the patient">
        <span className="clinvr-fallback-hair" />
        <span className="clinvr-fallback-head"><i /><i /><b /></span>
        <span className="clinvr-fallback-body" />
        <span className="clinvr-fallback-arm left" />
        <span className="clinvr-fallback-arm right" />
        <span className="clinvr-fallback-leg left" />
        <span className="clinvr-fallback-leg right" />
        <span className="clinvr-fallback-shoe left" />
        <span className="clinvr-fallback-shoe right" />
        {examView && <span className={`clinvr-fallback-action-ring ${examView.fallbackClass}`} />}
      </button>
      <div className="clinvr-fallback-doctor" aria-hidden="true">
        <span className="clinvr-doctor-hair" />
        <span className="clinvr-doctor-head"><i /><i /><b /></span>
        <span className="clinvr-doctor-body" />
        <span className="clinvr-doctor-coat left" />
        <span className="clinvr-doctor-coat right" />
        <span className="clinvr-doctor-arm left" />
        <span className="clinvr-doctor-arm right" />
        <span className="clinvr-doctor-leg left" />
        <span className="clinvr-doctor-leg right" />
        <span className="clinvr-doctor-shoe left" />
        <span className="clinvr-doctor-shoe right" />
        <span className="clinvr-doctor-badge" />
      </div>
      <div className="clinvr-fallback-caption"><span className="clinvr-fallback-status" />Consultation room</div>
    </div>
  );
}

/**
 * A compact, open-front consultation room for the case workspace.
 * Click or tap the patient to trigger the supplied interaction callback.
 */
export default function ConsultationScene({ onPatientClick, examAction, className = '', style }) {
  const examView = resolveExamAction(examAction);
  return (
    <div className={`clinvr-scene ${className}`} style={style}>
      <Canvas
        camera={{ position: [8.1, 6.5, 10], fov: 39, near: 0.1, far: 60 }}
        shadows
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#dbe7e5');
          camera.lookAt(0, 1.45, 0);
        }}
        fallback={<StaticFallback onPatientClick={onPatientClick} examView={examView} />}
      >
        <SceneContents onPatientClick={onPatientClick} examView={examView} />
        <SceneControls />
      </Canvas>
      {examView && (
        <div className="clinvr-exam-indicator" role="status" aria-live="polite">
          <span className="clinvr-exam-pulse" />
          <span>Exam focus</span>
          <strong>{examView.label}</strong>
        </div>
      )}
    </div>
  );
}


