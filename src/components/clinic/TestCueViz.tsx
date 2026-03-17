type TestCueVizProps = {
  type: "grip" | "face" | "path" | "strike";
};

export function TestCueViz({ type }: TestCueVizProps) {
  const labelMap: Record<TestCueVizProps["type"], string> = {
    grip: "Grip",
    face: "Face",
    path: "Path",
    strike: "Strike",
  };

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
      {labelMap[type]} cue
    </div>
  );
}
