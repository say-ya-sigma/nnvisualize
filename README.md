# Neural Network Visualizer

MNISTデータセットについて推論処理を行うニューラルネットワークのビジュアライザです。O'REILLYの「ゼロから作るDeepLearning Pythonで学ぶディープラーニングの理論と実践」に基づいています。

推論処理を含め全てブラウザ上で実行されます。

## スタック
* vue 3.4.3
* vite 5.0.10
* mathjs 12.2.1
* three 0.160.0

## ビジュアライズ

選択された画像に対して推論処理を行い、input layerに渡される信号（画像そのもの）、hidden layerに渡される信号（活性化関数適用後）、output layerに渡される信号（softmax関数適用後）をそれぞれ立方体のマテリアルのカラーに適用しています。

立方体と立方体を繋ぐ線は全て繋ぐと重くなってしまうため、しきい値（0.8）を設定しそれ以上の強い信号が設定されている立方体同士を繋いでいます。

## 推論モデル

**ファイル:** `src/lib/model.json`

#### レイヤー:
* input layer 784
* hidden layer 50
* output layer 10
* 活性化関数はReLU

#### パラメータ数 39760:
* weight
  * input to hidden: 784 x 50 = 39200
  * hidden to output: 50 x 10 = 500
* bias
  * input to hidden 50
  * hidden to output 10

#### 訓練環境
* python 3.10.6
* numpy 1.23.3
* Ubuntu 22.04.1 LTS (WSL)
* 繰り返し数 10000
* バッチサイズ 100
* SGD (学習率 0.1)
