import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Earth Texture URL (NASA Blue Marble via three.js examples) ─── */
const EARTH_TEXTURE = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r169/examples/textures/planets/earth_atmos_2048.jpg';
const EARTH_BUMP = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r169/examples/textures/planets/earth_normal_2048.jpg';
const EARTH_SPECULAR = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r169/examples/textures/planets/earth_specular_2048.jpg';

/* ─── Scroll-linked Earth Globe ─── */
function Earth({ scrollRef, mouseRef }) {
    const meshRef = useRef();
    const atmosphereRef = useRef();
    const cloudsRef = useRef();
    const groupRef = useRef();

    // Load textures
    const [colorMap, bumpMap, specMap] = useLoader(THREE.TextureLoader, [
        EARTH_TEXTURE,
        EARTH_BUMP,
        EARTH_SPECULAR,
    ]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Base slow rotation + scroll-linked rotation
        const scrollProgress = scrollRef.current;
        const targetRotationY = scrollProgress * Math.PI * 3 + state.clock.elapsedTime * 0.05;
        meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.03;
        
        // Tilt mesh slightly based on mouse Y
        meshRef.current.rotation.x = 0.3 + mouseRef.current.y * 0.15;

        // Clouds rotate slightly faster
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = meshRef.current.rotation.y + state.clock.elapsedTime * 0.02;
            cloudsRef.current.rotation.x = meshRef.current.rotation.x;
        }

        // Atmosphere follows
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y = meshRef.current.rotation.y;
            atmosphereRef.current.rotation.x = meshRef.current.rotation.x;
        }

        // Scroll-based zoom: closer at top, further at bottom
        const targetZ = 3.2 - scrollProgress * 0.6;
        state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;

        if (groupRef.current) {
            const targetOffsetX = (typeof window !== 'undefined' && window.location.pathname === '/admin' && window.innerWidth >= 1024) ? -0.85 : 0;
            groupRef.current.position.x += (targetOffsetX - groupRef.current.position.x) * 0.04; // Smooth lerp transition
        }

        // Mouse parallax (increased sensitivity: 0.3 -> 0.9, 0.2 -> 0.7, lerp 0.02 -> 0.06)
        const targetCamX = mouseRef.current.x * 0.9;
        const targetCamY = -mouseRef.current.y * 0.7;
        state.camera.position.x += (targetCamX - state.camera.position.x) * 0.06;
        state.camera.position.y += (targetCamY - state.camera.position.y) * 0.06;
        
        state.camera.lookAt(groupRef.current ? groupRef.current.position.x : 0, 0, 0);
    });

    return (
        <group ref={groupRef}>
            {/* Earth */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    bumpMap={bumpMap}
                    bumpScale={0.04}
                    specularMap={specMap}
                    specular={new THREE.Color(0x333333)}
                    shininess={15}
                />
            </mesh>

            {/* Cloud layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[1.008, 64, 64]} />
                <meshPhongMaterial
                    transparent
                    opacity={0.15}
                    color={0xffffff}
                    depthWrite={false}
                />
            </mesh>

            {/* Atmosphere glow */}
            <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[1, 64, 64]} />
                <shaderMaterial
                    transparent
                    depthWrite={false}
                    side={THREE.BackSide}
                    uniforms={{
                        glowColor: { value: new THREE.Color(0x38bdf8) },
                    }}
                    vertexShader={`
                        varying vec3 vNormal;
                        void main() {
                            vNormal = normalize(normalMatrix * normal);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        varying vec3 vNormal;
                        uniform vec3 glowColor;
                        void main() {
                            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                            gl_FragColor = vec4(glowColor, intensity * 0.6);
                        }
                    `}
                />
            </mesh>
        </group>
    );
}

