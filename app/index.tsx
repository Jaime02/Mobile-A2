import { Text, View, Button, TextInput, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { useState, useEffect } from "react";
import { addEvent, getEvents, deleteEvent, addCity, getCities, addLocation, getLocations, initializeDatabaseIfNeeded } from "@/database/database";
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from "dayjs";
import Event from "@/database/models/event";

export default function Index() {
  const [events, setEvents] = useState<Event[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", flex: 1 }}>EVENTS</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={36} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Horizontal list of all events sorted by interested_people */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {sortedEvents.map(event => (
          <View key={event.id} style={{ width: 220, marginRight: 12, borderWidth: 1, borderRadius: 8, padding: 8 }}>
            {event.thumbnail_uri && (
              <Image source={{ uri: event.thumbnail_uri }} style={{ width: 200, height: 120, borderRadius: 8 }} />
            )}
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{event.name}</Text>
            <Text><Ionicons name="calendar" /> {event.date}</Text>
            <Text><Ionicons name="location" /> {event.location_name}</Text>
            <Text><Ionicons name="people" /> {event.interested_people}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Today's Events */}
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Today</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {todayEvents.map(event => (
          <View key={event.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{event.name}</Text>
            <Text><Ionicons name="calendar" /> {event.date}</Text>
            <Text><Ionicons name="location" /> {event.location_name}</Text>
            <Text><Ionicons name="people" /> {event.interested_people}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tomorrow's Events */}
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 8 }}>Tomorrow</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {tomorrowEvents.map(event => (
          <View key={event.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{event.name}</Text>
            <Text><Ionicons name="calendar" /> {event.date}</Text>
            <Text><Ionicons name="location" /> {event.location_name}</Text>
            <Text><Ionicons name="people" /> {event.interested_people}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Modal for Add Event */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Add Event</Text>
          
          <View style={{ marginBottom: 20 }}>
            <TextInput
              style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
              placeholder="Event Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
              placeholder="Date (YYYY-MM-DD HH:MM)"
              value={date}
              onChangeText={setDate}
            />
            <Button title="Pick Image" onPress={pickImage} />
            {imageUri && (
              <Image 
                source={{ uri: imageUri }} 
                style={{ width: 200, height: 200, marginVertical: 10 }} 
              />
            )}
            <Button title="Add Event" onPress={handleAddEvent} />
          </View>

          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
