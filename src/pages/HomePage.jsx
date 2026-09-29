import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, ContactShadows, Line, Text, Text3D } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { CatmullRomCurve3, ExtrudeGeometry, PMREMGenerator, Shape, Vector3 } from 'three'
import { services, projectPillars, contactInfo } from '../data/siteData'

function ScienceHeroModel() {
  const ref = useRef()
  const orbitRef = useRef()
  const { gl, scene, size } = useThree()
  const mobile = size.width < 760
  const compact = size.width < 1100 || size.width / size.height < 1.3
  const logoScale = mobile ? 0.58 : compact ? 0.76 : 0.84
  const logoShape = useMemo(() => {
    const centerline = new CatmullRomCurve3([
      new Vector3(-0.39, 0.72, 0),
      new Vector3(-0.12, 0.9, 0),
      new Vector3(0.24, 0.81, 0),
      new Vector3(0.39, 0.57, 0),
      new Vector3(0.27, 0.37, 0),
      new Vector3(0.01, 0.19, 0),
      new Vector3(-0.26, 0.01, 0),
      new Vector3(-0.35, -0.2, 0),
      new Vector3(-0.25, -0.42, 0),
      new Vector3(0.02, -0.58, 0),
      new Vector3(0.29, -0.49, 0),
      new Vector3(0.44, -0.31, 0),
    ])
    const samples = centerline.getPoints(80)
    const leftEdge = []
    const rightEdge = []

    samples.forEach((point, index) => {
      const tangent = centerline.getTangent(index / (samples.length - 1))
      const halfWidth = 0.105
      const normalX = -tangent.y * halfWidth
      const normalY = tangent.x * halfWidth
      leftEdge.push([point.x + normalX, point.y + normalY])
      rightEdge.push([point.x - normalX, point.y - normalY])
    })

    const shape = new Shape()
    shape.moveTo(...leftEdge[0])
    leftEdge.slice(1).forEach((point) => shape.lineTo(...point))
    rightEdge.reverse().forEach((point) => shape.lineTo(...point))
    shape.closePath()

    return { centerline, shape }
  }, [])
  const logoGeometry = useMemo(() => new ExtrudeGeometry(logoShape.shape, {
    depth: 0.17,
    bevelEnabled: true,
    bevelSegments: 6,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 16,
    steps: 1,
  }), [logoShape])
  const orbitalCurves = useMemo(() => [
    { start: 0.2, end: Math.PI - 0.2, radiusX: 0.55, radiusY: 0.89, centerY: 0, z: -0.04 },
    { start: Math.PI + 0.26, end: Math.PI * 2 - 0.28, radiusX: 0.55, radiusY: 0.89, centerY: 0, z: 0.27 },
  ].map(({ start, end, radiusX, radiusY, centerY, z }) => {
    const points = Array.from({ length: 36 }, (_, index) => {
      const angle = start + ((end - start) * index) / 35
      return new Vector3(
        Math.cos(angle) * radiusX,
        centerY + Math.sin(angle) * radiusY,
        z + Math.sin(angle * 2) * 0.045,
      )
    })

    return new CatmullRomCurve3(points)
  }), [])

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, 0.04).texture
    scene.environment = environment

    return () => {
      if (scene.environment === environment) scene.environment = null
      environment.dispose()
      room.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()

    if (ref.current) {
      ref.current.rotation.y = Math.sin(elapsed * 0.12) * 0.035
      ref.current.rotation.x = Math.sin(elapsed * 0.2) * 0.025
      ref.current.rotation.z = Math.sin(elapsed * 0.16) * 0.012
      ref.current.position.y = -0.15 + Math.sin(elapsed * 0.72) * 0.06
      ref.current.position.z = Math.sin(elapsed * 0.38) * 0.04
    }

    if (orbitRef.current) orbitRef.current.rotation.z = -elapsed * 0.08
  })

  return (
    <>
      <group ref={ref} position={[0, -0.15, 0]} scale={logoScale}>
        <group>
          <group ref={orbitRef} position={[0.033, 0.441, 0]}>
            {orbitalCurves.map((curve, index) => (
              <mesh key={index} raycast={() => null}>
                <tubeGeometry args={[curve, 72, 0.027, 12, false]} />
                <meshPhysicalMaterial
                  color={index === 0 ? '#94631f' : '#d3a64f'}
                  metalness={0.99}
                  roughness={0.15}
                  clearcoat={0.95}
                  clearcoatRoughness={0.1}
                />
              </mesh>
            ))}
            {[
              [0.539, 0.177, -0.015],
              [-0.539, 0.177, -0.015],
              [-0.514, -0.229, 0.315],
              [0.508, -0.246, 0.315],
            ].map((position, index) => (
              <mesh key={index} position={position} raycast={() => null}>
                <icosahedronGeometry args={[0.045, 2]} />
                <meshPhysicalMaterial
                  color={index === 0 ? '#f0d18a' : '#b17a29'}
                  metalness={0.99}
                  roughness={0.13}
                  clearcoat={1}
                  clearcoatRoughness={0.08}
                />
              </mesh>
            ))}
          </group>
          <mesh geometry={logoGeometry} position={[0, 0.28, 0]} raycast={() => null}>
            <meshPhysicalMaterial
              color="#d0a044"
              metalness={0.99}
              roughness={0.16}
              clearcoat={0.95}
              clearcoatRoughness={0.1}
              emissive="#281704"
              emissiveIntensity={0.04}
            />
          </mesh>
          <mesh position={[0, 0.28, 0.22]} raycast={() => null}>
            <tubeGeometry args={[logoShape.centerline, 96, 0.012, 8, false]} />
            <meshPhysicalMaterial
              color="#754a16"
              metalness={0.96}
              roughness={0.23}
              clearcoat={0.65}
              clearcoatRoughness={0.18}
            />
          </mesh>
          <Center position={[0, -0.7, 0]}>
            <Text3D
              font={helvetikerBold}
              size={0.32}
              height={0.09}
              bevelEnabled
              bevelSegments={4}
              bevelSize={0.012}
              bevelThickness={0.016}
              curveSegments={8}
              letterSpacing={0.045}
              raycast={() => null}
            >
              SCIENCE
              <meshPhysicalMaterial
                color="#d3a64f"
                metalness={0.99}
                roughness={0.17}
                clearcoat={0.94}
                clearcoatRoughness={0.11}
                emissive="#35220a"
                emissiveIntensity={0.06}
              />
            </Text3D>
          </Center>
          <Center position={[0, -0.98, 0]}>
            <Text3D
              font={helvetikerBold}
              size={0.105}
              height={0.045}
              bevelEnabled
              bevelSegments={3}
              bevelSize={0.005}
              bevelThickness={0.008}
              curveSegments={6}
              letterSpacing={0.04}
              raycast={() => null}
            >
              EVENT MANAGEMENT
              <meshPhysicalMaterial
                color="#bd9145"
                metalness={0.98}
                roughness={0.2}
                clearcoat={0.88}
                clearcoatRoughness={0.14}
                emissive="#291a08"
                emissiveIntensity={0.04}
              />
            </Text3D>
          </Center>
        </group>
      </group>
      <ContactShadows position={[0, -2.2, 0]} opacity={0.5} scale={9} blur={2.8} far={3.5} />
    </>
  )
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const mobile = size.width < 760
    const compact = size.width < 1100 || size.width / size.height < 1.3
    const distance = mobile ? 6.2 : compact ? 7.6 : 6.2
    const fieldOfView = mobile ? 40 : compact ? 34 : 32

    camera.position.set(0, 0.3, distance)
    camera.fov = fieldOfView
    camera.updateProjectionMatrix()
  }, [camera, size.height, size.width])

  return null
}

