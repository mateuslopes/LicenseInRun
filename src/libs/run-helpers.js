export async function getJigs(run) {
  await run.inventory.sync();
  return run.inventory.jigs;
}
