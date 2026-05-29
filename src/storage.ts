import AsyncStorage from '@react-native-async-storage/async-storage';
import { prayers } from './data/prayers';

const KEY = 'currentPrayerIndex';

export async function loadIndex(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw === null) return 0;
    const idx = parseInt(raw, 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= prayers.length) return 0;
    return idx;
  } catch {
    return 0;
  }
}

export async function saveIndex(index: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, String(index));
  } catch {
    // ignore write failures; position persistence is best-effort
  }
}
