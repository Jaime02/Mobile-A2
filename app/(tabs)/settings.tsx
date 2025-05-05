import { View, Button, StyleSheet, Alert, Switch, TouchableOpacity } from 'react-native';
import { resetDatabase, getCities, getLocations, getEvents, seedDatabase } from '@/database/database';
import { useTheme } from '@/context/ThemeContext';
import AppColors from '@/constants/AppColors';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import { useTextStyles } from '@/constants/TextStyles';

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const textStyles = useTextStyles();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <AppText style={[styles.sectionTitle, textStyles.heading]}>Appearance</AppText>
        <View style={styles.switchContainer}>
          <TouchableOpacity 
            style={styles.switchLabelContainer}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={24} 
              color={colors.text} 
              style={styles.icon}
            />
            <AppText style={[styles.switchLabel, textStyles.body]}>
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </AppText>
          </TouchableOpacity>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: AppColors.Red }}
            thumbColor={isDarkMode ? colors.text : colors.text}
          />
        </View>
      </View>

      <View style={styles.section}>
        <AppText style={[styles.sectionTitle, textStyles.heading]}>Database</AppText>
        <Button 
          title="Reset Database" 
          onPress={handleResetDatabase} 
          color={AppColors.Red}
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Show Database Contents" 
          onPress={handleShowDatabase} 
          color={colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 16,
  },
  buttonSpacer: {
    height: 10,
  },
}); 