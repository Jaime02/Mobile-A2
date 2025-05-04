export default interface Event {
  id: number;
  name: string;
  date: string;
  location_name: string;
  city_name: string;
  latitude: number;
  longitude: number;
  interested_people: number;
  thumbnail_uri: string | null;
}
