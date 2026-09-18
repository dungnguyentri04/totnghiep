import React, { useEffect, useState } from 'react'
import { getGuests, deleteGuest } from '../api.js'

export default function Admin() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getGuests()
      setGuests(res.data)
    } catch (err) {
      console.error(err)
      setError('Không tải được danh sách. Kiểm tra backend đã chạy chưa.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Xóa người này khỏi danh sách?')) return
    try {
      await deleteGuest(id)
      setGuests(guests.filter((g) => g.id !== id))
    } catch (err) {
      console.error(err)
      alert('Xóa thất bại.')
    }
  }

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Danh sách đăng ký tham dự</h1>
          <div className="admin-actions">
            <span className="badge">Tổng: {guests.length}</span>
            <button onClick={load} className="submit-btn small">Làm mới</button>
          </div>
        </div>

        {loading && <p>Đang tải...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="guest-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Lời chúc / cảm nhận</th>
                  <th>Thời gian đăng ký</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                      Chưa có ai đăng ký.
                    </td>
                  </tr>
                )}
                {guests.map((g, idx) => (
                  <tr key={g.id}>
                    <td>{idx + 1}</td>
                    <td>{g.hoTen}</td>
                    <td>{g.sdt || '-'}</td>
                    <td>{g.camNhan || '-'}</td>
                    <td>{g.createdAt ? new Date(g.createdAt).toLocaleString('vi-VN') : '-'}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(g.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
