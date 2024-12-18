import { SPLASH_TEXT_ROUTE } from "~/api/misc"
import { duck } from "~/entry-server"
import { getSplashTextRandomly } from "~/features/splash-screen/data"

export const splashTexts = [
  "Around 650MB of data could fit on a PS1 CD, as opposed to about 64MB on an N64 cartridge. This usually led to movie-style cutscenes, higher quality music, and voice acting on the PlayStation.",
  "Pac-Man was originally going to be called Puck-Man in the United States, but that was changed after considering how easy it would be to vandalize the arcade cabinets to say... something else.",
  "Remember, you need air to live",
  "Remember, gravity hurts",
  "Remember to eat and stay hydrated",
  "Fill your pockets, pouches, and bags of holding with sand to confuse pickpockets.",
  "If something has more than one head, it probably wants to kill you.",
  "As if you had any other choice",
  "I'm testing your patience :)",
  "Empty hallways make for great traps. Just make sure you're the one setting it.",
  "I did that with <style />",
  "Baking ice cream",
  "*Distracted by cat gifs*",
  "Doing the heavy lifting",
  "Converting bugs to features...",
  "...at least you're not on hold...",
  "...and enjoy the elevator music...",
  "You shall not pass! yet..",
  "Hopefully it doesn't stuck at 99%",
  "Does anyone actually read this?",
  "Sharpening swords",
  "I added a bit of delay so you can read this (just in case)",
  "Loading new loading screen",
  "Discovering new ways of making you wait.",
  "We will be back in 1/0 minutes.",
  "Creating time-loop inversion field",
  "Patience! This is difficult, you know...",
  "Delivering silly phrases to a loading screen near you",
  "Delivering free huggie",
  "It's dangerous to go alone.",
  "When does the loading screen load?",
  "Didn't know paint dried so quickly.",
  "Happy to see you there.",
  "Cheese is also milk.zip by the way",
  "https://meowfacts.herokuapp.com/?count=1"
]

duck.get(SPLASH_TEXT_ROUTE, async(context) => {
  const text = await getSplashTextRandomly()
  
  return context.json({
    text
  }, 200)
})