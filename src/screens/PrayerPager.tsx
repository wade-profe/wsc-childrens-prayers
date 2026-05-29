import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import { prayers, Prayer } from '../data/prayers';
import { loadIndex, saveIndex } from '../storage';
import { getTheme } from '../theme';
import FitText from '../components/FitText';

type Props = NativeStackScreenProps<RootStackParamList, 'Pager'>;

export default function PrayerPager({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = getTheme(useColorScheme());

  const listRef = useRef<FlatList<Prayer>>(null);
  const [initialIndex, setInitialIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadIndex().then((idx) => {
      setInitialIndex(idx);
      setCurrentIndex(idx);
    });
  }, []);

  // Header: show position and a button to open the menu.
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${currentIndex + 1} / ${prayers.length}`,
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('Menu')}
          hitSlop={12}
          accessibilityLabel="Open prayer list"
        >
          <Text style={{ color: theme.accent, fontSize: 16, fontWeight: '600' }}>
            All Prayers
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, currentIndex, theme.accent]);

  // Jump to a prayer chosen from the menu.
  useEffect(() => {
    const goTo = route.params?.goToIndex;
    if (goTo == null) return;
    listRef.current?.scrollToIndex({ index: goTo, animated: false });
    setCurrentIndex(goTo);
    saveIndex(goTo);
    navigation.setParams({ goToIndex: undefined });
  }, [route.params?.goToIndex, navigation]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      if (idx !== currentIndex) {
        setCurrentIndex(idx);
        saveIndex(idx);
      }
    },
    [width, currentIndex]
  );

  const renderItem = useCallback(
    ({ item }: { item: Prayer }) => (
      <View
        style={{
          width,
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: 8,
          paddingBottom: insets.bottom + 28,
        }}
      >
        <Text
          style={{
            color: theme.questionText,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {`Q${item.q}. ${item.question}`}
        </Text>
        <FitText
          text={item.prayer}
          containerStyle={{ marginTop: 12 }}
          style={{ color: theme.text, textAlign: 'center', fontWeight: '400' }}
        />
      </View>
    ),
    [width, insets.bottom, theme.text, theme.questionText]
  );

  if (initialIndex == null) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  return (
    <FlatList
      ref={listRef}
      data={prayers}
      keyExtractor={(item) => String(item.q)}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      style={{ backgroundColor: theme.background }}
    />
  );
}
