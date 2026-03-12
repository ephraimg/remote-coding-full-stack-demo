import { QRCodeSVG } from 'qrcode.react'
import XRPIcon from './icons/XRPIcon'

interface QRCodeWithIconProps {
  value: string;
  size?: number;
}

export default function QRCodeWithIcon({ value, size = 200 }: QRCodeWithIconProps) {
  const iconSize = 48

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* QR Code with high error correction */}
      <QRCodeSVG
        value={value}
        size={size}
        level="H"  // High error correction allows icon overlay
        style={{
          height: 'auto',
          maxWidth: '100%',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: 'white',
        }}
      />

      {/* White circle background for icon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: iconSize + 8,
          height: iconSize + 8,
          borderRadius: '50%',
          backgroundColor: 'white',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* XRP icon overlay */}
        <XRPIcon size={iconSize} />
      </div>
    </div>
  )
}
