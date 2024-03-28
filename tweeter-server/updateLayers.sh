#!/bin/bash

# Load variables from .server file
source .server

# Check if BUCKET variable is set
if [ -z "$BUCKET" ]; then
  echo "BUCKET is not set. Please define BUCKET in your .server file."
  exit 1
fi

echo "Preparing nodejs folder..."
rm -rf nodejs nodejs.zip

echo "Creating new nodejs folder..."
mkdir nodejs
cp -rL node_modules nodejs/

echo "Zipping nodejs directory..."
zip -r nodejs.zip nodejs

echo "Uploading zip to S3..."
aws s3 cp nodejs.zip s3://$BUCKET/$S3_KEY

echo "Publishing new layer version..."
# Ensure to replace `LAYER_NAME` with the actual name of your Lambda layer
LAYER_ARN=$(aws lambda publish-layer-version --layer-name tweeter_dependencies --description "New version $(date)" --content S3Bucket=$BUCKET,S3Key=$S3_KEY --compatible-runtimes nodejs20.x --query LayerVersionArn --output text)

if [ -z "$LAYER_ARN" ]; then
  echo "Failed to publish new layer version."
  exit 1
fi

echo "New layer version ARN: $LAYER_ARN"

echo "Updating lambda functions to use the new layer version..."

for lambda in $EDIT_LAMBDALIST
do
    echo "Updating $lambda..."
    aws lambda update-function-configuration --function-name $lambda --layers $LAYER_ARN
done

echo "Lambda functions updated."
