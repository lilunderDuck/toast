import { createEffect, createMemo, createSignal, mergeProps, splitProps } from "solid-js"
// ...
import { CarouselApi, CarouselContextProps, CarouselProps, CarouselProvider } from "./CarouselProvider"
import createEmblaCarousel from "embla-carousel-solid"
// ...
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  carousel: {
    position: 'relative'
  }
})

interface ICarouselProps extends HTMLAttributes<"div">, CarouselProps {
  // 
}

export function Carousel(rawProps: ICarouselProps) {
  const props = mergeProps<ICarouselProps[]>(
    { orientation: "horizontal" },
    rawProps
  )
 
  const [local, others] = splitProps(props, [
    "orientation",
    "opts",
    "setApi",
    "plugins",
    "class",
    "children"
  ])
 
  const [carouselRef, api] = createEmblaCarousel(
    () => ({
      ...local.opts,
      axis: local.orientation === "horizontal" ? "x" : "y"
    }),
    () => (local.plugins === undefined ? [] : local.plugins)
  )
  const [canScrollPrev, setCanScrollPrev] = createSignal(false)
  const [canScrollNext, setCanScrollNext] = createSignal(false)
 
  const onSelect = (api: NonNullable<ReturnType<CarouselApi>>) => {
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }
 
  const scrollPrev = () => {
    api()?.scrollPrev()
  }
 
  const scrollNext = () => {
    api()?.scrollNext()
  }
 
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }
 
  createEffect(() => {
    if (!api() || !local.setApi) {
      return
    }
    local.setApi(api)
  })
 
  createEffect(() => {
    if (!api()) {
      return
    }
 
    onSelect(api()!)
    api()!.on("reInit", onSelect)
    api()!.on("select", onSelect)
 
    return () => {
      api()?.off("select", onSelect)
    }
  })
 
  const value = createMemo(
    () =>
      ({
        carouselRef,
        api,
        opts: local.opts,
        orientation: local.orientation || (local.opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      }) satisfies CarouselContextProps
  )
 
  return (
    <CarouselProvider value$={value}>
      <div
        onKeyDown={handleKeyDown}
        class={mergeClassname(stylex.attrs(style.carousel), local.class)}
        role="region"
        aria-roledescription="carousel"
        {...others}
      >
        {local.children}
      </div>
    </CarouselProvider>
  )
}