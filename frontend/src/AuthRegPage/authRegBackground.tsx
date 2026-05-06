import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';


export function AuthRegBackgroundComponent() {
    const splideOptions = {
        type: "loop" as const,
        focus: "center" as const,
        drag: false,

        direction: "ttb",

        height: "10vh",
        arrows: false,
        pagination: false,
        perPage: 3,

        autoScroll: {
            speed: -1,
            pauseOnHover: false,
            pauseOnFocus: false,
            rewind: false,
      },
    }

    return (
        <div className="flex flex-row text-text-bg bg-plate-accent absolute z-[-1] text-[clamp(2rem,8vw,8rem)] -translate-y-[100vh] gap-[clamp(5px,1vw,20px)]"> 
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
            <Splide extensions={{AutoScroll}} options={splideOptions}>
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
    )
}
