import { User } from './types';

// Simulating a Database and Session Store in LocalStorage
const DB_USERS_KEY = 'natal_store_users_db';
const SESSION_KEY = 'natal_store_session_token';

// Secure Admin Credentials (Simulated Environment Variables)
const ENV_ADMIN_EMAIL = 'snttbstt@01';
// Simulated Argon2id hash for password: $66S11B99$
const ENV_ADMIN_PASS_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$Ep/8W8c4...SECURE_HASH...'; 

// Helper to simulate network delay (Backend Latency)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Safe LocalStorage Wrapper
const storage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('LocalStorage access denied', e);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('LocalStorage access denied', e);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('LocalStorage access denied', e);
    }
  }
};

// UUID Polyfill for older browsers/environments
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Password Verification Logic (Mocking the crypto library check)
const verifyPassword = (plain: string, hash: string): boolean => {
  // If the hash matches our admin hash constant, check against the specific admin password
  if (hash === ENV_ADMIN_PASS_HASH) {
    return plain === '$66S11B99$';
  }
  // For other users (demo only), we compare plain text as we don't have a real hasher running in browser
  return plain === hash;
};

// Seed initial Admin user if Database is empty or to ensure admin exists
const seedDatabase = () => {
  const adminUser = {
    id: 'admin-master-id',
    name: 'Administrador Master',
    email: ENV_ADMIN_EMAIL,
    password: ENV_ADMIN_PASS_HASH, // Stored as hash
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  };

  const usersStr = storage.getItem(DB_USERS_KEY);
  let users = usersStr ? JSON.parse(usersStr) : [];

  // Check if admin exists
  const adminIndex = users.findIndex((u: any) => u.email === ENV_ADMIN_EMAIL);

  if (adminIndex === -1) {
    users.push(adminUser);
  } else {
    // Ensure admin credentials are up to date with the "Env vars"
    users[adminIndex] = { ...users[adminIndex], ...adminUser };
  }
  
  storage.setItem(DB_USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // POST /auth/login
  login: async (email: string, password: string): Promise<User> => {
    seedDatabase();
    await delay(800); // Simulate API call

    const users = JSON.parse(storage.getItem(DB_USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email);

    // 1. Check if user exists
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    // 2. Validate Password (Hash comparison)
    const isValid = verifyPassword(password, user.password);

    if (!isValid) {
      throw new Error('Credenciais inválidas.');
    }

    // 3. Generate Secure Session
    const sessionUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'USER'
    };

    storage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // POST /auth/register
  register: async (userData: any): Promise<User> => {
    seedDatabase();
    await delay(800);

    const users = JSON.parse(storage.getItem(DB_USERS_KEY) || '[]');
    
    // Prevent registering the reserved admin email
    if (userData.email === ENV_ADMIN_EMAIL) {
      throw new Error('Este e-mail é reservado para uso administrativo.');
    }

    if (users.find((u: any) => u.email === userData.email)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const newUser = {
      id: generateUUID(),
      name: userData.fullName,
      email: userData.email,
      password: userData.password, // In real app: hashPassword(userData.password)
      role: 'USER', // Default to USER, admin is seeded
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.setItem(DB_USERS_KEY, JSON.stringify(users));

    // Auto-login after register
    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: 'USER'
    };
    
    storage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // POST /auth/logout
  logout: async () => {
    await delay(300);
    storage.removeItem(SESSION_KEY);
  },

  // Middleware / Session Check
  getSession: (): User | null => {
    const sessionStr = storage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  }
};