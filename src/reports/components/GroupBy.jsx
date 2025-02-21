const generateKey = ({ groupBySeconds, timestamp, offset }) => {
  const keyDiff = (timestamp % groupBySeconds);
  return [((timestamp - keyDiff) + offset), keyDiff];
};

const generateSlots = ({ dateStart, dateEnd, groupBy }) => {
  const startKeyGen = generateKey(groupBy, dateStart, 0);
  const startHeadKey = startKeyGen[0];
  // const keyStep = startKeyGen[1];

  const endKeyGen = generateKey(groupBy, dateEnd, 0);
  const endTailKey = endKeyGen[0];

  let endKey = startHeadKey;

  const shift = dateStart - startHeadKey;

  const grida = {};
  while (endKey <= endTailKey) {
    grida[endKey + shift] = [];
    endKey += groupBy;
  }

  return { grid: grida, offset: shift };
};

const groupBy = ({ data, startDate, endDate, tsKey, groupDurationSec, pushTo }) => {
  pushTo = typeof pushTo !== 'undefined' ? pushTo : 'bottom';
  const slotsAndOffsets = generateSlots(startDate, endDate, groupDurationSec);
  const slots = slotsAndOffsets.grid;
  const offsets = slotsAndOffsets.offset;

  data.forEach((element) => {
    const key = generateKey(groupDurationSec, data[element].attributes[tsKey] - offsets, offsets)[0];
    if (slots[key] !== undefined) {
      if (pushTo === 'top') {
        slots[key].unshift(data[element]);
      } else {
        slots[key].push(data[element]);
      }
    }
  });
  return (slots);
};

export default groupBy;
