import { memo } from "react";

export type RivalDesignId = "sunny" | "remy" | "luna" | "kiki";

function RivalCharacter({ design }: { design: RivalDesignId }) {
  if (design === "remy") {
    return (
      <svg className="rival-vector rival-remy" viewBox="0 0 420 720" role="img" aria-label="Remy Robot, a teal beat-box robot">
        <g className="rival-rig">
          <ellipse cx="210" cy="675" rx="116" ry="18" fill="#09051b" opacity=".35" />
          <path d="M210 93V57" stroke="#4d2f68" strokeWidth="14" strokeLinecap="round" />
          <circle cx="210" cy="43" r="18" fill="#ff5dbd" stroke="#fff" strokeWidth="6" />
          <rect x="100" y="84" width="220" height="190" rx="52" fill="#42e8df" stroke="#342059" strokeWidth="10" />
          <path d="M122 112Q210 70 298 112V145H122Z" fill="#147daf" opacity=".72" />
          <rect x="132" y="145" width="156" height="90" rx="30" fill="#19133d" />
          <rect x="154" y="171" width="39" height="25" rx="12" fill="#fff16d" />
          <rect x="227" y="171" width="39" height="25" rx="12" fill="#ff70c8" />
          <path d="M169 216H251" stroke="#72fff0" strokeWidth="9" strokeLinecap="round" strokeDasharray="12 11" />
          <circle cx="105" cy="170" r="25" fill="#ffb732" stroke="#342059" strokeWidth="8" />
          <circle cx="315" cy="170" r="25" fill="#ffb732" stroke="#342059" strokeWidth="8" />
          <path d="M139 276H281L309 451Q210 505 111 451Z" fill="#5964e9" stroke="#342059" strokeWidth="10" />
          <rect x="153" y="306" width="114" height="83" rx="19" fill="#211a50" stroke="#91fff1" strokeWidth="6" />
          <path d="M176 346h68M210 322v49" stroke="#ff66bf" strokeWidth="9" strokeLinecap="round" />
          <circle cx="164" cy="419" r="11" fill="#fff16d" />
          <circle cx="210" cy="419" r="11" fill="#5cffe8" />
          <circle cx="256" cy="419" r="11" fill="#ff6bc7" />
          <g className="rival-arm rival-arm-left">
            <path d="M119 300Q60 337 63 414" fill="none" stroke="#342059" strokeWidth="42" strokeLinecap="round" />
            <path d="M119 300Q60 337 63 414" fill="none" stroke="#48d8e0" strokeWidth="28" strokeLinecap="round" strokeDasharray="40 13" />
            <circle cx="61" cy="431" r="28" fill="#ffb732" stroke="#342059" strokeWidth="8" />
          </g>
          <g className="rival-arm rival-arm-right">
            <path d="M301 300Q360 337 357 414" fill="none" stroke="#342059" strokeWidth="42" strokeLinecap="round" />
            <path d="M301 300Q360 337 357 414" fill="none" stroke="#48d8e0" strokeWidth="28" strokeLinecap="round" strokeDasharray="40 13" />
            <circle cx="359" cy="431" r="28" fill="#ffb732" stroke="#342059" strokeWidth="8" />
          </g>
          <path d="M151 458L137 610" stroke="#342059" strokeWidth="70" strokeLinecap="round" />
          <path d="M151 458L137 610" stroke="#6f72ec" strokeWidth="52" strokeLinecap="round" />
          <path d="M269 458L283 610" stroke="#342059" strokeWidth="70" strokeLinecap="round" />
          <path d="M269 458L283 610" stroke="#6f72ec" strokeWidth="52" strokeLinecap="round" />
          <path d="M82 627Q137 590 190 631V667H76Q64 649 82 627Z" fill="#42e8df" stroke="#342059" strokeWidth="10" />
          <path d="M338 627Q283 590 230 631V667H344Q356 649 338 627Z" fill="#42e8df" stroke="#342059" strokeWidth="10" />
        </g>
      </svg>
    );
  }

  if (design === "luna") {
    return (
      <svg className="rival-vector rival-luna" viewBox="0 0 420 720" role="img" aria-label="Luna Loops, a moon-themed dancer with long blue braids">
        <g className="rival-rig">
          <ellipse cx="210" cy="676" rx="112" ry="17" fill="#09051b" opacity=".34" />
          <path d="M118 178Q72 252 102 470M302 178Q348 252 318 470" fill="none" stroke="#171037" strokeWidth="44" strokeLinecap="round" />
          <path d="M118 178Q72 252 102 470M302 178Q348 252 318 470" fill="none" stroke="#5948bd" strokeWidth="28" strokeLinecap="round" strokeDasharray="24 13" />
          <ellipse cx="210" cy="164" rx="94" ry="112" fill="#3f234b" stroke="#25153f" strokeWidth="9" />
          <ellipse cx="210" cy="175" rx="76" ry="91" fill="#8e543e" stroke="#4f2a37" strokeWidth="7" />
          <path d="M140 143Q210 47 281 143Q249 98 210 119Q170 96 140 143Z" fill="#191033" />
          <path d="M155 164Q178 145 195 166M225 166Q245 145 267 164" fill="none" stroke="#25142f" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="178" cy="181" rx="17" ry="24" fill="#fff" />
          <ellipse cx="242" cy="181" rx="17" ry="24" fill="#fff" />
          <circle cx="182" cy="185" r="10" fill="#6855d9" /><circle cx="246" cy="185" r="10" fill="#6855d9" />
          <path d="M177 222Q210 251 244 220" fill="#fff" stroke="#612e46" strokeWidth="6" strokeLinecap="round" />
          <path d="M124 287Q210 245 296 287L319 483Q210 549 101 483Z" fill="#322b79" stroke="#2b194e" strokeWidth="9" />
          <path d="M137 304Q210 272 283 304L270 395H150Z" fill="#806be8" />
          <path d="M210 288L228 335L279 338L239 370L251 419L210 390L169 419L181 370L141 338L192 335Z" fill="#fff07d" stroke="#cf8c32" strokeWidth="5" />
          <path d="M150 394Q210 427 270 394L332 541Q210 592 88 541Z" fill="#7467d9" stroke="#2b194e" strokeWidth="9" />
          <path d="M107 521Q210 555 313 521" fill="none" stroke="#76f5ed" strokeWidth="10" />
          <g className="rival-arm rival-arm-left">
            <path d="M128 300Q67 353 77 440" fill="none" stroke="#4f2a37" strokeWidth="38" strokeLinecap="round" />
            <path d="M128 300Q67 353 77 440" fill="none" stroke="#8e543e" strokeWidth="26" strokeLinecap="round" />
            <circle cx="80" cy="454" r="19" fill="#8e543e" stroke="#4f2a37" strokeWidth="7" />
          </g>
          <g className="rival-arm rival-arm-right">
            <path d="M292 300Q353 353 343 440" fill="none" stroke="#4f2a37" strokeWidth="38" strokeLinecap="round" />
            <path d="M292 300Q353 353 343 440" fill="none" stroke="#8e543e" strokeWidth="26" strokeLinecap="round" />
            <circle cx="340" cy="454" r="19" fill="#8e543e" stroke="#4f2a37" strokeWidth="7" />
          </g>
          <path d="M162 548L152 634M258 548L268 634" stroke="#4f2a37" strokeWidth="36" strokeLinecap="round" />
          <path d="M91 649Q152 615 199 650V677H84Q75 662 91 649ZM329 649Q268 615 221 650V677H336Q345 662 329 649Z" fill="#fff" stroke="#2b194e" strokeWidth="9" />
          <circle cx="132" cy="157" r="15" fill="none" stroke="#fff26d" strokeWidth="6" />
          <circle cx="288" cy="157" r="15" fill="none" stroke="#fff26d" strokeWidth="6" />
        </g>
      </svg>
    );
  }

  if (design === "kiki") {
    return (
      <svg className="rival-vector rival-kiki" viewBox="0 0 420 720" role="img" aria-label="Queen Kiki, a tiny royal creator with a crown and cape">
        <g className="rival-rig">
          <ellipse cx="210" cy="676" rx="112" ry="17" fill="#09051b" opacity=".34" />
          <path d="M126 277Q74 399 91 575L153 536H267L329 575Q346 399 294 277Z" fill="#71369b" stroke="#341d58" strokeWidth="10" />
          <path d="M145 102L170 46L209 90L250 43L277 105Z" fill="#ffe15a" stroke="#8f4b21" strokeWidth="8" />
          <circle cx="170" cy="66" r="10" fill="#ff61b9" /><circle cx="250" cy="63" r="10" fill="#63eee5" /><circle cx="210" cy="88" r="10" fill="#8d65ff" />
          <path d="M116 179Q119 72 210 73Q301 72 304 179L278 236H142Z" fill="#2f1744" stroke="#291537" strokeWidth="9" />
          <path d="M124 174Q126 87 210 88Q294 87 296 174Q291 248 210 255Q129 248 124 174Z" fill="#efad85" stroke="#713c4a" strokeWidth="8" />
          <path d="M129 151Q166 77 210 117Q256 76 291 151Q249 126 210 150Q170 126 129 151Z" fill="#3d1b47" />
          <path d="M150 173Q174 153 193 175M227 175Q249 153 272 173" fill="none" stroke="#52243d" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="177" cy="190" rx="18" ry="25" fill="#fff" /><ellipse cx="243" cy="190" rx="18" ry="25" fill="#fff" />
          <circle cx="181" cy="194" r="10" fill="#b66b2b" /><circle cx="247" cy="194" r="10" fill="#b66b2b" />
          <path d="M176 228Q210 255 245 225" fill="#fff" stroke="#7c3346" strokeWidth="6" strokeLinecap="round" />
          <path d="M131 286Q210 251 289 286L304 441H116Z" fill="#fff2ad" stroke="#5d2a66" strokeWidth="9" />
          <path d="M151 306Q210 280 269 306L255 391H165Z" fill="#ff75bd" />
          <path d="M116 430Q210 394 304 430L342 559Q210 606 78 559Z" fill="#d448a9" stroke="#5d2a66" strokeWidth="10" />
          <path d="M94 537Q210 573 326 537" fill="none" stroke="#ffe873" strokeWidth="13" />
          <g className="rival-arm rival-arm-left">
            <path d="M130 300Q72 339 72 433" fill="none" stroke="#713c4a" strokeWidth="38" strokeLinecap="round" />
            <path d="M130 300Q72 339 72 433" fill="none" stroke="#efad85" strokeWidth="26" strokeLinecap="round" />
            <circle cx="73" cy="450" r="19" fill="#efad85" stroke="#713c4a" strokeWidth="7" />
          </g>
          <g className="rival-arm rival-arm-right">
            <path d="M290 300Q348 339 348 433" fill="none" stroke="#713c4a" strokeWidth="38" strokeLinecap="round" />
            <path d="M290 300Q348 339 348 433" fill="none" stroke="#efad85" strokeWidth="26" strokeLinecap="round" />
            <circle cx="347" cy="450" r="19" fill="#efad85" stroke="#713c4a" strokeWidth="7" />
          </g>
          <path d="M163 561L156 635M257 561L264 635" stroke="#713c4a" strokeWidth="35" strokeLinecap="round" />
          <path d="M91 648Q150 617 199 650V679H83Q73 662 91 648ZM329 648Q270 617 221 650V679H337Q347 662 329 648Z" fill="#fff" stroke="#5d2a66" strokeWidth="9" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="rival-vector rival-sunny" viewBox="0 0 420 720" role="img" aria-label="Sunny Sam, a bright skater with sunburst hair">
      <g className="rival-rig">
        <ellipse cx="210" cy="675" rx="112" ry="18" fill="#09051b" opacity=".34" />
        <path d="M210 53L229 88L268 67L266 108L307 108L283 141L319 160L280 176L302 212L260 209L256 250L222 225L197 259L181 220L143 239L148 198L107 195L132 163L96 143L135 127L114 91L156 95L161 54L194 79Z" fill="#ff9b30" stroke="#603025" strokeWidth="9" />
        <ellipse cx="210" cy="178" rx="79" ry="91" fill="#b96d42" stroke="#603025" strokeWidth="8" />
        <path d="M145 153Q210 91 275 153Q247 127 210 144Q174 126 145 153Z" fill="#6a321f" />
        <path d="M157 173Q180 153 198 175M222 175Q243 153 265 173" fill="none" stroke="#50261f" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="180" cy="190" rx="18" ry="25" fill="#fff" /><ellipse cx="240" cy="190" rx="18" ry="25" fill="#fff" />
        <circle cx="184" cy="194" r="10" fill="#2e805f" /><circle cx="244" cy="194" r="10" fill="#2e805f" />
        <path d="M176 229Q210 258 247 224" fill="#fff" stroke="#6f302c" strokeWidth="6" strokeLinecap="round" />
        <path d="M126 290Q210 247 294 290L310 443Q210 483 110 443Z" fill="#ffd84e" stroke="#563149" strokeWidth="10" />
        <circle cx="210" cy="354" r="48" fill="#ff9d30" />
        <path d="M210 320V388M176 354H244M186 330L234 378M234 330L186 378" stroke="#fff8a5" strokeWidth="9" strokeLinecap="round" />
        <g className="rival-arm rival-arm-left">
          <path d="M126 304Q70 345 79 435" fill="none" stroke="#603025" strokeWidth="42" strokeLinecap="round" />
          <path d="M126 304Q70 345 79 435" fill="none" stroke="#b96d42" strokeWidth="28" strokeLinecap="round" />
          <circle cx="82" cy="451" r="20" fill="#b96d42" stroke="#603025" strokeWidth="7" />
        </g>
        <g className="rival-arm rival-arm-right">
          <path d="M294 304Q350 345 341 435" fill="none" stroke="#603025" strokeWidth="42" strokeLinecap="round" />
          <path d="M294 304Q350 345 341 435" fill="none" stroke="#b96d42" strokeWidth="28" strokeLinecap="round" />
          <circle cx="338" cy="451" r="20" fill="#b96d42" stroke="#603025" strokeWidth="7" />
        </g>
        <path d="M112 438Q210 469 308 438L291 526H129Z" fill="#2dcac8" stroke="#563149" strokeWidth="10" />
        <path d="M158 521L145 627M262 521L275 627" stroke="#603025" strokeWidth="44" strokeLinecap="round" />
        <path d="M85 644Q145 607 196 646V678H78Q67 659 85 644ZM335 644Q275 607 224 646V678H342Q353 659 335 644Z" fill="#fff" stroke="#563149" strokeWidth="10" />
        <path d="M91 650H183M329 650H237" stroke="#ff67ba" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default memo(RivalCharacter);
