#!/bin/bash

echo "¿Qué contenedor quieres iniciar?"
echo "1. Postgres-database"
echo "2. Pgadmin"
echo "3. Sonarqube"
read -p "Introduce el número del contenedor que quieres iniciar: " containerNumber

case $containerNumber in
  1)
    sudo rm -rf ./docker-data/postgres_data/*
    echo "Directorio ./docker-data/postgres_data/ borrado."
    docker-compose up postgres-database
    ;;
  2)
    docker-compose up pgadmin
    ;;
  3)
    docker-compose up sonarqube
    ;;
  *)
    echo "Opción no válida."
    ;;
esac