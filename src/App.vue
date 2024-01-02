<template>
  <div>
    <ThreeCanvas :image="selectedImage"/>
  </div>
  <div v-for="numberClass in numberClasses" :key="numberClass">
    <MnistImage
      v-for="(image, index) in classifiedMnist[numberClass]"
      :image="image"
      :key="`${numberClass}${index}`"
      @click="onImageClick(numberClass, index)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ThreeCanvas from './components/ThreeCanvas.vue'
import MnistImage from './components/MnistImage.vue';
import classifiedMnist from './lib/classifiedMnist.json'

type NumberClass = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export default defineComponent({
  name: 'App',
  components: {
    ThreeCanvas,
    MnistImage
  },
  setup() {
    const numberClasses: NumberClass[] = ['0','1','2','3','4','5','6','7','8','9']
    const selectedImage = ref<number[]>(classifiedMnist['0'][0])

    const onImageClick = (numberClass: NumberClass, index: number) => {
      selectedImage.value = classifiedMnist[numberClass][index]
    }

    return {
      numberClasses,
      selectedImage,
      onImageClick,
      classifiedMnist
    }
  }
})
</script>
