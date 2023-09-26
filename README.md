# Lab2-SoftwareEngineer

## How to run

The project was configured in 2 docker container, 1 container for frontend + backend app and 1 container for the MySQL database.

To run it, please connect those two container together with a bridge network.

```
docker network create software-engineer
docker network connect software-engineer <container 1>
docker network connect software-engineer mysql
```

### Note: Please name the mysql container mysql as in the backend, inside prisma/schema.prisma, the database url is set to mysql:3306, so the Docker network will resolve the name into the ip address