function HeroScene() {
  const navigate = useNavigate()

  return (
    <Canvas camera={{ position: [0, 0.3, 6.2], fov: 32 }}>
      <color attach="background" args={['#070b12']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 5]} intensity={1.8} color="#fff0cf" />
      <pointLight position={[-4, -2, 3]} intensity={1.2} color="#9b7542" />
      <pointLight position={[0, 1.5, 2.4]} intensity={5} distance={8} color="#ffe0a1" />
      <ResponsiveCamera />
      <group scale={0.86}>
        <ScienceHeroModel />
      </group>
      <SpatialWorld navigate={navigate} />
    </Canvas>
  )
}

function ServiceStructure({ type, active }) {
  const steel = active ? '#dbe8f6' : '#899bad'

  if (type === 'management') {
    return (
      <group>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.7, 0.06, 0.38]} />
          <meshStandardMaterial color="#202c3a" metalness={0.8} roughness={0.28} />
        </mesh>
        {[-0.25, 0, 0.25].map((x) => (
          <mesh key={x} position={[x, 0.13, 0]}>
            <boxGeometry args={[0.035, 0.42, 0.035]} />
            <meshStandardMaterial color={steel} metalness={0.9} roughness={0.24} />
          </mesh>
        ))}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.72, 0.045, 0.39]} />
          <meshStandardMaterial color={steel} metalness={0.9} roughness={0.24} />
        </mesh>
      </group>
    )
  }

  if (type === 'production') {
    return (
      <group>
        <mesh position={[0, -0.19, 0]}>
          <boxGeometry args={[0.78, 0.12, 0.42]} />
          <meshStandardMaterial color="#253241" metalness={0.72} roughness={0.3} />
        </mesh>
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.12, 0]}>
            <boxGeometry args={[0.035, 0.5, 0.035]} />
            <meshStandardMaterial color={steel} metalness={0.86} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.68, 0.04, 0.035]} />
          <meshStandardMaterial color={steel} metalness={0.86} roughness={0.25} />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <group key={x} position={[x, 0.31, 0.04]}>
            <mesh>
              <cylinderGeometry args={[0.055, 0.075, 0.09, 8]} />
              <meshStandardMaterial color={steel} metalness={0.86} roughness={0.25} />
            </mesh>
            <pointLight position={[0, -0.18, 0.08]} intensity={active ? 0.28 : 0.08} distance={0.65} color="#c8d9ee" />
          </group>
        ))}
      </group>
    )
  }

  if (type === 'experience') {
    return (
      <group>
        {[0, 1, 2].map((index) => (
          <mesh key={index} rotation={[0, index * 0.34, index * 0.05]} position={[0, 0.02, index * -0.08]}>
            <torusGeometry args={[0.23 + index * 0.075, 0.018, 8, 56, Math.PI * 1.62]} />
            <meshStandardMaterial color={steel} metalness={0.82} roughness={0.22} />
          </mesh>
        ))}
        <mesh position={[0, -0.24, 0]}>
          <boxGeometry args={[0.65, 0.025, 0.34]} />
          <meshStandardMaterial color="#25313e" metalness={0.78} roughness={0.3} />
        </mesh>
      </group>
    )
  }

  if (type === 'branding') {
    return (
      <group rotation={[0, -0.22, 0]}>
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.48, 0.5, 0.035]} />
          <meshStandardMaterial color="#1b2632" metalness={0.68} roughness={0.3} />
        </mesh>
        {[0.15, 0.04, -0.07, -0.18].map((y, index) => (
          <mesh key={y} position={[-0.02 + (index % 2) * 0.055, y, 0.02]}>
            <boxGeometry args={[index === 0 ? 0.26 : 0.34 - (index % 2) * 0.08, 0.018, 0.04]} />
            <meshStandardMaterial color={steel} metalness={0.82} roughness={0.24} />
          </mesh>
        ))}
        <mesh position={[0.25, 0, 0.04]} rotation={[0, 0, 0.16]}>
          <boxGeometry args={[0.035, 0.58, 0.035]} />
          <meshStandardMaterial color="#b8c7d6" metalness={0.86} roughness={0.22} />
        </mesh>
      </group>
    )
  }

  if (type === 'digital') {
    const points = [[-0.28, 0.21, 0], [0.22, 0.24, 0], [-0.05, 0, 0], [-0.28, -0.22, 0], [0.25, -0.2, 0]]
    const links = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4]]

    return (
      <group>
        {links.map(([start, end]) => (
          <Line key={`${start}-${end}`} points={[points[start], points[end]]} color={steel} transparent opacity={0.65} lineWidth={1} />
        ))}
        {points.map((position, index) => (
          <mesh key={index} position={position}>
            <icosahedronGeometry args={[index === 2 ? 0.09 : 0.055, 1]} />
            <meshStandardMaterial color={steel} metalness={0.85} roughness={0.2} emissive="#162536" emissiveIntensity={active ? 0.35 : 0.12} />
          </mesh>
        ))}
      </group>
    )
  }

  if (type === 'execution') {
    return (
      <group rotation={[0, 0, -0.16]}>
        {[-0.2, -0.07, 0.07, 0.2].map((y, index) => (
          <mesh key={y} position={[0, y, index * 0.025]}>
            <boxGeometry args={[0.7 - Math.abs(index - 1.5) * 0.08, 0.035, 0.045]} />
            <meshStandardMaterial color={index === 1 ? steel : '#344252'} metalness={0.84} roughness={0.24} />
          </mesh>
        ))}
        <mesh position={[0.31, 0.02, 0.12]}>
          <boxGeometry args={[0.025, 0.52, 0.025]} />
          <meshStandardMaterial color={steel} metalness={0.86} roughness={0.22} />
        </mesh>
        <mesh position={[-0.32, -0.25, 0.12]}>
          <boxGeometry args={[0.08, 0.035, 0.035]} />
          <meshStandardMaterial color="#bccada" metalness={0.86} roughness={0.22} />
        </mesh>
      </group>
    )
  }

  if (type === 'projects') {
    return (
      <group>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.72, 0.08, 0.4]} />
          <meshStandardMaterial color="#202c39" metalness={0.8} roughness={0.28} />
        </mesh>
        {[-0.21, 0, 0.21].map((x, index) => (
          <mesh key={x} position={[x, -0.06 + index * 0.035, 0.02]}>
            <boxGeometry args={[0.16, 0.17 + index * 0.06, 0.12]} />
            <meshStandardMaterial color={index === 1 ? steel : '#55677a'} metalness={0.78} roughness={0.27} />
          </mesh>
        ))}
        <mesh position={[0, 0.23, -0.12]}>
          <boxGeometry args={[0.66, 0.34, 0.035]} />
          <meshStandardMaterial color="#273747" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.23, -0.09]}>
          <boxGeometry args={[0.45, 0.018, 0.018]} />
          <meshStandardMaterial color={steel} metalness={0.86} roughness={0.22} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[0.25, 0.035, 10, 48, Math.PI]} />
        <meshStandardMaterial color={steel} metalness={0.88} roughness={0.2} />
      </mesh>
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[x, -0.15, 0]}>
          <boxGeometry args={[0.045, 0.36, 0.05]} />
          <meshStandardMaterial color={steel} metalness={0.88} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.65, 0.035, 0.15]} />
        <meshStandardMaterial color="#334252" metalness={0.82} roughness={0.25} />
      </mesh>
    </group>
  )
}

