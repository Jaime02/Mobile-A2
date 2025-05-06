import LineIcon from "@/assets/images/LineIcon";
import AppText from "@/components/AppText";
import { useTextStyles } from "@/constants/TextStyles";
import { View } from "react-native";

export default function Header({ headerText }: { headerText: string }) {
  const textStyles = useTextStyles();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <LineIcon width={30} height={30} />
      <AppText style={{ ...textStyles.heading }}>{headerText}</AppText>
    </View>
  );
}
