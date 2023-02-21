#!/bin/sh

bucket_name=nekochan-ditect-box

image=nekoneko01.jpg

jsonparam=$(aws rekognition detect-labels --image "S3Object={Bucket=${bucket_name},Name=images/${image}}" --region ap-northeast-1 --query 'Labels[?Name==`Cat`].{Name: Name, Confidence: Confidence, Instances: Instances}' | jq -c .[])

#node index.js images/${image} images_output01/${image} "${jsonparam}"
node neko.js images/${image} images_output02/${image} "${jsonparam}"

