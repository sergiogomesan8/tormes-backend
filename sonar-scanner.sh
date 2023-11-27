#!/bin/bash

# Carga las variables de entorno desde el archivo .env
export $(grep -v '^#' .env | xargs)

# Ejecuta el comando sonar-scanner
sonarScannerCommand="sonar-scanner \
  -Dsonar.sources=src \
  -Dsonar.host.url=$SONAR_HOST_URL \
  -Dsonar.login=$SONAR_TOKEN"

$sonarScannerCommand

if [ $? -eq 0 ]
then
  echo "SonarQube analysis completed"
else
  echo "Error during SonarQube analysis" >&2
fi