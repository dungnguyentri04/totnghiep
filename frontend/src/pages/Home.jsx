import React, { useState } from 'react'
import { registerGuest } from '../api.js'

export default function Home() {
  const [form, setForm] = useState({ hoTen: '', sdt: '', camNhan: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.hoTen.trim()) {
      setError('Vui lòng nhập họ tên của bạn.')
      return
    }
    setSubmitting(true)
    try {
      await registerGuest(form)
      setDone(true)
    } catch (err) {
      console.error(err)
      setError('Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      {/* HEADER */}
      <header className="hero">
        <p className="hero-eyebrow">Đại Học Bách Khoa Hà Nội</p>
        <h1 className="hero-title">Thiệp Mời Tốt Nghiệp</h1>
        <p className="hero-sub">Trân trọng mời anh chị em đến chung vui cùng mình</p>
      </header>

      <main className="container">
        {/* THIỆP MỜI */}
        <section className="card invite-card">
          <img src="/thiep-moi.jpg" alt="Thiệp mời tốt nghiệp" className="invite-img" />
        </section>

        {/* GIỚI THIỆU BẢN THÂN */}
        <section className="card">
          <h2 className="section-title">Đôi lời giới thiệu</h2>
          <p className="section-text">
            Mình là <strong>Nguyễn Trí Dũng</strong>, sinh viên trường Đại học Bách khoa Hà Nội.
            Sau những năm tháng học tập và rèn luyện, mình sắp hoàn thành chặng đường đại học
            và chuẩn bị bước sang một hành trình mới. Đây là cột mốc quan trọng, và mình rất
            mong có sự hiện diện của những người thân yêu trong ngày đặc biệt này.
          </p>
        </section>

        {/* LỜI CẢM ƠN */}
        <section className="card">
          <h2 className="section-title">Lời cảm ơn</h2>
          <p className="section-text">
            Xin chân thành cảm ơn thầy cô, gia đình và bạn bè đã luôn đồng hành, ủng hộ và giúp
            đỡ mình trong suốt thời gian qua. Thành quả hôm nay có được là nhờ sự yêu thương và
            hỗ trợ của tất cả mọi người. Rất mong tiếp tục nhận được sự đồng hành của mọi người
            trong chặng đường sắp tới.
          </p>
        </section>

        {/* THÔNG TIN LIÊN HỆ */}
        <section className="card">
          <h2 className="section-title">Thông tin buổi lễ</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">🕙 Thời gian</span>
              <span>10h00 - 12h00, ngày 27 tháng 9 năm 2026</span>
            </div>
            <div className="info-item">
              <span className="info-label">📍 Địa điểm</span>
              <span>Trường Đại học Bách khoa Hà Nội<br />Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span>
            </div>
            <div className="info-item">
              <span className="info-label">📞 Liên hệ</span>
              <span>Nguyễn Trí Dũng — số điện thoại sẽ được cập nhật tại đây</span>
            </div>
          </div>
        </section>

        {/* FORM ĐĂNG KÝ */}
        <section className="card form-card">
          <h2 className="section-title">Đăng ký tham dự</h2>

          {!done ? (
            <form onSubmit={handleSubmit} className="rsvp-form">
              <label>
                Họ và tên <span className="required">*</span>
                <input
                  type="text"
                  name="hoTen"
                  value={form.hoTen}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </label>

              <label>
                Số điện thoại
                <input
                  type="tel"
                  name="sdt"
                  value={form.sdt}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                />
              </label>

              <label>
                Lời chúc / cảm nhận
                <textarea
                  name="camNhan"
                  value={form.camNhan}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Gửi lời chúc mừng tốt nghiệp..."
                />
              </label>

              {error && <p className="error-text">{error}</p>}

              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? 'Đang gửi...' : 'Xác nhận tham dự'}
              </button>
            </form>
          ) : (
            <div className="thank-you">
              <div className="thank-you-icon">🎓</div>
              <h3>Cảm ơn bạn đã xác nhận tham dự!</h3>
              <p>Hẹn gặp bạn tại buổi lễ tốt nghiệp nhé.</p>
              <button
                className="submit-btn secondary"
                onClick={() => {
                  setDone(false)
                  setForm({ hoTen: '', sdt: '', camNhan: '' })
                }}
              >
                Đăng ký thêm người khác
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Trân trọng! ♡</p>
      </footer>
    </div>
  )
}
