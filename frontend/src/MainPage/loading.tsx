export function LoadingComponent({ type }: Readonly<{ type: string }>) {
  return (
    <div
      className="sticky top-0 z-10 flex h-full w-full flex-col items-center justify-center self-center p-3 opacity-[0.33]"
      style={type == 'chat' ? {} : { position: 'absolute', bottom: '0', left: '0' }}
    >
      <img src={`${import.meta.env.BASE_URL}loading.gif`} alt="loading" />
    </div>
  );
}
