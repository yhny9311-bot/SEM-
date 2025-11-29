import { SemEffectData } from './types';

// Data extracted exactly from the user's R output "effects_plot_df" table
export const RAW_SEM_DATA: SemEffectData[] = [
  // 2013
  { Year: '2013', From: 'CP', To: 'CN', Type: '直接效应', est: 0.5502 },
  { Year: '2013', From: 'HP', To: 'CN', Type: '直接效应', est: 0.0634 },
  { Year: '2013', From: 'CP', To: 'HN', Type: '直接效应', est: -0.0215 },
  { Year: '2013', From: 'HP', To: 'HN', Type: '直接效应', est: 0.5062 },
  { Year: '2013', From: 'CP', To: 'HN', Type: '间接效应', est: -0.0102 },
  { Year: '2013', From: 'HP', To: 'HN', Type: '间接效应', est: -0.0012 },
  { Year: '2013', From: 'CP', To: 'HN', Type: '总效应', est: -0.0317 },
  { Year: '2013', From: 'HP', To: 'HN', Type: '总效应', est: 0.5050 },

  // 2018
  { Year: '2018', From: 'CP', To: 'CN', Type: '直接效应', est: 0.4542 },
  { Year: '2018', From: 'HP', To: 'CN', Type: '直接效应', est: -0.0751 },
  { Year: '2018', From: 'CP', To: 'HN', Type: '直接效应', est: 0.1013 },
  { Year: '2018', From: 'HP', To: 'HN', Type: '直接效应', est: 0.5634 },
  { Year: '2018', From: 'CP', To: 'HN', Type: '间接效应', est: -0.0355 },
  { Year: '2018', From: 'HP', To: 'HN', Type: '间接效应', est: 0.0059 },
  { Year: '2018', From: 'CP', To: 'HN', Type: '总效应', est: 0.0658 },
  { Year: '2018', From: 'HP', To: 'HN', Type: '总效应', est: 0.5693 },

  // 2023
  { Year: '2023', From: 'CP', To: 'CN', Type: '直接效应', est: 0.4847 },
  { Year: '2023', From: 'HP', To: 'CN', Type: '直接效应', est: -0.0194 },
  { Year: '2023', From: 'CP', To: 'HN', Type: '直接效应', est: 0.2329 },
  { Year: '2023', From: 'HP', To: 'HN', Type: '直接效应', est: 0.4770 },
  { Year: '2023', From: 'CP', To: 'HN', Type: '间接效应', est: -0.0736 },
  { Year: '2023', From: 'HP', To: 'HN', Type: '间接效应', est: 0.0029 },
  { Year: '2023', From: 'CP', To: 'HN', Type: '总效应', est: 0.1593 },
  { Year: '2023', From: 'HP', To: 'HN', Type: '总效应', est: 0.4799 },
];

export const FROM_LABELS: Record<string, string> = {
  CP: '降温斑块潜变量 (CP)',
  HP: '吸热斑块潜变量 (HP)',
};

export const TO_LABELS: Record<string, string> = {
  CN: '冷却节点强度 (CN)',
  HN: '加热节点强度 (HN)',
};
