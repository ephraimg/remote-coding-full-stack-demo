// Official XRP token icon from Ripple Design System
interface XRPIconProps {
  size?: number;
}

export default function XRPIcon({ size = 24 }: XRPIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 0C5.37256 0 0 5.37258 0 12C0 18.6274 5.37256 24 11.9999 24C18.6273 24 23.9999 18.6274 23.9999 12C24.0092 8.82665 22.7574 5.77959 20.5201 3.52915C18.2827 1.27871 15.243 0.0092338 12.0697 0H11.9999Z"
        fill="#23292F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.322 5H17.9004L14.0688 8.79043C12.908 9.93443 11.0438 9.93443 9.88302 8.79043L6.0543 5H3.63076L8.67223 9.98976C10.4986 11.7958 13.4575 11.7958 15.2825 9.98976L20.322 5ZM3.6 18.875H6.02322L9.88596 15.0538C11.0467 13.9098 12.911 13.9098 14.0717 15.0538L17.9331 18.875H20.3547L15.2825 13.8545C13.4562 12.0484 10.4972 12.0484 8.67223 13.8545L3.6 18.875Z"
        fill="white"
      />
    </svg>
  )
}
