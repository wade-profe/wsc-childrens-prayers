import React, { useCallback } from 'react';
import { FlatList, Pressable, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import { prayers, Prayer } from '../data/prayers';
import { getTheme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function PrayerMenu({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = getTheme(useColorScheme());

  const onSelect = useCallback(
    (index: number) => {
      navigation.popTo('Pager', { goToIndex: index });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Prayer; index: number }) => (
      <Pressable
        onPress={() => onSelect(index)}
        style={({ pressed }) => ({
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: pressed ? theme.border : theme.menuItemBackground,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          flexDirection: 'row',
        })}
      >
        <Text
          style={{
            color: theme.accent,
            fontSize: 17,
            fontWeight: '700',
            width: 44,
          }}
        >
          {item.q}.
        </Text>
        <Text style={{ color: theme.text, fontSize: 17, flex: 1 }}>
          {item.question}
        </Text>
      </Pressable>
    ),
    [onSelect, theme]
  );

  return (
    <FlatList
      data={prayers}
      keyExtractor={(item) => String(item.q)}
      renderItem={renderItem}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    />
  );
}
