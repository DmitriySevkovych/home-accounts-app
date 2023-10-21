import Image from 'next/image'
import React from 'react'

const OverlayImage: React.FC = () => {
    return (
        <div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full opacity-30 mix-blend-overlay">
            <Image
                src="/images/overlay_accent.png"
                alt="overlay"
                fill
                style={{ objectFit: 'cover' }}
            />
        </div>
    )
}

export default OverlayImage
