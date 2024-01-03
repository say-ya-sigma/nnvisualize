<template>
  <canvas ref="canvas" ></canvas>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type PropType } from 'vue'
import { inference } from '@/lib/mnist'
import useNNVisualize from '@/use/useNNVisualize'
import model from '@/lib/model.json'
import type { WebGLRenderer } from 'three'

export default defineComponent({
  name: 'ThreeCanvas',
  props: {
    image: {
      type: Array as PropType<number[]>,
      required: true
    }
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement>()
    const width = ref(960)
    const height = ref(540)
    const devicePixelRatio = computed(() => window.devicePixelRatio || 1)
    const renderer = ref<WebGLRenderer>()
    const animationKey = ref(0)

    const rotateVisualizedInference = (imageNormalized: number[]) => {
      if (!canvas.value) {
        return
      }

      if (animationKey.value) {
        cancelAnimationFrame(animationKey.value)
      }

      const inferenceResult = inference(model, imageNormalized)
      const {
        generateBoxMatrix,
        generateFullyConnectedLine,
        showInferred,
        rotate
      } = useNNVisualize(canvas.value, renderer, animationKey, width, height, devicePixelRatio)

      const inputLayer = generateBoxMatrix(28, 28, 5, 5, 100, imageNormalized)

      const hiddenGrayScaleMax = Math.max(...inferenceResult.inputSignalActivated)
      const hiddenLayerGrayScale = inferenceResult.inputSignalActivated.map((v) => v / hiddenGrayScaleMax)
      const hiddenLayer = generateBoxMatrix(5, 10, 5, 5, 0, hiddenLayerGrayScale)

      const outputGrayScaleMax = Math.max(...inferenceResult.outputSignalSoftMax)
      const outputLayerGrayScale = inferenceResult.outputSignalSoftMax.map((v) => v / outputGrayScaleMax)
      const outputLayer = generateBoxMatrix(1, 10, 5, 5, -100, outputLayerGrayScale)
      generateFullyConnectedLine(inputLayer, hiddenLayer)
      generateFullyConnectedLine(hiddenLayer, outputLayer)

      const inferredNumber = inferenceResult.outputSignalSoftMax.indexOf(Math.max(...inferenceResult.outputSignalSoftMax))
      showInferred(inferredNumber, -110)

      rotate()
    }

    watch(() => props.image, () => {
      const imageNormalized = props.image.map((v) => v / 255)
      rotateVisualizedInference(imageNormalized)
    })

    watch(canvas, () => {
      const imageNormalized = props.image.map((v) => v / 255)
      rotateVisualizedInference(imageNormalized)
    })

    return {
      canvas
    }
  }
})
</script>