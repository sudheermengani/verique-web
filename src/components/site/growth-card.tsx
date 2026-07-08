export function GrowthCard() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-8.5 pb-7 text-white shadow-[0_30px_70px_rgba(10,18,36,0.28)] before:absolute before:inset-0 before:bg-[radial-gradient(340px_200px_at_85%_0%,rgba(0,200,245,0.22),transparent_60%),radial-gradient(340px_220px_at_0%_100%,rgba(139,61,246,0.25),transparent_60%)]">
        <div className="relative">
          <p className="font-mono text-[11.5px] tracking-[0.16em] text-[#8D97AE] uppercase">
            Enquiries · Last 90 days
          </p>
          <svg viewBox="0 0 340 140" className="my-4.5 h-auto w-full" fill="none">
            <defs>
              <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#00C8F5" />
                <stop offset="0.55" stopColor="#2563EB" />
                <stop offset="1" stopColor="#8B3DF6" />
              </linearGradient>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2563EB" stopOpacity="0.35" />
                <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 110 L34 100 L68 106 L102 78 L136 84 L170 55 L204 62 L238 35 L272 40 L306 15 L340 20 L340 140 L0 140 Z"
              fill="url(#chartFill)"
            />
            <path
              d="M0 110 L34 100 L68 106 L102 78 L136 84 L170 55 L204 62 L238 35 L272 40 L306 15 L340 20"
              stroke="url(#chartLine)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-2 flex justify-between gap-4 border-t border-white/12 pt-4.5">
            <div>
              <b className="block font-display text-[22px] font-bold">312</b>
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#8D97AE] uppercase">
                Qualified leads
              </span>
            </div>
            <div>
              <b className="block font-display text-[22px] font-bold">£38</b>
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#8D97AE] uppercase">
                Cost per lead
              </span>
            </div>
            <div>
              <b className="block font-display text-[22px] font-bold">4.1×</b>
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#8D97AE] uppercase">
                Return on spend
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-5 -left-8.5 hidden animate-[float_5s_ease-in-out_infinite] items-center gap-2.5 rounded-[14px] border border-line bg-white px-4.5 py-3 text-sm font-semibold shadow-[0_14px_34px_rgba(10,18,36,0.14)] sm:flex">
        <span className="bg-grad size-2.5 rounded-full" />
        New enquiry received
      </div>
      <div className="absolute -right-6 -bottom-4.5 hidden animate-[float_6s_ease-in-out_1s_infinite] items-center gap-2.5 rounded-[14px] border border-line bg-white px-4.5 py-3 text-sm font-semibold shadow-[0_14px_34px_rgba(10,18,36,0.14)] sm:flex">
        <span className="bg-grad size-2.5 rounded-full" />
        Consultation booked
      </div>
    </div>
  );
}
