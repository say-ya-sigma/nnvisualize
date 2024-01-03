import {
  BoxGeometry,
  BufferGeometry,
  Line,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type ColorRepresentation,
  MeshLambertMaterial,
  AmbientLight,
  LineBasicMaterial,
  Color
} from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { type ComputedRef, type Ref } from "vue";

export default (
  canvas: HTMLCanvasElement,
  renderer: Ref<WebGLRenderer | undefined>,
  animationKey: Ref<number>,
  width: Ref<number>,
  height: Ref<number>,
  devicePixelRatio: ComputedRef<number>
) => {
  renderer.value = new WebGLRenderer({ canvas })
  renderer.value.setPixelRatio(devicePixelRatio.value)
  renderer.value.setSize(width.value, height.value)

  const scene = new Scene()
  scene.background = new Color(0x222222);
  const camera = new PerspectiveCamera(75, width.value / height.value)

  const light = new AmbientLight(0xFFFFFF, 3.0);
  scene.add(light);

  const moveCamera = (cameraPosition: Vector3, lookAtPosition: Vector3) => { 
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    camera.lookAt(lookAtPosition)
  }

  const generateBox = (size: number, color: ColorRepresentation): Mesh => {
    const box = new Mesh(
      new BoxGeometry(size, size, size),
      new MeshLambertMaterial({ color })
    )
    return box
  }

  const generateBoxMatrix = (verticalLength: number, horizontalLength: number, size: number, gap: number, depth: number, grayScale: number[]): Mesh[][] => {
    const boxMatrix: Mesh[][] = []
    for (let i = 0; i < verticalLength; i++) {
      const row: Mesh[] = []
      for (let j = 0; j < horizontalLength; j++) {
        const picked = Math.trunc(grayScale[i * horizontalLength + j] * 255)
        const box = generateBox(size, `rgb(${picked}, ${picked}, ${picked})`)
        box.position.set(
          (size + gap) * j - (size + gap) * (horizontalLength - 1) / 2,
          -1 * ((size + gap) * i - (size + gap) * (verticalLength - 1) / 2),
          depth
        )
        row.push(box)
        scene.add(box)
      }
      boxMatrix.push(row)
    }
    return boxMatrix
  }

  const generateFullyConnectedLine = (boxMatrix: Mesh[][], nextBoxMatrix: Mesh[][], threshold: number = 0.8) => {
    const flattenBoxMatrix = boxMatrix.flat(2)
    const flattenNextBoxMatrix = nextBoxMatrix.flat(2)
    flattenBoxMatrix.forEach((box) => {
      if (!(box.material instanceof MeshLambertMaterial)) { return }
      if (box.material.color.getHex() / (255 * 255 * 255) < threshold) { return }
      flattenNextBoxMatrix.forEach(nextBox => {
        if (!(nextBox.material instanceof MeshLambertMaterial) || !(box.material instanceof MeshLambertMaterial)) { return }
        if (nextBox.material.color.getHex() / (255 * 255 * 255) < threshold) { return }
        const start = new Vector3(box.position.x, box.position.y, box.position.z)
        const end = new Vector3(nextBox.position.x, nextBox.position.y, nextBox.position.z)
        const line = new Line(
          new BufferGeometry().setFromPoints([start, end]),
          new LineBasicMaterial({ color: box.material.color })
        )
        scene.add(line)
      })
    })
  }

  const showInferred = (inferred: number, depth: number) => {
    let textMesh: Mesh | undefined = undefined
    new FontLoader().load('/nnvisualize/helvetiker_regular.typeface.json', (font) => {
      textMesh = new Mesh(
        new TextGeometry(inferred.toString(), {
          font,
          size: 76,
          height: 1,
        }).center(),
        new MeshLambertMaterial({ color: 0xeeeeee })
      )
      textMesh.position.set(0, 38, depth)
      scene.add(textMesh)
    })
    return textMesh
  }

  let rot = 0
  let frame = 0

  const rotate = () => {
    if (!renderer.value) { return }

    animationKey.value = requestAnimationFrame(rotate)
    frame++

    if (frame % 6 !== 0) { return }

    rot += 5
    const radian = rot * Math.PI / 180;
    moveCamera(new Vector3(300 * Math.sin(radian), 0, 300 * Math.cos(radian)), new Vector3(0, 0, 0))

    renderer.value.render(scene, camera)
  }

  return {
    scene,
    camera,
    renderer,
    moveCamera,
    generateBox,
    generateBoxMatrix,
    generateFullyConnectedLine,
    showInferred,
    rotate,
    stop,
  }
}