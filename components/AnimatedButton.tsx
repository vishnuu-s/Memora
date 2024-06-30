import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';

interface MyComponentProps {
  icon: string; // Optional animated value
  visible: boolean;
  extended: boolean;
  label: string;
  animateFrom: 'right' | 'left' | undefined; // Allowed animateFrom values
  style?: StyleProp<ViewStyle>;
  iconMode?: 'static' | 'dynamic' | undefined; // Allowed iconMode values
  onPress?: () => void; // Optional onPress callback
}

const MyComponent: React.FC<MyComponentProps> = ({
  icon,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  onPress,
}) => {
  const fabStyle: {[key: string]: number} = {[animateFrom ?? 'right']: 16};

  return (
    <AnimatedFAB
      icon={icon}
      label={label}
      extended={extended}
      onPress={onPress}
      visible={visible}
      animateFrom={animateFrom}
      iconMode={iconMode}
      style={style}
      color="white"
    />
  );
};

export default MyComponent;
