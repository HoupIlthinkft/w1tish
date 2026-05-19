export function BackgroundComponent({ typeBG }: Readonly<{ typeBG: 'AuthRegForm' | 'Chat' }>) {
  const lineText = new Array(25).fill('W1TISH');
  const lineTexts = new Array(25).fill(lineText);

  return (
    <div className="absolute -top-full left-[-20%] z-[-1] hidden w-[150vw] rotate-30 overflow-hidden md:inline">
      {lineTexts.map((lineText, index) => (
        <div
          className={`flex h-[11vh] w-max flex-nowrap ${
            typeBG == 'AuthRegForm'
              ? index % 2 === 0
                ? 'animate-running-left'
                : 'animate-running-right'
              : index % 2 === 0
                ? 'animate-running-chatBG-left'
                : 'animate-running-chatBG-right'
          }`}
          key={index}
        >
          <div className="flex shrink-0 gap-8 px-4">
            {lineText.map((item, idx) => (
              <span
                key={`1-${idx}`}
                className="text-text-bg text-[clamp(4rem,10vw,10rem)] font-medium whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 gap-8 px-4" aria-hidden="true">
            {lineText.map((item, idx) => (
              <span
                key={`2-${idx}`}
                className="text-text-bg text-[clamp(4rem,10vw,10rem)] font-medium whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
