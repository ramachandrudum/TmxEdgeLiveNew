import type { Customer } from '../data/dashboard'

function BrandMark({ id }: { id: string }) {
  switch (id) {
    case 'coke':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" fill="#E4002B" />
          <path
            d="M5 20c2.5-6 6-7 7.5-1.5C14 24 17.5 25 19 19.5 20.5 14 24 15 25.5 20.5 27 26 30 26 32.5 21c.8-1.6 1.8-2.2 2.5-2.2"
            stroke="#fff"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'pepsico':
      return (
        <svg viewBox="0 0 40 40">
          <path d="M20 0a20 20 0 0 1 0 40 20 20 0 0 1 0-40z" fill="#004B93" />
          <path d="M20 0a20 20 0 0 0 0 40c6-13 6-27 0-40z" fill="#E32934" />
          <circle cx="20" cy="20" r="20" fill="none" stroke="#fff" strokeWidth="2.5" />
        </svg>
      )
    case 'unilever':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" fill="#1F36C7" />
          <path
            d="M13.5 9v13.5a6.5 6.5 0 0 0 13 0V9"
            stroke="#fff"
            strokeWidth="4.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'pg':
      return (
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="20" fill="#003DA5" />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="700"
            fontSize="15"
            fill="#fff"
          >
            P&G
          </text>
        </svg>
      )
    case 'danone':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" fill="#0B7DB8" />
          <path
            d="M8 14q3-5 6 0 3 5 6 0 3-5 6 0 3 5 6 0"
            stroke="#fff"
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M8 24q3-5 6 0 3 5 6 0 3-5 6 0 3 5 6 0"
            stroke="#fff"
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'mondelez':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" rx="0" fill="#0B5AA2" />
          <circle cx="20" cy="18" r="9" fill="#F7941D" />
          <text
            x="20"
            y="22.5"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="13"
            fill="#0B5AA2"
          >
            M
          </text>
        </svg>
      )
    case 'colgate':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" rx="6" fill="#E60000" />
          <rect x="8" y="6" width="5" height="4" rx="2.5" fill="#fff" />
          <rect x="27" y="30" width="5" height="4" rx="2.5" fill="#fff" />
          <text
            x="20"
            y="27"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="18"
            fill="#fff"
          >
            C
          </text>
        </svg>
      )
    case 'kraftheinz':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" rx="4" fill="#fff" />
          <rect width="40" height="40" rx="4" fill="none" stroke="#0033A0" strokeWidth="3" />
          <rect x="7" y="7" width="5.5" height="26" fill="#0033A0" />
          <path d="M12.5 20 27 7v8L17.5 20 27 32v8L12.5 27z" fill="#EF4136" />
        </svg>
      )
    case 'loreal':
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" rx="0" fill="#1B1B1B" />
          <text
            x="20"
            y="29"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="22"
            fill="#F6E27A"
          >
            L'
          </text>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 40 40">
          <rect width="40" height="40" rx="8" fill="#6B7280" />
          <text
            x="20"
            y="27"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="700"
            fontSize="16"
            fill="#fff"
          >
            {id[0]?.toUpperCase()}
          </text>
        </svg>
      )
  }
}

export default function CustomerLogo({
  customer,
  size = 'sm',
}: {
  customer: Customer
  size?: 'sm' | 'lg'
}) {
  const cls = size === 'lg' ? 'w-9 h-9' : 'w-7 h-7'
  if (customer.logo?.startsWith('/')) {
    return (
      <img src={customer.logo} alt={customer.name} className={`${cls} object-contain`} />
    )
  }
  return (
    <div className={`${cls} overflow-hidden rounded-md shrink-0`}>
      <BrandMark id={customer.id} />
    </div>
  )
}