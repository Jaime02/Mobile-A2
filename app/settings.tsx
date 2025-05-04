import { View, Button, StyleSheet, Alert } from 'react-native';
import { resetDatabase, getCities, getLocations, getEvents, seedDatabase } from '@/database/database';

export default function SettingsScreen() {

  const handleResetDatabase = () => {
    Alert.alert(
      "Reset Database",
      "Are you sure you want to delete all data? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: async () => {
            try {
              await resetDatabase();
              await seedDatabase();
              Alert.alert("Success", "Database has been reset.");
            } catch (error) {
              console.error("Error resetting database:", error);
              Alert.alert("Error", "Failed to reset database.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleShowDatabase = async () => {
    try {
      const cities = await getCities();
      const locations = await getLocations();
      const events = await getEvents();

      const message = 
        `Cities:\n${JSON.stringify(cities, null, 2)}\n\n` +
        `Locations:\n${JSON.stringify(locations, null, 2)}\n\n` +
        `Events:\n${JSON.stringify(events, null, 2)}`;

      Alert.alert("Database Contents", message);
    } catch (error) {
      console.error("Error fetching database contents:", error);
      Alert.alert("Error", "Failed to fetch database contents.");
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Reset Database" 
        onPress={handleResetDatabase} 
        color="red" 
      />
      <Button 
        title="Show Database Contents" 
        onPress={handleShowDatabase} 
        color="blue" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 