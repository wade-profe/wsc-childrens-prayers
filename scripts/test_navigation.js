// Regression test for the menu-navigation bug.
//
// Bug: from the Menu screen, returning to the Pager with the chosen prayer used
// `navigation.navigate('Pager', { goToIndex })`. In React Navigation v7,
// NAVIGATE only reuses an existing route when the target matches the *currently
// focused* route (or `pop` is set) — otherwise it PUSHES a new instance. That
// pushed a duplicate Pager (stacking back-buttons) which remounted and async-
// loaded the stored index, racing over `goToIndex` (wrong prayer).
//
// Fix: use `navigation.popTo('Pager', { goToIndex })`, which returns to the
// existing Pager route (same key → no remount) and applies the new params.
//
// This drives the REAL installed StackRouter to prove both behaviours.

const assert = require('assert');
const { StackRouter, CommonActions, StackActions } = require('@react-navigation/routers');

const router = StackRouter({});
const options = { routeNames: ['Pager', 'Menu'], routeParamList: {}, routeGetIdList: {} };

// Build the [Pager, Menu] stack (user opened the menu from the pager).
const initial = router.getInitialState(options);
const onMenu = router.getStateForAction(initial, CommonActions.navigate('Menu'), options);
assert.strictEqual(onMenu.routes.length, 2, 'precondition: stack is [Pager, Menu]');
assert.strictEqual(onMenu.routes[onMenu.index].name, 'Menu', 'precondition: focused on Menu');
const pagerKey = onMenu.routes[0].key;

// --- The buggy action: navigate() from Menu pushes a NEW Pager ---
const afterNavigate = router.getStateForAction(
  onMenu,
  CommonActions.navigate('Pager', { goToIndex: 9 }),
  options
);
assert.strictEqual(
  afterNavigate.routes.length,
  3,
  'BUG REPRODUCED: navigate() pushes a duplicate Pager (stacking)'
);
assert.notStrictEqual(
  afterNavigate.routes[afterNavigate.index].key,
  pagerKey,
  'BUG REPRODUCED: the new Pager is a fresh instance (remounts → wrong prayer)'
);

// --- The fix: popTo() returns to the EXISTING Pager with new params ---
const afterPopTo = router.getStateForAction(
  onMenu,
  StackActions.popTo('Pager', { goToIndex: 9 }),
  options
);
assert.strictEqual(afterPopTo.routes.length, 1, 'FIX: popTo collapses back to a single Pager');
assert.strictEqual(afterPopTo.routes[0].name, 'Pager', 'FIX: we are on the Pager');
assert.strictEqual(afterPopTo.routes[0].key, pagerKey, 'FIX: same Pager instance reused (no remount)');
assert.strictEqual(afterPopTo.routes[0].params.goToIndex, 9, 'FIX: goToIndex param applied');

console.log('PASS (router semantics): popTo reuses the existing Pager; navigate would have stacked.');

// --- Guard the app code: PrayerMenu must return to the Pager via popTo ---
const fs = require('fs');
const path = require('path');
const menuSrc = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'screens', 'PrayerMenu.tsx'),
  'utf8'
);
assert.ok(
  /navigation\.popTo\(\s*['"]Pager['"]/.test(menuSrc),
  "PrayerMenu must use navigation.popTo('Pager', ...) to return to the existing Pager"
);
assert.ok(
  !/navigation\.navigate\(\s*['"]Pager['"]/.test(menuSrc),
  "PrayerMenu must NOT use navigation.navigate('Pager', ...) — that pushes a duplicate in v7"
);

console.log('PASS (app code): PrayerMenu returns to the Pager via popTo.');
