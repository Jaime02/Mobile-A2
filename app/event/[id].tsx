import { View, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getEvents } from '@/database/database';
import AppText from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useTextStyles } from '@/constants/TextStyles';
import AppColors from '@/constants/AppColors';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
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

  if (!event) {
    return <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}><AppText>Loading...</AppText></View>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      {event.thumbnail_uri && (
        <Image source={{ uri: event.thumbnail_uri }} style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 20 }} />
      )}
      <AppText style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>{event.name}</AppText>
      <AppText style={{ color: colors.text, marginBottom: 10 }}><Ionicons name="calendar" color={AppColors.Red} /> {event.date}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Ionicons name="location" color={AppColors.Red} />
        <AppText style={{ color: colors.text, marginLeft: 6 }}>{event.location_name}</AppText>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Ionicons name="people" color={AppColors.Red} />
        <AppText style={{ color: colors.text, marginLeft: 6 }}>{event.interested_people} interested</AppText>
      </View>
      <AppText style={{ color: colors.textSecondary, marginTop: 20 }}>City: {event.city_name}</AppText>
    </ScrollView>
  );
} 