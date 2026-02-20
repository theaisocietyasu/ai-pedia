
import React from 'react';
import { editable as e } from '@theatre/r3f';
import { Text } from '@react-three/drei';

// Interface for Scene Object props
export interface SceneObjectProps {
  id: string;
  theatreKey: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  [key: string]: any;
}

export const EditableSphere: React.FC<SceneObjectProps> = ({ 
  theatreKey, 
  position = [0, 0, 0], 
  color = "#8b5cf6",
  ...props 
}) => {
  return (
    <e.mesh theatreKey={theatreKey} position={position} {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <e.meshStandardMaterial theatreKey={`${theatreKey}_Material`} color={color} />
    </e.mesh>
  );
};

export const EditableBox: React.FC<SceneObjectProps> = ({ 
  theatreKey, 
  position = [0, 0, 0], 
  color = "#ec4899",
  ...props 
}) => {
  return (
    <e.mesh theatreKey={theatreKey} position={position} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <e.meshStandardMaterial theatreKey={`${theatreKey}_Material`} color={color} />
    </e.mesh>
  );
};

export const EditablePlane: React.FC<SceneObjectProps> = ({ 
  theatreKey, 
  position = [0, -1, 0], 
  color = "#1f2937",
  rotation = [-Math.PI / 2, 0, 0],
  scale = [10, 10, 1],
  ...props 
}) => {
  return (
    <e.mesh theatreKey={theatreKey} position={position} rotation={rotation} scale={scale} {...props}>
      <planeGeometry args={[1, 1]} />
      <e.meshStandardMaterial theatreKey={`${theatreKey}_Material`} color={color} />
    </e.mesh>
  );
};

// Simple cylinder to act as a line for now, scalable in Y
export const EditableCylinder: React.FC<SceneObjectProps> = ({ 
  theatreKey, 
  position = [0, 0, 0], 
  color = "#3b82f6",
  scale = [0.1, 5, 0.1], // Thin and long default
  ...props 
}) => {
  return (
    <e.mesh theatreKey={theatreKey} position={position} scale={scale} {...props}>
      <cylinderGeometry args={[1, 1, 1, 32]} />
      <e.meshStandardMaterial theatreKey={`${theatreKey}_Material`} color={color} />
    </e.mesh>
  );
};

export const SceneObjectFactory: React.FC<{ type: string; props: SceneObjectProps }> = ({ type, props }) => {
  switch (type) {
    case 'sphere':
      return <EditableSphere {...props} />;
    case 'box':
      return <EditableBox {...props} />;
    case 'plane':
      return <EditablePlane {...props} />;
    case 'cylinder': // Using cylinder for lines as it's easier to hit-test and light
      return <EditableCylinder {...props} />;
    default:
      return null;
  }
};
