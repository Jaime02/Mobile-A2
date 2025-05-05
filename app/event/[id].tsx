import {
  View,
  Image,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getEvents } from "@/database/database";
import AppText from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import AppColors from "@/constants/AppColors";
import { Linking } from "react-native";
import { useTextStyles } from "@/constants/TextStyles";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>();
  const { colors } = useTheme();
  const textStyles = useTextStyles();

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

  const buyTickets = async () => {
    // Check if the device can open the best URL available on the internet :D
    const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    if (await Linking.canOpenURL(youtubeUrl)) {
      // Open the URL
      await Linking.openURL(youtubeUrl);
    } else {
      console.error(`Don't know how to open this URL: ${youtubeUrl}`);
      Alert.alert(`Don't know how to open this URL: ${youtubeUrl}`);
    }
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
      style={{ flex: 1, backgroundColor: colors.background, padding: 10 }}
      contentContainerStyle={{ gap: 10 }}
    >
      {event.thumbnailUri && (
        <Image
          source={{ uri: event.thumbnailUri }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 12,
          }}
        />
      )}
      <AppText
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: colors.text,
        }}
      >
        {event.name}
      </AppText>
      <AppText style={{ color: colors.text }}>
        <Ionicons name="calendar" color={AppColors.Red} /> {event.date}
      </AppText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="location" color={AppColors.Red} />
        <AppText style={{ color: colors.text, marginLeft: 6 }}>
          {event.cityName} - {event.locationName}
        </AppText>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="people" color={AppColors.Red} />
        <AppText style={{ color: colors.text, marginLeft: 6 }}>
          {event.interestedPeople} interested
        </AppText>
      </View>
      <AppText style={textStyles.body}>{event.description}</AppText>
      <Button
        title="I'm interested"
        onPress={() => Alert.alert("To do :)")}
        color={AppColors.Red}
      />
      <Button
        title="Buy tickets! 🤪"
        onPress={buyTickets}
        color={AppColors.Red}
      />
    </ScrollView>
  );
}
