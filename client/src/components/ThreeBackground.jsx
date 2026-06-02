import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef();
    const lineRef = useRef();

    const count = 180;
    const maxDist = 2.2;

    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = [];
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
            vel.push({
                x: (Math.random() - 0.5) * 0.004,
                y: (Math.random() - 0.5) * 0.004,
                z: (Math.random() - 0.5) * 0.003,
            });
        }
        return [pos, vel];
    }, []);

    const linePositions = useMemo(() => new Float32Array(count * count * 3), []);
    const lineGeo = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        return geo;
    }, [linePositions]);

    useFrame((state) => {
        if (!ref.current) return;
        const posArr = ref.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            posArr[i * 3] += velocities[i].x;
            posArr[i * 3 + 1] += velocities[i].y;
            posArr[i * 3 + 2] += velocities[i].z;

            if (posArr[i * 3] > 5 || posArr[i * 3] < -5) velocities[i].x *= -1;
            if (posArr[i * 3 + 1] > 5 || posArr[i * 3 + 1] < -5) velocities[i].y *= -1;
            if (posArr[i * 3 + 2] > 3 || posArr[i * 3 + 2] < -3) velocities[i].z *= -1;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;

        // Draw connecting lines
        let idx = 0;
        let numConnected = 0;
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = posArr[i * 3] - posArr[j * 3];
                const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < maxDist * maxDist) {
                    linePositions[idx++] = posArr[i * 3];
                    linePositions[idx++] = posArr[i * 3 + 1];
                    linePositions[idx++] = posArr[i * 3 + 2];
                    linePositions[idx++] = posArr[j * 3];
                    linePositions[idx++] = posArr[j * 3 + 1];
                    linePositions[idx++] = posArr[j * 3 + 2];
                    numConnected++;
                }
            }
        }
        if (lineRef.current) {
            lineRef.current.geometry.setDrawRange(0, numConnected * 2);
            lineRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Slow rotation
        ref.current.rotation.y = state.clock.elapsedTime * 0.02;
        ref.current.rotation.x = state.clock.elapsedTime * 0.01;
        if (lineRef.current) {
            lineRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            lineRef.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#38bdf8"
                    size={0.04}
                    sizeAttenuation
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
            <lineSegments ref={lineRef} geometry={lineGeo}>
                <lineBasicMaterial
                    color="#1d4ed8"
                    transparent
                    opacity={0.12}
                />
            </lineSegments>
        </>
    );
}

function CameraController() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useFrame((state) => {
        state.camera.position.x += (mouse.x * 0.5 - state.camera.position.x) * 0.02;
        state.camera.position.y += (-mouse.y * 0.5 - state.camera.position.y) * 0.02;
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <mesh
            visible={false}
            onPointerMove={(e) => {
                setMouse({
                    x: (e.clientX / window.innerWidth - 0.5) * 2,
                    y: (e.clientY / window.innerHeight - 0.5) * 2,
                });
            }}
        >
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
}

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <ParticleField />
                <CameraController />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
