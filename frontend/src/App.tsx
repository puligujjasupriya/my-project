import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

// ---------------------------------------------------------------------------
// TYPES & INTERFACES
// ---------------------------------------------------------------------------
export interface MenuItem {
  item_id: number | string
  name: string
  time_to_cook?: number | string | null
  calories?: number | string | null
  tags?: string[] | null
}

interface ApiResponse {
  data?: MenuItem[]
}

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sortOption: string) => void
}

// ---------------------------------------------------------------------------
// SUB-COMPONENT: MenuItemCard
// ---------------------------------------------------------------------------
const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
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
          item.tags.map((tag: string, idx: number) => (
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

// ---------------------------------------------------------------------------
// SUB-COMPONENT: SearchAndFilter
// ---------------------------------------------------------------------------
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
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

// ---------------------------------------------------------------------------
// MAIN COMPONENT: App
// ---------------------------------------------------------------------------
export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('default')

  useEffect(() => {
    const controller = new AbortController()

    axios
      .get<MenuItem[] | ApiResponse>('http://127.0.0.1:8000/menu-items', {
        signal: controller.signal,
      })
      .then((response) => {
        const payload = response.data
        const items: MenuItem[] = Array.isArray(payload)
          ? payload
          : payload.data || []

        setMenuItems(items)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        console.error('API Error, falling back to sample data:', err)
        setError('Could not connect to FastAPI server (http://127.0.0.1:8000). Displaying local sample menu instead.')
        
        // Fallback sample data so UI is never blank
        setMenuItems([
          { item_id: 1, name: 'Margherita Pizza', time_to_cook: 15, calories: 750, tags: ['Italian', 'Veg'] },
          { item_id: 2, name: 'Cheeseburger', time_to_cook: 10, calories: 850, tags: ['American', 'Fast Food'] },
          { item_id: 3, name: 'Caesar Salad', time_to_cook: 5, calories: 350, tags: ['Healthy', 'Veg'] }
        ])
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const processedItems = useMemo(() => {
    let result = [...menuItems]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(q))
      )
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'time') {
      result.sort((a, b) => Number(a.time_to_cook || 0) - Number(b.time_to_cook || 0))
    } else if (sortBy === 'calories') {
      result.sort((a, b) => Number(a.calories || 0) - Number(b.calories || 0))
    }

    return result
  }, [menuItems, searchQuery, sortBy])

  if (loading) return <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>Loading menu items...</div>

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '8px' }}>Flavorhouse Menu</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>
        Explore our selection of handcrafted dishes.
      </p>

      {error && (
        <div style={warningBannerStyle}>
          ⚠️ {error}
        </div>
      )}

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {processedItems.length > 0 ? (
        <div style={gridStyle}>
          {processedItems.map((item) => (
            <MenuItemCard key={item.item_id} item={item} />
          ))}
        </div>
      ) : (
        <p style={{ color: '#64748b', marginTop: '20px' }}>No menu items match your search.</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
}

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

const warningBannerStyle: React.CSSProperties = {
  backgroundColor: '#fef3c7',
  color: '#92400e',
  border: '1px solid #fcd34d',
  padding: '12px 16px',
  borderRadius: '6px',
  marginBottom: '20px',
  fontSize: '14px',
}