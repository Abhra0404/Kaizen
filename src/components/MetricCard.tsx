import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconBgColor: string;
  iconColor: string;
}

export default function MetricCard({ icon: Icon, value, label, iconBgColor, iconColor }: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        backgroundColor: iconBgColor.includes('blue') ? '#eff6ff' : 
                         iconBgColor.includes('green') ? '#f0fdf4' :
                         iconBgColor.includes('orange') ? '#fff7ed' : '#f0fdfa',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <Icon size={24} color={iconColor.includes('blue') ? '#3b82f6' :
                               iconColor.includes('green') ? '#10b981' :
                               iconColor.includes('orange') ? '#f97316' : '#14b8a6'} />
      </div>
      <h3 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '4px', margin: '0 0 4px 0' }}>{value}</h3>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{label}</p>
    </div>
  );
}
