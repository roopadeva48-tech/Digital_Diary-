import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSlogan = true,
  className = '',
  onClick,
}) => {
  // Dimensions mapping
  const dimMap = {
    sm: { width: 140, height: 110, fontSize: 13, bookScale: 0.65 },
    md: { width: 220, height: 175, fontSize: 18, bookScale: 1 },
    lg: { width: 280, height: 220, fontSize: 22, bookScale: 1.25 },
    xl: { width: 340, height: 260, fontSize: 26, bookScale: 1.5 },
  };

  const current = dimMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 300 240"
        width={current.width}
        height={current.height}
        className="overflow-visible drop-shadow-sm"
      >
        <defs>
          {/* Path for curved text AURAPAGES */}
          <path
            id="auraTextPath"
            d="M 35 125 A 130 110 0 0 1 265 125"
            fill="none"
          />
          {/* Drop shadow for book */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#784728" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Outer Circular Medallion Background */}
        <ellipse cx="150" cy="130" rx="72" ry="72" fill="#784524" />

        {/* 3 Sparkle Stars */}
        <g fill="#FAF6F0">
          {/* Center Star */}
          <path d="M 150 78 Q 150 87 159 87 Q 150 87 150 96 Q 150 87 141 87 Q 150 87 150 78 Z" />
          {/* Left Star */}
          <path d="M 125 90 Q 125 95 130 95 Q 125 95 125 100 Q 125 95 120 95 Q 125 95 125 90 Z" transform="scale(0.8) translate(30, 20)" />
          {/* Right Star */}
          <path d="M 175 90 Q 175 95 180 95 Q 175 95 175 100 Q 175 95 170 95 Q 175 95 175 90 Z" transform="scale(0.8) translate(45, 20)" />
        </g>

        {/* Laurel / Foliage Sprigs on sides */}
        {/* Left foliage */}
        <g stroke="#784524" fill="#8E5632" strokeWidth="1.5">
          <path d="M 100 175 C 75 165 55 175 40 160 C 55 150 75 155 85 165 Z" fill="#8E5632" />
          <path d="M 88 165 C 65 140 45 150 35 135 C 52 130 75 142 80 152 Z" fill="#8E5632" />
          <path d="M 95 172 Q 70 170 45 155" fill="none" stroke="#784524" strokeWidth="2.5" />
        </g>

        {/* Right foliage */}
        <g stroke="#784524" fill="#8E5632" strokeWidth="1.5">
          <path d="M 200 175 C 225 165 245 175 260 160 C 245 150 225 155 215 165 Z" fill="#8E5632" />
          <path d="M 212 165 C 235 140 255 150 265 135 C 248 130 225 142 220 152 Z" fill="#8E5632" />
          <path d="M 205 172 Q 230 170 255 155" fill="none" stroke="#784524" strokeWidth="2.5" />
        </g>

        {/* Open Book Graphic */}
        <g filter="url(#softGlow)" transform="translate(0, 5)">
          {/* Book cover back edge */}
          <path
            d="M 90 105 Q 150 120 150 120 Q 150 120 210 105 L 212 188 Q 150 198 150 198 Q 150 198 88 188 Z"
            fill="#B57B4A"
          />

          {/* Book outer pages layer */}
          <path
            d="M 93 103 Q 150 117 150 117 Q 150 117 207 103 L 208 183 Q 150 193 150 193 Q 150 193 92 183 Z"
            fill="#EAD0B3"
          />

          {/* Left Page (Soft Cream) */}
          <path
            d="M 97 101 Q 150 115 150 115 L 150 179 Q 97 175 97 175 Z"
            fill="#FAF3E6"
            stroke="#D8BD9E"
            strokeWidth="0.8"
          />

          {/* Right Page (Soft Cream) */}
          <path
            d="M 150 115 Q 150 115 203 101 L 203 175 Q 150 179 150 179 Z"
            fill="#F6EBD9"
            stroke="#D8BD9E"
            strokeWidth="0.8"
          />

          {/* Spine center shadow */}
          <path d="M 149 115 L 149 180" stroke="#784524" strokeWidth="1.2" opacity="0.35" />
        </g>

        {/* Bottom Banner Ribbon */}
        <g transform="translate(0, 10)">
          {/* Ribbon ends / tails */}
          <path
            d="M 45 185 L 60 172 L 78 182 L 68 198 L 45 190 Z"
            fill="#9C5E35"
          />
          <path
            d="M 255 185 L 240 172 L 222 182 L 232 198 L 255 190 Z"
            fill="#9C5E35"
          />

          {/* Ribbon front arch */}
          <path
            d="M 55 182 Q 150 206 245 182 L 240 198 Q 150 222 60 198 Z"
            fill="#C9864E"
          />

          {/* Ribbon text */}
          <text
            x="150"
            y="200"
            textAnchor="middle"
            fill="#FAF6F0"
            fontSize="10.5"
            fontWeight="bold"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            letterSpacing="2.5"
          >
            DIGITAL SCRAPBOOK
          </text>
        </g>

        {/* Arched Top Text: AURAPAGES */}
        <text
          fill="#C47D42"
          fontSize="31"
          fontWeight="900"
          fontFamily="'Playfair Display', serif"
          letterSpacing="8"
          style={{ textShadow: '2px 2px 0px #F5E5D3' }}
        >
          <textPath
            href="#auraTextPath"
            startOffset="50%"
            textAnchor="middle"
          >
            AURAPAGES
          </textPath>
        </text>
      </svg>

      {showSlogan && (
        <p className="mt-1 text-xs sm:text-sm tracking-widest text-[#7C5A3E] font-serif-display uppercase opacity-85 text-center">
          A Sanctuary for Your Memories
        </p>
      )}
    </div>
  );
};
