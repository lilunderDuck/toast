export function animateToastOnVisible(thisToast: HTMLDivElement, direction: 1 | -1) {
  thisToast.animate(
    [
      { transform: `translate3d(0,${direction * -200}%,0) scale(.6)`, opacity: 0.5 },
      { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
    ],
    {
      duration: 350,
      fill: 'forwards',
      easing: 'cubic-bezier(.21,1.02,.73,1)'
    }
  )
}

export function animateToastOnHide(thisToast: HTMLDivElement, direction: 1 | -1) {
  thisToast.animate(
    [
      { transform: 'translate3d(0,0,-1px) scale(1)', opacity: 1 },
      { transform: `translate3d(0,${direction * -150}%,-1px) scale(.4)`, opacity: 0 },
    ],
    {
      duration: 400,
      fill: 'forwards',
      easing: 'cubic-bezier(.06,.71,.55,1)'
    }
  )
}