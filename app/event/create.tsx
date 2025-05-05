import {
  View,
  Button,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { addEvent } from "@/database/database";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AppText from "@/components/AppText";
import { useTheme } from "@/context/ThemeContext";
import AppColors from "@/constants/AppColors";
import { StatusBar } from "expo-status-bar";

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // Consider using a DateTimePicker
  const [locationId, setLocationId] = useState<number | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const pickImage = async () => {
    // Request permissions if not granted
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddEvent = async () => {
    // Basic validation
    const parsedLocationId = parseInt(locationInput, 10);
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter an event name.");
      return;
    }
    if (!date.trim()) {
      // Add more robust date validation if needed
      Alert.alert(
        "Validation Error",
        "Please enter a date (YYYY-MM-DD HH:MM)."
      );
      return;
    }
    if (isNaN(parsedLocationId)) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid Location ID (numeric)."
      );
      return;
    }
    setLocationId(parsedLocationId); // Set the actual number state

    // Proceed if validation passes
    if (name && date && !isNaN(parsedLocationId)) {
      try {
        await addEvent(name, date, parsedLocationId, imageUri || undefined);
        Alert.alert("Success", "Event added successfully!");
        // Navigate back to the previous screen (likely the events list)
        if (router.canGoBack()) {
          router.back();
        } else {
          // Fallback if cannot go back (e.g., deep link)
          router.replace("/(tabs)/index"); // Go to home tab
        }
      } catch (error) {
        console.error("Error adding event:", error);
        Alert.alert("Error", "Could not add event. Please try again.");
      }
    }
  };

  const handleLocationInputChange = (text: string) => {
    setLocationInput(text);
    // Try parsing immediately or wait until submission
    // const parsed = parseInt(text, 10);
    // setLocationId(isNaN(parsed) ? null : parsed);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 10, paddingTop: 40, gap: 10 }}
    >
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
      />
      <AppText
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: colors.text,
          alignSelf: "center",
        }}
      >
        Add New Event
      </AppText>

      <TextInput
        style={{
          borderWidth: 1,
          padding: 12,

          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
          borderRadius: 5,
        }}
        placeholder="Event Name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 12,

          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
          borderRadius: 5,
        }}
        placeholder="Date (YYYY-MM-DD HH:MM)" // TODO: Use a DateTimePicker component
        placeholderTextColor={colors.textSecondary}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={{
          borderWidth: 1,
          padding: 12,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
          borderRadius: 5,
        }}
        placeholder="Location ID" // TODO: replace with a Picker or Searchable Dropdown
        placeholderTextColor={colors.textSecondary}
        value={locationInput}
        onChangeText={handleLocationInputChange}
        keyboardType="numeric" // Set keyboard type to numeric
      />

      <Button
        title="Pick Event Image"
        onPress={pickImage}
        color={AppColors.Red}
      />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: 200,
            resizeMode: "contain",
            borderRadius: 5,
            alignSelf: "center",
          }}
        />
      )}

      <Button
        title="Add Event"
        onPress={handleAddEvent}
        color={AppColors.Red}
      />

      <Button
        title="Cancel"
        onPress={() => router.back()}
        color={colors.textSecondary}
      />
    </ScrollView>
  );
}
