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
        <g transform="translate(-44 10)">
          <g className="zoe-leg zoe-leg-left">
            <path
              d="M-38 -12 C-47 32 -45 93 -35 139 C-16 152 14 152 34 139 C43 92 45 35 38 -12 C15 -24 -16 -24 -38 -12Z"
              fill="url(#zoe-pants)"
              className="zoe-outline"
            />
            <path d="M-30 17 Q0 5 31 17" className="zoe-detail" opacity=".55" />
            <rect
              x="-46"
              y="38"
              width="45"
              height="57"
              rx="11"
              fill="#842987"
              stroke="#4e214b"
              strokeWidth="3"
              transform="rotate(4 -23 66)"
            />
            <path d="M-36 50 H-9" stroke="#eb75d9" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(-21 69)">
              <circle r="14" fill="#ffd928" stroke="#8b5610" strokeWidth="3" />
              <circle cx="-5" cy="-3" r="2.2" fill="#4b2c13" />
              <circle cx="5" cy="-3" r="2.2" fill="#4b2c13" />
              <path d="M-7 4 Q0 10 7 4" fill="none" stroke="#4b2c13" strokeWidth="2.4" strokeLinecap="round" />
            </g>
            <g transform="translate(0 132)">
              <path
                d="M-34 -5 C-38 36 -36 99 -29 143 C-12 154 12 154 29 143 C36 99 37 36 33 -5 C14 -16 -15 -16 -34 -5Z"
                fill="url(#zoe-pants-dark)"
                className="zoe-outline"
              />
              <path d="M-26 23 Q0 12 26 23 M-24 103 Q0 116 25 103" className="zoe-detail" opacity=".4" />
              <path d="M-27 138 Q0 151 27 138" fill="none" stroke="#e45acc" strokeWidth="5" />
              <g transform="translate(0 139)">
                <path
                  d="M-31 -7 C-34 13 -44 37 -55 49 C-63 60 -57 74 -42 77 H38 C56 76 62 65 54 53 C44 41 27 31 22 -5 C6 -15 -15 -15 -31 -7Z"
                  fill="url(#zoe-shoe)"
                  className="zoe-outline"
                />
                <path d="M-47 54 Q0 70 50 52" fill="none" stroke="#ff4eae" strokeWidth="9" strokeLinecap="round" />
                <path d="M-25 1 L13 37 L27 7" fill="url(#zoe-teal)" stroke="#178ea7" strokeWidth="3" strokeLinejoin="round" />
                <path d="M-16 14 H15 M-11 24 H20 M-4 34 H25" stroke="#e13c9e" strokeWidth="3" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        <g transform="translate(44 10)">
          <g className="zoe-leg zoe-leg-right">
            <path
              d="M-38 -12 C-45 35 -43 92 -34 139 C-15 152 15 152 34 139 C44 93 46 33 39 -12 C16 -24 -15 -24 -38 -12Z"
              fill="url(#zoe-pants)"
              className="zoe-outline"
            />
            <path d="M-30 17 Q0 5 31 17" className="zoe-detail" opacity=".55" />
            <rect
              x="3"
              y="40"
              width="45"
              height="59"
              rx="11"
              fill="#842987"
              stroke="#4e214b"
              strokeWidth="3"
              transform="rotate(-4 25 69)"
            />
            <path d="M11 52 H39" stroke="#eb75d9" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(0 132)">
              <path
                d="M-33 -5 C-37 37 -35 98 -29 143 C-12 154 11 154 28 143 C35 101 37 35 34 -5 C15 -16 -15 -16 -33 -5Z"
                fill="url(#zoe-pants-dark)"
                className="zoe-outline"
              />
              <path d="M-25 23 Q0 12 26 23 M-24 103 Q0 116 25 103" className="zoe-detail" opacity=".4" />
              <path d="M-27 138 Q0 151 27 138" fill="none" stroke="#e45acc" strokeWidth="5" />
              <g transform="translate(0 139)">
                <path
                  d="M-22 -5 C-27 31 -44 41 -54 54 C-61 65 -55 76 -38 77 H43 C58 74 63 60 55 49 C44 37 34 13 31 -7 C15 -15 -6 -15 -22 -5Z"
                  fill="url(#zoe-shoe)"
                  className="zoe-outline"
                />
                <path d="M-49 52 Q0 69 48 54" fill="none" stroke="#ff4eae" strokeWidth="9" strokeLinecap="round" />
                <path d="M-27 7 L-13 37 L25 1" fill="url(#zoe-teal)" stroke="#178ea7" strokeWidth="3" strokeLinejoin="round" />
                <path d="M-25 14 H6 M-20 24 H11 M-15 34 H14" stroke="#e13c9e" strokeWidth="3" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        <g transform="translate(-84 -112)">
          <g className="zoe-arm zoe-arm-left">
            <path
              d="M-25 -7 C-42 15 -43 54 -34 91 C-27 116 -14 132 2 132 C20 128 31 108 35 84 C40 49 37 10 24 -8 C8 -19 -10 -19 -25 -7Z"
              fill="url(#zoe-hoodie)"
              className="zoe-outline"
            />
            <path d="M-29 30 Q0 14 30 29" className="zoe-detail" opacity=".45" />
            <path d="M-32 80 Q0 66 34 79" fill="none" stroke="#2cc8d8" strokeWidth="8" />
            <g transform="translate(1 119)">
              <path
                d="M-21 8 C-26 24 -22 45 -10 58 C-2 68 11 68 19 58 C26 49 25 36 21 23 L15 7 C12 0 5 3 7 11 L9 24 L4 4 C2 -3 -5 -1 -4 7 L-2 24 L-9 7 C-12 0 -19 3 -15 11 L-10 28 L-17 15 C-22 8 -27 14 -21 24Z"
                fill="url(#zoe-skin)"
                stroke="#a65539"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>

        <path
          d="M-72 -116 C-70 -161 -43 -179 0 -179 C44 -179 70 -159 72 -116 L48 -91 H-48Z"
          fill="#c5b5d3"
          stroke="#4e214b"
          strokeWidth="4"
        />
        <path
          d="M-73 -126 C-94 -95 -91 -37 -72 8 C-33 29 33 29 72 8 C92 -39 94 -95 73 -126 C37 -145 -37 -145 -73 -126Z"
          fill="url(#zoe-hoodie)"
          className="zoe-outline"
        />
        <path d="M-70 -80 Q0 -60 70 -80 M-62 2 Q0 17 62 2" className="zoe-detail" opacity=".45" />
        <path d="M-73 -108 L-53 -98" stroke="#2ed8ef" strokeWidth="13" strokeLinecap="round" />
        <path d="M73 -108 L53 -98" stroke="#ff4eb3" strokeWidth="13" strokeLinecap="round" />
        <path d="M-34 7 Q0 20 34 7" fill="none" stroke="#a693b8" strokeWidth="8" strokeLinecap="round" />
        <path d="M-48 14 Q0 34 48 14" fill="none" stroke="#4e214b" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M0 -95 L11 -70 L39 -68 L18 -50 L25 -22 L0 -37 L-25 -22 L-18 -50 L-39 -68 L-11 -70Z"
          fill="url(#zoe-pink)"
          stroke="#7d246d"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M-19 -141 Q-10 -121 -9 -99 M19 -141 Q10 -121 9 -99" fill="none" stroke="#7a627f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="-19" cy="-142" r="5" fill="#2ed8ef" />
        <circle cx="19" cy="-142" r="5" fill="#ff4eb3" />

        <g transform="translate(84 -112)">
          <g className="zoe-arm zoe-arm-right">
            <path
              d="M-24 -8 C-38 10 -41 49 -35 84 C-31 108 -20 128 -2 132 C15 132 28 116 35 91 C44 54 42 15 25 -7 C10 -19 -8 -19 -24 -8Z"
              fill="url(#zoe-hoodie)"
              className="zoe-outline"
            />
            <path d="M-30 29 Q0 14 29 30" className="zoe-detail" opacity=".45" />
            <path d="M-34 79 Q0 66 32 80" fill="none" stroke="#ff4eb3" strokeWidth="8" />
            <g transform="translate(-1 119)">
              <path
                d="M-22 20 C-26 8 -16 2 -8 10 L-3 22 L-7 -16 C-8 -24 2 -26 4 -18 L8 10 L14 -13 C16 -22 27 -19 25 -10 L20 19 C27 28 27 44 17 56 C8 68 -9 68 -19 57 C-28 48 -29 33 -22 20Z"
                fill="url(#zoe-skin)"
                stroke="#a65539"
                strokeWidth="3"
                strokeLinejoin="round"
              />
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
