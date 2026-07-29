/**
 * Sequentially fills a list of setter functions with a short delay between
 * each, simulating Luka populating fields one by one.
 *
 * @param fields  Array of { set: () => void } — each set() writes one value
 * @param onDone  Called after all fields are filled
 * @param delay   Ms between each fill (default 380)
 */
export function lukaSequentialFill(
  fields: Array<{ set: () => void }>,
  onDone: () => void,
  delay = 380
) {
  let i = 0;
  function next() {
    if (i >= fields.length) { onDone(); return; }
    fields[i].set();
    i++;
    setTimeout(next, delay);
  }
  setTimeout(next, 200); // small initial pause before first fill
}
