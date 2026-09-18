import React, { useState, useEffect, useMemo, useRef } from 'react'
import { registerGuest } from '../api.js'
import './home.css'

/* ====== CHỈNH SỬA NHANH Ở ĐÂY ====== */
const EVENT_DATE = new Date('2026-09-27T10:00:00+07:00')
const HO_TEN = 'Nguyễn Trí Dũng'
const SDT_LIEN_HE = '09xx xxx xxx'
const DIA_CHI = 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội'
const MAP_URL = 'https://maps.google.com/?q=Đại+học+Bách+khoa+Hà+Nội'

const CHANG_DUONG = [
	{
		nam: '2021',
		ten: 'Ngày đầu qua cổng Parabol',
		ke: 'Một chiếc balo, một tờ giấy báo nhập học và rất nhiều bỡ ngỡ. Bách Khoa bắt đầu từ đó.',
	},
	{
		nam: '2022',
		ten: 'Những đêm trắng đầu tiên',
		ke: 'Giải tích, Đại số, và cảm giác lần đầu code chạy đúng lúc 3 giờ sáng ở thư viện Tạ Quang Bửu.',
	},
	{
		nam: '2024',
		ten: 'Đồ án và những người bạn',
		ke: 'Học được rằng thứ đi xa nhất không phải là điểm số, mà là những người cùng ngồi lại làm cho xong.',
	},
	{
		nam: '2026',
		ten: 'Ngày nhận bằng',
		ke: 'Khép lại một chặng đường, và mình muốn có bạn ở đó để cùng nhìn lại.',
	},
]

const TABS = [
	{ id: 'thiep', nhan: 'Thiệp mời' },
	{ id: 'vemink', nhan: 'Về mình' },
	{ id: 'hanhtrinh', nhan: 'Hành trình' },
	{ id: 'buoile', nhan: 'Buổi lễ' },
	{ id: 'luubut', nhan: 'Sổ lưu bút' },
]

/* ====== Đếm ngược ====== */
function useCountdown(target) {
	const [now, setNow] = useState(() => Date.now())
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(id)
	}, [])
	const con = Math.max(0, target.getTime() - now)
	return {
		het: con === 0,
		ngay: Math.floor(con / 86400000),
		gio: Math.floor((con / 3600000) % 24),
		phut: Math.floor((con / 60000) % 60),
		giay: Math.floor((con / 1000) % 60),
	}
}

/* ====== Cánh hoa rơi ====== */
function CanhHoa() {
	const hat = useMemo(
		() =>
			Array.from({ length: 16 }, (_, i) => ({
				id: i,
				left: `${(i * 6.4 + (i % 5) * 3) % 100}%`,
				delay: `${(i % 8) * 1.7}s`,
				duration: `${11 + (i % 6) * 2.5}s`,
				scale: 0.5 + ((i % 4) * 0.22),
				drift: `${(i % 2 ? 1 : -1) * (30 + (i % 5) * 18)}px`,
			})),
		[]
	)
	return (
		<div className="canh-hoa" aria-hidden="true">
			{hat.map((h) => (
				<span
					key={h.id}
					style={{
						left: h.left,
						animationDelay: h.delay,
						animationDuration: h.duration,
						'--scale': h.scale,
						'--drift': h.drift,
					}}
				/>
			))}
		</div>
	)
}