/* ─── Particle Field Wireframe Network ─── */
function WireframeParticles({ scrollRef, mouseRef }) {
    const pointsRef = useRef();
    const linesRef = useRef();

    const particleCount = 180;
    const maxConnections = 300; // Cap to keep frame rate high

    // Initialize positions and velocities
    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vels = [];
        for (let i = 0; i < particleCount; i++) {
            let x, y, z, dist;
            do {
                x = (Math.random() - 0.5) * 12;
                y = (Math.random() - 0.5) * 12;
                z = (Math.random() - 0.5) * 8 - 1;
                dist = Math.sqrt(x * x + y * y + z * z);
            } while (dist < 1.4); // Keep away from Earth and atmosphere
            
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            
            vels.push({
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003
            });
        }
        return [pos, vels];
    }, []);

    const linePositions = useMemo(() => new Float32Array(maxConnections * 2 * 3), []);

    useFrame((state, delta) => {
        if (!pointsRef.current || !linesRef.current) return;

        const posAttr = pointsRef.current.geometry.attributes.position;
        const posArray = posAttr.array;

        // Move particles
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += velocities[i].x * (delta * 60);
            posArray[i * 3 + 1] += velocities[i].y * (delta * 60);
            posArray[i * 3 + 2] += velocities[i].z * (delta * 60);

            // Bounce from boundary
            if (Math.abs(posArray[i * 3]) > 6) velocities[i].x *= -1;
            if (Math.abs(posArray[i * 3 + 1]) > 6) velocities[i].y *= -1;
            if (posArray[i * 3 + 2] > 3 || posArray[i * 3 + 2] < -5) velocities[i].z *= -1;

            // Stay away from Earth
            const dist = Math.sqrt(
                posArray[i * 3] * posArray[i * 3] +
                posArray[i * 3 + 1] * posArray[i * 3 + 1] +
                posArray[i * 3 + 2] * posArray[i * 3 + 2]
            );
            if (dist < 1.4) {
                const factor = 1.4 / dist;
                posArray[i * 3] *= factor;
                posArray[i * 3 + 1] *= factor;
                posArray[i * 3 + 2] *= factor;
                velocities[i].x *= -1;
                velocities[i].y *= -1;
                velocities[i].z *= -1;
            }
        }
        posAttr.needsUpdate = true;

        // Update lines
        let vertexIndex = 0;
        let numConnected = 0;
        const maxDist = 2.2;

        const lineAttr = linesRef.current.geometry.attributes.position;
        const lineArray = lineAttr.array;

        for (let i = 0; i < particleCount; i++) {
            if (numConnected >= maxConnections) break;
            for (let j = i + 1; j < particleCount; j++) {
                if (numConnected >= maxConnections) break;

                const dx = posArray[i * 3] - posArray[j * 3];
                const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < maxDist * maxDist) {
                    lineArray[vertexIndex++] = posArray[i * 3];
                    lineArray[vertexIndex++] = posArray[i * 3 + 1];
                    lineArray[vertexIndex++] = posArray[i * 3 + 2];

                    lineArray[vertexIndex++] = posArray[j * 3];
                    lineArray[vertexIndex++] = posArray[j * 3 + 1];
                    lineArray[vertexIndex++] = posArray[j * 3 + 2];
                    numConnected++;
                }
            }
        }

        linesRef.current.geometry.setDrawRange(0, numConnected * 2);
        lineAttr.needsUpdate = true;

        // Parallax matching the camera/Earth slow rotations
        const rotationSpeedY = 0.015 + scrollRef.current * 0.05;
        pointsRef.current.rotation.y = state.clock.elapsedTime * rotationSpeedY;
        pointsRef.current.rotation.x = state.clock.elapsedTime * 0.005;

        // Small mouse influence on rotation
        pointsRef.current.rotation.y += mouseRef.current.x * 0.05;
        pointsRef.current.rotation.x += mouseRef.current.y * 0.05;

        linesRef.current.rotation.y = pointsRef.current.rotation.y;
        linesRef.current.rotation.x = pointsRef.current.rotation.x;
    });

    return (
        <group>
            {/* Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color="#38bdf8"
                    size={0.04}
                    sizeAttenuation={true}
                    transparent
                    opacity={0.4}
                    depthWrite={false}
                />
            </points>

            {/* Lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={linePositions.length / 3}
                        array={linePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#1d4ed8"
                    transparent
                    opacity={0.12}
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    );
}

/* ─── Scene Lighting ─── */
function Lighting() {
    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[5, 3, 5]} intensity={1.8} color={0xffffff} />
            <pointLight position={[-10, -5, -5]} intensity={0.3} color={0x38bdf8} />
        </>
    );
}

/* ─── Fallback while textures load ─── */
function LoadingFallback() {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });
    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#0c4a6e" wireframe />
        </mesh>
    );
}

const ThreeBackground = () => {
    const scrollRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollRef.current = docHeight > 0 ? window.scrollY / docHeight : 0;
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Initial scroll calculation
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 30% 50%, #0a1628 0%, #020617 70%)' }}>
            <Canvas
                camera={{ position: [0, 0, 3.2], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }}
            >
                <Lighting />
                <Stars
                    radius={50}
                    depth={80}
                    count={3000}
                    factor={4}
                    saturation={0.2}
                    fade
                    speed={0.5}
                />
                <Suspense fallback={<LoadingFallback />}>
                    <Earth scrollRef={scrollRef} mouseRef={mouseRef} />
                </Suspense>
                <WireframeParticles scrollRef={scrollRef} mouseRef={mouseRef} />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
