import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useState, useCallback, useEffect, useMemo } from "react";
import { getEvents, initializeDatabaseIfNeeded } from "@/database/database";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import Event from "@/database/models/event";
import AppText from "@/components/AppText";
import { useTextStyles } from "@/constants/TextStyles";
import { useTheme } from "@/context/ThemeContext";
import AppColors from "@/constants/AppColors";
import { StatusBar } from "expo-status-bar";
import { useRouter, useFocusEffect } from "expo-router";
import EventListSection from "@/components/EventList";

export default function Index() {
  const [events, setEvents] = useState<Event[]>([]);
  const textStyles = useTextStyles();
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();

  const today = dayjs().format("YYYY-MM-DD");
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

  // Memoize filtered/sorted lists to prevent recalculation on every render
  const popularEvents: Event[] = useMemo(
    () => [...events].sort((a, b) => b.interestedPeople - a.interestedPeople).slice(0, 6),
    [events]
  );
  const todayEvents: Event[] = useMemo(
    () => events.filter((e) => e.date.startsWith(today)),
    [events, today]
  );
  const tomorrowEvents: Event[] = useMemo(
    () => events.filter((e) => e.date.startsWith(tomorrow)),
    [events, tomorrow]
  );

  const loadEvents = useCallback(async () => {
    try {
      setEvents(await getEvents());
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, []);

  useEffect(() => {
    initializeDatabaseIfNeeded();
    loadEvents();
  }, [loadEvents]);

  // Use useFocusEffect to reload events when the screen comes into focus
  // This ensures the list updates after adding an event and navigating back
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  return (
    <ScrollView
      style={{ flex: 1, padding: 20, backgroundColor: colors.background }}
    >
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={colors.background}
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <AppText style={{ ...textStyles.heading, flex: 1 }}>EVENTS</AppText>
        <TouchableOpacity onPress={() => router.push("/event/create")}>
          <Ionicons name="add-circle" size={36} color={AppColors.Red} />
        </TouchableOpacity>
      </View>

      <AppText style={{ ...textStyles.heading, marginBottom: 8 }}>
        Popular
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 5, height: 220 }}
      >
        {popularEvents.length === 0 && (
          <AppText
            style={{
              color: colors.textSecondary,
              width: 250,
              textAlign: "center",
              alignSelf: "center",
            }}
          >
            No popular events found.
          </AppText>
        )}
        {popularEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            onPress={() =>
              router.push({
                pathname: "/event/[id]",
                params: { id: String(event.id) },
              })
            }
          >
            <View
              style={{
                width: 220,
                marginRight: 12,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                height: "100%",
              }}
            >
              {event.thumbnailUri ? (
                <Image
                  source={{ uri: event.thumbnailUri }}
                  style={{
                    width: "100%",
                    height: 100,
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 100,
                    borderRadius: 4,
                    marginBottom: 8,
                    backgroundColor: colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="image-outline"
                    size={40}
                    color={colors.textSecondary}
                  />
                </View>
              )}
              <AppText
                style={{ ...textStyles.subheading, flexShrink: 1 }}
                numberOfLines={1}
              >
                {event.name}
              </AppText>
              <AppText
                style={[
                  textStyles.body,
                  {
                    color: colors.textSecondary,
                    marginVertical: 2,
                    fontSize: 12,
                  },
                ]}
              >
                {dayjs(event.date).format("ddd, MMM D, h:mm A")}
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "auto",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    marginRight: 4,
                  }}
                >
                  <Ionicons name="location" color={AppColors.Red} size={14} />
                  <AppText
                    style={{
                      ...textStyles.body,
                      marginLeft: 4,
                      flexShrink: 1,
                      fontSize: 12,
                    }}
                    numberOfLines={1}
                  >
                    {event.locationName || "No location"}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="people" color={AppColors.Red} size={14} />
                  <AppText
                    style={{ ...textStyles.body, marginLeft: 4, fontSize: 12 }}
                  >
                    {event.interestedPeople}
                  </AppText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <EventListSection
        title="Today"
        events={todayEvents}
        emptyMessage="No events today."
      />

      <EventListSection
        title="Tomorrow"
        events={tomorrowEvents}
        emptyMessage="No events tomorrow."
      />
    </ScrollView>
  );
}
