import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/menu-items')
      .then(response => {
        const payload = response.data
        const items = Array.isArray(payload) ? payload : (payload.data || [])
        setMenuItems(items)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching menu items:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Flavorhouse Menu</h1>
      
      {loading ? (
        <p>Loading menu items...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Item Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.item_id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.item_id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>{item.item_name}</strong></td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.category_name || item.dietary_type}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${item.original_price || item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App