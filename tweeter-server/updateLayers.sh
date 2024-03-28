# Use this file to update the lambda layers for each lambda.
# First create the new lambda layer, or lambda layer version, in aws by uploading the new lambda layer code.
# Then copy the arn for the lambda layer from aws to the .server LAMBDALAYER_ARN variable.
# Then run this script.

source .server

# Removing old nodejs folder
echo "Removing old nodejs folder..."
rm -rf nodejs

# Creating new nodejs folder
echo "Creating new nodejs folder..."
mkdir nodejs

# Copying the node_modules folder to the new nodejs folder
echo "Copying the node_modules folder to the new nodejs folder..."
cp -rL node_modules nodejs/

# Contiin with the script to update lambda layers
echo "Updating lambda layers for each lambda"

i=1
PID=0
pids=()
for lambda in $EDIT_LAMBDALIST
do
    aws lambda update-function-configuration --function-name  $lambda --layer $LAMBDALAYER_ARN 1>>/dev/null & 
    echo lambda $i, $lambda, updating lambda layer...
    pids[${i-1}]=$!
    ((i=i+1))
done
for pid in ${pids[*]}; do
    wait $pid
done
echo Lambda layers updated for all lambdas in .source
