import dayjs from 'dayjs';

export const formatDate = (date: string) => {
  return dayjs(date).format('YYYY年MM月DD日');
};

export const formatDateShort = (date: string) => {
  return dayjs(date).format('MM/DD');
};

export const formatDateTime = (date: string) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm');
};

export const formatYear = (date: string) => {
  return dayjs(date).format('YYYY年');
};

export const getRelativeTime = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  const diffDays = now.diff(target, 'day');

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
  return `${Math.floor(diffDays / 365)}年前`;
};

export const getExamTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    blood: '血液检查',
    urine: '尿液检查',
    imaging: '影像检查',
    ultrasound: '超声检查',
    ecg: '心电图',
    other: '其他检查',
  };
  return labels[type] || '其他检查';
};

export const getFrequencyLabel = (frequency: string) => {
  const labels: Record<string, string> = {
    'once': '每日一次',
    'twice': '每日两次',
    'three': '每日三次',
    'four': '每日四次',
    'asneeded': '必要时',
    'weekly': '每周一次',
  };
  return labels[frequency] || frequency;
};
