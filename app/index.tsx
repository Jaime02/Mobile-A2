import { View, Button, TextInput, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { useState, useEffect } from "react";
import { addEvent, getEvents, deleteEvent, addCity, getCities, addLocation, getLocations, initializeDatabaseIfNeeded } from "@/database/database";
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from "dayjs";
import Event from "@/database/models/event";
import AppText from "@/components/AppText";
import { useTextStyles } from "@/constants/TextStyles";
import { useTheme } from "@/context/ThemeContext";
import AppColors from "@/constants/AppColors";
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const [events, setEvents] = useState<Event[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const textStyles = useTextStyles();
  const { colors, isDarkMode } = useTheme();
  
  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  
  const sortedEvents = [...events].sort((a, b) => b.interested_people - a.interested_people);
  const todayEvents = events.filter(e => e.date.startsWith(today));
  const tomorrowEvents = events.filter(e => e.date.startsWith(tomorrow));

  const loadEvents = async () => {
    try {
      const loadedEvents = await getEvents();
      setEvents(loadedEvents as Event[]);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddEvent = async () => {
    if (name && date && locationId) {
      try {
        await addEvent(name, date, locationId, imageUri || undefined);
        setName("");
        setDate("");
        setLocationId(null);
        setImageUri(null);
        loadEvents();
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const openLocationInMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    initializeDatabaseIfNeeded();
    loadEvents();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={colors.background} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <AppText style={{ fontSize: 24, fontWeight: "bold", flex: 1, color: colors.text }}>EVENTS</AppText>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={36} color={AppColors.Red} />
        </TouchableOpacity>
      </View>

      {/* Horizontal list of all events sorted by interested_people */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {sortedEvents.map(event => (
          <View key={event.id} style={{ width: 220, marginRight: 12, borderWidth: 1, borderRadius: 8, padding: 8, backgroundColor: colors.surface, borderColor: colors.border }}>
            {event.thumbnail_uri && (
              <Image source={{ uri: event.thumbnail_uri }} style={{ width: 200, height: 120, borderRadius: 8 }} />
            )}
            <AppText style={{ fontWeight: 'bold', fontSize: 22, color: colors.text }}>{event.name}</AppText>
            <AppText style={[textStyles.secondary]}>{event.date}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" color={AppColors.Red} />
                <AppText style={{ color: colors.text, marginLeft: 4 }}>{event.location_name}</AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people" color={AppColors.Red} />
                <AppText style={{ color: colors.text, marginLeft: 4 }}>{event.interested_people}</AppText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Today's Events */}
      <AppText style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: colors.text }}>Today</AppText>
      <ScrollView style={{ maxHeight: 200 }}>
        {todayEvents.map(event => (
          <View key={event.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8, backgroundColor: colors.surface, borderColor: colors.border }}>
            <AppText style={{ fontWeight: 'bold', color: colors.text }}>{event.name}</AppText>
            <AppText style={{ color: colors.text }}><Ionicons name="calendar" /> {event.date}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" color={AppColors.Red} />
                <AppText style={{ color: colors.text, marginLeft: 4 }}>{event.location_name}</AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people" color={AppColors.Red} />
                <AppText style={{ color: colors.text, marginLeft: 4 }}>{event.interested_people}</AppText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Tomorrow's Events */}
      <AppText style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 8, color: colors.text }}>Tomorrow</AppText>
      <ScrollView style={{ maxHeight: 200 }}>
        {tomorrowEvents.map(event => (
          <View key={event.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8, backgroundColor: colors.surface, borderColor: colors.border }}>
            <AppText style={{ fontWeight: 'bold', color: colors.text }}>{event.name}</AppText>
            <AppText style={{ color: colors.text }}><Ionicons name="calendar" /> {event.date}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" color={AppColors.Red} />
                <AppText style={{ color: colors.text, marginLeft: 4 }}>{event.location_name}</AppText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="people" color={AppColors.Red} />
                <AppText style={{ color: colors.text, marginLeft: 4 }}>{event.interested_people}</AppText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal for Add Event */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
          <AppText style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: colors.text }}>Add Event</AppText>
          
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={{ borderWidth: 1, padding: 10, marginBottom: 10, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
              placeholder="Event Name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={{ borderWidth: 1, padding: 10, marginBottom: 10, backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
              placeholder="Date (YYYY-MM-DD HH:MM)"
              placeholderTextColor={colors.textSecondary}
              value={date}
              onChangeText={setDate}
            />
            <Button title="Pick Image" onPress={pickImage} color={AppColors.Red} />
            {imageUri && (
              <Image 
                source={{ uri: imageUri }} 
                style={{ width: 200, height: 200, marginVertical: 10 }} 
              />
            )}
            <Button title="Add Event" onPress={handleAddEvent} color={AppColors.Red} />
          </View>

          <Button title="Close" onPress={() => setModalVisible(false)} color={AppColors.Red} />
        </View>
      </Modal>
    </View>
  );
}
