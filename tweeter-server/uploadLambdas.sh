#!/bin/bash

# Use set -e to terminate the script on error
set -e

# Load environment variables
source .server

# Directory for log files
LOG_DIR="lambda_logs"
mkdir -p $LOG_DIR  # Create the directory if it doesn't exist

echo "Removing existing dist.zip and creating a new one..."
rm -f dist.zip
zip -r dist.zip dist

echo "dist.zip created successfully."
aws s3 cp dist.zip s3://$BUCKET/code/lambdalist.zip

echo -e '\n\n\nlambdalist.zip uploaded to the bucket. Updating lambda functions...\n'

# Assuming EDIT_LAMBDALIST is multiline, convert it into a single line for processing
EDIT_LAMBDALIST_SINGLE_LINE=$(echo "$EDIT_LAMBDALIST" | tr '\n' ' ')

i=1
for lambda in $EDIT_LAMBDALIST_SINGLE_LINE; do
    aws lambda update-function-code \
        --function-name $lambda \
        --s3-bucket $BUCKET \
        --s3-key code/lambdalist.zip \
        --publish \
        > "$LOG_DIR/lambda_update_$lambda.log" 2>&1 &
    echo "Lambda $i, $lambda, uploading from s3. See $LOG_DIR/lambda_update_$lambda.log for details."
    ((i=i+1))
done

# Wait for background processes to complete
wait

echo -e '\nAll Lambda functions updated.'
