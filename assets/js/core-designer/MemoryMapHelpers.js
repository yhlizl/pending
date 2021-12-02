/*
  Returns a list of memory maps for the TIMs/DTIM/ITIM/DLS.

  Example:
    getMemories(state)
      => [{
            "present": true,
            "name": "tim_0",
            "base": 0x3000000,
            "size": 0x1000000,
         },
         {
            "present": true,
            "name": "dtim",
            "base": 0x4000000,
            "size": 0x10000,
         }]
*/
function getMemories(state) {
  const timNames = Object.entries(state)
    .map((entry) => entry[0])
    .filter((name) => name.startsWith("has_tim_"))
    .map((name) => name.substr(4));

  const memories = timNames
    .map((name) => {
      const present = state[`has_${name}`];
      const base = state[`${name}_base_addr`];
      const size = state[`${name}_size`] * 1024;
      return {
        present,
        name,
        base,
        size,
      };
    })
    .filter((tim) => tim.present);

  // Get rocket or bullet DTIM and/or rocket ICache and/or bullet ITIM
  if (state.has_dtim) {
    memories.push({
      present: true,
      name: "dtim",
      base: state.dtim_base_addr,
      size: state.dtim_size * 1024 * state.number_of_cores,
    });
  }
  if (state.has_itim) {
    memories.push({
      present: true,
      name: "itim",
      base: state.itim_base_addr,
      size: state.itim_size * 1024 * state.number_of_cores,
    });
  }
  if (state.has_dls) {
    memories.push({
      present: true,
      name: "dls",
      base: state.dls_base_addr,
      size: state.dls_size * 1024 * state.number_of_cores,
    });
  }

  return memories;
}

/*
  Returns a list of memory maps for the ports.

  Example:
    getPorts(state)
      => [{
            "present": true,
            "name": "system_port_0",
            "base": 0x2000000,
            "size": 0x1000000,
         }]
*/
function getPorts(state) {
  const portNames = Object.entries(state)
    .map((entry) => entry[0])
    .filter((name) => name.startsWith("has_") && name.indexOf("_port") !== -1)
    .map((name) => name.substr(4))
    .filter((name) => name !== "front_port");

  const ports = portNames
    .map((name) => {
      const present = state[`has_${name}`];
      const base = state[`${name}_base_addr`];
      const size = state[`${name}_size`] * 1024;
      return {
        present,
        name,
        base,
        size,
      };
    })
    .filter((port) => port.present);

  return ports;
}

/*
  Returns a list containing all memory maps.
  Entries are sorted by their base addresses.

  Example:
    getMemoryMap(state)
      => [{
            "present": true,
            "name": "system_port_0",
            "base": 0x2000000,
            "size": 0x1000000,
          },
          {
            "present": true,
            "name": "tim_0",
            "base": 0x3000000,
            "size": 0x1000000,
         }]
*/
function getMemoryMap(state) {
  const memories = getMemories(state);
  const ports = getPorts(state);

  const mapCmp = (first, second) => {
    if (first.base < second.base) {
      return -1;
    }
    if (first.base === second.base) {
      return 0;
    }
    return 1;
  };
  const memoryMap = [].concat(memories, ports);
  memoryMap.sort(mapCmp);
  return memoryMap;
}

// TODO: Be careful about cases with equality!
function overlapsWith(mapA, mapB) {
  const mapAStart = mapA.base;
  const mapAEnd = mapA.base + mapA.size;

  const mapBStart = mapB.base;
  const mapBEnd = mapB.base + mapB.size;

  if (mapAStart <= mapBStart && mapBStart < mapAEnd) {
    //    |A           |
    //          |B ...
    return true;
  }
  if (mapBStart <= mapAStart && mapAStart < mapBEnd) {
    //          |A...
    //    |B           |
    return true;
  }
  return false;
}

/*
  Returns a mapping from memory map names to the list of memory map names
  which overlap with it.
*/
function getMemoryMapOverlaps(state) {
  const memoryMap = getMemoryMap(state);
  const overlaps = new Map();

  for (let i = 0; i < memoryMap.length; i += 1) {
    for (let j = 0; j < memoryMap.length; j += 1) {
      // things can't overlap with themselves
      if (i === j) {
        /* eslint-disable-next-line no-continue */
        continue;
      }

      const mapA = memoryMap[i];
      const mapB = memoryMap[j];
      if (overlapsWith(mapA, mapB)) {
        if (!overlaps.has(mapA.name)) {
          overlaps.set(mapA.name, []);
        }
        overlaps.get(mapA.name).push(mapB.name);
      }
    }
  }

  return overlaps;
}

export { getMemoryMapOverlaps };
