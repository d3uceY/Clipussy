import { Howl } from "howler";

let currentSound: Howl | null = null;

export function playSound(soundSrc: string, soundOn = true, volume = .1) {
  if (!soundOn) return;

  // Stop previous sound
  if (currentSound) {
    currentSound.stop();
  }

  // Create and play new sound
  currentSound = new Howl({
    src: [soundSrc],
    volume: volume,
  });

  currentSound.play();
}