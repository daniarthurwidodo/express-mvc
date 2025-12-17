# PostgreSQL with Podman Setup Guide

## 🐘 PostgreSQL Database in Podman

This guide will help you set up PostgreSQL database using Podman for your Express TypeScript MVC application.

---

## 📋 Prerequisites

1. **Podman** installed on your system
   ```bash
   # Check if podman is installed
   podman --version
   
   # Install on macOS
   brew install podman
   
   # Start podman machine
   podman machine init
   podman machine start
   ```

2. **Podman Compose** (optional but recommended)
   ```bash
   # Install podman-compose
   pip3 install podman-compose
   
   # Or use docker-compose with podman
   brew install docker-compose
   ```

---

## 🚀 Quick Start

### Option 1: Using Podman Compose (Recommended)

1. **Start PostgreSQL and PgAdmin:**
   ```bash
   podman-compose up -d
   ```

2. **Check container status:**
   ```bash
   podman-compose ps
   ```

3. **View logs:**
   ```bash
   podman-compose logs -f postgres
   ```

4. **Stop containers:**
   ```bash
   podman-compose down
   ```

### Option 2: Using Podman Directly

1. **Create network:**
   ```bash
   podman network create express-mvc-network
   ```

2. **Run PostgreSQL:**
   ```bash
   podman run -d \
     --name express-mvc-postgres \
     --network express-mvc-network \
     -e POSTGRES_USER=admin \
     -e POSTGRES_PASSWORD=admin123 \
     -e POSTGRES_DB=express_mvc_db \
     -p 5432:5432 \
     -v postgres_data:/var/lib/postgresql/data \
     postgres:16-alpine
   ```

3. **Run PgAdmin (optional):**
   ```bash
   podman run -d \
     --name express-mvc-pgadmin \
     --network express-mvc-network \
     -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
     -e PGADMIN_DEFAULT_PASSWORD=admin123 \
     -p 5050:80 \
     dpage/pgadmin4:latest
   ```

---

## 🔧 Configuration

### Environment Variables

The `.env` file contains all configuration:

```env
# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=express_mvc_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Connection URL
DATABASE_URL=postgresql://admin:admin123@localhost:5432/express_mvc_db

# PgAdmin
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```

### Database Schema

The database is automatically initialized with:
- `users` table with sample data
- Indexes on `email` and `created_at`
- Trigger for automatic `updated_at` timestamp

Schema location: `init-scripts/01-init.sql`

---

## 📊 Access Database

### Using psql CLI

```bash
# Connect to PostgreSQL
podman exec -it express-mvc-postgres psql -U admin -d express_mvc_db

# List tables
\dt

# Query users
SELECT * FROM users;

# Exit
\q
```

### Using PgAdmin Web Interface

1. Open browser: `http://localhost:5050`
2. Login:
   - Email: `admin@admin.com`
   - Password: `admin123`
3. Add new server:
   - Name: `Express MVC DB`
   - Host: `express-mvc-postgres` (container name)
   - Port: `5432`
   - Username: `admin`
   - Password: `admin123`
   - Database: `express_mvc_db`

### Using Database Client

**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `express_mvc_db`
- Username: `admin`
- Password: `admin123`

**Connection URL:**
```
postgresql://admin:admin123@localhost:5432/express_mvc_db
```

---

## 🛠️ Podman Commands

### Container Management

```bash
# List running containers
podman ps

# List all containers
podman ps -a

# Stop container
podman stop express-mvc-postgres

# Start container
podman start express-mvc-postgres

# Restart container
podman restart express-mvc-postgres

# Remove container
podman rm express-mvc-postgres

# View logs
podman logs -f express-mvc-postgres
```

### Volume Management

```bash
# List volumes
podman volume ls

# Inspect volume
podman volume inspect postgres_data

# Remove volume (WARNING: deletes all data)
podman volume rm postgres_data
```

### Network Management

```bash
# List networks
podman network ls

# Inspect network
podman network inspect express-mvc-network

# Remove network
podman network rm express-mvc-network
```

---

## 🔄 Database Operations

### Backup Database

```bash
# Backup to file
podman exec express-mvc-postgres pg_dump -U admin express_mvc_db > backup.sql

# Backup with timestamp
podman exec express-mvc-postgres pg_dump -U admin express_mvc_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore from backup
cat backup.sql | podman exec -i express-mvc-postgres psql -U admin -d express_mvc_db
```

### Reset Database

```bash
# Drop and recreate database
podman exec -it express-mvc-postgres psql -U admin -c "DROP DATABASE express_mvc_db;"
podman exec -it express-mvc-postgres psql -U admin -c "CREATE DATABASE express_mvc_db;"

# Run init scripts again
cat init-scripts/01-init.sql | podman exec -i express-mvc-postgres psql -U admin -d express_mvc_db
```

---

## 🔍 Troubleshooting

### Container won't start

```bash
# Check logs
podman logs express-mvc-postgres

# Check if port is already in use
lsof -i :5432

# Remove and recreate container
podman rm -f express-mvc-postgres
podman-compose up -d
```

### Can't connect to database

```bash
# Check if container is running
podman ps | grep postgres

# Check container network
podman inspect express-mvc-postgres | grep IPAddress

# Test connection
podman exec -it express-mvc-postgres psql -U admin -d express_mvc_db -c "SELECT 1;"
```

### Data persistence issues

```bash
# Check volume
podman volume inspect postgres_data

# Verify data location
podman exec -it express-mvc-postgres ls -la /var/lib/postgresql/data
```

### PgAdmin can't connect

1. Make sure both containers are on the same network
2. Use container name as host: `express-mvc-postgres`
3. Check PgAdmin logs: `podman logs express-mvc-pgadmin`

---

## 🔐 Security Best Practices

1. **Change default passwords** in production
2. **Use strong passwords** (20+ characters)
3. **Don't commit `.env`** to git (already in `.gitignore`)
4. **Use secrets management** for production
5. **Limit database access** with firewall rules
6. **Regular backups** of database

### Production Environment Variables

```env
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=express_mvc_prod
DATABASE_URL=postgresql://prod_user:<password>@db-host:5432/express_mvc_prod
```

---

## 📦 Next Steps

After setting up PostgreSQL, you can:

1. **Install PostgreSQL driver:**
   ```bash
   npm install pg @types/pg
   ```

2. **Install an ORM (choose one):**
   
   **Prisma (Recommended):**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```
   
   **TypeORM:**
   ```bash
   npm install typeorm reflect-metadata
   ```
   
   **Sequelize:**
   ```bash
   npm install sequelize pg pg-hstore
   ```

3. **Update Repository to use PostgreSQL** instead of in-memory data

4. **Create database migrations** for schema changes

---

## 📚 Useful Links

- [Podman Documentation](https://docs.podman.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

## ⚡ Quick Commands Reference

```bash
# Start everything
podman-compose up -d

# Stop everything
podman-compose down

# Restart PostgreSQL
podman restart express-mvc-postgres

# Connect to database
podman exec -it express-mvc-postgres psql -U admin -d express_mvc_db

# View logs
podman logs -f express-mvc-postgres

# Backup database
podman exec express-mvc-postgres pg_dump -U admin express_mvc_db > backup.sql
```

---

**Your PostgreSQL database is now ready to use with Podman! 🎉**
