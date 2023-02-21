# cat-bounding-box

猫型のBoundingBoxを作ってみたかった、ただそれだけである。

## usage

### 用意するもの

- AWS環境
  rekognitionとs3をごにょごにょできるアカウント
- nodeを実行できる環境
- ネコが写っている写真など。サイズは800px x 600px にすると何も考えずにこのスクリプトを実行できます。

### AWSの設定なり

- 任意のS3バケットを作成します
- 使いたい画像をバケットに入れます
- aws cliをインストールして、aws configure して、ターミナルから aws cli を使ってAWS環境をごにょごにょできるようにします


### aws rekognitionの実行


できるか試しておきます


``` 
 $ aws rekognition detect-labels --image "S3Object={Bucket=バケット名,Name=オブジェクト名" --region ap-northeast-1

```

### スクリプト実行の準備

npm i して、出力等のディレクトリを作成

```
 $ npm i
 $ mkdir -p output01
 $ mkdir -p output02
```


### やってみよう

```
bucket_name=nekochan-bounding-box
image_path=images/nekoneko01.jpg
normal_output_path=output01/nekoneko01.jpg
cat_output_path=output02/nekoenkoe01.jpg
	
jsonparam=$(aws rekognition detect-labels --image "S3Object={Bucket=${bucket_name},Name=images/${image}}" --region ap-northeast-1 --query 'Labels[?Name==`Cat`].{Name: Name, Confidence: Confidence, Instances: Instances}' | jq -c .[])

node index.js ${image_path} images_output01/${image} "${jsonparam}"
node neko.js images/${image} images_output02/${image} "${jsonparam}"

```