#!/bin/zsh

# Use set -e to terminate the script on error
set -e

# Load environment variables
source .server

echo "Zipping the dist folder..."
rm -f dist.zip
zip -r dist.zip dist

echo "dist.zip created successfully."
aws s3 cp dist.zip s3://$BUCKET/code/lambdalist.zip

echo -e '\n\n\nlambdalist.zip uploaded to the bucket. Updating lambda functions...\n'

# Loop through each lambda function in EDIT_LAMBDALIST
for lambda in ${(s: :)EDIT_LAMBDALIST}; do
    # Update the lambda code
    aws lambda update-function-code --function-name $lambda --s3-bucket $BUCKET --s3-key code/lambdalist.zip --publish 1>/dev/null
    echo "Lambda $lambda code uploading from s3"
    sleep 10 # Wait for 10 seconds to let AWS process the update
done

echo -e '\nAll Lambda functions updated.'
