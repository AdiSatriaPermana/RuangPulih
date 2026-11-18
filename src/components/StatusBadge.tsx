import React from 'react';

type Status = 'Diterima' | 'Diproses' | 'Selesai';

interface StatusBadgeProps {
  status: Status;
}

const styles: Record<Status, React.CSSProperties> = {
  Diterima: {
    backgroundColor: '#FDF8EE',
    color: '#7A541C',
    border: '1px solid #F2DFC1',
  },
  Diproses: {
    backgroundColor: '#EDF2F7',
    color: '#2C4A6E',
    border: '1px solid #C5D5E8',
  },
  Selesai: {
    backgroundColor: '#E9F3EE',
    color: '#1F5E47',
    border: '1px solid #C0D9CB',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      style={styles[status]}
      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
    >
      {status}
    </span>
  );
};

export default StatusBadge;
