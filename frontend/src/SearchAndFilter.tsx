import React from 'react'

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sortOption: string) => void
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Search menu or tags..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={inputStyle}
      />

      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} style={selectStyle}>
        <option value="default">Default Order</option>
        <option value="name">Sort by Name</option>
        <option value="time">Sort by Cooking Time</option>
        <option value="calories">Sort by Calories</option>
      </select>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  flexWrap: 'wrap',
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  flex: '1',
  minWidth: '220px',
}

const selectStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  backgroundColor: '#fff',
  cursor: 'pointer',
}