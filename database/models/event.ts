export default interface Event {
  id: number;
  name: string;
  date: string;
  locationName: string;
  cityName: string;
  interestedPeople: number;
  thumbnailUri: string | null;
}
