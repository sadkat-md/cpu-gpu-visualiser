export function HoloHud({
  left,
  mid,
  right,
  color,
}: {
  left: string;
  mid: string;
  right: string;
  color: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]">
      <span className="holo-corner tl" />
      <span className="holo-corner tr" />
      <span className="holo-corner bl" />
      <span className="holo-corner br" />
      <div className="absolute inset-x-4 top-14 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] sm:top-[3.35rem]">
        <span style={{ color }}>{left}</span>
        <span className="hidden text-muted md:inline">{mid}</span>
        <span className="text-muted">{right}</span>
      </div>
      <div className="absolute inset-x-4 bottom-16 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-muted sm:bottom-[4.25rem]">
        <span>SCAN ACTIVE</span>
        <span className="holo-bar" style={{ background: color }} />
        <span>SYS.OK</span>
      </div>
    </div>
  );
}
