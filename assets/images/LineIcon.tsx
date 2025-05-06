import AppColors from '@/constants/AppColors';
import Svg, { Line } from 'react-native-svg';

export default function LineIcon(props: any) {
  return (
    <Svg viewBox="0 0 1000 1000" {...props}>
      <Line
        x1={900}
        y1={100}
        x2={100}
        y2={900}
        stroke={AppColors.Red}
        strokeWidth={100}
        strokeLinecap="round"
      />
    </Svg>
  );
}