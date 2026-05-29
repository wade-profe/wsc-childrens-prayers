import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextLayoutEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  text: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  minFontSize?: number;
  maxFontSize?: number;
  lineHeightRatio?: number;
};

/**
 * Renders text at the largest font size (between min and max) that fits its
 * container without vertical clipping, using a binary search over font sizes.
 * Text is hidden until the size has settled to avoid flicker.
 */
export default function FitText({
  text,
  style,
  containerStyle,
  minFontSize = 16,
  maxFontSize = 46,
  lineHeightRatio = 1.32,
}: Props) {
  const [containerH, setContainerH] = useState<number | null>(null);
  const [lo, setLo] = useState(minFontSize);
  const [hi, setHi] = useState(maxFontSize);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setLo(minFontSize);
    setHi(maxFontSize);
    setFontSize(maxFontSize);
    setSettled(false);
  }, [text, containerH, minFontSize, maxFontSize]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h && h !== containerH) setContainerH(h);
  };

  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (settled || containerH == null) return;
    const totalH = e.nativeEvent.lines.reduce((sum, l) => sum + l.height, 0);
    const fits = totalH <= containerH;

    const nextLo = fits ? fontSize : lo;
    const nextHi = fits ? hi : fontSize;

    if (nextHi - nextLo <= 1) {
      setFontSize(fits ? fontSize : nextLo);
      setSettled(true);
      return;
    }
    setLo(nextLo);
    setHi(nextHi);
    setFontSize(Math.floor((nextLo + nextHi) / 2));
  };

  return (
    <View style={[{ flex: 1, justifyContent: 'center' }, containerStyle]} onLayout={onContainerLayout}>
      {containerH != null && (
        <Text
          onTextLayout={onTextLayout}
          style={[
            style,
            {
              fontSize,
              lineHeight: Math.round(fontSize * lineHeightRatio),
              opacity: settled ? 1 : 0,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
}
