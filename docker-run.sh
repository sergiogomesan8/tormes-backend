#!/bin/bash

echo "¿Qué contenedor quieres iniciar?"
echo "1. Sonarqube"
echo "2. Postgres-database"
echo "3. Pgadmin"
read -p "Introduce el número del contenedor que quieres iniciar: " containerNumber

case $containerNumber in
  1)
    docker-compose up sonarqube
    ;;
  2)
    docker-compose up postgres-database
    ;;
  3)
    docker-compose up pgadmin
    ;;
  *)
    echo "Opción no válida."
    ;;
esac