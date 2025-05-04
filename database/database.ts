import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDatabasePath = () => {
  return `${FileSystem.documentDirectory}SQLite/app.db`;
};

// Open the database
const db = SQLite.openDatabaseSync('app.db');

// Function to reset the database by dropping and recreating tables
export const resetDatabase = () => {
  db.execAsync(`
    DROP TABLE IF EXISTS Event;
    DROP TABLE IF EXISTS Location;
    DROP TABLE IF EXISTS City;
  `);
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS City (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      name TEXT NOT NULL,
      city_id INTEGER NOT NULL,
      FOREIGN KEY (city_id) REFERENCES City(id)
    );

    CREATE TABLE IF NOT EXISTS Event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date DATETIME NOT NULL,
      location_id INTEGER NOT NULL,
      interested_people INTEGER DEFAULT 0,
      thumbnail_uri TEXT,
      FOREIGN KEY (location_id) REFERENCES Location(id)
    );
  `);
  console.log("Database reset successfully.");
};

export const seedDatabase = async () => {
  const cityIds: number[] = [];
  const cities = [
    'Paris',
    'Berlin',
    'Madrid',
    'Rome',
    'Vienna',
    'Amsterdam',
    'Prague',
    'Budapest',
    'Lisbon',
    'Copenhagen',
  ];
  for (const city of cities) {
    const result = await db.runAsync('INSERT INTO City (name) VALUES (?)', [city]);
    cityIds.push(result.lastInsertRowId);
  }

  const locations = [
    { name: 'Eiffel Tower', latitude: 48.8584, longitude: 2.2945, cityIndex: 0 }, // Paris
    { name: 'Brandenburg Gate', latitude: 52.5163, longitude: 13.3777, cityIndex: 1 }, // Berlin
    { name: 'Plaza Mayor', latitude: 40.4154, longitude: -3.7074, cityIndex: 2 }, // Madrid
    { name: 'Colosseum', latitude: 41.8902, longitude: 12.4922, cityIndex: 3 }, // Rome
    { name: 'Schönbrunn Palace', latitude: 48.1845, longitude: 16.3122, cityIndex: 4 }, // Vienna
    { name: 'Rijksmuseum', latitude: 52.3599, longitude: 4.8852, cityIndex: 5 }, // Amsterdam
    { name: 'Charles Bridge', latitude: 50.0865, longitude: 14.4114, cityIndex: 6 }, // Prague
    { name: 'Buda Castle', latitude: 47.4969, longitude: 19.0399, cityIndex: 7 }, // Budapest
    { name: 'Belém Tower', latitude: 38.6916, longitude: -9.2166, cityIndex: 8 }, // Lisbon
    { name: 'Tivoli Gardens', latitude: 55.6736, longitude: 12.5681, cityIndex: 9 }, // Copenhagen
  ];
  const locationIds: number[] = [];
  for (const loc of locations) {
    const result = await db.runAsync(
      'INSERT INTO Location (latitude, longitude, name, city_id) VALUES (?, ?, ?, ?)',
      [loc.latitude, loc.longitude, loc.name, cityIds[loc.cityIndex]]
    );
    locationIds.push(result.lastInsertRowId);
  }

  const events = [
    { name: 'Spring Festival', date: '2024-04-20', locationIndex: 0 },
    { name: 'Art Expo', date: '2024-05-15', locationIndex: 1 },
    { name: 'Food Carnival', date: '2024-06-10', locationIndex: 2 },
    { name: 'Music Night', date: '2024-07-05', locationIndex: 3 },
    { name: 'Film Gala', date: '2024-08-12', locationIndex: 4 },
    { name: 'Book Fair', date: '2024-09-18', locationIndex: 5 },
    { name: 'Jazz Fest', date: '2024-10-22', locationIndex: 6 },
    { name: 'Wine Tasting', date: '2024-11-14', locationIndex: 7 },
    { name: 'Marathon', date: '2024-12-01', locationIndex: 8 },
    { name: 'Christmas Market', date: '2024-12-20', locationIndex: 9 },
  ];
  for (const event of events) {
    await db.runAsync(
      'INSERT INTO Event (name, date, location_id) VALUES (?, ?, ?)',
      [event.name, event.date, locationIds[event.locationIndex]]
    );
  }
};

export const initializeDatabaseIfNeeded = async () => {
  const hasInitialized = await AsyncStorage.getItem('db_initialized');
  if (hasInitialized) {
    return;
  }
  await resetDatabase();
  await seedDatabase();
  await AsyncStorage.setItem('db_initialized', 'true');
};

// City operations
export const addCity = (name: string) => {
  return db.runAsync('INSERT INTO City (name) VALUES (?)', [name]);
};

export const getCities = () => {
  return db.getAllAsync('SELECT * FROM City');
};

// Location operations
export const addLocation = (latitude: number, longitude: number, name: string, cityId: number) => {
  return db.runAsync(
    'INSERT INTO Location (latitude, longitude, name, city_id) VALUES (?, ?, ?, ?)',
    [latitude, longitude, name, cityId]
  );
};

export const getLocations = () => {
  return db.getAllAsync(`
    SELECT l.*, c.name as city_name 
    FROM Location l
    JOIN City c ON l.city_id = c.id
  `);
};

export const addEvent = async (name: string, date: string, locationId: number, imageUri?: string) => {
  // Directly store the image URI (no manipulation)
  return db.runAsync(
    'INSERT INTO Event (name, date, location_id, thumbnail_uri) VALUES (?, ?, ?, ?)',
    [name, date, locationId, imageUri || null]
  );
};

export const getEvents = () => {
  return db.getAllAsync(`
    SELECT e.*, l.name as location_name, l.latitude, l.longitude, c.name as city_name
    FROM Event e
    JOIN Location l ON e.location_id = l.id
    JOIN City c ON l.city_id = c.id
  `);
};

export const updateInterestedPeople = (eventId: number, count: number) => {
  return db.runAsync(
    'UPDATE Event SET interested_people = ? WHERE id = ?',
    [count, eventId]
  );
};

export const deleteEvent = async (eventId: number) => {
  // Get the event and check for thumbnail_uri
  const event = await db.getFirstAsync('SELECT thumbnail_uri FROM Event WHERE id = ?', [eventId]);
  const uri = (event as { thumbnail_uri?: string })?.thumbnail_uri;
  if (uri) {
    try {
      await FileSystem.deleteAsync(uri);
    } catch (e) {
      // Ignore if file doesn't exist
    }
  }
  return db.runAsync('DELETE FROM Event WHERE id = ?', [eventId]);
};
