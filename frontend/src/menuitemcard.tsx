import React from 'react'

// Define the shape of a single Menu Item
export interface MenuItem {
  item_id: number | string
  name: string
  time_to_cook?: number | string | null
  calories?: number | string | null
  tags?: string[] | null
}

interface MenuItemCardProps {
  item: MenuItem
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>{item.name}</h3>
        <span style={idBadgeStyle}>#{item.item_id}</span>
      </div>

      <div style={detailsStyle}>
        <span>⏱️ {item.time_to_cook ? `${item.time_to_cook} mins` : 'N/A'}</span>
        <span>🔥 {item.calories ? `${item.calories} kcal` : 'N/A'}</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        {item.tags && item.tags.length > 0 ? (
          item.tags.map((tag, idx) => (
            <span key={idx} style={tagStyle}>
              {tag}
            </span>
          ))
        ) : (
          <span style={{ fontSize: '12px', color: '#999' }}>No tags</span>
        )}
      </div>
    </div>
  )
}

// Styling definitions
const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
}

const idBadgeStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '2px 6px',
  borderRadius: '4px',
}

const detailsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  fontSize: '14px',
  color: '#475569',
}

const tagStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#e0e7ff',
  color: '#4338ca',
  fontSize: '12px',
  fontWeight: 500,
  padding: '2px 8px',
  borderRadius: '12px',
  marginRight: '6px',
  marginTop: '4px',
}