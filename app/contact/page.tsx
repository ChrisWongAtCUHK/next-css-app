import Link from 'next/link'

export default function ContactPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>聯絡我們</h1>
      <p>這是我的第一個 Next.js 分頁！</p>
      <Link href='/' style={{ color: 'blue', textDecoration: 'underline' }}>
        回到首頁
      </Link>
    </div>
  )
}
