import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Event from "@/database/models/event";
import dayjs from "dayjs";
import Location from "@/database/models/location";

export const getDatabasePath = () => {
  return `${FileSystem.documentDirectory}SQLite/app.db`;
};

// Open the database
const db = SQLite.openDatabaseSync("app.db");

// Function to reset the database by dropping and recreating tables
export const resetDatabase = () => {
  db.execAsync(`
    DROP TABLE IF EXISTS Event;
    DROP TABLE IF EXISTS Location;
    DROP TABLE IF EXISTS City;

    CREATE TABLE IF NOT EXISTS City (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      name TEXT NOT NULL,
      cityId INTEGER NOT NULL,
      FOREIGN KEY (cityId) REFERENCES City(id)
    );

    CREATE TABLE IF NOT EXISTS Event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date DATETIME NOT NULL,
      locationId INTEGER NOT NULL,
      interestedPeople INTEGER DEFAULT 0,
      thumbnailUri TEXT,
      description TEXT,
      FOREIGN KEY (locationId) REFERENCES Location(id)
    );
  `);
  console.log("Database reset successfully.");
};

export const seedDatabase = async () => {
  const cityIds: number[] = [];
  const cities = [
    "Paris",
    "Berlin",
    "Madrid",
    "Rome",
    "Vienna",
    "Amsterdam",
    "Budapest",
    "Lisbon",
  ];
  for (const city of cities) {
    const result = await db.runAsync("INSERT INTO City (name) VALUES (?)", [
      city,
    ]);
    cityIds.push(result.lastInsertRowId);
  }

  const locations = [
    {
      name: "Eiffel Tower",
      latitude: 48.8584,
      longitude: 2.2945,
      cityIndex: 0,
    }, // Paris
    {
      name: "Brandenburg Gate",
      latitude: 52.5163,
      longitude: 13.3777,
      cityIndex: 1,
    }, // Berlin
    {
      name: "Plaza Mayor",
      latitude: 40.4154,
      longitude: -3.7074,
      cityIndex: 2,
    }, // Madrid
    { name: "Colosseum", latitude: 41.8902, longitude: 12.4922, cityIndex: 3 }, // Rome
    {
      name: "Schönbrunn Palace",
      latitude: 48.1845,
      longitude: 16.3122,
      cityIndex: 4,
    }, // Vienna
    { name: "Rijksmuseum", latitude: 52.3599, longitude: 4.8852, cityIndex: 5 }, // Amsterdam
    {
      name: "Buda Castle",
      latitude: 47.4969,
      longitude: 19.0399,
      cityIndex: 6,
    }, // Budapest
    {
      name: "Belém Tower",
      latitude: 38.6916,
      longitude: -9.2166,
      cityIndex: 7,
    }, // Lisbon
  ];
  const locationIds: number[] = [];
  for (const loc of locations) {
    const result = await db.runAsync(
      "INSERT INTO Location (latitude, longitude, name, cityId) VALUES (?, ?, ?, ?)",
      [loc.latitude, loc.longitude, loc.name, cityIds[loc.cityIndex]]
    );
    locationIds.push(result.lastInsertRowId);
  }

  const today = dayjs().format("YYYY-MM-DD");
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const nextWeek = dayjs().add(1, "week").format("YYYY-MM-DD");

  const events = [
    {
      name: "Spring Festival",
      date: today,
      locationIndex: 0,
      interestedPeople: 33,
      description:
        "Flowerpower man! Prepare for questionable fashion choices and excessive flower crowns.",
    },
    {
      name: "Art Expo",
      date: tomorrow,
      locationIndex: 1,
      interestedPeople: 420,
      description:
        "Where 'abstract' means 'I spilled paint and called it a masterpiece'. Free cheese cubes!",
    },
    {
      name: "Food Carnival",
      date: today,
      locationIndex: 2,
      interestedPeople: 72,
      description:
        "Come for the food, stay because you ate too much and can't move.",
    },
    {
      name: "Music Night",
      date: tomorrow,
      locationIndex: 3,
      interestedPeople: 69,
      description:
        "Featuring bands you've never heard of, but whose parents are *very* proud.",
    },
    {
      name: "Film Gala",
      date: nextWeek,
      locationIndex: 4,
      interestedPeople: 88,
      description:
        "Watch movies so independent, they haven't even been seen by the director.",
    },
    {
      name: "Book Fair",
      date: nextWeek,
      locationIndex: 5,
      interestedPeople: 1312,
      description:
        "Warning: May result in purchasing more books than you can read in a lifetime.",
    },
    {
      name: "Wine Tasting",
      date: today,
      locationIndex: 6,
      interestedPeople: 16,
      description:
        "Sample wines and pretend you know the difference between 'oaky' and 'just okay'.",
    },
    {
      name: "Marathon",
      date: tomorrow,
      locationIndex: 7,
      interestedPeople: 1213,
      description:
        "Running 26.2 miles just to get a free banana at the end. Seems fair.",
    },
  ];

  const eventImages = [
    require("../assets/images/locations/eiffel.jpg"),
    require("../assets/images/locations/brandenburg.webp"),
    require("../assets/images/locations/plazamayor.jpg"),
    require("../assets/images/locations/coliseum.jpg"),
    require("../assets/images/locations/schonbrunn.jpg"),
    require("../assets/images/locations/rijksmuseum.jpg"),
    require("../assets/images/locations/budacastle.jpg"),
    require("../assets/images/locations/belemtower.jpg"),
  ];

  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    const imageUri = await copyAssetToFileSystem(
      eventImages[i],
      `event_${i}.jpg`
    );
    await db.runAsync(
      "INSERT INTO Event (name, date, locationId, thumbnailUri, interestedPeople, description) VALUES (?, ?, ?, ?, ?, ?)",
      [
        event.name,
        event.date,
        locationIds[event.locationIndex],
        imageUri,
        event.interestedPeople,
        event.description,
      ]
    );
  }
};