export default function Home() {
	const [tab, setTab] = useState('thiep')
	const [form, setForm] = useState({ hoTen: '', camNhan: '' })
	const [submitting, setSubmitting] = useState(false)
	const [done, setDone] = useState(false)
	const [error, setError] = useState('')
	const [loiChuc, setLoiChuc] = useState([])
	const [moc, setMoc] = useState(0)
	const dem = useCountdown(EVENT_DATE)
	const noiDungRef = useRef(null)

	const doiTab = (id) => {
		setTab(id)
		if (noiDungRef.current) {
			const y = noiDungRef.current.getBoundingClientRect().top + window.scrollY - 92
			window.scrollTo({ top: y, behavior: 'smooth' })
		}
	}

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		if (!form.hoTen.trim()) {
			setError('Cần tên của bạn để mình ghi vào danh sách khách mời.')
			return
		}
		setSubmitting(true)
		try {
			await registerGuest(form)
			if (form.camNhan.trim()) {
				setLoiChuc((cu) => [{ ten: form.hoTen.trim(), chuc: form.camNhan.trim() }, ...cu])
			}
			setDone(true)
		} catch (err) {
			console.error(err)
			setError('Không gửi được. Kiểm tra kết nối mạng rồi gửi lại giúp mình nhé.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="trang">
			<CanhHoa />

			{/* ===== HERO ===== */}
			<header className="hero">
				<div className="hero-vien">
					<p className="hero-truong">Đại học Bách khoa Hà Nội</p>
					<h1 className="hero-tieude">
						<span className="dong-1">Thiệp mời</span>
						<span className="dong-2">Tốt nghiệp</span>
					</h1>
					<p className="hero-ten">{HO_TEN}</p>
					<p className="hero-sub">Trân trọng mời bạn đến chung vui cùng mình</p>

					<div className="dem-nguoc" role="timer" aria-live="off">
						{dem.het ? (
							<p className="dem-xong">Hôm nay là ngày đó. Hẹn gặp bạn tại hội trường!</p>
						) : (
							<>
								{[
									['Ngày', dem.ngay],
									['Giờ', dem.gio],
									['Phút', dem.phut],
									['Giây', dem.giay],
								].map(([nhan, so]) => (
									<div className="o-dem" key={nhan}>
										<span className="so">{String(so).padStart(2, '0')}</span>
										<span className="nhan">{nhan}</span>
									</div>
								))}
							</>
						)}
					</div>

					<button className="nut chinh hero-nut" onClick={() => doiTab('luubut')}>
						Xác nhận tham dự
					</button>
				</div>
			</header>

			{/* ===== TABS ===== */}
			<nav className="thanh-tab" ref={noiDungRef} aria-label="Các mục">
				<div className="thanh-tab-trong" role="tablist">
					{TABS.map((t) => (
						<button
							key={t.id}
							role="tab"
							aria-selected={tab === t.id}
							className={`tab ${tab === t.id ? 'dang-chon' : ''}`}
							onClick={() => setTab(t.id)}
						>
							{t.nhan}
						</button>
					))}
				</div>
			</nav>

			<main className="khung">
				{/* ===== THIỆP MỜI ===== */}
				{tab === 'thiep' && (
					<section className="mo-ra">
						<div className="khung-thiep">
							<img src="/thiep-moi.jpg" alt="Thiệp mời tốt nghiệp" className="anh-thiep" />
						</div>
						<p className="chu-thich">Chạm vào các mục phía trên để xem thêm về ngày hôm ấy.</p>
					</section>
				)}

				{/* ===== VỀ MÌNH ===== */}
				{tab === 'vemink' && (
					<section className="mo-ra the">
						<h2 className="tieu-de-muc">Đôi lời</h2>
						<p className="doan">
							Mình là <strong>{HO_TEN}</strong>, sinh viên Đại học Bách khoa Hà Nội. Sau những năm
							tháng học tập và rèn luyện, mình sắp khép lại chặng đường đại học để bước sang một
							hành trình mới. Đây là cột mốc mình chờ rất lâu, và nó sẽ trọn vẹn hơn nhiều nếu có
							bạn ở đó.
						</p>

						<div className="vach-vang" />

						<h2 className="tieu-de-muc">Lời cảm ơn</h2>
						<p className="doan">
							Cảm ơn thầy cô đã kiên nhẫn với một sinh viên còn nhiều thiếu sót. Cảm ơn bố mẹ đã
							không hỏi &quot;bao giờ ra trường&quot; vào những lúc mình mệt nhất. Cảm ơn bạn bè đã
							cùng thức, cùng trượt môn, cùng làm lại và cùng đi tới đây. Tấm bằng này có phần của
							tất cả mọi người.
						</p>
					</section>
				)}

				{/* ===== HÀNH TRÌNH ===== */}
				{tab === 'hanhtrinh' && (
					<section className="mo-ra the">
						<h2 className="tieu-de-muc">Chặng đường ở Bách Khoa</h2>
						<ol className="doc-thoi-gian">
							{CHANG_DUONG.map((m, i) => (
								<li key={m.nam} className={`moc ${moc === i ? 'mo' : ''}`}>
									<button className="moc-nut" onClick={() => setMoc(moc === i ? -1 : i)}>
										<span className="moc-nam">{m.nam}</span>
										<span className="moc-ten">{m.ten}</span>
										<span className="moc-dau" aria-hidden="true" />
									</button>
									<div className="moc-than">
										<p>{m.ke}</p>
									</div>
								</li>
							))}
						</ol>
					</section>
				)}

				{/* ===== BUỔI LỄ ===== */}
				{tab === 'buoile' && (
					<section className="mo-ra the">
						<h2 className="tieu-de-muc">Thông tin buổi lễ</h2>
						<dl className="thong-tin">
							<div>
								<dt>Thời gian</dt>
								<dd>10h00 – 12h00, Chủ nhật ngày 27 tháng 9 năm 2026</dd>
							</div>
							<div>
								<dt>Địa điểm</dt>
								<dd>
									Đại học Bách khoa Hà Nội
									<br />
									{DIA_CHI}
								</dd>
							</div>
							<div>
								<dt>Liên hệ</dt>
								<dd>
									{HO_TEN} — {SDT_LIEN_HE}
								</dd>
							</div>
							<div>
								<dt>Trang phục</dt>
								<dd>Thoải mái, lịch sự. Nhớ mang theo máy ảnh giúp mình nhé.</dd>
							</div>
						</dl>
						<a className="nut vien" href={MAP_URL} target="_blank" rel="noreferrer">
							Mở chỉ đường
						</a>
					</section>
				)}

				{/* ===== SỔ LƯU BÚT ===== */}
				{tab === 'luubut' && (
					<section className="mo-ra the">
						<h2 className="tieu-de-muc">Sổ lưu bút</h2>

						{!done ? (
							<form onSubmit={handleSubmit} className="bieu-mau">
								<label>
									<span className="nhan-o">Họ và tên</span>
									<input
										type="text"
										name="hoTen"
										value={form.hoTen}
										onChange={handleChange}
										placeholder="Tên bạn muốn mình ghi trên danh sách"
										required
									/>
								</label>

								<label>
									<span className="nhan-o">Lời chúc</span>
									<textarea
										name="camNhan"
										value={form.camNhan}
										onChange={handleChange}
										rows={5}
										placeholder="Viết vài dòng cho mình nhé…"
									/>
								</label>

								{error && <p className="loi">{error}</p>}

								<button type="submit" disabled={submitting} className="nut chinh">
									{submitting ? 'Đang gửi…' : 'Xác nhận tham dự'}
								</button>
							</form>
						) : (
							<div className="xong">
								<div className="mu" aria-hidden="true">🎓</div>
								<h3>Đã ghi tên bạn vào danh sách</h3>
								<p>Hẹn gặp bạn ngày 27/9 nhé.</p>
								<button
									className="nut vien"
									onClick={() => {
										setDone(false)
										setForm({ hoTen: '', camNhan: '' })
									}}
								>
									Ghi tên người khác
								</button>
							</div>
						)}

						{loiChuc.length > 0 && (
							<div className="tuong-chuc">
								<h3 className="tieu-de-phu">Lời chúc vừa gửi</h3>
								<ul>
									{loiChuc.map((l, i) => (
										<li key={i} className="manh-giay">
											<p className="chuc">{l.chuc}</p>
											<p className="ky">— {l.ten}</p>
										</li>
									))}
								</ul>
							</div>
						)}
					</section>
				)}
			</main>

			<footer className="chan">
				<p className="chan-ten">{HO_TEN}</p>
				<p>Trân trọng ♡</p>
			</footer>
		</div>
	)
}