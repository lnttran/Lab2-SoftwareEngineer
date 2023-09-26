#!/bin/bash

# Retry loop to wait for MySQL server to become available
for i in {1..10}; do
  if npx prisma db push; then
    exec npm start
    break
  else
    echo "Retrying in 3 seconds..."
    sleep 3
  fi
done

# Start your application or desired command
echo "Failed, do not start"