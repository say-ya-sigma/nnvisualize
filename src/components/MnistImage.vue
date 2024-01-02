<template>
  <img :src="imageUrl" />
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'


export default defineComponent({
  name: 'MnistImage',
  props: {
    image: {
      type: Array as PropType<number[]>,
      required: true
    }
  },
  setup(props) {
    const image = props.image
    const canvas = document.createElement('canvas')
    canvas.width = 28
    canvas.height = 28
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const imageData = ctx.createImageData(28, 28)
      for (let i = 0; i < 28 * 28; i++) {
        const pixel = image[i]
        imageData.data[i * 4 + 0] = pixel
        imageData.data[i * 4 + 1] = pixel
        imageData.data[i * 4 + 2] = pixel
        imageData.data[i * 4 + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }
    const imageUrl = ref<string>('');
    canvas.toBlob((blob) => {
      if (!blob) { return }
      imageUrl.value = URL.createObjectURL(blob)
    },'image/png');
    return {
      imageUrl
    }
  }
})
</script>
