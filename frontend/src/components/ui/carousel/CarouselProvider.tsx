import createEmblaCarousel, { CreateEmblaCarouselType } from "embla-carousel-solid"
import { type Accessor, createContext, type ParentProps, useContext, VoidProps } from "solid-js"
import { ButtonProps } from "../Button"

export type CarouselApi = CreateEmblaCarouselType[1]
 
type UseCarouselParameters = Parameters<typeof createEmblaCarousel>
type CarouselOptions = NonNullable<UseCarouselParameters[0]>
type CarouselPlugin = NonNullable<UseCarouselParameters[1]>

export type CarouselButtonProps = VoidProps<ButtonProps>
 
export type CarouselProps = {
  opts?: ReturnType<CarouselOptions>
  plugins?: ReturnType<CarouselPlugin>
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}
 
export type CarouselContextProps = {
  carouselRef: ReturnType<typeof createEmblaCarousel>[0]
  api: ReturnType<typeof createEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: Accessor<boolean>
  canScrollNext: Accessor<boolean>
} & CarouselProps
 
const Context = createContext<Accessor<CarouselContextProps> | null>(null)

export function CarouselProvider(props: ParentProps<{
  value$: Accessor<CarouselContextProps>
}>) {
  return (
    <Context.Provider value={props.value$}>
      {props.children}
    </Context.Provider>
  )
}

export function useCarouselContext() {
  const context = useContext(Context)!
 
  return context()
}