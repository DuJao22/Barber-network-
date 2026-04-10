import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

class DBWrapper {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }
  
  async all(sql: string, ...params: any[]) {
    return await this.db.all(sql, ...params);
  }
  
  async get(sql: string, ...params: any[]) {
    return await this.db.get(sql, ...params);
  }
  
  async run(sql: string, ...params: any[]) {
    const res = await this.db.run(sql, ...params);
    return { lastID: res.lastID, changes: res.changes };
  }
  
  async exec(sql: string) {
    return await this.db.exec(sql);
  }
}

let db: DBWrapper | null = null;

export async function getDb() {
  if (!db) {
    const dbPath = path.resolve(process.cwd(), 'database.sqlite');
    const sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    db = new DBWrapper(sqliteDb);
  }
  return db;
}

export async function initDb() {
  const database = await getDb();
  
  try {
    await database.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        logo TEXT,
        cover_image TEXT,
        primary_color TEXT,
        secondary_color TEXT,
        payment_config TEXT,
        admin_username TEXT,
        admin_password TEXT,
        status TEXT DEFAULT 'active',
        subscription_due_date DATETIME,
        subscription_status TEXT DEFAULT 'active',
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        price REAL NOT NULL,
        promotional_price REAL,
        image TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tenant_id, phone),
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        user_id INTEGER,
        client_name TEXT NOT NULL,
        client_phone TEXT NOT NULL,
        service_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Agendado',
        notified_1day BOOLEAN DEFAULT 0,
        notified_1hour BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS working_hours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        start_time_2 TEXT,
        end_time_2 TEXT,
        is_active BOOLEAN DEFAULT 1,
        UNIQUE(tenant_id, day_of_week),
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        setting_key TEXT NOT NULL,
        value TEXT,
        UNIQUE(tenant_id, setting_key),
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS processed_payments (
        id TEXT PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        amount REAL,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
      );
    `);

    // Migration: add admin_username and admin_password if they don't exist
    try {
      await database.exec('ALTER TABLE tenants ADD COLUMN admin_username TEXT');
      await database.exec('ALTER TABLE tenants ADD COLUMN admin_password TEXT');
    } catch (e) {
      // Columns likely already exist
    }

    // Migration: add subscription fields
    try {
      await database.exec('ALTER TABLE tenants ADD COLUMN subscription_due_date DATETIME');
      await database.exec('ALTER TABLE tenants ADD COLUMN subscription_status TEXT DEFAULT "active"');
    } catch (e) {
      // Columns likely already exist
    }

    // Migration: add address field
    try {
      await database.exec('ALTER TABLE tenants ADD COLUMN address TEXT');
    } catch (e) {
      // Column likely already exists
    }

    // Seed initial tenant if empty
    const tenantCount = await database.get('SELECT COUNT(*) as count FROM tenants');
    if (tenantCount.count === 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = await database.run(`
        INSERT INTO tenants (slug, name, primary_color, secondary_color, admin_username, admin_password, subscription_due_date, subscription_status) 
        VALUES ('barbearia-premium', 'Barbearia Premium', '#000000', '#E5E7EB', 'Dujao', '30031936', ?, 'active')
      `, futureDate.toISOString());
      const tenantId = result.lastID;

      await database.run(`
        INSERT INTO settings (tenant_id, setting_key, value) VALUES 
        (?, 'cover_photo', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80'),
        (?, 'profile_photo', 'https://images.unsplash.com/photo-1621605815841-2941a58112c4?w=400&q=80')
      `, tenantId, tenantId);

      await database.run(`
        INSERT INTO working_hours (tenant_id, day_of_week, start_time, end_time, is_active) VALUES 
        (?, 0, '09:00', '18:00', 0),
        (?, 1, '09:00', '18:00', 1),
        (?, 2, '09:00', '18:00', 1),
        (?, 3, '09:00', '18:00', 1),
        (?, 4, '09:00', '18:00', 1),
        (?, 5, '09:00', '18:00', 1),
        (?, 6, '09:00', '18:00', 1)
      `, tenantId, tenantId, tenantId, tenantId, tenantId, tenantId, tenantId);

      await database.run(`
        INSERT INTO services (tenant_id, name, description, duration, price, promotional_price, image) VALUES 
        (?, 'Corte de Cabelo', 'Corte clássico ou moderno com acabamento impecável.', 45, 60.00, 50.00, 'https://images.unsplash.com/photo-1621605815841-2941a58112c4?w=500&q=80'),
        (?, 'Barba Completa', 'Design de barba com toalha quente e produtos premium.', 30, 40.00, NULL, 'https://images.unsplash.com/photo-1599351431247-f13b28ce283d?w=500&q=80'),
        (?, 'Combo Corte + Barba', 'O pacote completo para o seu visual.', 75, 90.00, 80.00, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80'),
        (?, 'Sobrancelha', 'Limpeza e alinhamento da sobrancelha masculina.', 15, 20.00, NULL, 'https://images.unsplash.com/photo-1588514930263-8a9d18728a55?w=500&q=80'),
        (?, 'Pigmentação', 'Cobertura de falhas ou realce do design da barba/cabelo.', 30, 35.00, NULL, 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80')
      `, tenantId, tenantId, tenantId, tenantId, tenantId);
    }
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
  }
}