const destinations = [
  { title: services[0].title, detail: services[0].description, type: 'management', to: '/services' },
  { title: services[1].title, detail: services[1].description, type: 'production', to: '/services' },
  { title: services[2].title, detail: services[2].description, type: 'experience', to: '/services' },
  { title: services[3].title, detail: services[3].description, type: 'branding', to: '/services' },
  { title: services[4].title, detail: services[4].description, type: 'digital', to: '/services' },
  { title: services[5].title, detail: services[5].description, type: 'execution', to: '/services' },
  { title: 'OUR WORK', detail: projectPillars[0].name, type: 'projects', to: '/our-work' },
  { title: 'CONTACT', detail: contactInfo[0].value, type: 'contact', to: '/contact' },
]

function WorldAnchor({ item, index, position, navigate, compact, mobile }) {
  const [active, setActive] = useState(false)
  const groupRef = useRef()
  const visualRef = useRef()
  const { size } = useThree()
  const objectScale = mobile ? 0.32 : compact ? 0.58 : 0.7
  const hitRadius = mobile ? 0.34 : compact ? 0.3 : 0.38
  const tinyMobile = mobile && size.height < 500
  const titleWidth = tinyMobile ? 1.1 : mobile ? 0.78 : compact ? 0.75 : 1.5
  const detailWidth = titleWidth
  const cameraDistance = mobile ? 6.2 : compact ? 7.6 : 6.2
  const fieldOfView = mobile ? 40 : compact ? 34 : 32
  const worldUnitsPerPixel = (2 * (cameraDistance + 2.5) * Math.tan(fieldOfView * Math.PI / 360)) / size.height
  const titleFontSize = (tinyMobile ? 8 : 11) * worldUnitsPerPixel
  const detailFontSize = (tinyMobile ? 6 : 8) * worldUnitsPerPixel
  const detailLimit = tinyMobile ? 18 : mobile ? 24 : 52
  const detail = item.detail.length > detailLimit
    ? `${item.detail.slice(0, detailLimit - 3).trimEnd()}...`
    : item.detail
  const titleLineCount = Math.max(1, Math.ceil((item.title.length * titleFontSize * 0.55) / titleWidth))
  const titlePositionY = -0.44 * objectScale - 0.08
  const detailPositionY = titlePositionY - titleLineCount * titleFontSize * 1.18 - 0.045

  useEffect(() => {
    if (!visualRef.current) return

    visualRef.current.traverse((object) => {
      if (object.isMesh || object.isLine || object.isPoints) {
        object.raycast = () => null
      }
    })
  }, [])

  useEffect(() => () => {
    document.body.style.cursor = ''
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const elapsed = clock.getElapsedTime()
    const phase = elapsed * (0.3 + index * 0.018) + index * 1.13
    const direction = index % 2 === 0 ? 1 : -1
    const orbitRange = mobile ? 0.06 : compact ? 0.12 : 0.17
    const floatRange = mobile ? 0.07 : compact ? 0.12 : 0.15
    const depthRange = mobile ? 0.065 : compact ? 0.15 : 0.18
    const rotationRange = mobile ? 0.09 : 0.14
    groupRef.current.position.x = Math.sin(phase) * orbitRange
    groupRef.current.position.y = Math.sin(phase * 0.76 + index * 0.45) * floatRange
    groupRef.current.position.z = Math.cos(phase * 0.68 + index * 0.81) * depthRange
    groupRef.current.rotation.y = Math.sin(phase * 0.72 + index) * rotationRange * direction
    groupRef.current.rotation.x = Math.cos(phase * 0.58 + index * 0.7) * rotationRange * 0.42
    groupRef.current.rotation.z = Math.sin(phase * 0.44 + index * 1.1) * rotationRange * 0.24
  })

  function activate(event) {
    event.stopPropagation()
    navigate(item.to)
  }

  return (
    <group position={position}>
      <group
        ref={groupRef}
        scale={active ? 1.05 : 1}
      >
        <group ref={visualRef}>
          <group scale={objectScale}>
            <ServiceStructure type={item.type} active={active} />
          </group>
          <Text
            position={[0, titlePositionY, 0.03]}
            fontSize={titleFontSize}
            lineHeight={1.18}
            maxWidth={titleWidth}
            textAlign="center"
            anchorX="center"
            anchorY="top"
            color={active ? '#f0dfb5' : '#e4cf98'}
            material-toneMapped={false}
          >
            {item.title}
          </Text>
          {detail && (
            <Text
              position={[0, detailPositionY, 0.03]}
              fontSize={detailFontSize}
              maxWidth={detailWidth}
              lineHeight={1.18}
              textAlign="center"
              anchorX="center"
              anchorY="top"
              color={active ? '#dfcc9f' : '#c3ad79'}
              material-toneMapped={false}
            >
              {detail}
            </Text>
          )}
        </group>
        <mesh
          onClick={activate}
          onPointerOver={(event) => {
            event.stopPropagation()
            setActive(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(event) => {
            event.stopPropagation()
            setActive(false)
            document.body.style.cursor = ''
          }}
          onPointerMove={(event) => event.stopPropagation()}
        >
          <sphereGeometry args={[hitRadius, 16, 12]} />
          <meshBasicMaterial transparent opacity={0} colorWrite={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

function SpatialWorld({ navigate }) {
  const { size } = useThree()
  const worldRef = useRef()
  const mobile = size.width < 760
  const aspectRatio = size.width / size.height
  const portraitTablet = !mobile && size.width < 1100 && aspectRatio < 0.85
  const tinyMobile = mobile && size.height < 500
  const compact = size.width < 1100 || aspectRatio < 1.3
  const parallaxRange = mobile ? 0 : compact ? 0.008 : 0.018
  const narrowMobile = aspectRatio < 0.58
  const mobileTopX = narrowMobile ? 0.2 : 0.5
  const mobileSideX = narrowMobile ? 1.08 : 1.34
  const positions = tinyMobile
    ? [
        [-0.5, 2.05, -2.9], [-1.34, 0.82, -2.45], [-1.34, -0.82, -2.45], [-0.5, -1.92, -2.9],
        [0.5, 2.05, -3.15], [1.34, 0.82, -2.75], [1.34, -0.82, -2.75], [0.5, -1.92, -3.15],
      ]
    : mobile
    ? [
        [-mobileTopX, 2.05, -2.9], [-mobileSideX, 0.82, -2.45], [-mobileSideX, -0.82, -2.45], [-mobileTopX, -1.92, -2.9],
        [mobileTopX, 2.05, -3.15], [mobileSideX, 0.82, -2.75], [mobileSideX, -0.82, -2.75], [mobileTopX, -1.92, -3.15],
      ]
    : portraitTablet
      ? [
          [-1, 2.05, -3.05], [-1.9, 0.72, -2.65], [-1.9, -0.72, -2.4], [-1, -1.88, -3.05],
          [1, 2.05, -3.3], [1.9, 0.72, -2.85], [1.9, -0.72, -2.65], [1, -1.88, -3.3],
        ]
      : compact
      ? [
          [-1.9, 1.92, -3.1], [-2.9, 0.68, -2.75], [-2.9, -0.68, -2.5], [-1.9, -1.78, -3.1],
          [1.9, 1.92, -3.35], [2.9, 0.68, -2.95], [2.9, -0.68, -2.75], [1.9, -1.78, -3.35],
        ]
      : [
          [-1.8, 1.8, -3.1], [-3.45, 0.55, -2.75], [-3.45, -0.55, -2.5], [-1.8, -1.72, -3.1],
          [1.8, 1.8, -3.35], [3.45, 0.55, -2.95], [3.45, -0.55, -2.75], [1.8, -1.72, -3.35],
        ]

  useFrame(({ pointer }) => {
    if (!worldRef.current) return

    worldRef.current.rotation.y += (pointer.x * parallaxRange - worldRef.current.rotation.y) * 0.025
    worldRef.current.rotation.x += (-pointer.y * parallaxRange * 0.67 - worldRef.current.rotation.x) * 0.025
  })

  return (
    <group ref={worldRef}>
      {destinations.map((item, index) => {
        const position = positions[index]
        const connectorStart = [position[0] * 0.82, position[1] * 0.82, position[2] * 0.82]
        const connectorEnd = [position[0] * 0.93, position[1] * 0.93, position[2] * 0.93]

        return (
          <group key={item.title}>
            <Line points={[connectorStart, connectorEnd]} color="#8293a7" transparent opacity={0.16} lineWidth={0.7} />
            <WorldAnchor item={item} index={index} position={position} navigate={navigate} compact={compact} mobile={mobile} />
          </group>
        )
      })}
    </group>
  )
}

export default function HomePage() {
  return (
    <section className="hero hero--spatial" id="home">
      <div className="hero-canvas" aria-label="Interactive 3D SCIENCE Event Management environment">
        <HeroScene />
      </div>
      <nav className="home-spatial-links" aria-label="Home scene destinations">
        {destinations.map((item) => (
          <Link key={item.title} to={item.to}>{item.title}</Link>
        ))}
      </nav>
    </section>
  )
}
