export function ShortNamify(name, playerNicks) {
  // TODO: make this unique among the party in case of first name collisions.
  // TODO: probably this should be a general cactbot utility.

  if (name in playerNicks)
    return playerNicks[name];

  const idx = name.indexOf(' ');
  return idx < 0 ? name : name.substr(0, idx);
}

// Turns a scrambled string damage field into an integer.
// Since fields are modified in place right now, this does nothing if called
// again with an integer.  This is kind of a hack, sorry.
export function UnscrambleDamage(field) {
  if (typeof field !== 'string')
    return field;
  const len = field.length;
  if (len <= 4)
    return 0;
  // Get the left two bytes as damage.
  let damage = parseInt(field.substr(0, len - 4), 16);
  // Check for third byte == 0x40.
  if (field[len - 4] === '4') {
    // Wrap in the 4th byte as extra damage.  See notes above.
    const rightDamage = parseInt(field.substr(len - 2, 2), 16);
    damage = damage - rightDamage + (rightDamage << 16);
  }
  return damage;
}

export function IsPlayerId(id) {
  return id[0] < 4;
}

export function IsTriggerEnabled(options, id) {
  if (id in options.DisabledTriggers)
    return false;

  const autoConfig = options.PerTriggerAutoConfig[id];
  if (autoConfig)
    return autoConfig.enabled;

  return true;
}
