import { View, Image, ScrollView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getEvents } from "@/database/database";
import AppText from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import AppColors from "@/constants/AppColors";
import { Linking } from "react-native";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      const events = await getEvents();
      const found = events.find((e: any) => String(e.id) === String(id));
      setEvent(found);
    };
    fetchEvent();
  }, [id]);

  const openLocationInMaps = (latitude: number, longitude: number) => {
    const scheme = Platform.OS === "ios" ? "maps://0,0?q=" : "geo:0,0?q=";
    const latLng = `${latitude},${longitude}`;
    const label = "Event Location"; // Optional label
    const url =
      Platform.OS === "ios"
        ? `${scheme}${label}@${latLng}`
        : `${scheme}${latLng}(${label})`;
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  if (!event) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppText>Loading...</AppText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}
    >
      {event.thumbnailUri && (
        <Image
          source={{ uri: event.thumbnailUri }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 12,
            marginBottom: 20,
          }}
        />
      )}
      <AppText
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 10,
        }}
      >
        {event.name}
      </AppText>
      <AppText style={{ color: colors.text, marginBottom: 10 }}>
        <Ionicons name="calendar" color={AppColors.Red} /> {event.date}
      </AppText>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Ionicons name="location" color={AppColors.Red} />
        <AppText style={{ color: colors.text, marginLeft: 6 }}>
          {event.locationName}
        </AppText>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Ionicons name="people" color={AppColors.Red} />
        <AppText style={{ color: colors.text, marginLeft: 6 }}>
          {event.interestedPeople} interested
        </AppText>
      </View>
      <AppText style={{ color: colors.textSecondary, marginTop: 20 }}>
        City: {event.cityName}
      </AppText>
    </ScrollView>
  );
}
