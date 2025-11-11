export async function wakeNeon() {
  try {
    await fetch("https://ep-holy-snow-a822tvil-pooler.eastus2.azure.neon.tech");
  } catch (e) {
    console.log("⚠️ Neon wake-up skipped (offline or unreachable)");
  }
}
