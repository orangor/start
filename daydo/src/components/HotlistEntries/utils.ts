export const parseHeatData = (heat: string) => {
  if (!heat) return [] as number[];
  return heat.split(',').map(h => parseInt(h) || 0);
};

export const getLatestHeat = (heat: string) => {
  const heats = parseHeatData(heat);
  return heats.length > 0 ? heats[heats.length - 1] : 0;
};

export const getHeatTrend = (heat: string) => {
  const heats = parseHeatData(heat);
  if (heats.length < 2) return 'stable' as const;
  const latest = heats[heats.length - 1];
  const previous = heats[heats.length - 2];
  if (latest > previous) return 'up';
  if (latest < previous) return 'down';
  return 'stable';
};

// 兼容 id / entry_id
export const getRecordId = <T extends { id?: number; entry_id?: number }>(record: T): number | undefined => {
  return record.id ?? record.entry_id;
};