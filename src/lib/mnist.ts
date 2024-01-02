import { exp, max, multiply, sum } from 'mathjs'

export type Model = {
  weight: Record<'weight1' | 'weight2', number[][]>
  bias: Record<'bias1' | 'bias2', number[]>
}

export type InferenceSignals = {
  inputSignal: number[]
  inputSignalActivated: number[]
  outputSignal: number[]
  outputSignalSoftMax: number[]
}

export const inference = (model: Model, input: number[]): InferenceSignals => {
  const inputSignal = multiply(input, model.weight.weight1).map((value, index) => value + model.bias.bias1[index])
  const inputSignalActivated = inputSignal.map(value => value > 0 ? value : 0)
  const outputSignal = multiply(inputSignalActivated, model.weight.weight2).map((value, index) => value + model.bias.bias2[index])

  const slide = max(outputSignal)
  const outputSignalSoftMax = outputSignal.map(value => exp(value - slide) / sum(outputSignal.map(value => exp(value - slide))))
  return {
    inputSignal,
    inputSignalActivated,
    outputSignal,
    outputSignalSoftMax
  }
}