# Configuration MySQL pour Stell's Hope

## Installation de MySQL

### Windows
1. Téléchargez MySQL Community Server depuis [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Installez MySQL avec les paramètres par défaut
3. Notez le mot de passe root généré pendant l'installation

### macOS
```bash
# Avec Homebrew
brew install mysql
brew services start mysql

# Ou téléchargez depuis mysql.com
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Configuration de la base de données

### 1. Créer le fichier .env
Copiez le fichier `.env.example` vers `.env` :
```bash
cd backend
cp .env.example .env
```

### 2. Configurer les variables d'environnement
Éditez le fichier `.env` et modifiez ces lignes :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=stell_hope
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe_mysql
```

### 3. Créer la base de données
Connectez-vous à MySQL :
```bash
mysql -u root -p
```

Créez la base de données :
```sql
CREATE DATABASE stell_hope CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 4. Générer la clé d'application
```bash
php artisan key:generate
```

### 5. Exécuter les migrations
```bash
php artisan migrate
```

### 6. Exécuter les seeders (optionnel)
```bash
php artisan db:seed
```

## Vérification de l'installation

### Tester la connexion
```bash
php artisan tinker
```
Puis dans tinker :
```php
DB::connection()->getPdo();
```

### Vérifier les tables
```bash
php artisan migrate:status
```

## Commandes utiles

### Réinitialiser la base de données
```bash
php artisan migrate:fresh --seed
```

### Vider le cache
```bash
php artisan config:clear
php artisan cache:clear
```

### Voir les logs
```bash
tail -f storage/logs/laravel.log
```

## Dépannage

### Erreur de connexion
- Vérifiez que MySQL est démarré
- Vérifiez les paramètres dans `.env`
- Testez la connexion : `mysql -u root -p`

### Erreur de permissions
- Assurez-vous que l'utilisateur MySQL a les bonnes permissions
- Créez un utilisateur dédié si nécessaire :
```sql
CREATE USER 'stell_hope'@'localhost' IDENTIFIED BY 'mot_de_passe';
GRANT ALL PRIVILEGES ON stell_hope.* TO 'stell_hope'@'localhost';
FLUSH PRIVILEGES;
```

### Problèmes de charset
- Assurez-vous que la base de données utilise `utf8mb4`
- Vérifiez la configuration MySQL dans `/etc/mysql/my.cnf` :
```ini
[mysql]
default-character-set = utf8mb4

[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```
