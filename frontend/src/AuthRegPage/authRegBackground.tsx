import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

export function AuthRegBackgroundComponent() {
  const splideOptions = {
    type: 'loop' as const,
    focus: 'center' as const,
    drag: false,

    direction: 'ttb',

    height: '10vh',
    arrows: false,
    pagination: false,
    perPage: 3,

    autoScroll: {
      speed: -1,
      pauseOnHover: false,
      pauseOnFocus: false,
      rewind: false,
    },
  };

  return (
    <div className="text-text-bg bg-plate-accent absolute z-[-1] hidden translate-y-[-100vh] flex-row gap-[clamp(5px,1vw,20px)] font-[Jost] text-[clamp(2rem,8vw,8rem)] font-semibold md:flex">
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
      <Splide extensions={{ AutoScroll }} options={splideOptions}>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
        <SplideSlide>
          <p>W1tish</p>
        </SplideSlide>
      </Splide>
    </div>
  );
}
