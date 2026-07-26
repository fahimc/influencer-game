export default function ZoeCharacter() {
  return (
    <svg
      className="zoe-vector"
      viewBox="0 0 420 720"
      role="img"
      aria-labelledby="zoe-title zoe-description"
    >
      <title id="zoe-title">Zoe, the StarSpark performer</title>
      <desc id="zoe-description">
        A cheerful vector character with brown space buns, a white star hoodie,
        magenta cargo pants, and teal and pink sneakers.
      </desc>
      <defs>
        <linearGradient id="zoe-skin" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffd7b4" />
          <stop offset="0.58" stopColor="#efa678" />
          <stop offset="1" stopColor="#d98256" />
        </linearGradient>
        <linearGradient id="zoe-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a3e1b" />
          <stop offset="0.42" stopColor="#4b1c10" />
          <stop offset="1" stopColor="#210a08" />
        </linearGradient>
        <linearGradient id="zoe-hoodie" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.62" stopColor="#f3edf8" />
          <stop offset="1" stopColor="#cfc0dc" />
        </linearGradient>
        <linearGradient id="zoe-pants" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#db47c4" />
          <stop offset="0.48" stopColor="#9b30aa" />
          <stop offset="1" stopColor="#552378" />
        </linearGradient>
        <linearGradient id="zoe-pants-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a931ae" />
          <stop offset="1" stopColor="#4d1e70" />
        </linearGradient>
        <linearGradient id="zoe-shoe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f2eaf7" />
          <stop offset="1" stopColor="#d1c1dc" />
        </linearGradient>
        <linearGradient id="zoe-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#72f0e9" />
          <stop offset="1" stopColor="#18a7c2" />
        </linearGradient>
        <linearGradient id="zoe-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff76ce" />
          <stop offset="1" stopColor="#d92d91" />
        </linearGradient>
        <linearGradient id="zoe-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff77a" />
          <stop offset="0.5" stopColor="#ffc62f" />
          <stop offset="1" stopColor="#e47c14" />
        </linearGradient>
        <filter id="zoe-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="7"
            floodColor="#20082f"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      <g className="zoe-rig-root" transform="translate(210 365)" filter="url(#zoe-shadow)">
        <g transform="translate(-35 19)">
          <g className="zoe-leg zoe-leg-left">
            <path
              d="M-35 4 C-43 48 -46 101 -40 151 C-37 187 -43 227 -31 258 C-18 271 16 271 29 258 C38 226 33 186 31 150 C35 99 36 47 28 4 C9 -7 -16 -7 -35 4Z"
              fill="url(#zoe-pants)"
              className="zoe-outline"
            />
            <path d="M-31 29 Q-3 17 26 27 M-34 164 Q-3 177 29 163 M-31 224 Q-2 211 28 224" className="zoe-detail" opacity=".42" />
            <path
              d="M-43 79 Q-20 67 3 78 L1 137 Q-19 148 -40 137Z"
              fill="#842987"
              stroke="#4e214b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M-37 91 Q-18 84 -1 90" stroke="#eb75d9" strokeWidth="3" strokeLinecap="round" fill="none" />
            <g transform="translate(-21 113)">
              <circle r="14" fill="#ffd928" stroke="#8b5610" strokeWidth="3" />
              <circle cx="-5" cy="-3" r="2.2" fill="#4b2c13" />
              <circle cx="5" cy="-3" r="2.2" fill="#4b2c13" />
              <path d="M-7 4 Q0 10 7 4" fill="none" stroke="#4b2c13" strokeWidth="2.4" strokeLinecap="round" />
            </g>
            <path d="M-29 251 Q-2 262 27 251" fill="none" stroke="#e45acc" strokeWidth="8" strokeLinecap="round" />
            <g transform="translate(-2 255)">
              <path
                d="M-27 -5 C-30 15 -36 31 -48 46 C-56 56 -52 70 -38 74 H39 C54 73 59 61 52 50 C43 38 25 29 22 -5 C7 -13 -12 -13 -27 -5Z"
                fill="url(#zoe-shoe)"
                className="zoe-outline"
              />
              <path d="M-43 52 Q1 65 48 50" fill="none" stroke="#ff4eae" strokeWidth="8" strokeLinecap="round" />
              <path d="M-23 1 L11 34 L26 6" fill="url(#zoe-teal)" stroke="#178ea7" strokeWidth="3" strokeLinejoin="round" />
              <path d="M-16 11 H13 M-12 20 H18 M-7 29 H21" stroke="#e13c9e" strokeWidth="3" strokeLinecap="round" />
              <path d="M-24 38 Q2 47 31 37" fill="none" stroke="#baa8c7" strokeWidth="3" />
            </g>
          </g>
        </g>

        <g transform="translate(35 19)">
          <g className="zoe-leg zoe-leg-right">
            <path
              d="M-28 4 C-36 47 -35 99 -31 150 C-33 186 -38 226 -29 258 C-16 271 18 271 31 258 C43 227 37 187 40 151 C46 101 43 48 35 4 C16 -7 -9 -7 -28 4Z"
              fill="url(#zoe-pants)"
              className="zoe-outline"
            />
            <path d="M-26 27 Q3 17 31 29 M-29 163 Q3 177 34 164 M-28 224 Q2 211 31 224" className="zoe-detail" opacity=".42" />
            <path
              d="M-3 78 Q20 67 43 79 L40 137 Q19 148 -1 137Z"
              fill="#842987"
              stroke="#4e214b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M1 90 Q18 84 37 91" stroke="#eb75d9" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M-27 251 Q2 262 29 251" fill="none" stroke="#e45acc" strokeWidth="8" strokeLinecap="round" />
            <g transform="translate(2 255)">
              <path
                d="M-22 -5 C-25 29 -43 38 -52 50 C-59 61 -54 73 -39 74 H38 C52 70 56 56 48 46 C36 31 30 15 27 -5 C12 -13 -7 -13 -22 -5Z"
                fill="url(#zoe-shoe)"
                className="zoe-outline"
              />
              <path d="M-48 50 Q-1 65 43 52" fill="none" stroke="#ff4eae" strokeWidth="8" strokeLinecap="round" />
              <path d="M-26 6 L-11 34 L23 1" fill="url(#zoe-teal)" stroke="#178ea7" strokeWidth="3" strokeLinejoin="round" />
              <path d="M-21 11 H8 M-18 20 H12 M-14 29 H17" stroke="#e13c9e" strokeWidth="3" strokeLinecap="round" />
              <path d="M-31 37 Q-2 47 24 38" fill="none" stroke="#baa8c7" strokeWidth="3" />
            </g>
          </g>
        </g>

        <path
          d="M-55 -18 C-59 -8 -61 2 -60 14 C-35 29 35 29 60 14 C61 2 59 -8 55 -18Z"
          fill="url(#zoe-skin)"
          stroke="#a65539"
          strokeWidth="3"
        />
        <path d="M0 6 Q-3 10 0 13" fill="none" stroke="#a65539" strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M-66 10 Q0 -3 66 10 L62 43 Q0 53 -62 43Z"
          fill="url(#zoe-pants)"
          className="zoe-outline"
        />
        <path d="M-64 22 Q0 10 64 22" fill="none" stroke="#e969d1" strokeWidth="4" />
        <circle cx="0" cy="20" r="8" fill="#ded2e7" stroke="#5c245b" strokeWidth="3" />
        <path d="M-44 13 V38 M44 13 V38 M-17 12 V39 M17 12 V39" fill="none" stroke="#63206e" strokeWidth="3" />
        <path d="M-57 40 C-53 57 -44 67 -31 74" fill="none" stroke="#d4d0dd" strokeWidth="4" strokeLinecap="round" />
        <path d="M-56 42 C-48 56 -40 66 -29 73" fill="none" stroke="#5c5063" strokeWidth="7" strokeDasharray="2 8" strokeLinecap="round" />

        <g transform="translate(-78 -120)">
          <g className="zoe-arm zoe-arm-left">
            <path
              d="M-12 -8 C-35 -2 -44 26 -45 56 C-47 86 -38 110 -26 126 C-17 137 2 137 12 126 C25 110 31 84 28 57 C26 27 18 -2 6 -9 C0 -13 -6 -12 -12 -8Z"
              fill="url(#zoe-hoodie)"
              className="zoe-outline"
            />
            <path d="M-38 32 Q-7 17 23 31 M-37 88 Q-6 76 24 89" className="zoe-detail" opacity=".38" />
            <path d="M-29 113 Q-7 103 16 114 L12 133 Q-8 142 -27 131Z" fill="#e7ddea" stroke="#a593b3" strokeWidth="3" />
            <g transform="translate(-7 128)">
              <path
                d="M-14 -3 C-17 11 -19 28 -18 43 C-18 55 -12 63 -6 60 C-1 58 0 50 -1 43 L0 54 C1 63 8 65 11 58 C13 53 10 43 10 36 L13 40 C17 46 24 43 24 37 C24 32 18 26 15 20 L12 10 C9 0 4 -5 -14 -3Z"
                fill="url(#zoe-skin)"
                stroke="#a65539"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path d="M-11 15 L-11 48 M-5 14 L-4 52 M2 14 L4 51" fill="none" stroke="#bd6c51" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <path
          d="M-68 -116 C-65 -153 -42 -170 0 -170 C42 -170 65 -153 68 -116 L48 -94 H-48Z"
          fill="#c5b5d3"
          stroke="#4e214b"
          strokeWidth="4"
        />
        <path
          d="M-68 -125 C-81 -104 -79 -57 -63 -20 C-34 -8 34 -8 63 -20 C79 -57 81 -104 68 -125 C36 -141 -36 -141 -68 -125Z"
          fill="url(#zoe-hoodie)"
          className="zoe-outline"
        />
        <path d="M-64 -83 Q0 -65 64 -83 M-57 -24 Q0 -14 57 -24" className="zoe-detail" opacity=".38" />
        <text x="0" y="-65" textAnchor="middle" fontSize="30" fontWeight="1000" fill="#f43ba5" stroke="white" strokeWidth="1.5" paintOrder="stroke">BE</text>
        <text x="0" y="-36" textAnchor="middle" fontSize="29" fontWeight="1000" fill="#7947dc" stroke="white" strokeWidth="1.5" paintOrder="stroke">YOU!</text>
        <path d="M-42 -84 l-8 -8 M44 -56 l10 -4 M-42 -47 l-10 7 M39 -89 l7 -9" fill="none" stroke="#29cbd8" strokeWidth="5" strokeLinecap="round" />
        <path d="M-17 -135 Q-10 -113 -8 -92 M17 -135 Q10 -113 8 -92" fill="none" stroke="#7a627f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="-17" cy="-136" r="5" fill="#aee72b" />
        <circle cx="17" cy="-136" r="5" fill="#ff4eb3" />

        <g transform="translate(78 -120)">
          <g className="zoe-arm zoe-arm-right">
            <path
              d="M-6 -9 C-18 -2 -26 27 -28 57 C-31 84 -25 110 -12 126 C-2 137 17 137 26 126 C38 110 47 86 45 56 C44 26 35 -2 12 -8 C6 -12 0 -13 -6 -9Z"
              fill="url(#zoe-hoodie)"
              className="zoe-outline"
            />
            <path d="M-23 31 Q7 17 38 32 M-24 89 Q6 76 37 88" className="zoe-detail" opacity=".38" />
            <path d="M-16 114 Q7 103 29 113 L27 131 Q8 142 -12 133Z" fill="#e7ddea" stroke="#a593b3" strokeWidth="3" />
            <g transform="translate(7 128)">
              <g transform="scale(-1 1)">
                <path
                  d="M-14 -3 C-17 11 -19 28 -18 43 C-18 55 -12 63 -6 60 C-1 58 0 50 -1 43 L0 54 C1 63 8 65 11 58 C13 53 10 43 10 36 L13 40 C17 46 24 43 24 37 C24 32 18 26 15 20 L12 10 C9 0 4 -5 -14 -3Z"
                  fill="url(#zoe-skin)"
                  stroke="#a65539"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M-11 15 L-11 48 M-5 14 L-4 52 M2 14 L4 51" fill="none" stroke="#bd6c51" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        <rect x="-20" y="-178" width="40" height="42" rx="17" fill="url(#zoe-skin)" stroke="#a65539" strokeWidth="3" />

        <g transform="translate(0 -247)">
          <g className="zoe-head">
            <path
              d="M-74 22 C-92 -8 -84 -54 -54 -75 C-27 -95 20 -96 51 -77 C83 -58 93 -10 74 25 C68 -9 55 -34 33 -47 C10 -61 -24 -58 -46 -42 C-63 -29 -70 -8 -74 22Z"
              fill="url(#zoe-hair)"
              stroke="#4e214b"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <g className="zoe-bun zoe-bun-left">
              <path
                d="M-102 -71 C-105 -94 -88 -111 -68 -108 C-51 -117 -31 -103 -30 -84 C-19 -69 -29 -47 -47 -43 C-58 -31 -82 -36 -87 -50 C-97 -52 -103 -60 -102 -71Z"
                fill="url(#zoe-hair)"
                stroke="#4e214b"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M-91 -79 C-78 -99 -50 -99 -39 -79 C-31 -64 -46 -49 -62 -51 C-77 -53 -82 -68 -72 -77 C-63 -85 -48 -80 -48 -70"
                fill="none"
                stroke="#ad5425"
                strokeWidth="7"
                strokeLinecap="round"
                opacity=".72"
              />
            </g>
            <g className="zoe-bun zoe-bun-right">
              <path
                d="M102 -71 C105 -94 88 -111 68 -108 C51 -117 31 -103 30 -84 C19 -69 29 -47 47 -43 C58 -31 82 -36 87 -50 C97 -52 103 -60 102 -71Z"
                fill="url(#zoe-hair)"
                stroke="#4e214b"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M91 -79 C78 -99 50 -99 39 -79 C31 -64 46 -49 62 -51 C77 -53 82 -68 72 -77 C63 -85 48 -80 48 -70"
                fill="none"
                stroke="#ad5425"
                strokeWidth="7"
                strokeLinecap="round"
                opacity=".72"
              />
            </g>

            <ellipse cx="-66" cy="12" rx="12" ry="19" fill="#e99a6b" stroke="#a65539" strokeWidth="3" />
            <ellipse cx="66" cy="12" rx="12" ry="19" fill="#e99a6b" stroke="#a65539" strokeWidth="3" />
            <path
              d="M0 -58 C-42 -58 -65 -37 -66 -4 C-68 27 -56 59 -30 77 C-12 90 12 90 30 77 C56 59 68 27 66 -4 C65 -37 42 -58 0 -58Z"
              fill="url(#zoe-skin)"
              stroke="#a65539"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M-68 -13 C-65 -48 -38 -70 -5 -65 C10 -72 31 -65 45 -54 C60 -43 68 -27 68 -10 C54 -27 39 -35 20 -36 C3 -36 -10 -28 -19 -17 C-26 -34 -42 -37 -68 -13Z"
              fill="url(#zoe-hair)"
              stroke="#4e214b"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M-2 -64 C8 -53 9 -38 -1 -26 C13 -37 27 -43 44 -38"
              fill="none"
              stroke="#ad5425"
              strokeWidth="7"
              strokeLinecap="round"
              opacity=".78"
            />
            <path d="M-55 -25 Q-67 -7 -60 14 M56 -23 Q67 -6 60 14" fill="none" stroke="#4b1c10" strokeWidth="7" strokeLinecap="round" />

            <path d="M-50 -1 Q-30 -14 -10 -2" fill="none" stroke="#502514" strokeWidth="5" strokeLinecap="round" />
            <path d="M10 -2 Q30 -14 50 -1" fill="none" stroke="#502514" strokeWidth="5" strokeLinecap="round" />
            <path d="M-47 10 Q-53 4 -56 0 M47 10 Q53 4 56 0" fill="none" stroke="#502514" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="-30" cy="20" rx="18" ry="23" fill="white" stroke="#6f3a42" strokeWidth="3" />
            <ellipse cx="30" cy="20" rx="18" ry="23" fill="white" stroke="#6f3a42" strokeWidth="3" />
            <ellipse cx="-28" cy="22" rx="11" ry="15" fill="#6b371d" />
            <ellipse cx="28" cy="22" rx="11" ry="15" fill="#6b371d" />
            <ellipse cx="-27" cy="24" rx="6" ry="10" fill="#170c15" />
            <ellipse cx="27" cy="24" rx="6" ry="10" fill="#170c15" />
            <circle cx="-23" cy="17" r="4.5" fill="white" />
            <circle cx="31" cy="17" r="4.5" fill="white" />
            <circle cx="-31" cy="29" r="2" fill="#d89b76" opacity=".8" />
            <circle cx="23" cy="29" r="2" fill="#d89b76" opacity=".8" />
            <path d="M0 25 Q-4 36 2 37" fill="none" stroke="#bd6c51" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M-24 53 Q0 67 24 53 Q19 81 0 82 Q-19 81 -24 53Z" fill="#8f3151" stroke="#6c2744" strokeWidth="3" />
            <path d="M-15 56 Q0 62 15 56" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <path d="M-10 75 Q0 68 10 75" fill="none" stroke="#ff8caf" strokeWidth="5" strokeLinecap="round" />
            <circle cx="-49" cy="48" r="2.3" fill="#a45f4d" />
            <circle cx="-40" cy="51" r="1.8" fill="#a45f4d" />
            <circle cx="49" cy="48" r="2.3" fill="#a45f4d" />
            <circle cx="40" cy="51" r="1.8" fill="#a45f4d" />
            <ellipse cx="-42" cy="42" rx="11" ry="5" fill="#eb7e86" opacity=".24" />
            <ellipse cx="42" cy="42" rx="11" ry="5" fill="#eb7e86" opacity=".24" />
            <path d="M-67 34 Q-80 49 -66 60" fill="none" stroke="url(#zoe-gold)" strokeWidth="5" />
            <path d="M67 34 Q80 49 66 60" fill="none" stroke="url(#zoe-gold)" strokeWidth="5" />

            <g transform="translate(-58 -29) rotate(-14)">
              <path d="M0 -13 L4 -4 L14 -4 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4 L-4 -4Z" fill="#b8ff2c" stroke="#538900" strokeWidth="3" strokeLinejoin="round" />
            </g>
            <g transform="translate(51 -35) rotate(12)">
              <path d="M0 -10 L3 -3 L11 -3 L5 2 L7 9 L0 5 L-7 9 L-5 2 L-11 -3 L-3 -3Z" fill="#ff58bd" stroke="#9b276f" strokeWidth="3" strokeLinejoin="round" />
            </g>
          </g>
        </g>

        <path d="M-67 19 Q0 39 67 19" fill="none" stroke="#4e214b" strokeWidth="5" strokeLinecap="round" />
        <path d="M-18 18 V40 M18 18 V40" stroke="#f0a4e4" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
