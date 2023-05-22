# Guide

## Accessing Docker database instance
When the docker-compose stack is running, it is possible to access the database used in the image by running the following command: 
```docker cp <server-container-name>:/server/database/database.db <dest path>```

The name of the server container can be retrieved by running ```docker ps``` to show the running containers and their name. By running the ```docker cp``` command, the database file will be copied in the specified destination path and will be accessible.
