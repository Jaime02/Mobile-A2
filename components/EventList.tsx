import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import Event from "@/database/models/event";
import AppText from "@/components/AppText";
import AppColors from "@/constants/AppColors";
import { useRouter } from "expo-router";
import { useTextStyles } from "@/constants/TextStyles";
import { useTheme } from "@/context/ThemeContext";

interface EventListSectionProps {
  title: string;
  events: Event[];
  emptyMessage: string;
}

export default function EventListSection({
  title,
  events,
  emptyMessage,
}: EventListSectionProps) {
  const textStyles = useTextStyles();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <>
      <AppText
        style={{ ...textStyles.heading, marginBottom: 8, marginTop: 15 }}
      >
        {title}
      </AppText>
      <View>
        {events.length === 0 && (
          <AppText style={{ color: colors.textSecondary, marginTop: 10 }}>
            {emptyMessage}
          </AppText>
        )}
        {events.map((event) => (
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
                marginBottom: 10,
                padding: 10,
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {event.thumbnailUri ? (
                <Image
                  source={{ uri: event.thumbnailUri }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    marginRight: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    marginRight: 10,
                    backgroundColor: colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <AppText style={textStyles.bodyEmphasized} numberOfLines={1}>
                  {event.name}
                </AppText>
                <AppText
                  style={[
                    textStyles.body,
                    { color: colors.textSecondary, fontSize: 12 },
                  ]}
                >
                  <Ionicons name="time-outline" size={12} />{" "}
                  {dayjs(event.date).format("h:mm A")}
                </AppText>
                <AppText
                  style={[
                    textStyles.body,
                    { color: colors.textSecondary, fontSize: 12 },
                  ]}
                >
                  <Ionicons name="location-outline" size={12} />{" "}
                  {event.locationName || "No location"}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Ionicons name="people" color={AppColors.Red} size={14} />
                <AppText style={{ ...textStyles.body, marginLeft: 4 }}>
                  {event.interestedPeople}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
