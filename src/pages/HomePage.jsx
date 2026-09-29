import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float, Line, Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { services, projectPillars, contactInfo } from '../data/siteData'

function ScienceHeroModel() {
  const ref = useRef()
  const { size } = useThree()
  const mobile = size.width < 760
  const compact = size.width < 1100 || size.width / size.height < 1.3
  const modelScale = mobile ? 0.16 : compact ? 0.3 : 0.36
  const wireframeScale = mobile ? 0.16 : compact ? 0.22 : 0.28
  const blueScale = mobile ? 0.32 : compact ? 0.4 : 0.45
  const wireframePosition = mobile ? [0, 0.12, -0.22] : compact ? [0, 0.2, -0.26] : [0, 0.25, -0.3]
  const bluePosition = mobile ? [0, -0.32, 0.2] : compact ? [0, -0.45, 0.24] : [0, -0.55, 0.28]

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()

    if (ref.current) {
      ref.current.rotation.y = elapsed * 0.35
      ref.current.rotation.x = Math.sin(elapsed * 0.7) * 0.35
      ref.current.position.y = Math.sin(elapsed * 1.5) * 0.08
    }
  })

  return (
    <group ref={ref} position={[0, 0.2, 0]}>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2}>
        <group>
          <Text
            position={[0, 0, 0]}
            fontSize={1.2 * modelScale}
            letterSpacing={0.12 * modelScale}
            color="#dfe7f4"
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
          >
            SCIENCE
          </Text>

          <group position={wireframePosition}>
            <mesh scale={wireframeScale} rotation={[0.4, 0.3, 0.35]} raycast={() => null}>
              <torusKnotGeometry args={[1.9, 0.34, 220, 28]} />
              <meshStandardMaterial color="#151d2a" metalness={0.9} roughness={0.3} wireframe />
            </mesh>
          </group>

          <group position={bluePosition}>
            <mesh scale={blueScale} raycast={() => null}>
              <icosahedronGeometry args={[0.9, 1]} />
              <meshStandardMaterial
                color="#b8d7ff"
                emissive="#10253d"
                emissiveIntensity={0.7}
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>
      </Float>
      <ContactShadows position={[0, -2.2, 0]} opacity={0.5} scale={9} blur={2.8} far={3.5} />
    </group>
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
      <directionalLight position={[4, 5, 5]} intensity={1.5} color="#dfefff" />
      <pointLight position={[-4, -2, 3]} intensity={1.5} color="#64b5ff" />
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
    const floatRange = mobile ? 0.012 : 0.035
    const rotationRange = mobile ? 0.018 : 0.045
    groupRef.current.position.y = Math.sin(elapsed * 0.55 + index * 0.9) * floatRange
    groupRef.current.rotation.y = Math.sin(elapsed * 0.3 + index) * rotationRange
    groupRef.current.rotation.x = Math.sin(elapsed * 0.22 + index) * rotationRange * 0.4
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
            color={active ? '#f1f6fb' : '#c0ccda'}
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
              color={active ? '#bacbde' : '#8797aa'}
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
  const positions = tinyMobile
    ? [
        [-1.25, 1.7, -2.4], [-1.25, 0.65, -2.4], [-1.25, -0.4, -2.4], [-1.25, -1.4, -2.4],
        [1.25, 1.7, -2.8], [1.25, 0.65, -2.8], [1.25, -0.4, -2.8], [1.25, -1.4, -2.8],
      ]
    : mobile
    ? [
        [-1.13, 1.7, -2.4], [-1.13, 0.65, -2.4], [-1.13, -0.4, -2.4], [-1.13, -1.4, -2.4],
        [1.13, 1.7, -2.8], [1.13, 0.65, -2.8], [1.13, -0.4, -2.8], [1.13, -1.4, -2.8],
      ]
    : portraitTablet
      ? [
          [-1.6, 2.25, -3], [-1.6, 1.05, -2.4], [-1.6, -0.65, -1.8], [-1.6, -1.9, -2.6],
          [1.6, 2.25, -3], [1.6, 1.05, -2], [1.6, -0.65, -2.15], [1.6, -1.9, -2.6],
        ]
      : compact
      ? [
          [-1.95, 2.6, -3], [-1.95, 1.4, -2.4], [-1.95, -0.45, -1.8], [-1.95, -1.85, -2.6],
          [1.95, 2.6, -3], [1.95, 1.4, -2], [1.95, -0.45, -2.15], [1.95, -1.85, -2.6],
        ]
      : [
          [-2.6, 1.8, -3.2], [-2.9, 0.65, -3], [-2.9, -0.5, -3], [-2.9, -1.65, -3.6],
          [2.6, 1.8, -3.2], [2.9, 0.65, -3], [2.9, -0.5, -3], [2.9, -1.65, -3.6],
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
