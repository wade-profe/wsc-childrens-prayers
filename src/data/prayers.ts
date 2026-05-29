import prayersData from '../../assets/prayers.json';

export type Prayer = {
  q: number;
  question: string;
  prayer: string;
};

export const prayers: Prayer[] = prayersData as Prayer[];