export const initializeDatabaseIfNeeded = async () => {
  const hasInitialized = await AsyncStorage.getItem("db_initialized");
  if (hasInitialized) {
    return;
  }
  await resetDatabase();
  await seedDatabase();
  await AsyncStorage.setItem("db_initialized", "true");
};

// City operations
export const addCity = (name: string) => {
  return db.runAsync("INSERT INTO City (name) VALUES (?)", [name]);
};

export const getCities = () => {
  return db.getAllAsync("SELECT * FROM City");
};

// Location operations
export const addLocation = (
  latitude: number,
  longitude: number,
  name: string,
  cityId: number
) => {
  return db.runAsync(
    "INSERT INTO Location (latitude, longitude, name, cityId) VALUES (?, ?, ?, ?)",
    [latitude, longitude, name, cityId]
  );
};

export function getLocations(): Promise<Location[]> {
  return db.getAllAsync(`
    SELECT l.*, c.name as cityName 
    FROM Location l
    JOIN City c ON l.cityId = c.id
  `);
}

export const addEvent = async (
  name: string,
  date: string,
  locationId: number,
  imageUri?: string
) => {
  // Directly store the image URI (no manipulation)
  return db.runAsync(
    "INSERT INTO Event (name, date, locationId, thumbnailUri) VALUES (?, ?, ?, ?)",
    [name, date, locationId, imageUri || null]
  );
};

export function getEvents(): Promise<Event[]> {
  return db.getAllAsync(`
    SELECT e.*, l.name as locationName, l.latitude, l.longitude, c.name as cityName
    FROM Event e
    JOIN Location l ON e.locationId = l.id
    JOIN City c ON l.cityId = c.id
  `);
}

export const updateInterestedPeople = (eventId: number, count: number) => {
  return db.runAsync("UPDATE Event SET interestedPeople = ? WHERE id = ?", [
    count,
    eventId,
  ]);
};

export const deleteEvent = async (eventId: number) => {
  // Get the event and check for thumbnailUri
  const event = await db.getFirstAsync(
    "SELECT thumbnailUri FROM Event WHERE id = ?",
    [eventId]
  );
  const uri = (event as { thumbnailUri?: string })?.thumbnailUri;
  if (uri) {
    try {
      await FileSystem.deleteAsync(uri);
    } catch (e) {
      // Ignore if file doesn't exist
    }
  }
  return db.runAsync("DELETE FROM Event WHERE id = ?", [eventId]);
};

// Helper to copy asset to file system and return URI
async function copyAssetToFileSystem(
  assetModule: any,
  filename: string
): Promise<string> {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const dest = FileSystem.documentDirectory + filename;
  await FileSystem.copyAsync({ from: asset.localUri!, to: dest });
  return dest;
}
